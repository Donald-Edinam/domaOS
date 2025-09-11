# Domadir - AI-Powered Domain Management Platform

A comprehensive domain management platform built with Next.js, Convex, and integrated with the Doma API for advanced domain analysis and orderbook functionality. Features AI-powered domain analysis through Mastra agents.

## 🚀 Quick Start

### Prerequisites

- **Bun** (v1.2.20 or higher) - Required package manager
- **Node.js** (v18 or higher)
- **Git**

### 1. Clone & Install

```bash
git clone <repository-url>
cd domadir
bun install
```

### 2. Environment Setup

Create environment files in the following locations:

#### Web App Environment (`apps/web/.env`)

```env
# Convex Configuration
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key

# AI Configuration (for Mastra agents)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key

# Doma API Configuration
DOMA_API_KEY=your_doma_api_key
```

#### Backend Environment (`packages/backend/.env`)

```env
# Convex Configuration
CONVEX_DEPLOYMENT=your_convex_deployment_name
```

### 3. Backend Setup

Initialize and configure your Convex project:

```bash
bun dev:setup
```

This will guide you through:
- Creating a Convex account and project
- Configuring Clerk authentication
- Setting up the database schema

### 4. Authentication Setup

1. Create a [Clerk](https://dashboard.clerk.com/) application
2. Copy the API keys to your web app `.env` file
3. Configure OAuth providers as needed

### 5. API Keys Setup

#### Google AI API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create an API key for Gemini models
3. Add to your `.env` file

#### Doma API Key
1. Contact Doma team for API access
2. Get your testnet API key for `https://api-testnet.doma.xyz`
3. Add to your `.env` file

## 🏃‍♂️ Running the Application

### Development Mode

Start all services:
```bash
bun dev
```

Access the application:
- **Web App**: http://localhost:3001
- **Convex Dashboard**: Available through your Convex deployment

### Individual Services

```bash
bun dev:web        # Web app only
bun dev:server     # Convex backend only
```

## 📁 Project Architecture

```
domadir/
├── apps/
│   └── web/                           # Next.js Frontend
│       ├── src/
│       │   ├── app/                   # App Router pages
│       │   │   ├── api/               # API routes
│       │   │   │   ├── agent/         # AI agent endpoints
│       │   │   │   └── analyze-domains/ # Domain analysis API
│       │   │   ├── dashboard/         # Protected dashboard
│       │   │   │   ├── assistant/     # AI assistant page
│       │   │   │   └── page.tsx       # Domain analysis dashboard
│       │   │   └── (auth)/            # Authentication pages
│       │   ├── components/            # React components
│       │   │   ├── ui/                # shadcn/ui components
│       │   │   ├── assistant-chat.tsx # AI chat interface
│       │   │   ├── domain-analysis.tsx # Domain analysis UI
│       │   │   └── app-sidebar.tsx    # Navigation sidebar
│       │   ├── mastra/                # AI agent configuration
│       │   │   ├── agents/            # Mastra agent definitions
│       │   │   ├── tools/             # Custom AI tools
│       │   │   └── workflows/         # Domain analysis workflows
│       │   ├── hooks/                 # Custom React hooks
│       │   └── lib/                   # Utilities and configs
│       └── package.json
├── packages/
│   └── backend/                       # Convex Backend
│       ├── convex/
│       │   ├── schema.ts              # Database schema
│       │   ├── auth.config.ts         # Auth configuration
│       │   ├── scoring.ts             # Domain scoring functions
│       │   └── tldStats.ts           # TLD statistics
│       └── package.json
├── bunfig.toml                        # Bun configuration
└── package.json                       # Workspace configuration
```

## 🔑 Key Features

### 🤖 AI-Powered Domain Analysis
- **Mastra Agent Framework**: Intelligent domain evaluation
- **Multi-factor Scoring**: Comprehensive domain scoring system
- **AI Assistant**: Interactive chat interface for domain queries
- **Automated Analysis**: Bulk domain analysis capabilities

### 🔐 Authentication & Security
- **Clerk Integration**: Secure user authentication
- **Protected Routes**: Role-based access control
- **Session Management**: Persistent user sessions

### 📊 Domain Management
- **Domain Portfolio**: Manage owned domains
- **Search & Discovery**: Advanced domain search capabilities
- **Analytics Dashboard**: Domain performance metrics
- **TLD Statistics**: Top-level domain insights

### 🔗 API Integration
- **Doma API**: Orderbook and marketplace integration
- **Real-time Data**: Live domain status updates
- **Convex Backend**: Reactive database operations

## 🛠️ Development

### Available Scripts

```bash
# Development
bun dev                    # Start all services
bun dev:web               # Start web app only
bun dev:server            # Start Convex backend only
bun dev:setup             # Setup Convex project

# Building & Testing
bun build                 # Build all applications
bun check-types           # TypeScript type checking
```

### Key Technologies

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Convex (real-time database)
- **AI Framework**: Mastra with Google Gemini
- **UI Components**: shadcn/ui, Radix UI, Tailwind CSS
- **Authentication**: Clerk
- **Package Manager**: Bun (workspaces)

### Adding Features

1. **New AI Tools**: Add to `src/mastra/tools/`
2. **Agent Workflows**: Define in `src/mastra/workflows/`
3. **API Endpoints**: Create in `src/app/api/`
4. **UI Components**: Add to `src/components/`
5. **Database Functions**: Add to `packages/backend/convex/`

## 🧠 AI Agent System

### Mastra Configuration

The platform uses Mastra for AI agent capabilities:

```typescript
// Example agent definition
const domainAgent = new Agent({
  name: 'Domain Assistant',
  instructions: 'Analyze domains for investment potential...',
  model: 'gemini-1.5-flash',
  tools: [searchDomaNames, analyzeDomain]
});
```

### Available Tools

- **Domain Search**: Search available and premium domains
- **Domain Analysis**: Evaluate domain metrics and potential
- **Market Data**: Get domain marketplace statistics

## 🔧 Configuration

### Convex Schema

```typescript
// Database tables
export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    // ... user fields
  }),
  domains: defineTable({
    name: v.string(),
    score: v.number(),
    metrics: v.object({
      // ... domain metrics
    })
  })
});
```

### Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL | ✅ |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | ✅ |
| `CLERK_SECRET_KEY` | Clerk secret key | ✅ |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google AI API key | ✅ |
| `DOMA_API_KEY` | Doma API key | ⚠️ Optional |

## 🚀 Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Set environment variables in dashboard
3. Deploy automatically on push

### Build Process

```bash
bun build
```

Builds:
- Next.js application with static optimization
- Convex functions deployment
- TypeScript compilation

## 🔍 Monitoring & Analytics

### Built-in Analytics

- **Domain Performance**: Track domain metrics over time
- **User Engagement**: Monitor assistant chat usage
- **API Usage**: Track external API calls

### Observability

- **Convex Dashboard**: Real-time function logs
- **Clerk Dashboard**: Authentication analytics
- **Vercel Analytics**: Performance monitoring

## 🐛 Troubleshooting

### Common Issues

**Authentication Errors**
```bash
# Check Clerk configuration
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
```

**Convex Connection Issues**
```bash
# Verify deployment
bun dev:setup
```

**AI Agent Errors**
```bash
# Verify Google AI API key
echo $GOOGLE_GENERATIVE_AI_API_KEY
```

### Debug Mode

Enable verbose logging:
```env
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

## 📚 Resources

- [Mastra Documentation](https://mastra.ai/docs)
- [Convex Documentation](https://docs.convex.dev/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Clerk Authentication](https://clerk.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow existing code conventions
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ using [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack) and enhanced with AI capabilities through [Mastra](https://mastra.ai/).