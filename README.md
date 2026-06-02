# Blockchain Network Implementation

A Node.js-based blockchain network implementation developed for educational purposes. This project demonstrates core blockchain concepts including proof-of-work consensus, distributed transaction broadcasting, and chain validation across a peer-to-peer network.

## 📌 Project Scope

This is an **educational implementation** designed to explore blockchain fundamentals as part of a course curriculum. While the project successfully demonstrates key blockchain concepts, it is not intended for production use and lacks many critical features required for real-world blockchain systems.

### What This Project Covers

✅ Proof-of-Work consensus mechanism  
✅ Distributed transaction broadcasting  
✅ Block mining and validation  
✅ Chain consensus protocol  
✅ P2P network node management  
✅ Block explorer UI for visualization  
✅ Transaction history and address tracking

## 🏗️ Architecture Overview

```
blockchain/
├── dev/
│   ├── blockchain.js      # Core blockchain logic, consensus, and validation
│   ├── networkNode.js     # Express server for P2P network communication
│   ├── wallet.js          # Wallet functionality (not integrated)
│   └── test.js            # Network testing utilities
├── index.html             # Interactive block explorer UI
├── learnPromise.js        # Promise learning examples
└── package.json           # Dependencies
```

### Core Components

#### `blockchain.js`

Implements the blockchain data structure with:

- Genesis block initialization
- Block creation and mining (proof-of-work)
- Transaction management
- Chain validation and consensus
- Difficulty adjustment
- Address and transaction lookups

**Key Methods:**

- `mineBlock()` - Performs proof-of-work mining
- `isChainValid()` - Validates entire chain integrity
- `getAddressData()` - Retrieves balance and transaction history
- `replaceChain()` - Implements consensus mechanism

#### `networkNode.js`

Express-based P2P network node with endpoints for:

- `/blockchain` - Retrieve full blockchain state
- `/transaction/broadcast` - Broadcast transactions to network
- `/mine` - Mine a new block and propagate to peers
- `/register-and-broadcast-node` - Join existing network
- `/consensus` - Execute chain consensus protocol

#### `index.html`

Web-based block explorer providing:

- Real-time blockchain visualization
- Transaction broadcasting interface
- Block mining UI
- Search functionality (blocks, transactions, addresses)
- Network statistics dashboard
- Auto-refresh mechanism

## 🚀 Getting Started

### Prerequisites

- Node.js v12 or higher
- npm

### Installation

```bash
# Clone/navigate to project directory
cd /home/decentralizer/Desktop/blockchain

# Install dependencies
npm install
```

### Running a Single Node

```bash
# Start a blockchain node on port 3001
node dev/networkNode.js 3001
```

Access the block explorer at `http://localhost:3001`

### Running a Multi-Node Network

```bash
# Terminal 1 - Node 1 (seed node)
node dev/networkNode.js 3001

# Terminal 2 - Node 2
node dev/networkNode.js 3002

# Terminal 3 - Node 3
node dev/networkNode.js 3003
```

Then register nodes using the block explorer or HTTP requests:

```bash
# Register node 2 with node 1
curl -X POST http://localhost:3001/register-and-broadcast-node \
  -H "Content-Type: application/json" \
  -d '{"newNodeUrl": "http://localhost:3002"}'
```

## 🔧 API Reference

### Blockchain Endpoints

| Method | Endpoint                 | Description                      |
| ------ | ------------------------ | -------------------------------- |
| GET    | `/blockchain`            | Retrieve entire blockchain state |
| POST   | `/transaction/broadcast` | Broadcast transaction to network |
| POST   | `/transaction`           | Add transaction to pending pool  |
| GET    | `/mine`                  | Mine pending block (single node) |
| POST   | `/recieve-new-block`     | Receive mined block from peer    |
| GET    | `/consensus`             | Execute consensus protocol       |

### Network Management

| Method | Endpoint                       | Description                     |
| ------ | ------------------------------ | ------------------------------- |
| POST   | `/register-and-broadcast-node` | Register new node to network    |
| POST   | `/register-node`               | Register node (single peer)     |
| POST   | `/register-nodes-bulk`         | Register multiple nodes at once |

### Query Endpoints

| Method | Endpoint                      | Description                          |
| ------ | ----------------------------- | ------------------------------------ |
| GET    | `/block/:blockHash`           | Get block by hash                    |
| GET    | `/transaction/:transactionId` | Get transaction and containing block |
| GET    | `/address/:address`           | Get address balance and transactions |

## 💡 Usage Examples

### Broadcasting a Transaction

```bash
curl -X POST http://localhost:3001/transaction/broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "from": "alice",
    "to": "bob",
    "amount": 100
  }'
```

### Mining a Block

```bash
curl http://localhost:3001/mine
```

### Searching Transactions

```bash
# Get transaction details
curl http://localhost:3001/transaction/{transactionId}

# Get address balance
curl http://localhost:3001/address/alice
```

## ⚠️ Known Limitations & Issues

### Critical Issues

**1. No Cryptographic Security**

- Transactions are unsigned and unauthenticated
- No digital signatures using public/private keys
- Any user can send funds on behalf of another address
- No sender verification

**2. Incomplete Wallet Implementation**

- `wallet.js` exists but is not integrated
- No key generation or signature verification
- No actual wallet functionality in the network

**3. Consensus Vulnerabilities**

- Simple longest-chain rule without weight considerations
- No Byzantine fault tolerance
- Susceptible to 51% attacks
- No chain rollback protection beyond basic validation

**4. Transaction Validation**

- Minimal transaction validation
- No balance verification before transaction acceptance
- No double-spend prevention
- Transactions never rejected based on insufficient funds

### Architectural Issues

**5. No Persistent Storage**

- All blockchain data stored in memory
- Data lost on node restart
- No database integration

**6. Synchronization Problems**

- Manual node registration required
- No automatic peer discovery
- Block propagation can fail silently
- No transaction pool sync between nodes

**7. Difficulty Adjustment**

- Simplistic difficulty scaling (increases every 50 blocks)
- No dynamic adjustment based on block time
- No minimum difficulty floor

**8. Performance Concerns**

- Hash-based block lookup is O(n)
- Chain validation recalculates all hashes
- No caching or optimization
- Single-threaded mining blocks network I/O

### Missing Features

- **No Fee System** - Mining rewards are fixed
- **No Smart Contracts** - Simple UTXO model only
- **No Merkle Trees** - Transactions stored as arrays
- **No Bloom Filters** - Inefficient light client support
- **No State Snapshots** - Full chain replay required
- **No RPC Improvements** - Limited query capabilities
- **No Monitoring/Logging** - Minimal observability

## 📚 Educational Value

This implementation effectively demonstrates:

- Proof-of-work mechanics and computational effort
- Block structure and blockchain properties
- P2P network node communication patterns
- Consensus mechanisms through longest-chain rule
- Transaction lifecycle and block inclusion
- Basic blockchain validation and verification

It serves as an excellent foundation for understanding how blockchain systems work conceptually.

## 🔄 Next Steps & Improvements

For a production-ready or more realistic implementation, consider:

- **Add Cryptography**: Implement ECDSA for transaction signing
- **Persistent Storage**: Integrate database (LevelDB, RocksDB, or PostgreSQL)
- **Enhanced Consensus**: Implement Byzantine Fault Tolerance or PoS
- **Wallet System**: Complete wallet integration with key management
- **Transaction Pool**: Implement mempool with fee-based prioritization
- **Improved Networking**: Add peer discovery and automatic sync
- **Scalability**: Implement light clients, sharding, or layer-2 solutions
- **Testing**: Comprehensive unit and integration tests
- **Documentation**: API specifications and architecture docs
- **Monitoring**: Logging, metrics, and observability

## 📦 Dependencies

```json
{
	"express": "^4.x",
	"axios": "^0.x",
	"sha256": "^0.x"
}
```

See `package.json` for exact versions.

## 🧪 Testing

Basic network testing utilities available in `test.js`. Run with:

```bash
node dev/test.js
```

## 📄 License

Educational project. Use freely for learning purposes.

## 📝 Notes

This project is part of a blockchain course curriculum. It prioritizes conceptual clarity and educational value over production-readiness. The codebase intentionally omits certain complexities to focus on core blockchain principles.

For production blockchain systems, refer to established implementations like Bitcoin Core, Ethereum, or other battle-tested platforms.

---

**Status**: Active Development (Educational)  
**Maturity Level**: Early Stage / Proof of Concept  
**Use Case**: Learning & Education Only
