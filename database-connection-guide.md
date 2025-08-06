# Database Connection for Login Access

## Option 1: Use Your Existing Database

### If you have PostgreSQL:
1. Create database: `easearena_db`
2. Create user: `easearena_user` with password
3. Run this SQL to create tables:

```sql
-- Copy and paste the entire cpanel-setup.sql file content here
-- This creates all necessary tables for login and tournaments
```

### Connection String Format:
```
DATABASE_URL=postgresql://easearena_user:your_password@localhost:5432/easearena_db
```

## Option 2: Free Cloud Database (Recommended)

### Neon (Free PostgreSQL):
1. Go to neon.tech
2. Create account and project "EaseArena" 
3. Copy connection string (something like):
   `postgresql://user:pass@ep-name-123.us-east-1.aws.neon.tech/easearena`
4. Use this as your DATABASE_URL

### Supabase (Free PostgreSQL):
1. Go to supabase.com
2. Create new project
3. Go to Settings > Database
4. Copy connection string
5. Use this as your DATABASE_URL

## Option 3: Alternative Authentication

### If database setup is complex, you can replace Replit Auth with:
- Auth0 (auth0.com)
- Firebase Auth (firebase.google.com)
- Simple username/password system

## Quick Test:
Once database is connected, the app will automatically:
- Create user accounts on login
- Store tournament data
- Handle team memberships
- Track leaderboards

Your login system will work as soon as the database connection is established.