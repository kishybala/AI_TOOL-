# Autism Screening Tool - Deployment Guide

## 🚀 Deployment Instructions

### Backend Deployment on Render

1. **Render par jao**: https://render.com
2. **Sign up/Login** karo GitHub se
3. **New Web Service** create karo:
   - **Repository**: `Sandhurajput/AUTISM_AI_Tool` select karo
   - **Root Directory**: `autism/server` daalo
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Environment Variables add karo**:
   ```
   PORT=5000
   GEMINI_API_KEY=your_actual_gemini_api_key
   ```

5. **Firebase Service Account**:
   - Render dashboard me "Environment" section me jao
   - `serviceAccountKey.json` ki content ko environment variable me add karo
   - Option 1: File upload karo ya
   - Option 2: JSON content ko ek variable me paste karo (e.g., `FIREBASE_SERVICE_ACCOUNT`)

6. **Deploy** button click karo

7. **Backend URL note karo**: `https://your-app-name.onrender.com`

---

### Frontend Deployment on Vercel

1. **Vercel par jao**: https://vercel.com
2. **Sign up/Login** karo GitHub se
3. **New Project** create karo:
   - **Repository**: `Sandhurajput/AUTISM_AI_Tool` select karo
   - **Framework Preset**: Vite
   - **Root Directory**: `autism/client`

4. **Build Settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Environment Variables add karo**:
   ```
   VITE_API_URL=https://your-render-backend-url.onrender.com
   ```
   ⚠️ **Important**: Apne Render backend URL ko yahan use karo (https se start hoga)

6. **Deploy** button click karo

---

## 📝 Post-Deployment Steps

### Backend (Render) ko configure karo:

1. **CORS Settings**: 
   - `server/index.js` me CORS ko production frontend URL ke liye allow karo
   - Example:
   ```javascript
   app.use(cors({
     origin: ['https://your-vercel-app.vercel.app', 'http://localhost:5173'],
     credentials: true
   }));
   ```

2. **Firebase Config**:
   - Service account key properly set hai verify karo
   - Firestore rules production ke liye configure karo

### Frontend (Vercel) ko test karo:

1. Vercel deployment URL open karo
2. Form fill karo aur submit karo
3. Check karo ki backend API properly call ho rahi hai
4. Browser console me errors check karo

---

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Error**:
   - Backend me proper CORS configuration add karo
   - Frontend ka deployed URL backend me allow karo

2. **API Not Found (404)**:
   - Environment variable `VITE_API_URL` properly set hai check karo
   - Vercel settings me redeploy karo after adding env vars

3. **Firebase Error**:
   - Service account key properly configured hai verify karo
   - Firebase project me proper permissions set hain check karo

4. **Build Fails**:
   - Dependencies properly install ho rahe hain check karo
   - Node version compatibility check karo

---

## 📦 Environment Variables Summary

### Backend (Render):
```
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend (Vercel):
```
VITE_API_URL=https://your-render-backend-url.onrender.com
```

---

## ✅ Verification Checklist

- [ ] Backend deployed on Render successfully
- [ ] Backend URL accessible aur working
- [ ] Frontend deployed on Vercel successfully
- [ ] Frontend environment variable set with backend URL
- [ ] CORS properly configured
- [ ] Test API call from deployed frontend
- [ ] Firebase connection working
- [ ] AI analysis working properly

---

## 🔗 Useful Links

- Render Dashboard: https://dashboard.render.com
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Repository: https://github.com/Sandhurajput/AUTISM_AI_Tool

---

## 💡 Tips

1. **Free Tier Limitations**:
   - Render free tier me service 15 minutes inactivity ke baad sleep mode me chali jati hai
   - First request slow ho sakta hai (cold start)

2. **Environment Variables**:
   - Kabhi bhi sensitive keys ko code me commit mat karo
   - Always use environment variables for API keys

3. **Monitoring**:
   - Render aur Vercel dashboards me logs regularly check karo
   - Error tracking setup karo for production issues

---

Good luck with your deployment! 🎉
