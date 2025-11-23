# Quick Start Guide

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Configure Environment Variables

### Backend (.env)
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bangladeshi-supershop
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

## Step 3: Start MongoDB

### Local MongoDB
```bash
# Make sure MongoDB is running
mongod
```

### Or use MongoDB Atlas
Update `MONGODB_URI` in backend/.env with your Atlas connection string.

## Step 4: Seed Database (Optional)

```bash
cd backend
npm run seed:pro
```

## Step 5: Start Both Services

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
✅ Backend running on: http://localhost:5000

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
✅ Frontend running on: http://localhost:3000

## Step 6: Access the Application

Open your browser: **http://localhost:3000**

## Default Admin Credentials

After seeding:
- Email: `admin@supershop.com`
- Password: `admin123`

## Troubleshooting

### Port already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Change port in backend/.env
PORT=5001
```

### MongoDB connection error
- Ensure MongoDB is running
- Check connection string in .env
- For Atlas: whitelist your IP address

### Frontend can't reach backend
- Verify backend is running on port 5000
- Check NEXT_PUBLIC_API_URL in frontend/.env.local
- Check CORS settings in backend

## Next Steps

1. ✅ Add products via admin panel
2. ✅ Test checkout process
3. ✅ Configure payment gateway
4. ✅ Customize branding
5. ✅ Deploy to production

## Production Deployment

See individual README files:
- `backend/README.md` - Backend deployment
- `frontend/README.md` - Frontend deployment

## Need Help?

Check the main `README.md` for comprehensive documentation.
