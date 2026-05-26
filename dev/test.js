const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

bitcoin.createNewTransaction('Bob', 'John', 22, '');
bitcoin.createNewTransaction('Bob', 'John', 30, '');
bitcoin.createNewTransaction('Bob', 'John', 40, '');
let prevBlockHash = bitcoin.chain[0].hash;
let currentBlockData = [
    { fromAddress: 'Bob', toAddress: 'John', amount: 22, timestamp: bitcoin.pendingTransactions[0].timestamp, data: '', signiture: null},
    { fromAddress: 'Bob', toAddress: 'John', amount: 30, timestamp: bitcoin.pendingTransactions[1].timestamp, data: '', signiture: null},
    { fromAddress: 'Bob', toAddress: 'John', amount: 40, timestamp: bitcoin.pendingTransactions[2].timestamp, data: '', signiture: null}
];
let data = bitcoin.proofOfWork(prevBlockHash, currentBlockData);
bitcoin.createNewBlock(data.nonce, prevBlockHash, data.hash);

bitcoin.createNewTransaction('Alice', 'John', 2, '');
bitcoin.createNewTransaction('Bob', 'Alice', 33, '');
bitcoin.createNewTransaction('John', 'Alice', 554, 'Hello Alice :)');
prevBlockHash = bitcoin.getLastBlock().hash;
currentBlockData = [
    { fromAddress: 'Alice', toAddress: 'John', amount: 2, timestamp: bitcoin.pendingTransactions[0].timestamp, data: '', signiture: null},
    { fromAddress: 'Bob', toAddress: 'Alice', amount: 33, timestamp: bitcoin.pendingTransactions[1].timestamp, data: '', signiture: null},
    { fromAddress: 'John', toAddress: 'Alice', amount: 554, timestamp: bitcoin.pendingTransactions[2].timestamp, data: 'Hello Alice :)', signiture: null}    
];
data = bitcoin.proofOfWork(prevBlockHash, currentBlockData);
bitcoin.createNewBlock(data.nonce, prevBlockHash, data.hash);

// mine `i` block 
for (let i = 1; i <= 250; i++) {
    prevBlockHash = bitcoin.getLastBlock().hash;
    currentBlockData = [];
    data = bitcoin.proofOfWork(prevBlockHash, currentBlockData);
    bitcoin.createNewBlock(data.nonce, prevBlockHash, data.hash);    
}

// console.log(data);
// console.log(bitcoin);
console.log('****** ****** ****** ****** ****** ****** ****** ******');
console.log('****** ****** ****** ****** ****** ****** ****** ******');