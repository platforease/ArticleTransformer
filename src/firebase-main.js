import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, sendEmailVerification, sendPasswordResetEmail, confirmPasswordReset } from 'firebase/auth';

// Add a small delay to ensure Firebase is fully initialized
const waitForAuth = () => {
  return new Promise((resolve) => {
    if (auth) {
      resolve(auth);
    } else {
      setTimeout(() => resolve(auth), 100);
    }
  });
};

// Mark Firebase as loaded
window.firebaseLoaded = true;
console.log('Firebase authentication module loaded successfully');

window.firebaseAuth = {
  async register(email, password, fullName) {
    try {
      await waitForAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: fullName });
      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  },
  async signIn(email, password) {
    try {
      await waitForAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if email is verified
      if (!user.emailVerified) {
        // Sign out the user to prevent access
        await auth.signOut();
        return { 
          success: false, 
          error: 'Please verify your email before signing in. Check your inbox for the verification link.',
          needsVerification: true 
        };
      }
      
      return { success: true, user };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  },
  async signInWithGoogle() {
    try {
      await waitForAuth();
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { success: false, error: error.message };
    }
  },
  async signInWithGithub() {
    try {
      await waitForAuth();
      const provider = new GithubAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('GitHub sign in error:', error);
      return { success: false, error: error.message };
    }
  },
  getCurrentUser() {
    return auth?.currentUser || null;
  },
  async signOut() {
    try {
      await waitForAuth();
      await auth.signOut();
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  },
  async sendVerificationEmail() {
    try {
      await waitForAuth();
      if (!auth.currentUser) throw new Error('No user is signed in');
      await sendEmailVerification(auth.currentUser);
      return { success: true };
    } catch (error) {
      console.error('Email verification error:', error);
      return { success: false, error: error.message };
    }
  },
  async sendPasswordResetEmail(email) {
    try {
      await waitForAuth();
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message };
    }
  },
  async confirmPasswordReset(oobCode, newPassword) {
    try {
      await waitForAuth();
      await confirmPasswordReset(auth, oobCode, newPassword);
      return { success: true };
    } catch (error) {
      console.error('Password reset confirmation error:', error);
      return { success: false, error: error.message };
    }
  }
};

window.firebaseDb = db; 