// Configuration Manager for PlatformEase
// Handles environment variables and secure configuration loading

class ConfigManager {
  constructor() {
    this.config = {};
    this.isLoaded = false;
    this.loadConfig();
  }

  // Load configuration from various sources
  async loadConfig() {
    try {
      // Try to load from .env file first (for development)
      await this.loadFromEnvFile();
      
      // Fallback to environment variables or default values
      this.setDefaultConfig();
      
      // Validate configuration
      this.validateConfig();
      
      this.isLoaded = true;
      console.log('Configuration loaded successfully');
    } catch (error) {
      console.error('Error loading configuration:', error);
      this.setFallbackConfig();
    }
  }

  // Load environment variables from .env file (development)
  async loadFromEnvFile() {
    try {
      const response = await fetch('.env');
      if (response.ok) {
        const envText = await response.text();
        const envLines = envText.split('\n');
        
        envLines.forEach(line => {
          const trimmedLine = line.trim();
          if (trimmedLine && !trimmedLine.startsWith('#')) {
            const [key, ...valueParts] = trimmedLine.split('=');
            const value = valueParts.join('=').trim();
            if (key && value) {
              this.config[key.trim()] = value;
            }
          }
        });
      }
    } catch (error) {
      console.log('No .env file found, using environment variables or defaults');
    }
  }

  // Set default configuration values
  setDefaultConfig() {
    const defaults = {
      NODE_ENV: 'production',
      DEBUG_MODE: 'false',
      ENCRYPT_LOCAL_STORAGE: 'true',
      SESSION_TIMEOUT: '86400000' // 24 hours
    };

    Object.keys(defaults).forEach(key => {
      if (!this.config[key]) {
        this.config[key] = defaults[key];
      }
    });
  }

  // Set fallback configuration when everything else fails
  setFallbackConfig() {
    this.config = {
      FIREBASE_API_KEY: 'demo-mode',
      FIREBASE_AUTH_DOMAIN: 'demo.firebaseapp.com',
      FIREBASE_PROJECT_ID: 'demo-project',
      FIREBASE_STORAGE_BUCKET: 'demo-project.appspot.com',
      FIREBASE_MESSAGING_SENDER_ID: '123456789',
      FIREBASE_APP_ID: '1:123456789:web:abcdef',
      NODE_ENV: 'development',
      DEBUG_MODE: 'true',
      ENCRYPT_LOCAL_STORAGE: 'false',
      SESSION_TIMEOUT: '86400000'
    };
    console.warn('Using fallback configuration - Firebase features may not work');
  }

  // Validate required configuration
  validateConfig() {
    const requiredKeys = [
      'FIREBASE_API_KEY',
      'FIREBASE_AUTH_DOMAIN',
      'FIREBASE_PROJECT_ID',
      'FIREBASE_STORAGE_BUCKET',
      'FIREBASE_MESSAGING_SENDER_ID',
      'FIREBASE_APP_ID'
    ];

    const missingKeys = requiredKeys.filter(key => !this.config[key] || this.config[key] === 'your-actual-api-key-here');
    
    if (missingKeys.length > 0) {
      console.warn('Missing or placeholder Firebase configuration:', missingKeys);
      console.warn('Please update your .env file with actual Firebase credentials');
    }
  }

  // Get configuration value
  get(key) {
    return this.config[key];
  }

  // Get Firebase configuration object
  getFirebaseConfig() {
    return {
      apiKey: this.config.FIREBASE_API_KEY,
      authDomain: this.config.FIREBASE_AUTH_DOMAIN,
      projectId: this.config.FIREBASE_PROJECT_ID,
      storageBucket: this.config.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: this.config.FIREBASE_MESSAGING_SENDER_ID,
      appId: this.config.FIREBASE_APP_ID,
      measurementId: this.config.FIREBASE_MEASUREMENT_ID
    };
  }

  // Check if running in development mode
  isDevelopment() {
    return this.config.NODE_ENV === 'development';
  }

  // Check if debug mode is enabled
  isDebugMode() {
    return this.config.DEBUG_MODE === 'true';
  }

  // Check if local storage encryption is enabled
  shouldEncryptLocalStorage() {
    return this.config.ENCRYPT_LOCAL_STORAGE === 'true';
  }

  // Get session timeout in milliseconds
  getSessionTimeout() {
    return parseInt(this.config.SESSION_TIMEOUT) || 86400000;
  }

  // Print configuration status (for debugging)
  printStatus() {
    if (this.isDebugMode()) {
      console.log('Configuration Status:');
      console.log('- Environment:', this.config.NODE_ENV);
      console.log('- Debug Mode:', this.config.DEBUG_MODE);
      console.log('- Firebase Project:', this.config.FIREBASE_PROJECT_ID);
      console.log('- Local Storage Encryption:', this.config.ENCRYPT_LOCAL_STORAGE);
      console.log('- Session Timeout:', this.getSessionTimeout() / 1000 / 60, 'minutes');
    }
  }
}

// Create global configuration instance
window.config = new ConfigManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ConfigManager;
}

export { ConfigManager };
export const configInstance = window.config;
