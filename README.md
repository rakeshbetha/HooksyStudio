# Hooksy.studio

AI-powered content generation for viral hooks, titles, hashtags, and CTAs.

## Features

- Generate viral hooks, titles, hashtags, and CTAs with AI
- Multiple tone options (professional, funny, emotional, shocking, educational, motivational)
- Save and organize your favorite content
- Social media preview functionality
- Responsive design for all devices

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- CSS Modules
- Framer Motion
- OpenAI API

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env.local` with your API keys (see `env.example`)
4. Run the development server: `npm run dev`

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# OpenAI Configuration (Server-side only)
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Important**: Never expose `OPENAI_API_KEY` in client-side code. It's only used in API routes.

## Deployment

### AWS Amplify

This project is configured for AWS Amplify deployment with automatic environment variable handling.

1. **Set Environment Variables in Amplify Console:**
   - `OPENAI_API_KEY` (your OpenAI API key)
   - `NEXT_PUBLIC_SUPABASE_URL` (your Supabase project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (your Supabase anon key)
   - `SUPABASE_SERVICE_ROLE_KEY` (your Supabase service role key)

2. **Deploy:** Amplify will automatically build and deploy using the `amplify.yml` configuration.

### Vercel (Alternative)

This project can also be deployed on Vercel with automatic deployments from the main branch.

Latest deployment: Fixed import issues and enhanced UX flow 