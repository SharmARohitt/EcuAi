# ecuAi — Secure Decentralized AI Marketplace

![ecuAi Banner](https://img.shields.io/badge/ecuAi-Decentralized%20AI-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

> **"Trust the AI you use — Powering Trusted Intelligence for the Next AI Economy."**

## 🚀 Vision

ecuAi is a trustless decentralized marketplace for AI models, datasets, and compute resources — powered by blockchain, smart contracts, and OriginTrail DKG integration. The platform ensures verifiable provenance, data integrity, fair compensation, and seamless user experience.

### Key Problems Solved
- ✅ AI model theft & data monopolization
- ✅ Opaque AI sourcing
- ✅ Unfair creator compensation
- ✅ Lack of provenance verification

### Core Features
- 🔐 **Verifiable Provenance** via OriginTrail DKG
- 💎 **NFT-based Asset Ownership** (ERC-721/1155)
- 💰 **Automated Royalty Distribution**
- 🧪 **Zero-Knowledge Sandbox Testing**
- 🏛️ **DAO Governance**
- 🌍 **Decentralized Storage** (IPFS/Filecoin)

## 🧩 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│  React + TypeScript + TailwindCSS + Three.js + Framer Motion │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              Backend API (Node.js + Express)                 │
│        TypeScript + MongoDB + Web3.js + DKG SDK              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────┬──────────────────────┬───────────────┐
│  Smart Contracts     │  OriginTrail DKG     │  AI Runtime   │
│  (Solidity/Move)     │  Provenance Layer    │  (Python)     │
│  Ethereum/Aptos      │  IPFS Storage        │  FastAPI+zkML │
└──────────────────────┴──────────────────────┴───────────────┘
```

## 📁 Project Structure

```
ecuAi/
├── frontend/              # Next.js frontend application
│   ├── components/        # React components
│   ├── pages/            # Next.js pages
│   ├── styles/           # Global styles
│   ├── utils/            # Utility functions
│   ├── hooks/            # Custom React hooks
│   └── public/           # Static assets
│
├── backend/              # Node.js backend API
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   │   ├── dkgService.ts
│   │   │   ├── ipfsService.ts
│   │   │   ├── contractService.ts
│   │   │   └── aiSandboxService.ts
│   │   ├── models/       # Database models
│   │   ├── middleware/   # Express middleware
│   │   └── config/       # Configuration
│
├── contracts/            # Smart contracts
│   ├── contracts/
│   │   ├── AIAssetRegistry.sol
│   │   ├── RoyaltyEscrow.sol
│   │   └── GovernanceDAO.sol
│   ├── scripts/          # Deployment scripts
│   └── test/             # Contract tests
│
├── ai-runtime/           # Python AI microservice
│   ├── app.py            # FastAPI application
│   ├── models/           # AI model handlers
│   ├── zkml/             # Zero-knowledge ML
│   └── requirements.txt
│
└── docs/                 # Documentation
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 + React 18 + TypeScript
- **Styling**: TailwindCSS + Framer Motion
- **3D Graphics**: Three.js + React Three Fiber
- **Web3**: RainbowKit + Wagmi + Viem
- **State Management**: Zustand
- **UI Components**: shadcn/ui + Lucide Icons

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js + TypeScript
- **Database**: MongoDB + Mongoose
- **Web3**: Web3.js + Ethers.js
- **Storage**: IPFS (via Pinata/Web3.Storage)
- **DKG**: @origintrail/dkg SDK

### Blockchain
- **Network**: Ethereum (Sepolia testnet) / Aptos
- **Smart Contracts**: Solidity 0.8.20+
- **Development**: Hardhat / Foundry
- **Standards**: ERC-721, ERC-1155, ERC-20

### AI Runtime
- **Framework**: FastAPI
- **ML Libraries**: PyTorch, scikit-learn
- **zkML**: zkSNARK libraries
- **Containerization**: Docker

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.10+
- MongoDB
- MetaMask or compatible Web3 wallet

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ecuAi.git
cd ecuAi
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

3. **Install Backend Dependencies**
```bash
cd ../backend
npm install
```

4. **Install AI Runtime Dependencies**
```bash
cd ../ai-runtime
pip install -r requirements.txt
```

5. **Install Smart Contract Dependencies**
```bash
cd ../contracts
npm install
```

### Configuration

1. **Backend Environment Variables** (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecuai
JWT_SECRET=your_jwt_secret_here

# Blockchain
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS=deployed_contract_address

# OriginTrail DKG
DKG_ENDPOINT=https://testnet.origintrail.io
DKG_PRIVATE_KEY=your_dkg_private_key

# IPFS
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_KEY=your_pinata_secret

# AI Runtime
AI_SERVICE_URL=http://localhost:8000
```

2. **Frontend Environment Variables** (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Running the Application

1. **Start MongoDB**
```bash
mongod
```

2. **Start Backend API**
```bash
cd backend
npm run dev
```

3. **Start AI Runtime**
```bash
cd ai-runtime
uvicorn app:app --reload --port 8000
```

4. **Start Frontend**
```bash
cd frontend
npm run dev
```

5. **Deploy Smart Contracts** (first time only)
```bash
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.ts --network sepolia
```

Visit `http://localhost:3000` to access the application.

## 📚 API Documentation

### Backend API Endpoints

#### Assets
- `POST /api/upload` - Upload AI model/dataset
- `GET /api/assets` - List all assets
- `GET /api/assets/:id` - Get asset details
- `GET /api/verify/:kaid` - Verify provenance via DKG

#### Transactions
- `POST /api/purchase` - Purchase asset
- `GET /api/transactions/:userId` - Get user transactions

#### Sandbox
- `POST /api/test-sandbox` - Run sandbox inference

#### User
- `POST /api/auth/login` - Web3 authentication
- `GET /api/user/profile` - Get user profile
- `GET /api/user/dashboard` - Get creator dashboard data

## 🔐 Security Features

- ✅ Web3-based authentication (no passwords)
- ✅ JWT token validation
- ✅ Rate limiting & DDoS protection
- ✅ Input sanitization
- ✅ HTTPS enforcement
- ✅ Smart contract auditing
- ✅ Encrypted file storage
- ✅ Zero-knowledge proofs for privacy

## 💎 Token Economics

### $ECU Token (ERC-20)
- **Utility**: Transaction fees, staking, governance
- **Total Supply**: 1,000,000,000 ECU
- **Distribution**:
  - 40% - Community & Ecosystem
  - 25% - Team & Advisors (4-year vesting)
  - 20% - Treasury & Development
  - 15% - Initial Liquidity

### $rECU (Reward Token)
- Earned through platform participation
- Redeemable for $ECU
- Auto-distributed royalties

## 🎨 Design System

### Color Palette
- **Primary**: Electric Blue (#0EA5E9)
- **Secondary**: Neon Green (#10B981)
- **Background**: Matte Black (#0F172A)
- **Accent**: Purple (#8B5CF6)

### Typography
- **Headings**: Inter Bold
- **Body**: Inter Regular
- **Code**: JetBrains Mono

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm run test
```

### Backend Tests
```bash
cd backend
npm run test
```

### Smart Contract Tests
```bash
cd contracts
npx hardhat test
```

## 📦 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy --prod
```

### Backend (Railway/Render)
```bash
cd backend
# Configure your deployment platform
```

### Smart Contracts
```bash
cd contracts
npx hardhat run scripts/deploy.ts --network mainnet
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: [ecuai.io](https://ecuai.io)
- **Documentation**: [docs.ecuai.io](https://docs.ecuai.io)
- **Twitter**: [@ecuAI](https://twitter.com/ecuAI)
- **Discord**: [Join our community](https://discord.gg/ecuai)

## 🙏 Acknowledgments

- OriginTrail for DKG infrastructure
- OpenZeppelin for secure smart contracts
- The Web3 community

---

**Built with ❤️ for the decentralized AI economy**
