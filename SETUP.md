# SchemeDesk Setup Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Database Setup

```bash
# Install PostgreSQL (if not installed)
# Windows: Download from https://www.postgresql.org/download/windows/

# Create database
createdb schemedesk

# Run schema
psql -d schemedesk -f database/schema.sql

# Seed data
psql -d schemedesk -f database/seed.sql
```

### Step 2: Backend Setup

```bash
cd backend
npm install
npm run dev
```

✅ Backend should be running on http://localhost:5000

### Step 3: Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend should be running on http://localhost:3000

## 📝 Test the Application

1. **Register**: Create account at http://localhost:3000/register
   - Name: Test User
   - Email: test@example.com
   - Password: Test@123
   - Age: 30
   - Income: 150000
   - State: Maharashtra

2. **Login**: Use the credentials above

3. **View Eligible Schemes**: Navigate to Schemes page

4. **Apply**: Click on a scheme and apply

5. **Check Risk Score**: View your application risk

## 🔧 Troubleshooting

### Database Connection Error
- Check PostgreSQL is running
- Verify credentials in `backend/.env`
- Ensure database `schemedesk` exists

### Port Already in Use
- Backend: Change PORT in `backend/.env`
- Frontend: Change port in `frontend/vite.config.js`

### CORS Error
- Ensure backend is running
- Check proxy configuration in `frontend/vite.config.js`

## 📊 API Testing

Test backend endpoints:

```bash
# Health check
curl http://localhost:5000/health

# Get all schemes
curl http://localhost:5000/api/schemes

# Register (POST)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'
```

## 🎯 Demo Flow

1. **Authentication**
   - Register → Login → Dashboard

2. **Scheme Discovery**
   - View all schemes
   - Filter eligible schemes
   - View scheme details

3. **Application**
   - Apply to scheme
   - Upload documents
   - Check validation

4. **Risk Assessment**
   - View risk score
   - See recommendations
   - Track application

## 📁 Project Structure

```
SchemeDesk/
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── config/    # DB & Auth config
│   │   ├── models/    # Data models
│   │   ├── controllers/ # Business logic
│   │   ├── routes/    # API routes
│   │   ├── services/  # Core services (DIFFERENTIATORS)
│   │   └── middleware/ # Auth & error handling
│   └── server.js      # Entry point
│
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/     # Route pages
│   │   ├── services/  # API calls
│   │   ├── context/   # State management
│   │   └── utils/     # Helpers
│   └── index.html     # Entry HTML
│
├── ai-engine/         # Rule-based logic
│   ├── rules/         # Eligibility rules
│   ├── risk-model/    # Risk calculation
│   └── document-analyzer/ # Document validation
│
├── database/          # PostgreSQL
│   ├── schema.sql     # Database schema
│   └── seed.sql       # Sample data
│
└── docs/              # Documentation
```

## 🎨 Key Features

### 1. Eligibility Engine
- Rule-based matching
- Multi-criteria evaluation
- Match percentage scoring

### 2. Risk Score
- Document completeness
- Profile completeness
- Historical patterns
- Recommendations

### 3. Document Validation
- Name matching (Levenshtein)
- Expiry checking
- Format validation
- Real-time feedback

## 🔐 Default Credentials

**Test User** (created in seed.sql):
- Email: rajesh.kumar@example.com
- Password: Test@123

## 📞 Support

For issues or questions:
1. Check console logs
2. Verify all services are running
3. Check database connection
4. Review API responses

## 🎉 Success Indicators

✅ Backend health check returns 200
✅ Frontend loads without errors
✅ Can register and login
✅ Schemes are visible
✅ Can create application
✅ Risk score calculates

---

**Ready to demo!** 🚀
