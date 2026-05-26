const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Wallet {
    constructor() {
        this.keyPair = ec.genKeyPair();
        this.privateKey = this.keyPair.priv.toString(16);
        this.publicKey = this.keyPair.getPublic().encode('hex', true);
        this.address = [];
        console.log(this.privateKey, this.publicKey);
    }

    generatePrivateKey() {}
}

const decWallet = new Wallet();

module.exports = Wallet;