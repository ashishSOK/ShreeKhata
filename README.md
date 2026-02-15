# ShreeKhata - Setup Instructions

## Prerequisites

Before running ShreeKhata, you need to set up the following external services:

### 1. MongoDB Atlas (Database)
1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier M0 is sufficient)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/shreekhata`)

### 2. Cloudinary (Image Storage)
1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. From your dashboard, note down:
   - Cloud Name
   - API Key
   - API Secret

### 3. Email Service (Optional - for password reset)
**Option A: Gmail** (Easiest for development)
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Use this app password (not your regular password)

**Option B: SendGrid/Mail gun** (Better for production)
- Create an account and get API credentials

---

## Installation & Setup

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd /Users/ashish/Desktop/ShreeKhata/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file with your credentials:**
   ```env
   PORT=5002
   NODE_ENV=development
   
   # MongoDB connection string from Atlas
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/shreekhata
   
   # Generate a random secret (or use: openssl rand -base64 32)
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=30d
   
   # Cloudinary credentials
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Email configuration
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password_here
   EMAIL_FROM=ShreeKhata <noreply@shreekhata.com>
   
   FRONTEND_URL=http://localhost:5173
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   🚀 ShreeKhata Server running on port 5002
   ✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
   ```

### Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**
   ```bash
   cd /Users/ashish/Desktop/ShreeKhata/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   VITE v5.x.x  ready in xxx ms
   
   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:5173
   ```

---

## Usage

### First Time Setup

1. **Sign Up:**
   - Visit http://localhost:5173/signup
   - Fill in your details (name, email, phone, password)
   - Optionally add shop name and GST number
   - Click "Sign Up"

2. **Login:**
   - Use your email and password to login
   - You'll be redirected to the dashboard

### Features

- **Dashboard:** View financial analytics, charts, and summaries
- **Ledger:** Manage transactions (add, edit, delete)
- **Categories:** Create and manage expense categories
- **Reports:** Generate and export financial reports
- **Profile:** Update your account information

---

## Development

### Backend (Port 5002)
- API endpoints available at: http://localhost:5002/api
- Health check: http://localhost:5002/api/health

### Frontend (Port 5173)
- Main app: http://localhost:5173
- Auto-reloads on file changes

---

## Troubleshooting

### Backend won't start
- **Error: "MongooseError: The `uri` parameter to `openUri()` must be a string"**
  - Solution: Check your `.env` file has the correct MONGODB_URI

- **Error: "Port 5002 already in use"**
  - Solution: Kill the process using port 5002 or change PORT in `.env`

### Frontend won't start
- **Error: "Cannot find module"**
  - Solution: Delete `node_modules` and run `npm install` again

### Can't upload images
- **Check Cloudinary credentials in `.env`**
- **Verify file size is under 5MB**

### Email not sending
- **If using Gmail, ensure you're using an App Password, not your regular password**
- **Check EMAIL_USER and EMAIL_PASSWORD in `.env`**

---

## Next Steps

### For Full Production Deployment:

1. **Add remaining features:**
   - Complete ledger page with transaction management
   - Implement category CRUD operations
   - Build comprehensive reports page

2. **Deploy Backend:**
   - Use Render, Railway, or Heroku
   - Update FRONTEND_URL in production .env

3. **Deploy Frontend:**
   - Use Vercel or Netlify
   - Update API proxy in vite.config.js for production

4. **Security:**
   - Use strong JWT_SECRET
   - Enable database IP whitelist
   - Add rate limiting in production

---

## Technology Stack

**Backend:**
- Node.js + Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary for image storage
- PDF & Excel generation

**Frontend:**
- React 18 with Vite
- Material UI (MUI)
- Recharts for analytics
- Framer Motion for animations
- Axios for API calls

**Features:**
- ✅ Responsive mobile-first design
- ✅ Dark/Light mode
- ✅ Real-time dashboard analytics
- ✅ Secure authentication
- ✅ Cloud-based receipt storage
- ✅ Financial reports (PDF/Excel)
- ✅ Running balance calculations

---

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all environment variables are set correctly
3. Ensure both backend and frontend servers are running

**Enjoy using ShreeKhata! 📊💰**
