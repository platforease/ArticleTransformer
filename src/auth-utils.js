// Authentication utility functions
export class AuthUtils {
  // Check if user is authenticated
  static isAuthenticated() {
    return window.firebaseAuth?.getCurrentUser() !== null;
  }

  // Get user data
  static getCurrentUser() {
    return window.firebaseAuth?.getCurrentUser() || null;
  }

  // Redirect to login if not authenticated
  static requireAuth(redirectUrl = 'login.html') {
    if (!this.isAuthenticated()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  }

  // Redirect to dashboard if already authenticated
  static redirectIfAuthenticated(redirectUrl = 'dashboard.html') {
    if (this.isAuthenticated()) {
      window.location.href = redirectUrl;
      return true;
    }
    return false;
  }

  // Wait for auth state to be determined
  static waitForAuthState() {
    return new Promise((resolve) => {
      if (!window.firebaseAuth) {
        setTimeout(() => this.waitForAuthState().then(resolve), 100);
        return;
      }

      const unsubscribe = window.firebaseAuth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  // Validate email format
  static isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static validatePassword(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[^a-zA-Z\d]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      strength: this.calculatePasswordStrength(password)
    };
  }

  // Calculate password strength (0-4)
  static calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    return strength;
  }

  // Format Firebase error messages
  static formatFirebaseError(error) {
    const errorMessages = {
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password is too weak. Please choose a stronger password.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/popup-closed-by-user': 'Sign in was cancelled.',
      'auth/popup-blocked': 'Popup was blocked. Please allow popups and try again.',
      'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
      'auth/invalid-action-code': 'Invalid or expired verification code.',
      'auth/expired-action-code': 'Verification code has expired. Please request a new one.',
      'auth/invalid-continue-uri': 'Invalid redirect URL.',
      'auth/unauthorized-continue-uri': 'Unauthorized redirect URL.',
      'auth/missing-continue-uri': 'Missing redirect URL.',
      'auth/network-request-failed': 'Network error. Please check your connection and try again.',
      'auth/internal-error': 'An internal error occurred. Please try again.',
      'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/operation-not-allowed': 'This operation is not allowed.',
      'auth/requires-recent-login': 'Please sign in again to complete this action.'
    };

    return errorMessages[error.code] || error.message || 'An unexpected error occurred.';
  }
}

// Make available globally
window.AuthUtils = AuthUtils;