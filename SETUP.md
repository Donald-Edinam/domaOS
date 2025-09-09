# Doma Domain Management Platform - Setup Guide

A comprehensive domain management platform built with Next.js, Convex, and integrated with the Doma API for orderbook functionality.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Bun** (recommended package manager)
- **Git**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd domadir
```

### 2. Install Dependencies

```bash
bun install
```

## 🔧 Environment Setup

### 3. Configure Environment Variables

You'll need to set up environment variables for both the web app and backend.

#### Web App Environment (apps/web/.env)

Create `apps/web/.env` file:

```env
# Convex Configuration
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
NEXT_PUBLIC_CLERK_FRONTEND_API_URL=https://your-clerk-frontend-api.clerk.accounts.dev

# Doma API Configuration
DOMA_API_KEY=your_doma_api_key
```

#### Backend Environment (packages/backend/.env)

Create `packages/backend/.env` file:

```env
# Convex Configuration
CONVEX_DEPLOYMENT=your_convex_deployment_name
```

### 4. Set Up Convex Backend

Initialize and configure your Convex project:

```bash
bun dev:setup
```

This will:
- Create a new Convex project (if needed)
- Configure authentication with Clerk
- Set up the database schema
- Generate necessary configuration files

Follow the prompts to:
1. Create a Convex account (if you don't have one)
2. Create a new project
3. Configure Clerk integration

### 5. Set Up Clerk Authentication

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy the API keys to your `.env` file
4. Configure OAuth providers (optional)
5. Set up webhooks for user synchronization with Convex

### 6. Get Doma API Key

1. Contact Doma team or visit their developer portal
2. Obtain your API key for testnet: `https://api-testnet.doma.xyz`
3. Add the API key to your `.env` file

## 🏃‍♂️ Running the Application

### Development Mode

Start all services in development mode:

```bash
bun dev
```

This will start:
- **Web App**: http://localhost:3001
- **Convex Backend**: Connected to your cloud deployment

### Individual Services

Start only the web application:
```bash
bun dev:web
```

Start only the Convex backend:
```bash
bun dev:server
```

## 📁 Project Structure

```
domadir/
├── apps/
│   └── web/                    # Next.js Frontend Application
│       ├── src/
│       │   ├── app/
│       │   │   ├── api/        # API Routes
│       │   │   │   ├── domains/        # Domain management API
│       │   │   │   └── orderbook/      # Orderbook API routes
│       │   │   │       ├── list/       # Create listings
│       │   │   │       ├── offer/      # Create offers
│       │   │   │       ├── listing/    # Listing operations
│       │   │   │       └── currencies/ # Supported currencies
│       │   │   ├── dashboard/  # Protected dashboard pages
│       │   │   │   ├── search/         # Domain search
│       │   │   │   └── orderbook/      # Orderbook management
│       │   │   └── sign-in/    # Authentication pages
│       │   ├── components/     # Reusable UI components
│       │   │   ├── ui/         # shadcn/ui components
│       │   │   ├── app-sidebar.tsx     # Main navigation
│       │   │   └── providers.tsx       # Context providers
│       │   └── lib/           # Utility functions
│       ├── .env               # Environment variables
│       └── package.json
├── packages/
│   └── backend/               # Convex Backend
│       ├── convex/
│       │   ├── schema.ts      # Database schema
│       │   ├── auth.config.ts # Authentication config
│       │   └── todos.ts       # Example functions
│       ├── .env               # Backend environment
│       └── package.json
├── package.json               # Root package.json
└── README.md
```

## 🔑 Key Features

### Authentication
- **Clerk Integration**: Secure user authentication
- **Protected Routes**: Dashboard requires authentication
- **User Management**: Profile and session handling

### Domain Management
- **Domain Search**: Search for available and expiring domains
- **Domain Portfolio**: Manage owned domains
- **Advanced Filtering**: Category and status-based filtering

### Orderbook Integration
- **Create Listings**: Fixed-price listings on OpenSea/Doma
- **Create Offers**: Make offers on domain tokens
- **Cancel Orders**: Cancel existing listings and offers
- **Fee Management**: View marketplace fees
- **Multi-chain Support**: Support for different blockchain networks

### API Endpoints

#### Domain API
- `GET /api/domains` - Fetch domains with filtering options
- `GET /api/domains/[id]` - Get specific domain details

#### Orderbook API
- `POST /api/orderbook/list` - Create a listing
- `POST /api/orderbook/offer` - Create an offer
- `GET /api/orderbook/listing/[orderId]/[buyer]` - Get listing fulfillment data
- `GET /api/orderbook/offer/[orderId]/[fulfiller]` - Get offer fulfillment data
- `POST /api/orderbook/listing/cancel` - Cancel a listing
- `POST /api/orderbook/offer/cancel` - Cancel an offer
- `GET /api/orderbook/fee/[orderbook]/[chainId]/[contractAddress]` - Get fees
- `GET /api/orderbook/currencies/[chainId]/[contractAddress]/[orderbook]` - Get supported currencies

## 🛠️ Development

### Available Scripts

```bash
# Development
bun dev                 # Start all services
bun dev:web            # Start only web app
bun dev:server         # Start only Convex backend
bun dev:setup          # Setup Convex project

# Building
bun build              # Build all applications
bun check-types        # Type checking across all apps
```

### Adding New Features

1. **API Routes**: Add new routes in `apps/web/src/app/api/`
2. **Pages**: Add new pages in `apps/web/src/app/dashboard/`
3. **Components**: Create reusable components in `apps/web/src/components/`
4. **Backend Functions**: Add Convex functions in `packages/backend/convex/`

### Database Schema

The Convex schema includes:
- **Users**: User profiles and authentication data
- **Todos**: Example data structure (can be extended)
- **Private Data**: Secure user-specific information

## 🔒 Security

- **API Key Protection**: Doma API key is server-side only
- **Authentication**: All dashboard routes are protected
- **Input Validation**: Form validation and sanitization
- **CORS**: Proper cross-origin request handling

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `DOMA_API_KEY`

## 🐛 Troubleshooting

### Common Issues

1. **404 on API routes**: Ensure environment variables are set correctly
2. **Authentication errors**: Check Clerk configuration and API keys
3. **Convex connection issues**: Verify Convex deployment URL
4. **Doma API errors**: Confirm API key validity and network access

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.