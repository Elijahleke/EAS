# Files to Upload to Your Server

## 1. Upload to public_html folder:
Copy these files from your Replit project:

### Frontend Files (goes in public_html/):
- `dist/public/index.html` 
- `dist/public/assets/index-CKF7hNDU.css`
- `dist/public/assets/index-etYd2Bwa.js`

### Folder structure in public_html:
```
public_html/
├── index.html
└── assets/
    ├── index-CKF7hNDU.css
    └── index-etYd2Bwa.js
```

## 2. Backend Server (if Node.js supported):
- `dist/index.js` - Upload to server root or Node.js app folder
- `package.json` - Upload to same location

## 3. Environment Setup:
Create `.env` file on your server with your database connection:

```
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-random-secret-key-here
NODE_ENV=production
PORT=3000
```

## 4. Database Setup:
Run the SQL commands in `cpanel-setup.sql` in your PostgreSQL database.

## 5. If Node.js not supported:
Use static frontend files only and connect to a separate API service (like Railway, Heroku, or Render) for the backend.