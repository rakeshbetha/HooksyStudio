# AWS Amplify Deployment Guide for HooksyStudio

## Overview

This guide explains how to deploy HooksyStudio on AWS Amplify with proper environment variable handling for both client-side and server-side variables.

## Prerequisites

- AWS Account with Amplify access
- Supabase project configured
- OpenAI API key
- GitHub repository connected to Amplify

## Step 1: Environment Variables in Amplify Console

1. Go to your Amplify app dashboard
2. Navigate to **App settings** → **Environment variables**
3. Add the following variables:

### Required Variables

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `OPENAI_API_KEY` | `sk-...` | Your OpenAI API key (server-side only) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://...` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Your Supabase service role key |

### Important Notes

- **`OPENAI_API_KEY`**: This is a **secret** and should never be exposed to the client
- **`NEXT_PUBLIC_*`**: These variables are safe to expose to the client
- **`SUPABASE_SERVICE_ROLE_KEY`**: This is a **secret** for server-side operations only

## Step 2: Build Configuration

The `amplify.yml` file is already configured to:

1. Install dependencies with `npm ci`
2. Write environment variables to `.env.production` before building
3. Build the Next.js application
4. Serve from the `.next` directory

## Step 3: Deploy

1. **Save** the environment variables in Amplify Console
2. **Redeploy** your application (this happens automatically after saving env vars)
3. Monitor the build logs for any errors

## Step 4: Verify Deployment

### Check Build Logs

Look for this diagnostic output in your build logs:

```
ENV check (server): {
  hasOpenAI: true,
  hasSupabaseUrl: true,
  hasSupabaseAnon: true,
  nodeEnv: 'production',
  openaiKeyLength: 51
}
```

### Test API Endpoints

1. Test `/api/generate` endpoint
2. Verify it returns content instead of "OpenAI API key not configured"
3. Check that no secrets are exposed in the client bundle

## Troubleshooting

### Common Issues

#### 1. "OpenAI API key not configured" Error

**Cause**: Environment variable not properly set or not accessible to API routes

**Solution**:
- Verify `OPENAI_API_KEY` is set in Amplify Console
- Check that the variable name is exactly `OPENAI_API_KEY` (case-sensitive)
- Redeploy after setting environment variables

#### 2. Environment Variables Not Loading

**Cause**: Variables not written to `.env.production` during build

**Solution**:
- Check `amplify.yml` exists in your repository root
- Verify build logs show the printf command executing
- Ensure variable names match exactly between Amplify Console and `amplify.yml`

#### 3. Client-Side Errors

**Cause**: Missing `NEXT_PUBLIC_*` variables

**Solution**:
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Check browser console for specific error messages

### Debug Steps

1. **Check Build Logs**: Look for the diagnostic output in Amplify build logs
2. **Verify Variables**: Confirm all required variables are set in Amplify Console
3. **Test Locally**: Test with `.env.local` to ensure code works
4. **Check API Routes**: Verify server-side environment variable access

## Security Best Practices

1. **Never expose secrets**: `OPENAI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are server-side only
2. **Use RLS**: Supabase Row Level Security ensures data isolation
3. **Validate inputs**: All API routes validate input data
4. **Monitor usage**: Track API calls and database access

## Environment Variable Reference

### Client-Side (NEXT_PUBLIC_*)
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

### Server-Side Only
- `OPENAI_API_KEY`: OpenAI API key for content generation
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role for admin operations

## Support

If you encounter issues:

1. Check Amplify build logs for error messages
2. Verify environment variables are set correctly
3. Test API endpoints directly
4. Check this guide for common solutions

## Next Steps

After successful deployment:

1. Test all functionality (hook generation, saving, authentication)
2. Monitor performance and error rates
3. Set up monitoring and alerts if needed
4. Consider setting up custom domain and SSL 