const sha256 = require('sha256');
const currentUrl = process.argv[3];

class Blockchain {

    constructor() {
        this.chain = [];
        this.pendingTransactions = [];
        this.baseReward = 50;
        this.difficulty = '0';
        this.createGenesisBlock();
        this.currentNodeUrl = currentUrl;
        this.networkNodes = [];
    }

    createGenesisBlock() {
        if (this.chain.length === 0) {
            const GENESIS_BLOCK = {
                index: 0,
                timestamp: Date.now(),
                transactions: [],
                prevBlockHash: 'GENESIS BLOCK',
                nonce: 0,
                hash: this.hashBlock('GENESIS', [], 0),
                difficulty: this.difficulty
            }
            this.chain.push(GENESIS_BLOCK);
        }
    }
    
    mineBlock(minerAddress) {
        const fee = 0; // Not implemented fee system yet.
        const reward = this.getBlockReward() + fee;
        const prevBlockHash = this.getLastBlock().hash;

        const coinbaseTx = this.createNewTransaction('COINBASE', minerAddress, reward, '');
        this.pendingTransactions.unshift(coinbaseTx);

        const pow = this.proofOfWork(prevBlockHash, this.pendingTransactions);
        
        const newBlock = this.createNewBlock(pow.nonce, prevBlockHash, pow.hash);
        this.pendingTransactions = [];
        this.chain.push(newBlock);
        
        this.updateDifficultyAndReward();

        return newBlock;
    }

    createNewBlock(nonce, prevBlockHash, hash) {
        const newBlock = {
            index: this.chain.length,
            timestamp: Date.now(),
            transactions: this.pendingTransactions,
            prevBlockHash: prevBlockHash,
            nonce: nonce,
            hash: hash,
            difficulty: this.difficulty
        };
        return newBlock;
    }

    addBlockToChain(newBlock) {
        if (this.isBlockValid(newBlock, this.getBlockByIndex(newBlock.index - 1))) {
            this.pendingTransactions = [];
            this.chain.push(newBlock);
        } else {
            console.error('Errro: Block is not valid');
        }
    }

    getLastBlock() {
        if (this.chain.length === 0) {
            return null;
        }
        return this.chain[this.chain.length - 1];
    }

    createNewTransaction(from, to, value, data) {
        const newTransaction = {
            fromAddress: from,
            toAddress: to,
            amount: value,
            timestamp: Date.now(),
            data: data,
            signiture: null
        };
        
        newTransaction.id = sha256(JSON.stringify(newTransaction));

        return newTransaction;
    }

    addTrxToPendingTransactions(newTransaction) {
        this.pendingTransactions.push(newTransaction);
        return this.chain.length;
    }

    hashBlock(prevBlockHash, currentBlockData, nonce) {
        const dataAsString = prevBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
        const hash = sha256(dataAsString);
        return hash;
    }

    proofOfWork(prevBlockHash, currentBlockData) {
        const expectedHash = this.difficulty;
        let nonce = 0;
        let hash = this.hashBlock(prevBlockHash, currentBlockData, nonce);
        while (!hash.startsWith(expectedHash)) {
            nonce++;
            hash = this.hashBlock(prevBlockHash, currentBlockData, nonce);
        }
        return {
            hash: hash,
            nonce: nonce
        };
    }

    getBlockReward() {
        return this.baseReward;
    }
    
    updateDifficultyAndReward() {
        const lastBlock = this.getLastBlock();
        if (lastBlock.index > 0) {
            if (this.chain.length % 10 === 0) {
                this.baseReward = this.baseReward / 2;
            }
            if (this.chain.length % 50 == 0) {
                this.difficulty = this.difficulty + '0';
            }
        }
    }

    isBlockValid(block, prevBlock) {
        console.log('***prevBlock:', prevBlock);
        console.log('***currentBlock:', block);
        if (block.index > 0) {
            if (this.hashBlock(prevBlock.hash, block.transactions, block.nonce) !== block.hash) {
                console.error('Error: Hash calculation mismatch!');
                return false;
            }
            if (prevBlock.hash !== block.prevBlockHash) {
                console.error('Error: The prev block hash is wrong!');
                return false;
            }
            if (!block.hash.startsWith(this.difficulty)) {
                console.error(`Error: You should proof your work by find a hash that starts with '${this.difficulty}'.`);
                return false;
            }
        }
        return true;
    }
    
    isChainValid(chain) {        
        if (
            this.hashBlock('GENESIS', [], 0) !== chain[0].hash
            || chain[0].hash !== this.chain[0].hash
        ) {
            console.error('Error: Genesis block hash is invalid');
            return false;
        }
        
        for (let index = 1; index < chain.length; index++) {
            const currentBlock = chain[index];
            const prevBlock = chain[index - 1];
            
            if (!this.isBlockValid(currentBlock, prevBlock)) {
                return false;
            }
        }
        return true;
    }

    replaceChain(newChain) {
        if (this.isChainValid(newChain)) {
            this.chain = newChain;
            this.pendingTransactions = [];
            this.updateDifficultyAndReward();
        }
    }

    getBlockByIndex(index) {
        return this.chain[index];
    }

    getBlockByHash(hash) {
        let resBlock = null;
        this.chain.forEach(block => {
            if (block.hash === hash.toString()) resBlock = block;
        });
        return resBlock;
    }
    
    getTransaction(transactionId) {
        let resultTransaction = null;
        let resultBlock = null
        this.chain.forEach(block => {
            block.transactions.forEach(tx => {
                if (tx.id === transactionId) {
                    resultTransaction = tx;
                    resultBlock = block;
                }
            });
        });

        return {
            transaction: resultTransaction,
            block: resultBlock
        };
    }

    getAddressData(address) {
    	const addressTransactions = [];
        this.chain.forEach(block => {
            block.transactions.forEach(tx => {
                if (tx.fromAddress === address || tx.toAddress === address) {
                    addressTransactions.push(tx);
                }
            });
        });

        let balance = 0;
        addressTransactions.forEach(tx => {
            if (tx.toAddress === address) { balance += tx.amount }
            else if (tx.fromAddress === address) { balance -= tx.amount }
        });

        return {
            addressTransactions: addressTransactions,
            balance: balance
        };
    }
}

module.exports = Blockchain;