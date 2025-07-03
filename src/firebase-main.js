import { auth, db } from './firebase-config.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup, 
  sendEmailVerification, 
  sendPasswordResetEmail, 
  confirmPasswordReset,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// Wait for Firebase to be ready
const waitForAuth = () => {
  return new Promise((resolve, reject) => {
    if (auth) {
      resolve(auth);
    } else {
      setTimeout(() => {
        if (auth) {
          resolve(auth);
        } else {
          reject(new Error('Firebase Auth failed to initialize'));
        }
      }, 1000);
    }
  });
};

// Create user document in Firestore
const createUserDocument = async (user, additionalData = {}) => {
  if (!user) return;
  
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = serverTimestamp();
      
      await setDoc(userRef, {
        displayName: displayName || additionalData.fullName || '',
        email,
        photoURL: photoURL || '',
        createdAt,
        lastLogin: createdAt,
        provider: additionalData.provider || 'email',
        ...additionalData
      });
      
      console.log('User document created successfully');
    } else {
      // Update last login
      await setDoc(userRef, {
        lastLogin: serverTimestamp()
      }, { merge: true });
    }
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

// Mark Firebase as loaded
window.firebaseLoaded = true;
console.log('Firebase authentication module loaded successfully');

// Enhanced Firebase Auth object
window.firebaseAuth = {
  // Registration with improved error handling
  async register(email, password, fullName) {
    try {
      await waitForAuth();
      
      // Validate inputs
      if (!email || !password || !fullName) {
        throw new Error('All fields are required');
      }
      
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, { 
        displayName: fullName 
      });
      
      // Create user document in Firestore
      await createUserDocument(user, { 
        fullName, 
        provider: 'email' 
      });
      
      console.log('User registered successfully:', user.uid);
      return { success: true, user };
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // Provide user-friendly error messages
      let errorMessage = error.message;
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      }
      
      return { success: false, error: errorMessage };
    }
  },

  // Sign in with improved error handling
  async signIn(email, password) {
    try {
      await waitForAuth();
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if email is verified
      if (!user.emailVerified) {
        await signOut(auth);
        return { 
          success: false, 
          error: 'Please verify your email before signing in. Check your inbox for the verification link.',
          needsVerification: true,
          user: user
        };
      }
      
      // Update user document
      await createUserDocument(user);
      
      console.log('User signed in successfully:', user.uid);
      return { success: true, user };
      
    } catch (error) {
      console.error('Sign in error:', error);
      
      let errorMessage = error.message;
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please register first.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }
      
      return { success: false, error: errorMessage };
    }
  },

  // Google sign in with error handling
  async signInWithGoogle() {
    try {
      await waitForAuth();
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      // Create user document
      await createUserDocument(user, { provider: 'google' });
      
      console.log('Google sign in successful:', user.uid);
      return { success: true, user };
      
    } catch (error) {
      console.error('Google sign in error:', error);
      
      let errorMessage = error.message;
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign in was cancelled. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked. Please allow popups and try again.';
      }
      
      return { success: false, error: errorMessage };
    }
  },

  // GitHub sign in with error handling
  async signInWithGithub() {
    try {
      await waitForAuth();
      const provider = new GithubAuthProvider();
      provider.addScope('user:email');
      
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      // Create user document
      await createUserDocument(user, { provider: 'github' });
      
      console.log('GitHub sign in successful:', user.uid);
      return { success: true, user };
      
    } catch (error) {
      console.error('GitHub sign in error:', error);
      
      let errorMessage = error.message;
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign in was cancelled. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked. Please allow popups and try again.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with the same email. Please sign in with your original method.';
      }
      
      return { success: false, error: errorMessage };
    }
  },

  // Get current user
  getCurrentUser() {
    return auth?.currentUser || null;
  },

  // Sign out
  async signOut() {
    try {
      await waitForAuth();
      await signOut(auth);
      console.log('User signed out successfully');
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  },

  // Send email verification
  async sendEmailVerification() {
    try {
      await waitForAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('No user is signed in');
      }
      
      if (user.emailVerified) {
        return { success: true, message: 'Email is already verified' };
      }
      
      await sendEmailVerification(user);
      console.log('Verification email sent');
      return { success: true };
      
    } catch (error) {
      console.error('Email verification error:', error);
      return { success: false, error: error.message };
    }
  },

  // Send password reset email
  async sendPasswordResetEmail(email) {
    try {
      await waitForAuth();
      
      if (!email) {
        throw new Error('Email is required');
      }
      
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent');
      return { success: true };
      
    } catch (error) {
      console.error('Password reset error:', error);
      
      let errorMessage = error.message;
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      }
      
      return { success: false, error: errorMessage };
    }
  },

  // Confirm password reset
  async confirmPasswordReset(oobCode, newPassword) {
    try {
      await waitForAuth();
      
      if (!oobCode || !newPassword) {
        throw new Error('Reset code and new password are required');
      }
      
      if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      
      await confirmPasswordReset(auth, oobCode, newPassword);
      console.log('Password reset successful');
      return { success: true };
      
    } catch (error) {
      console.error('Password reset confirmation error:', error);
      
      let errorMessage = error.message;
      if (error.code === 'auth/invalid-action-code') {
        errorMessage = 'Invalid or expired reset code. Please request a new password reset.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      }
      
      return { success: false, error: errorMessage };
    }
  },

  // Auth state observer
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }
};

// Set up auth state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is signed in:', user.uid);
    // Update last login time
    createUserDocument(user).catch(console.error);
  } else {
    console.log('User is signed out');
  }
});

// Export for direct access
window.firebaseDb = db;
export { auth, db };