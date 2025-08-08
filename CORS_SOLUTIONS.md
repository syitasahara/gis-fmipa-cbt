# 🔧 CORS Troubleshooting Guide

## ❌ **Problem**
```
Access to fetch at 'https://ujicoba-gis-backend.karyavisual.com/api/login' 
from origin 'http://localhost:3001' has been blocked by CORS policy
```

## ✅ **Solutions Implemented**

### 1. **Next.js Proxy Configuration** (Primary Solution)
- **File**: `next.config.mjs`
- **How it works**: Rewrites `/api/*` to backend URL, avoiding CORS
- **Advantage**: Production-ready, no CORS issues

### 2. **Next.js API Routes** (Backup Solution)  
- **Files**: 
  - `/src/app/api/login/route.js`
  - `/src/app/api/register/route.js`
  - `/src/app/api/users/byAuth/route.js`
  - `/src/app/api/logout/route.js`
  - `/src/app/api/exam/[...path]/route.js`
- **How it works**: Server-side proxy through Next.js API routes
- **Advantage**: Always works, handles all authentication

### 3. **Enhanced API Client** (Fallback System)
- **File**: `/src/app/utils/api.js`
- **Features**:
  - Primary: Uses proxy `/api/*` 
  - Fallback: Direct backend URL if proxy fails
  - Enhanced error handling for CORS issues
  - User-friendly error messages

## 🚀 **How to Test**

### Method 1: Test Login
```bash
# 1. Start development server
npm run dev

# 2. Open browser: http://localhost:3002/login
# 3. Try login with test credentials
# 4. Check browser console for errors
```

### Method 2: Test API Directly
```javascript
// Open browser console and test:
fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
}).then(r => r.json()).then(console.log);
```

## 🔍 **Debug Steps**

### Check if Proxy is Working:
1. Open Network tab in DevTools
2. Try login
3. Look for requests to `/api/login` (not external URL)
4. Status should be 200/400, not CORS error

### Check API Routes:
1. Visit `http://localhost:3002/api/login` directly
2. Should show "Method not allowed" (405) - means route exists
3. Try POST with curl:
```bash
curl -X POST http://localhost:3002/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 🛠 **Troubleshooting Commands**

### Restart Development Server:
```bash
# Kill existing server
pkill -f "next dev"

# Restart
npm run dev
```

### Check Port Usage:
```bash
# Check what's running on port 3000-3002
lsof -i :3000
lsof -i :3001  
lsof -i :3002
```

### Clear Next.js Cache:
```bash
rm -rf .next
npm run dev
```

## 📱 **Frontend Error Handling**

The login component now handles different error types:

- **Network errors**: "Koneksi ke server gagal"
- **CORS errors**: "Terjadi masalah teknis" 
- **Auth errors**: "Email atau password salah"
- **Server errors**: Displays actual backend message

## 🎯 **Expected Behavior**

### ✅ **Success Flow:**
1. User enters credentials
2. Frontend calls `/api/login` (proxy)
3. Next.js forwards to backend
4. Backend returns JWT token
5. Frontend stores token and redirects

### ❌ **Error Flow:**
1. User enters wrong credentials
2. Backend returns 401 error
3. Frontend shows "Email atau password salah"
4. User can try again

## 🔒 **Security Notes**

- **Proxy Method**: Secure, hides backend URL
- **API Routes**: Server-side proxy, tokens never exposed
- **Direct CORS**: Less secure, but works for development
- **Token Storage**: Uses localStorage (consider httpOnly cookies for production)

## 📊 **Performance Impact**

- **Proxy**: Minimal overhead, caches effectively
- **API Routes**: Slight server overhead, but negligible
- **Fallback**: Only activates if primary methods fail

---

**Status**: All methods implemented and tested ✅
**Recommendation**: Use proxy method for production deployment
