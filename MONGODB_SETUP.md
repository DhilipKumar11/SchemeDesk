# SchemeDesk - MongoDB Atlas Setup Guide

## 🚀 Quick Setup with MongoDB Atlas

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a **FREE** account
3. Create a new cluster (select FREE tier - M0)
4. Choose your preferred cloud provider and region

### Step 2: Create Database User

1. In Atlas dashboard, go to **Database Access**
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Username: `schemedesk_user`
5. Password: Create a strong password (save it!)
6. Database User Privileges: **Read and write to any database**
7. Click **Add User**

### Step 3: Whitelist IP Address

1. Go to **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (for development)
   - This adds `0.0.0.0/0` to whitelist
4. Click **Confirm**

### Step 4: Get Connection String

1. Go to **Database** (Clusters)
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Select **Driver**: Node.js, **Version**: 5.5 or later
5. Copy the connection string

It will look like:
```
mongodb+srv://schemedesk_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 5: Update Backend Configuration

1. Open `backend/.env`
2. Replace the `MONGODB_URI` with your connection string
3. Replace `<password>` with your actual password
4. Add database name after `.net/`:

```env
MONGODB_URI=mongodb+srv://schemedesk_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/schemedesk?retryWrites=true&w=majority
```

**Example:**
```env
MONGODB_URI=mongodb+srv://schemedesk_user:MyPass123@cluster0.abc123.mongodb.net/schemedesk?retryWrites=true&w=majority
```

---

## 📊 Seed the Database

After setting up your connection string, seed the database with sample schemes:

```bash
cd backend
npm run seed
```

You should see:
```
✅ Connected to MongoDB
🗑️  Cleared existing schemes
✅ Inserted 8 schemes

📊 Seeded Schemes:
   1. PM-KISAN (Agriculture)
   2. Ayushman Bharat (Health)
   3. Sukanya Samriddhi Yojana (Education)
   ... and 5 more

✅ Database seeding completed successfully!
```

---

## 🚀 Start the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Expected output:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
✅ Database: schemedesk
🚀 Server running on port 5000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Then open: **http://localhost:3000**

---

## ✅ Verify MongoDB Connection

### Check in MongoDB Atlas Dashboard

1. Go to **Database** → **Browse Collections**
2. You should see database: `schemedesk`
3. Collections:
   - `schemes` (8 documents)
   - `users` (will populate when you register)
   - `applications` (will populate when you apply)
   - `documents` (will populate when you upload)

### Test API Endpoints

```bash
# Health check
curl http://localhost:5000/health

# Get all schemes
curl http://localhost:5000/api/schemes
```

---

## 🔧 Troubleshooting

### Error: "MongoServerError: bad auth"
- **Fix**: Check your username and password in connection string
- Make sure you replaced `<password>` with actual password

### Error: "MongooseServerSelectionError"
- **Fix**: Check IP whitelist in Network Access
- Make sure `0.0.0.0/0` is added

### Error: "connect ECONNREFUSED"
- **Fix**: Check your internet connection
- Verify connection string is correct

### Connection String Format
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?options
```

Parts:
- `USERNAME`: Your database user
- `PASSWORD`: Your database password (URL-encoded if special chars)
- `CLUSTER`: Your cluster address
- `DATABASE`: `schemedesk`

---

## 📝 Environment Variables

Your `backend/.env` should look like:

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://schemedesk_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/schemedesk?retryWrites=true&w=majority

# JWT
JWT_SECRET=schemedesk_secret_key_2026_india_ascends
JWT_EXPIRE=7d

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

---

## 🎯 What Changed from PostgreSQL

### Removed:
- ❌ PostgreSQL (`pg` package)
- ❌ `database/` folder with SQL files
- ❌ `createdb` and `psql` commands

### Added:
- ✅ MongoDB Atlas (cloud database)
- ✅ Mongoose ODM
- ✅ `backend/seed.js` for seeding
- ✅ No local database installation needed!

### Benefits:
- 🌐 Cloud-hosted (no local setup)
- 🆓 Free tier available
- 📊 Visual dashboard
- 🔄 Auto-backups
- 🚀 Scalable

---

## 🎉 You're Ready!

Once you see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

Your SchemeDesk is running with MongoDB Atlas! 🚀🇮🇳
