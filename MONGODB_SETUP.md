# MongoDB Connection Setup Guide

## Current Status
✅ **Server is running with LOCAL MongoDB connection**

Your MongoDB Atlas IP is not whitelisted, so the server automatically fell back to using local MongoDB.

---

## Option 1: Fix MongoDB Atlas Connection (Recommended for Production)

### Steps to Whitelist Your IP:

1. **Go to MongoDB Atlas Dashboard**
   - Visit: https://cloud.mongodb.com
   - Log in with your credentials

2. **Navigate to Network Access**
   - Click on "Network Access" in the left sidebar (under Security)

3. **Add IP Address**
   - Click "Add IP Address" button
   - Choose one of these options:
     - **Allow Access from Anywhere**: Click this button (adds 0.0.0.0/0)
     - **Add Current IP Address**: Automatically detects and adds your IP
     - **Manual Entry**: Enter your specific IP address

4. **Save and Wait**
   - Click "Confirm"
   - Wait 1-2 minutes for changes to take effect

5. **Restart Your Server**
   ```bash
   # Press Ctrl+C to stop the server
   node server/index.js
   ```

### Your Atlas Connection String:
```
mongodb+srv://bd-supeshop22:XK0tOEThXJmKOGJV@cluster0.zpcykbv.mongodb.net/bangladeshi-supershop
```

---

## Option 2: Continue Using Local MongoDB (Current Setup)

### Requirements:
- MongoDB Community Server must be installed and running on your computer
- Default connection: `mongodb://localhost:27017/supershop`

### To Install MongoDB Locally:

1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Download for Windows
   - Install with default settings

2. **Start MongoDB Service**
   ```powershell
   # Start MongoDB service
   net start MongoDB
   ```

3. **Verify Connection**
   - Your server should automatically connect to local MongoDB

### Local MongoDB Benefits:
- ✅ Works offline
- ✅ Faster for development
- ✅ No IP whitelist needed
- ❌ Data not synced with cloud
- ❌ Not accessible from deployed app

---

## Current Configuration

The server automatically tries to connect in this order:
1. **MongoDB Atlas** (if MONGODB_URI is set in .env)
2. **Local MongoDB** (fallback if Atlas fails)

### To Switch Between Connections:

**Use Atlas:**
```env
# In .env file
MONGODB_URI=mongodb+srv://bd-supeshop22:XK0tOEThXJmKOGJV@cluster0.zpcykbv.mongodb.net/bangladeshi-supershop
```

**Use Local Only:**
```env
# In .env file - comment out or remove MONGODB_URI
# MONGODB_URI=mongodb+srv://...
```

---

## Troubleshooting

### Error: "Could not connect to any servers"
- ✅ **Solution**: Whitelist your IP in MongoDB Atlas (see Option 1)

### Error: "Local MongoDB not available"
- ✅ **Solution**: Install MongoDB Community Server (see Option 2)

### Error: "EADDRINUSE: address already in use"
- ✅ **Solution**: 
  ```powershell
  taskkill /F /IM node.exe
  node server/index.js
  ```

---

## Next Steps

1. **For Development**: Continue using local MongoDB (current setup works!)
2. **For Production**: Whitelist your IP in Atlas and test the connection
3. **Check Server Status**: Visit http://localhost:5000/api to verify it's running

---

## Need Help?

If you're still having issues:
1. Check if MongoDB service is running: `Get-Service MongoDB`
2. Verify your .env file has correct credentials
3. Test Atlas connection directly using MongoDB Compass
