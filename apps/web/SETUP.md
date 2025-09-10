# Environment Setup

## Required API Keys

### Google Generative AI API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your_actual_api_key_here
   ```

### Doma API Key (Optional)
If using Doma Protocol features:
1. Get your API key from [Doma API Documentation](https://docs.doma.ai/)
2. Add it to your `.env` file as:
   ```
   DOMA_API_KEY=your_doma_api_key_here
   ```

## Quick Setup
1. Copy `.env.example` to `.env`
2. Fill in the required API keys
3. Run `npm run dev` to start the development server