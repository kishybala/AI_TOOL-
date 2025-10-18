# 🚀 Quick Deployment Steps

## Step 1: Backend Deploy (Render)

### A. Render par account banao
1. https://render.com par jao
2. GitHub se sign up/login karo

### B. New Web Service banao
1. Dashboard me "New +" → "Web Service" click karo
2. Repository connect karo: `Sandhurajput/AUTISM_AI_Tool`
3. Settings fill karo:
   ```
   Name: autism-screening-backend (ya koi bhi naam)
   Region: Frankfurt (ya nearest)
   Branch: main
   Root Directory: autism/server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

### C. Environment Variables add karo
Render dashboard me "Environment" tab me jao aur ye add karo:
```
PORT=5000
GEMINI_API_KEY=your_actual_gemini_api_key_here
FRONTEND_URL=https://your-vercel-url.vercel.app
NODE_ENV=production
```

### D. Deploy karo
- "Create Web Service" button click karo
- Deployment complete hone tak wait karo (5-10 minutes)
- **Backend URL copy karo**: `https://autism-screening-backend.onrender.com`

---

## Step 2: Frontend Deploy (Vercel)

### A. Vercel par account banao
1. https://vercel.com par jao
2. GitHub se sign up/login karo

### B. New Project banao
1. "Add New..." → "Project" click karo
2. Repository import karo: `Sandhurajput/AUTISM_AI_Tool`
3. Settings configure karo:
   ```
   Framework Preset: Vite
   Root Directory: autism/client
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

### C. Environment Variable add karo
"Environment Variables" section me:
```
VITE_API_URL=https://autism-screening-backend.onrender.com
```
⚠️ **Important**: Yahan apna actual Render backend URL use karo

### D. Deploy karo
- "Deploy" button click karo
- Deployment complete hone tak wait karo (2-5 minutes)
- **Frontend URL**: `https://your-project-name.vercel.app`

---

## Step 3: Backend Update (CORS Fix)

Backend me frontend URL ko allow karne ke liye:

1. Render dashboard me "Environment" tab me jao
2. `FRONTEND_URL` variable add/update karo:
   ```
   FRONTEND_URL=https://your-actual-vercel-url.vercel.app
   ```
3. Service redeploy ho jayegi automatically

---

## Step 4: Testing

### ✅ Test karo:
1. Vercel URL open karo browser me
2. Form fill karo:
   - Child Name: Test Child
   - Parent Name: Test Parent
   - Age: 5
   - Sabhi fields fill karo
3. Submit karo
4. Results page dikhna chahiye AI analysis ke sath

### 🔍 Agar error aaye:
- Browser console open karo (F12)
- Network tab check karo
- API call 200 status return kar rahi hai verify karo

---

## Step 5: Firebase Configuration (Important!)

### A. Service Account Key setup (Render):
1. `server/serviceAccountKey.json` file ki content copy karo
2. Render dashboard me "Environment" section me jao
3. **Option 1**: Secret File upload karo
   - "Add Secret File" click karo
   - Filename: `serviceAccountKey.json`
   - Content paste karo
   
4. **Option 2**: Environment variable use karo
   - Variable name: `FIREBASE_SERVICE_ACCOUNT`
   - Content: JSON paste karo (minified)

### B. Firebase me firebaseConfig.js update karo (agar Secret File use kar rahe ho):
```javascript
// If using secret file in Render
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT || 
  require('./serviceAccountKey.json')
);
```

---

## 📋 Deployment Checklist

Backend (Render):
- [ ] Web Service created
- [ ] Repository connected
- [ ] Root directory set to `autism/server`
- [ ] Environment variables added (PORT, GEMINI_API_KEY, FRONTEND_URL)
- [ ] Firebase service account configured
- [ ] Build successful
- [ ] Service running (check logs)
- [ ] Backend URL accessible

Frontend (Vercel):
- [ ] Project created
- [ ] Repository connected
- [ ] Root directory set to `autism/client`
- [ ] Environment variable added (VITE_API_URL)
- [ ] Build successful
- [ ] Deployment successful
- [ ] Frontend URL accessible

Testing:
- [ ] Frontend loads properly
- [ ] Form submission works
- [ ] API calls successful
- [ ] AI analysis returns results
- [ ] No CORS errors
- [ ] Firebase data saving properly

---

## 🆘 Common Issues & Solutions

### Issue 1: CORS Error
**Solution**: 
- Render me `FRONTEND_URL` environment variable verify karo
- Backend code me CORS configuration check karo

### Issue 2: API Not Found (404)
**Solution**:
- Vercel me `VITE_API_URL` properly set hai check karo
- Frontend rebuild karo after adding env var

### Issue 3: Firebase Error
**Solution**:
- Service account key properly configured hai check karo
- Firebase project permissions verify karo

### Issue 4: Render Service Sleeping
**Solution**:
- Free tier me service 15 min inactivity ke baad sleep hoti hai
- First request slow hoga (cold start ~30 seconds)
- Paid plan ($7/month) lelo for always-on service

---

## 💰 Cost Breakdown

### Free Tier:
- **Vercel**: Unlimited deployments ✅ FREE
- **Render**: 750 hours/month ✅ FREE (service sleeps after 15 min)
- **Firebase**: Free tier (Spark plan) ✅ FREE

### Paid (Optional):
- **Render**: $7/month for always-on service
- **Firebase**: Pay-as-you-go (Blaze plan) if you exceed free limits

---

## 🎉 All Done!

Deployment complete hai! 

**Your URLs:**
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-service.onrender.com`

Share karo aur use karo! 🚀
