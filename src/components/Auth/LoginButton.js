import React, { useState } from 'react';
import { signInWithGoogle, signOutUser, auth } from '../../services/firebase';
import './LoginButton.css';

function LoginButton() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  // Monitor auth state
  React.useEffect(() => {
    if (auth) {
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        setUser(currentUser);
      });
      return () => unsubscribe();
    }
  }, []);

  const handleSignIn = async () => {
    try {
      setError('');
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
      // Show the actual error message from firebase.js
      const errorMessage = error.message || 'Failed to sign in. Please check your Firebase configuration.';
      setError(errorMessage);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!auth) {
    return null;
  }

  if (user) {
    return (
      <div className="login-button-container">
        <div className="user-info">
          {user.photoURL && (
            <img src={user.photoURL} alt={user.displayName} className="user-avatar" />
          )}
          <span className="user-name">{user.displayName}</span>
        </div>
        <button onClick={handleSignOut} className="logout-button">
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="login-button-container">
      <button onClick={handleSignIn} className="login-button">
        <img 
          src="https://www.google.com/favicon.ico" 
          alt="Google" 
          className="google-icon"
        />
        Sign in with Google
      </button>
      {error && (
        <div className="error-message" style={{ 
          position: 'fixed', 
          top: '80px', 
          right: '20px', 
          maxWidth: '400px',
          zIndex: 1000,
          padding: '1rem',
          background: '#fff3f3',
          border: '2px solid #d32f2f',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <strong>Authentication Error:</strong>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>{error}</p>
        </div>
      )}
    </div>
  );
}

export default LoginButton;
