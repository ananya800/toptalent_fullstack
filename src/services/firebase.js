import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
let auth;
let googleProvider;

// Check if Firebase config is valid
const isFirebaseConfigured = firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'your_firebase_api_key' &&
  firebaseConfig.projectId && 
  firebaseConfig.projectId !== 'your_project_id';

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.warn('Firebase initialization failed:', error.message);
    console.warn('Google Sign-in will be disabled. The app will work normally without it.');
  }
} else {
  console.warn('Firebase not configured. Google Sign-in is disabled.');
  console.warn('To enable: Add Firebase credentials to .env file');
  console.warn('The app works perfectly without authentication!');
}

// Sign in with Google
export const signInWithGoogle = async () => {
  if (!auth) {
    throw new Error('Firebase not configured');
  }
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Sign-in successful:', result.user.displayName);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    
    // Provide user-friendly error messages
    if (error.code === 'auth/operation-not-allowed') {
      throw new Error('Google sign-in is not enabled. Please enable it in Firebase Console → Authentication → Sign-in method → Google');
    } else if (error.code === 'auth/configuration-not-found') {
      throw new Error('Firebase Authentication not initialized. Go to Firebase Console → Authentication → Click "Get started" button');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized. Add localhost to authorized domains in Firebase Console');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked by browser. Please allow popups for this site');
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in cancelled');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your internet connection');
    }
    
    throw error;
  }
};

// Sign out
export const signOutUser = async () => {
  if (!auth) {
    throw new Error('Firebase not configured');
  }
  
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export { auth };
