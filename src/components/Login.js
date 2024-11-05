'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

export default function Login() {
  const { signIn, signUp, signInWithGoogle, error } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (error) {
      setFormError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      setFormError(error.message);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1>Welcome to Task Tracker</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        
        <div className={styles.formGroup}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
        </div>
        
        <div className={styles.formGroup}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>

        {formError && <p className={styles.error}>{formError}</p>}
        
        <button type="submit" className={styles.submitButton}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>

        <p className={styles.toggleText}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className={styles.toggleButton}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </form>

      <div className={styles.divider}>
        <span>OR</span>
      </div>

      <button 
        onClick={handleGoogleSignIn}
        className={styles.googleButton}
      >
        Sign in with Google
      </button>
    </div>
  );
} 