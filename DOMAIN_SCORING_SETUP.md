# Domain Scoring MVP Setup Guide

## Overview
This is a domain scoring MVP that analyzes and scores SaaS-ready domains from the Doma Multi-Chain ecosystem. It provides:

- Domain scoring algorithm based on length, TLD, and SaaS keywords
- Leaderboard of top-scoring domains
- Domain search functionality
- TLD trend analysis and charts
- Real-time data ingestion from Doma Subgraph

## Architecture

### Backend (Convex)
- **Domain Scoring**: Algorithm that scores domains 0-100 based on multiple factors
- **Data Ingestion**: Fetches domains from Doma Multi-Chain Subgraph
- **Database**: Stores domains, scores, TLD statistics, and trends
- **API**: Convex functions for querying data

### Frontend (Next.js)
- **Dashboard**: Main leaderboard and search interface
- **Trends Page**: Charts showing TLD performance over time
- **API Routes**: REST endpoints for external access

## Setup Instructions

### 1. Install Dependencies
```bash
bun install
```

### 2. Setup Convex Backend

**Option A: Interactive Setup (Recommended)**
```bash
cd packages/backend
npx convex dev --configure
```

Follow the prompts to:
- Create a new Convex project or connect to existing
- Set up authentication (optional)
- Generate deployment URL

**Option B: Manual Setup**
1. Go to https://dashboard.convex.dev
2. Create a new project
3. Get your deployment URL
4. Create `packages/backend/convex.json`:
```json
{
  "origin": "https://your-project.convex.cloud"
}
```

### 3. Environment Variables

**Backend (`packages/backend/.env`)**
```env
# Already configured
CLERK_JWT_ISSUER_DOMAIN=https://game-parakeet-96.clerk.accounts.dev/.well-known/jwks.json
```

**Frontend (`apps/web/.env.local`)**
```env
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```

### 4. Deploy Schema
```bash
cd packages/backend
npx convex dev
```

This will deploy:
- Domain schema with scoring fields
- TLD statistics schema
- Supported TLDs schema
- All query and mutation functions

### 5. Initialize Data
Once both servers are running:

1. Open http://localhost:3001
2. Click "Initialize Data" button
3. This will:
   - Set up supported TLDs with bonuses
   - Start fetching domains from Doma Subgraph
   - Calculate and store domain scores

### 6. Start Development

**Terminal 1 (Backend):**
```bash
bun run dev:server
```

**Terminal 2 (Frontend):**
```bash
bun run dev:web
```

## API Endpoints

### Domain Queries
- `GET /api/domains/top?limit=10` - Top scoring domains
- `GET /api/domains/[name]` - Get specific domain score
- `GET /api/domains/search?sld=example&limit=10` - Search domains by SLD

### TLD Statistics
- `GET /api/tlds/stats?limit=20` - TLD performance stats
- `GET /api/tlds/trends?tlds=ai,io,dev&weeks=8` - TLD trend data

### Data Management
- `POST /api/data/initialize` - Initialize data from Doma Subgraph

## Scoring Algorithm

Domains are scored 0-100 based on:

### Base Score: 50 points

### Length Bonus:
- ≤3 characters: +30 points (Premium short)
- 4-5 characters: +20 points
- 6-7 characters: +10 points
- 8-10 characters: +0 points
- >10 characters: -10 points

### SaaS Keywords: +15 points
Keywords include: ai, app, api, cloud, dev, tech, software, platform, saas, tool, hub, lab, studio, build, data, smart, digital, web, code, pro, etc.

### TLD Bonus:
- .ai: +25 points
- .cloud: +25 points
- .io: +20 points
- .dev: +20 points
- .app: +20 points
- .co: +15 points
- .tech: +15 points
- .com: +10 points
- .org, .net: +5 points

### Quality Bonuses:
- No hyphens/numbers: +5 points
- Dictionary-like word: +10 points

## Features Implemented

### ✅ Core Features
- [x] Domain scoring algorithm
- [x] Data ingestion from Doma Subgraph
- [x] Top domains leaderboard
- [x] Domain search functionality
- [x] TLD statistics and trends
- [x] Interactive dashboard
- [x] Trend charts with Recharts
- [x] REST API endpoints

### 🎨 UI Features
- [x] Dark/light mode support
- [x] Responsive design
- [x] Score badges (Premium/Good/Fair/Basic)
- [x] SaaS keyword highlighting
- [x] Interactive TLD selector
- [x] Real-time score visualization

## Data Sources

### Doma Multi-Chain Subgraph
- **Endpoint**: https://api-testnet.doma.xyz/graphql
- **Query**: Fetches tokenized domains with metadata
- **Fields**: name, expiresAt, ownerAddress, tokens, registrar info

### Supported TLDs
Currently tracking 200+ TLDs including popular ones like .ai, .io, .dev, .cloud, and traditional ones like .com, .org.

## File Structure

```
├── apps/web/src/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── trends/       # Trends page
│   │   └── page.tsx      # Main dashboard
├── packages/backend/convex/
│   ├── schema.ts         # Database schema
│   ├── scoring.ts        # Domain scoring functions
│   ├── tldStats.ts       # TLD statistics functions
│   └── dataIngestion.ts  # Doma Subgraph integration
```

## Troubleshooting

### Common Issues

**1. "Cannot prompt for input in non-interactive terminals"**
- Run `npx convex dev --configure` in an interactive terminal
- Or manually set up Convex project via dashboard

**2. "NEXT_PUBLIC_CONVEX_URL is not defined"**
- Add the Convex URL to `apps/web/.env.local`
- Get URL from Convex dashboard or terminal output

**3. "No domains found"**
- Click "Initialize Data" button in the dashboard
- Wait for data ingestion to complete
- Check browser console for any API errors

**4. API endpoints returning 500 errors**
- Ensure Convex backend is running
- Check that schema has been deployed
- Verify environment variables are set

### Development Tips

1. **Data Initialization**: Start with small batches (50-100 domains) to test
2. **Rate Limiting**: Doma Subgraph has rate limits, adjust batch sizes if needed
3. **Score Tuning**: Modify scoring algorithm in `packages/backend/convex/scoring.ts`
4. **TLD Management**: Add new TLDs in the `initializeSupportedTlds` function

## Next Steps

### Phase 2 Features
- [ ] User authentication and saved searches
- [ ] Domain availability checking
- [ ] Price predictions based on scores
- [ ] Email alerts for new high-scoring domains
- [ ] Advanced filtering (by registrar, network, etc.)
- [ ] Export functionality (CSV, JSON)
- [ ] Historical score tracking
- [ ] Machine learning score improvements

### Technical Improvements
- [ ] Caching layer for better performance
- [ ] Real-time updates with Convex subscriptions
- [ ] Background jobs for continuous data sync
- [ ] A/B testing for scoring algorithms
- [ ] Analytics and usage tracking

## Support

This MVP demonstrates the core functionality for Track 4 of the hackathon. The system is designed to be easily extensible for production use with additional features and optimizations.

For technical questions or issues, check the console logs and API responses for debugging information.
