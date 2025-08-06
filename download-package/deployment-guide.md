# EaseArena Deployment Guide

## Files for Your Domain

Your EaseArena application has been built and is ready for deployment. Here are the files you need:

### 1. Production Files
- **`dist/public/`** - Contains your frontend files (HTML, CSS, JS)
- **`dist/index.js`** - Your backend server file
- **`package.json`** - Dependencies list
- **`shared/schema.ts`** - Database schema
- **`drizzle.config.ts`** - Database configuration

### 2. Required Environment Variables
Create a `.env` file on your server with these variables:
```
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-random-secret-key-here
PGHOST=your-postgres-host
PGPORT=5432
PGDATABASE=your-database-name
PGUSER=your-username
PGPASSWORD=your-password
ISSUER_URL=https://replit.com/oidc
REPL_ID=your-repl-id
REPLIT_DOMAINS=yourdomain.com
```

## Database Setup for cPanel

### Option 1: PostgreSQL on cPanel (if available)
1. **Create PostgreSQL Database**
   - Login to cPanel
   - Go to "PostgreSQL Databases"
   - Create database: `easearena_db`
   - Create user: `easearena_user`
   - Assign user to database with all privileges

2. **Get Connection Details**
   - Host: Usually `localhost` or your domain
   - Port: Usually `5432`
   - Database: `easearena_db`
   - Username: `easearena_user`
   - Password: (what you set)

### Option 2: External PostgreSQL (Recommended)
Since many cPanel hosts don't support PostgreSQL, use a cloud database:

**Neon (Free/Paid)**
1. Go to [neon.tech](https://neon.tech)
2. Create free account
3. Create new project: "EaseArena"
4. Copy the connection string
5. Use this as your `DATABASE_URL`

**Supabase (Free/Paid)**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > Database
4. Copy connection string
5. Use this as your `DATABASE_URL`

### Option 3: MySQL Alternative (if PostgreSQL not available)
If your cPanel only supports MySQL, you'll need to:
1. Modify the database configuration in `drizzle.config.ts`
2. Update schema to use MySQL syntax
3. Install mysql2 instead of @neondatabase/serverless

## Deployment Steps

### 1. Upload Files to cPanel
1. **Upload via File Manager or FTP:**
   - Upload `dist/public/` contents to your `public_html` folder
   - Upload `dist/index.js` to your server root
   - Upload `package.json` to server root

### 2. Install Dependencies
```bash
npm install --production
```

### 3. Set Environment Variables
Create `.env` file with your database credentials

### 4. Initialize Database
```bash
npm run db:push
```

### 5. Seed Database (optional)
```bash
node server/seeds.js
```

### 6. Start Application
```bash
npm start
```

## cPanel Specific Instructions

### Node.js App Setup (if supported)
1. Go to "Node.js Apps" in cPanel
2. Create new app
3. Set startup file: `dist/index.js`
4. Set environment variables
5. Install dependencies
6. Start application

### Alternative: Static Files + API
If cPanel doesn't support Node.js:
1. Upload `dist/public/` to `public_html`
2. Use a separate API hosting service (Heroku, Railway, Render)
3. Update API endpoints in your frontend

## Authentication Setup

Since you're using Replit Auth, you'll need to:
1. Update `REPLIT_DOMAINS` to include your domain
2. Configure OAuth redirect URLs in Replit
3. Or replace with a different auth system (Auth0, Firebase Auth, etc.)

## Database Schema

Your database includes these tables:
- users
- tournaments
- teams
- matches
- tournament_participants
- team_members
- chat_messages
- games
- user_stats
- sessions (for authentication)

## Support

For deployment issues:
1. Check server logs for errors
2. Verify database connection
3. Ensure all environment variables are set
4. Test API endpoints manually

Your EaseArena platform is ready for deployment with full tournament management, team features, and leaderboards!