const express = require("express");
const app = express();
const Blockchain = require("./blockchain");
const port = process.argv[2];
const bitcoin = new Blockchain();
const axios = require("axios");
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS for frontend
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept",
	);
	res.header(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, DELETE",
	);
	next();
});

// Serve static files from parent directory
app.use(express.static(path.join(__dirname, "..")));

app.get("/blockchain", (req, res) => {
	res.send(bitcoin);
	console.log("You are on the blockchain endpoint");
});

app.post("/transaction", (req, res) => {
	const trx = req.body.trx;
	const blockIndex = bitcoin.addTrxToPendingTransactions(trx);
	res.json({ note: `Transaction will add in block number ${blockIndex}.` });
});

app.post("/transaction/broadcast", async (req, res) => {
	const trx = bitcoin.createNewTransaction(
		req.body.from,
		req.body.to,
		req.body.amount,
		"",
	);
	bitcoin.addTrxToPendingTransactions(trx);
	const trxCreationPromises = bitcoin.networkNodes.map((url) => {
		axios.post(url + "/transaction", { trx: trx });
	});
	try {
		await Promise.all(trxCreationPromises);
	} catch (error) {
		res.status(500).json({
			error: error,
			details: error.message,
		});
	}
	res.json({
		note: "Transaction created and broadcasted successfully.",
	});
});

app.get("/mine", async (req, res) => {
	const newBlock = bitcoin.mineBlock("mew");

	const minePromises = bitcoin.networkNodes.map((url) => {
		return axios.post(url + "/recieve-new-block", { newBlock: newBlock });
	});

	Promise.all(minePromises)
		.then((data) => {
			res.json({
				note: `Block number ${bitcoin.chain.length} was mined.`,
				block: newBlock,
			});
		})
		.catch((error) => {
			res.status(400).json({
				note: "Block mining faild.",
				detail: error.message,
			});
		});
});

app.post("/recieve-new-block", (req, res) => {
	const newBlock = req.body.newBlock;
	const prevBlock = bitcoin.getBlockByIndex(newBlock.index - 1);

	if (bitcoin.isBlockValid(newBlock, prevBlock)) {
		bitcoin.addBlockToChain(newBlock);
		res.json({
			note: `Block number ${bitcoin.chain.length} received.`,
		});
	} else {
		res.status(400).json({
			note: "The block is invalid.",
			block: newBlock,
		});
	}
});

app.post("/register-and-broadcast-node", async (req, res) => {
	const newNodeUrl = req.body.newNodeUrl;

	if (bitcoin.networkNodes.includes(newNodeUrl)) {
		res.status(400).json({ error: "Node is already in network." });
	}
	if (!newNodeUrl) {
		res.status(400).json({ error: "New node is required." });
	}

	bitcoin.networkNodes.push(newNodeUrl);

	const regNodePromises = bitcoin.networkNodes.map((url) => {
		axios.post(url + "/register-node", { newNodeUrl: newNodeUrl });
	});

	try {
		await Promise.all(regNodePromises);
		await axios.post(newNodeUrl + "/register-nodes-bulk", {
			allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl],
		});
	} catch (error) {
		const index = bitcoin.networkNodes.indexOf(newNodeUrl);
		if (index > -1) {
			bitcoin.networkNodes.splice(index, 1);
		}

		res.status(500).json({
			error: "Something went wrong during broadcast.",
			details: error.message,
		});
	}
	res.json({ note: "New node registered with network successfully." });
});

app.post("/register-node", (req, res) => {
	const newNoeUrl = req.body.newNodeUrl;
	const nodeNotAlreadyPresent =
		bitcoin.networkNodes.indexOf(newNoeUrl) === -1;
	const notCurrentNode = bitcoin.currentNodeUrl !== newNoeUrl;
	if (nodeNotAlreadyPresent && notCurrentNode)
		bitcoin.networkNodes.push(newNoeUrl);
	res.json({ note: "Node registered successfully." });
});

app.post("/register-nodes-bulk", (req, res) => {
	const allNetworkNodes = req.body.allNetworkNodes;
	allNetworkNodes.map((url) => {
		const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(url) === -1;
		const notCurrentNode = bitcoin.currentNodeUrl !== url;
		if (nodeNotAlreadyPresent && notCurrentNode)
			bitcoin.networkNodes.push(url);
	});
	res.json({ note: "Node registered successfully." });
});

app.get("/consensus", (req, res) => {
	const chainsPromises = bitcoin.networkNodes.map((url) => {
		return axios.get(url + "/blockchain");
	});

	Promise.all(chainsPromises)
		.then((blockchainResponses) => {
			const chains = blockchainResponses.map((res) => res.data.chain);

			let maxLength = bitcoin.chain.length;
			let longestChain = null;

			chains.forEach((chain) => {
				if (chain.length > maxLength && bitcoin.isChainValid(chain)) {
					maxLength = chain.length;
					longestChain = chain;
				}
			});

			if (longestChain) {
				bitcoin.replaceChain(longestChain);
				return res.json({
					note: `Longest chain replaced successfully.`,
					newChain: longestChain,
				});
			}

			return res.status(200).json({
				note: "You are up to date.",
			});
		})
		.catch((error) => {
			res.status(400).json({
				note: "Consensus faild.",
				detail: error.message,
			});
		});
});

app.get("/block/:blockHash", (req, res) => {
	const blockHash = req.params.blockHash;
	const block = bitcoin.getBlockByHash(blockHash);
	if (block) {
		res.json({
			block: block,
		});
	} else {
		res.status(400).json({
			note: "There is no such block hash",
			BlockHash: blockHash,
		});
	}
});

app.get("/transaction/:transactionId", (req, res) => {
	const transactionId = req.params.transactionId;
	const transactionData = bitcoin.getTransaction(transactionId);
	if (transactionData.transaction && transactionData.block) {
		res.json({
			transactoin: transactionData.transaction,
			block: transactionData.block,
		});
	} else {
		res.status(400).json({
			note: "There is no such transaction ID.",
			transactionId: transactionId,
		});
	}
});

app.get("/address/:address", (req, res) => {
	const address = req.params.address;
	const addressData = bitcoin.getAddressData(address);

	if (addressData.addressTransactions.length > 0) {
		res.json({
			addressTransactions: addressData.addressTransactions,
			balance: addressData.balance,
		});
	} else {
		res.status(400).json({
			note: "The address has no transaction yet :(",
			address: address,
		});
	}
});

app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
	console.log(`Block Explorer: http://localhost:${port}`);
});
