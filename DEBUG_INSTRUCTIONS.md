# Debug Instructions for Redirect Loop Issue

## Changes Made

1. **Fixed Token Storage**: Updated `setToken()` and `removeToken()` functions in `utils/api.js` to store tokens in both localStorage and cookies
2. **Enhanced Authentication Check**: Improved `isAuthenticated()` function to validate token expiration
3. **Updated Middleware**: Modified middleware to be less aggressive with redirects
4. **Added Safety Checks**: Prevented multiple rapid redirects in components
5. **Fixed Login Logic**: Only redirect from login page if user is authenticated AND has exam in progress

## How to Test

1. **Clear Browser Data**: 
   - Clear localStorage, cookies, and cache
   - Use incognito/private window

2. **Test Flow**:
   - Go to `/login`
   - Should stay on login page
   - Enter valid credentials
   - Should redirect to `/start-exam`
   - Click start exam
   - Should redirect to `/quiz`

3. **Check Console Logs**:
   - Look for "Token found, verifying with server..."
   - Look for "Middleware: ..." messages
   - No infinite redirect loops should occur

## Common Issues

- **Still getting loops**: Clear all browser data and restart browser
- **Token not persisting**: Check if cookies are being set in developer tools
- **API errors**: Check network tab for 401/403 errors

## Files Modified

- `src/app/utils/api.js`
- `src/app/components/cbt.js` 
- `src/app/login/page.js`
- `src/app/start-exam/page.js`
- `middleware.js`
