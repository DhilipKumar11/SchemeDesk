# SchemeDesk - Quick Demo Guide

## 🚀 Running the Demo (Step-by-Step)

### Prerequisites Check
Before starting, ensure you have:
- ✅ Node.js installed (check: `node --version`)
- ✅ PostgreSQL installed (check: `psql --version`)
- ✅ Git Bash or PowerShell

---

## Step 1: Setup Database (5 minutes)

### Option A: If PostgreSQL is installed

```bash
# Create database
createdb schemedesk

# Run schema
psql -d schemedesk -f database/schema.sql

# Add sample data
psql -d schemedesk -f database/seed.sql
```

### Option B: If PostgreSQL is NOT installed

**Download PostgreSQL:**
1. Visit: https://www.postgresql.org/download/windows/
2. Download and install PostgreSQL 14+
3. Remember the password you set during installation
4. Then run the commands from Option A

### Verify Database Setup

```bash
# Connect to database
psql -d schemedesk

# Check if tables exist
\dt

# Check schemes count (should show 8)
SELECT COUNT(*) FROM schemes;

# Exit
\q
```

---

## Step 2: Configure Backend

1. **Update database password** in `backend/.env`:
   ```env
   DB_PASSWORD=your_postgres_password_here
   ```

2. **Start backend**:
   ```bash
   cd backend
   npm run dev
   ```

   ✅ You should see:
   ```
   🚀 SchemeDesk Backend Server
   🚀 Server running on port 5000
   ✅ Database connected successfully
   ```

   **Keep this terminal running!**

---

## Step 3: Start Frontend

Open a **NEW terminal** and run:

```bash
cd frontend
npm run dev
```

✅ You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
```

**Keep this terminal running too!**

---

## Step 4: Open in Browser

1. Open your browser
2. Go to: **http://localhost:3000**
3. You should see the SchemeDesk login page!

---

## 🎯 Demo Flow

### 1. Register a New User

Click "Register" and fill in:
- **Name**: Rajesh Kumar
- **Email**: rajesh@example.com
- **Password**: Test@123
- **Age**: 30
- **Income**: 150000
- **State**: Maharashtra
- **District**: Pune

Click "Register" → You'll be logged in automatically!

### 2. Explore Dashboard

You'll see:
- Welcome message with your name
- Application statistics
- Quick action cards

### 3. View Eligible Schemes

Click **"View Eligible Schemes"** button

You'll see schemes you're eligible for based on your profile:
- PM-KISAN (if income < 200000)
- Ayushman Bharat
- PM Awas Yojana
- And more!

Each scheme shows:
- Match percentage
- Category badge
- Description
- Benefits

### 4. Apply to a Scheme

1. Click **"Apply Now"** on any scheme
2. Application will be created
3. You'll see a success message

### 5. Track Applications

Click **"Applications"** in the navbar

You'll see:
- All your applications
- Status badges (Submitted, Under Review, etc.)
- Risk scores
- Application dates

---

## 🎨 What to Show Judges

### Core Differentiator #1: Eligibility Engine
- Navigate to **Schemes** page
- Show how schemes are filtered based on user profile
- Point out the **match percentage** (e.g., "95% Match")
- Explain the rule-based matching

### Core Differentiator #2: Risk Score
- Go to **Applications** page
- Show the **risk score** for each application
- Explain the weighted calculation:
  - Document completeness (30%)
  - Document validity (35%)
  - Profile completeness (15%)
  - Income/Age verification (20%)

### Core Differentiator #3: Document Validation
- Mention the document validation system
- Explain features:
  - Name matching (Levenshtein algorithm)
  - Expiry date checking
  - Format validation
- (Note: Full UI is placeholder, but backend logic is complete)

---

## 🔧 Troubleshooting

### Backend won't start?
**Error**: "Database connection failed"
- Check PostgreSQL is running
- Verify password in `backend/.env`
- Ensure database `schemedesk` exists

### Frontend won't start?
**Error**: "Port 3000 already in use"
- Kill the process using port 3000
- Or change port in `frontend/vite.config.js`

### Can't see schemes?
- Check backend is running on port 5000
- Open http://localhost:5000/health (should return success)
- Check browser console for errors

### Login fails?
- Ensure you registered first
- Check credentials are correct
- Look at backend terminal for error messages

---

## 📊 API Testing (Optional)

Test backend directly:

```bash
# Health check
curl http://localhost:5000/health

# Get all schemes
curl http://localhost:5000/api/schemes

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@test.com\",\"password\":\"test123\"}"
```

---

## 🎬 Quick Demo Script (2 Minutes)

1. **Show Login Page** (10 sec)
   - "Modern, clean UI with premium design"

2. **Register & Login** (20 sec)
   - "User creates profile with demographics"

3. **Dashboard** (15 sec)
   - "Personalized dashboard with stats"

4. **Eligible Schemes** (30 sec)
   - "Rule-based engine matches user to schemes"
   - "See match percentages and categories"

5. **Apply to Scheme** (15 sec)
   - "One-click application creation"

6. **View Applications** (20 sec)
   - "Track status and risk scores"

7. **Explain Differentiators** (30 sec)
   - Eligibility matching
   - Risk score calculation
   - Document validation (backend ready)

**Total**: ~2 minutes

---

## 🎯 Key Talking Points

✅ **Full-stack application** - React + Node.js + PostgreSQL
✅ **Three core differentiators** - All implemented
✅ **8 real government schemes** - PM-KISAN, Ayushman Bharat, etc.
✅ **Modern UI/UX** - Premium design with gradients and animations
✅ **Scalable architecture** - Service layer, RESTful API
✅ **Production-ready** - JWT auth, password hashing, validation

---

## 📱 Screenshots to Take

1. Login page
2. Registration form
3. Dashboard with stats
4. Eligible schemes list
5. Application tracker

---

**You're ready to demo SchemeDesk!** 🚀🇮🇳

Need help? Check the terminals for error messages or review the setup steps above.
