# Supabase Setup Guide for HooksyStudio

## Prerequisites
- Supabase account (free tier available)
- Node.js and npm installed

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `hooksy-studio`
   - Database Password: Choose a strong password
   - Region: Select closest to your users
5. Click "Create new project"

## Step 2: Get API Keys

1. In your project dashboard, go to Settings → API
2. Copy the following values:
   - Project URL
   - Anon (public) key
   - Service role key (keep this secret)

## Step 3: Environment Variables

Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 4: Database Setup

1. In Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `supabase-setup.sql`
3. Click "Run" to execute the SQL

This will create:
- `collections` table for user collections
- `hooks` table for individual hooks
- Row Level Security (RLS) policies
- Proper relationships between tables

## Step 5: Authentication Setup

1. Go to Authentication → Settings in Supabase
2. Configure email templates (optional but recommended)
3. Set up any additional auth providers if needed

## Step 6: Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to `/login`
3. Create a new account
4. Test login/logout functionality

## Database Schema

### Collections Table
- `id`: UUID primary key
- `user_id`: References auth.users(id)
- `title`: Collection name
- `created_at`: Timestamp

### Hooks Table
- `id`: UUID primary key
- `collection_id`: References collections(id)
- `text`: Hook content
- `platform`: Social media platform
- `scores`: JSON field for hook scores
- `created_at`: Timestamp

## Row Level Security

The setup includes RLS policies that ensure:
- Users can only access their own collections
- Users can only access hooks within their collections
- All operations are properly secured by user ownership

## Deployment

### Local Development
- Uses `.env.local` for environment variables
- Supabase client connects to your project

### Production (Amplify)
- Set environment variables in Amplify console
- Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- `SUPABASE_SERVICE_ROLE_KEY` is only needed for server-side operations

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check your environment variables
   - Ensure keys are copied correctly

2. **"RLS policy violation" error**
   - Verify SQL setup was executed
   - Check that user is authenticated

3. **Authentication not working**
   - Check Supabase project settings
   - Verify email confirmation is configured

### Support

- Supabase Documentation: [docs.supabase.com](https://docs.supabase.com)
- Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
- GitHub Issues: Check project repository

## Security Notes

- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- RLS policies provide database-level security
- All user data is automatically isolated by user ID
- Supabase handles authentication tokens securely 