# ecuAi Deployment Guide

This guide will help you deploy the ecuAi platform across all layers.

## Prerequisites

- Node.js 20+
- Python 3.10+
- MongoDB
- MetaMask or compatible Web3 wallet
- Infura/Alchemy account (for Ethereum RPC)
- Pinata account (for IPFS)
- OriginTrail DKG credentials

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone https://github.com/yourusername/ecuAi.git
cd ecuAi
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
# Required variables:
# - MONGODB_URI
# - JWT_SECRET
# - ETHEREUM_RPC_URL
# - PRIVATE_KEY
# - DKG_ENDPOINT, DKG_PRIVATE_KEY, DKG_PUBLIC_KEY
# - PINATA_API_KEY, PINATA_SECRET_KEY

# Start MongoDB
mongod

# Run backend
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Edit .env.local with your configuration
# Required variables:
# - NEXT_PUBLIC_API_URL=http://localhost:5000
# - NEXT_PUBLIC_CHAIN_ID=11155111
# - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

# Run frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Smart Contracts Deployment

```bash
cd contracts

# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Deploy to testnet (Sepolia)
npx hardhat run scripts/deploy.ts --network sepolia

# Save the contract addresses to backend/.env and frontend/.env.local
```

### 5. AI Runtime Setup

```bash
cd ai-runtime

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run AI service
uvicorn app:app --reload --port 8000
```

AI Runtime will run on `http://localhost:8000`

## 🌐 Production Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

```bash
# Or deploy manually
cd frontend
vercel --prod
```

### Backend (Railway/Render)

1. Create new project on Railway/Render
2. Connect GitHub repository
3. Set environment variables
4. Deploy

**Environment Variables:**
```
PORT=5000
NODE_ENV=production
MONGODB_URI=<your_mongodb_atlas_uri>
JWT_SECRET=<strong_secret>
ETHEREUM_RPC_URL=<mainnet_rpc>
PRIVATE_KEY=<deployer_private_key>
DKG_ENDPOINT=<origintrail_endpoint>
DKG_PRIVATE_KEY=<dkg_key>
DKG_PUBLIC_KEY=<dkg_public_key>
PINATA_API_KEY=<pinata_key>
PINATA_SECRET_KEY=<pinata_secret>
AI_SERVICE_URL=<ai_runtime_url>
CORS_ORIGIN=<frontend_url>
```

### AI Runtime (Docker)

```bash
cd ai-runtime

# Build Docker image
docker build -t ecuai-runtime .

# Run container
docker run -p 8000:8000 ecuai-runtime

# Or deploy to cloud (AWS ECS, Google Cloud Run, etc.)
```

### Smart Contracts (Mainnet)

```bash
cd contracts

# Deploy to mainnet
npx hardhat run scripts/deploy.ts --network mainnet

# Verify on Etherscan
npx hardhat verify --network mainnet <CONTRACT_ADDRESS>
```

### Database (MongoDB Atlas)

1. Create MongoDB Atlas account
2. Create new cluster
3. Whitelist IP addresses
4. Get connection string
5. Update `MONGODB_URI` in backend .env

## 🔐 Security Checklist

- [ ] Change all default secrets and keys
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up proper CORS policies
- [ ] Enable rate limiting
- [ ] Audit smart contracts
- [ ] Set up monitoring and logging
- [ ] Enable database backups
- [ ] Implement proper error handling
- [ ] Secure API keys in environment variables
- [ ] Enable Web3 authentication

## 📊 Monitoring

### Backend Logs

```bash
cd backend
tail -f logs/combined.log
```

### Frontend Analytics

- Set up Vercel Analytics
- Configure Google Analytics
- Monitor Web3 transactions

### Smart Contract Events

- Use Etherscan for transaction monitoring
- Set up event listeners in backend
- Configure alerts for critical events

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm run test
```

### Frontend Tests

```bash
cd frontend
npm run test
```

### Smart Contract Tests

```bash
cd contracts
npx hardhat test
```

### Integration Tests

```bash
# Start all services
# Run integration test suite
npm run test:integration
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy ecuAi

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: railway up
```

## 📝 Post-Deployment

1. **Test all features:**
   - Wallet connection
   - Asset upload
   - Asset purchase
   - Sandbox testing
   - DKG verification

2. **Monitor performance:**
   - API response times
   - Database queries
   - Smart contract gas usage
   - IPFS upload/download speeds

3. **Set up alerts:**
   - Server downtime
   - High error rates
   - Failed transactions
   - Low balance warnings

## 🆘 Troubleshooting

### Common Issues

**Issue: Cannot connect to MongoDB**
```bash
# Check MongoDB is running
mongod --version
# Check connection string
echo $MONGODB_URI
```

**Issue: Smart contract deployment fails**
```bash
# Check network configuration
npx hardhat network
# Verify account has sufficient ETH
# Check gas price settings
```

**Issue: IPFS upload fails**
```bash
# Verify Pinata credentials
# Check API rate limits
# Test connection: curl https://api.pinata.cloud/data/testAuthentication
```

**Issue: DKG integration errors**
```bash
# Verify DKG credentials
# Check endpoint availability
# Review DKG documentation
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OriginTrail DKG Docs](https://docs.origintrail.io/)
- [IPFS Documentation](https://docs.ipfs.io/)
- [Web3.js Documentation](https://web3js.readthedocs.io/)

## 🤝 Support

For deployment issues:
- Open an issue on GitHub
- Join our Discord community
- Email: support@ecuai.io

---

**Built with ❤️ for the decentralized AI economy**
