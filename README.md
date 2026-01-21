# SchemeDesk - Eligibility Intelligence Layer

**Decision system for Indian welfare delivery • Not a portal, a verification engine**

SchemeDesk is an **Eligibility Intelligence Layer** that sits on top of existing government infrastructure to solve the discovery and verification problem. We don't replace government portals - we make them smarter.

## 🎯 Core Differentiators

1. **Rule Engine Model** - Structured eligibility configs, not keyword matching
2. **Approval Risk Scoring** - Predictive probability analysis, not binary yes/no  
3. **Failure-Handling Logic** - Delay reasons, missing docs, appeal eligibility

## 🧠 What Makes This Different

**We're NOT building:**
- ❌ Another government portal
- ❌ A scheme listing website
- ❌ A document storage system

**We ARE building:**
- ✅ An eligibility verification engine
- ✅ A risk scoring system
- ✅ A decision intelligence layer

## 🏗️ Architecture

```
SchemeDesk/
├── frontend/          # React + Vite
├── backend/           # Node.js + Express
├── database/          # PostgreSQL schemas
├── ai-engine/         # Rule-based logic
└── docs/              # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (FREE tier)
- Git

### 1. MongoDB Atlas Setup

**Create FREE MongoDB Atlas account:**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a cluster (M0 - Free tier)
3. Create database user
4. Whitelist IP address (0.0.0.0/0 for development)
5. Get connection string

**Update backend/.env:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/schemedesk?retryWrites=true&w=majority
```

**Seed the database:**
```bash
cd backend
npm install
npm run seed
```

### 2. Backend Setup

```bash
cd backend
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## 📊 Database Configuration

Update `backend/.env` with your MongoDB Atlas connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/schemedesk?retryWrites=true&w=majority
JWT_SECRET=your_secret_key
```

**Get MongoDB Atlas connection string:**
- See [MONGODB_SETUP.md](MONGODB_SETUP.md) for detailed instructions

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Schemes
- `GET /api/schemes` - Get all schemes
- `GET /api/schemes/eligible` - Get eligible schemes (Protected)
- `GET /api/schemes/:id` - Get scheme details

### Applications
- `POST /api/applications` - Create application (Protected)
- `GET /api/applications` - Get user applications (Protected)
- `GET /api/applications/:id/risk` - Get risk score (Protected)

### Documents
- `POST /api/documents/upload` - Upload document (Protected)
- `GET /api/documents/application/:id` - Get documents (Protected)

## 🎨 Tech Stack

**Frontend:**
- React 18
- React Router 6
- Axios
- Vite
- Modern CSS

**Backend:**
- Node.js
- Express
- MongoDB Atlas (Cloud Database)
- Mongoose ODM
- JWT Authentication
- Multer (file uploads)

**AI Engine:**
- Rule-based eligibility matching
- Risk score calculation
- Document validation (name matching, expiry checks)

## 📝 Sample Government Schemes

The database includes 8 major schemes:
1. PM-KISAN (Agriculture)
2. Ayushman Bharat (Health)
3. Sukanya Samriddhi Yojana (Education)
4. PM Awas Yojana (Housing)
5. PM Mudra Yojana (Business)
6. National Scholarship Portal (Education)
7. Stand Up India (Business)
8. Atal Pension Yojana (Pension)

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm run build
```

## 📱 Demo Flow

1. **Register** with profile (age, income, state)
2. **View Eligible Schemes** based on your profile
3. **Apply** to a scheme
4. **Upload Documents** with validation
5. **Check Risk Score** for your application
6. **Track Application** status

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation
- SQL injection prevention

## 🎯 Future Enhancements

- AI-powered document OCR
- Real-time application status updates
- Multi-language support
- Mobile app (React Native)
- Integration with government APIs
- Advanced analytics dashboard

## 👥 Team

Built for **India Ascends Hackathon 2026**

## 📄 License

MIT License

---

**SchemeDesk** - Empowering citizens through technology 🇮🇳
