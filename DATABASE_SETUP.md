# Database Setup Guide - FaithConnect

## Quick Setup Using pgAdmin (Easiest Method)

### Step 1: Open pgAdmin
- Look for pgAdmin in your Start Menu
- pgAdmin should be installed with PostgreSQL

### Step 2: Connect to Server
- Expand "Servers" in left panel
- Click on "PostgreSQL 16" (or your version)
- Enter your PostgreSQL password if prompted

### Step 3: Create Database
1. Right-click on "Databases"
2. Select "Create" → "Database..."
3. In the "General" tab:
   - Database name: `faithconnect`
4. Click "Save"

### Step 4: Load Schema
1. Click on the new `faithconnect` database
2. Click "Tools" in top menu → "Query Tool"
3. Click the folder icon (Open File)
4. Navigate to: `d:\Websites\Humanity\FaithConnect\backend\database.sql`
5. Click "Open"
6. Click the Play button (▶) or press F5 to execute
7. You should see: "Query returned successfully"

### Step 5: Verify Data
In the Query Tool, run:
```sql
SELECT * FROM users;
```
You should see 5 sample users (3 leaders, 2 worshipers)

✅ **Done!** Your database is ready!

---

## Alternative: Using SQL Shell (psql)

If you prefer command line:

### Step 1: Open SQL Shell (psql)
- Search for "SQL Shell (psql)" in Start Menu
- Press Enter to accept defaults for:
  - Server [localhost]: (press Enter)
  - Database [postgres]: (press Enter)  
  - Port [5432]: (press Enter)
  - Username [postgres]: (press Enter)
- Enter your PostgreSQL password

### Step 2: Create Database
```sql
CREATE DATABASE faithconnect;
\q
```

### Step 3: Reconnect to New Database
- Reopen SQL Shell
- When prompted for Database, type: `faithconnect`
- Press Enter for other defaults
- Enter password

### Step 4: Load Schema
```sql
\i 'd:/Websites/Humanity/FaithConnect/backend/database.sql'
```

---

## Verify Backend Connection

Once database is set up, restart your backend:

```bash
cd d:\Websites\Humanity\FaithConnect\backend
npm start
```

You should see:
```
✅ Database connected successfully
🚀 FaithConnect Server running on port 5000
```

Test the API:
```
http://localhost:5000/health
```

---

## Sample Data Included

The database.sql file creates everything and adds sample users:

**Religious Leaders:**
- `leader1@faith.com` (Pastor John Smith - Christianity)
- `leader2@faith.com` (Imam Ahmed Hassan - Islam)
- `leader3@faith.com` (Rabbi David Cohen - Judaism)

**Worshipers:**
- `worshiper1@faith.com` (Sarah Johnson)
- `worshiper2@faith.com` (Michael Brown)

**All passwords:** `password123`

---

## Troubleshooting

### "Database already exists"
Good! It's already created. Just load the schema:
- Open pgAdmin
- Right-click `faithconnect` database
- Delete it and start over, OR
- Use Query Tool to run the SQL

### "Permission denied"
Run pgAdmin as Administrator

### Can't find pgAdmin
Download from: https://www.pgadmin.org/download/

### Backend won't connect
Check `backend/.env` file:
```
DB_NAME=faithconnect
DB_USER=postgres
DB_PASSWORD=your_password_here
```

---

## Need to Reset Database?

To start fresh:

```sql
-- In psql or pgAdmin Query Tool
DROP DATABASE faithconnect;
CREATE DATABASE faithconnect;
-- Then run database.sql again
```
