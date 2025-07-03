# Firebase Setup Guide for PlatformEase

This guide will help you set up Firebase Authentication and Firestore for your PlatformEase application.

## Prerequisites

1. Node.js and npm installed
2. A Google account
3. Access to the Firebase Console

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `platformease` (or your preferred name)
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project dashboard, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click and toggle "Enable"
   - **Google**: Click, toggle "Enable", and add your email as a test user
   - **GitHub**: Click, toggle "Enable", and follow OAuth setup instructions

## Step 3: Set up Firestore Database

1. Click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

## Step 4: Get Your Firebase Configuration

1. Click on the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (`</>`) to add a web app
5. Register your app with nickname "PlatformEase Web"
6. Copy the configuration object

## Step 5: Configure Your Application

1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual Firebase configuration:

```env
# Firebase Configuration
FIREBASE_API_KEY=your-actual-api-key-here
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id

# Optional: Firebase Analytics
FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Development Settings
NODE_ENV=development
DEBUG_MODE=true
```

## Step 6: Configure Firestore Security Rules

In the Firestore console, go to "Rules" and replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read access for published content (add more collections as needed)
    match /articles/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 7: Test Your Setup

1. Open your application in a browser
2. Navigate to the registration page
3. Try creating an account with email/password
4. Try signing in with Google or GitHub
5. Check the Firebase Console to see if users are being created

## Step 8: Configure Authorized Domains

1. In Firebase Console, go to Authentication > Settings
2. Scroll down to "Authorized domains"
3. Add your domain(s):
   - `localhost` (for local development)
   - Your production domain when ready to deploy

## Firestore Data Structure

Your application will create the following collections:

### Users Collection (`users/{userId}`)
```javascript
{
  uid: "firebase-user-id",
  fullName: "User's Full Name",
  email: "user@example.com",
  provider: "email|google|github",
  createdAt: Timestamp,
  lastLogin: Timestamp,
  photoURL: "profile-image-url" // (for social logins)
}
```

## Security Features

- **Password Strength**: Enforces strong password requirements
- **Email Validation**: Uses robust email format validation  
- **Real-time Validation**: Provides immediate feedback to users
- **Secure Authentication**: All authentication and user data are handled exclusively by Firebase Authentication and Firestore. No passwords or sensitive data are stored locally.
- **Session Management**: Proper session handling and cleanup

## Troubleshooting

### Common Issues:

1. **"Firebase not loaded yet"**: 
   - Check console for JavaScript errors
   - Ensure `.env` file has correct values
   - Verify Firebase configuration

2. **Authentication errors**:
   - Check authorized domains in Firebase Console
   - Verify OAuth providers are properly configured
   - Ensure Firestore rules allow user document creation

3. **CORS errors**:
   - Serve your application through a local server (not file://)
   - Use tools like `live-server` or `python -m    
   .http.server`

### Debug Mode

Set `DEBUG_MODE=true` in your `.env` file to see:
- Configuration loading status
- Firebase connection status
- Detailed error messages in console

## Production Deployment

When deploying to production:

1. Update `.env` with production values
2. Set `NODE_ENV=production`
3. Update Firestore security rules for production
4. Add your production domain to authorized domains
5. Enable Firebase Authentication email verification

## Support

If you encounter issues:
1. Check the browser console for errors
2. Review Firebase Console for authentication and database logs
3. Ensure all configuration values are correct
4. Test with different browsers and clear cache if needed

function onFirebaseReady(callback) {
  if (window.firebaseAuth) {
    callback();
  } else {
    // Listen for the module to be loaded
    let checkCount = 0;
    const interval = setInterval(() => {
      if (window.firebaseAuth) {
        clearInterval(interval);
        callback();
      } else if (++checkCount > 50) { // Timeout after 5 seconds
        clearInterval(interval);
        alert('Firebase failed to load. Please refresh the page.');
      }
    }, 100);
  }
}

// Usage:
onFirebaseReady(() => {
  // All your registration JS that depends on window.firebaseAuth goes here
});
