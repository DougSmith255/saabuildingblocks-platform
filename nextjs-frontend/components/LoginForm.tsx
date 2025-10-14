'use client';

import { useState, FormEvent } from 'react';
import '../styles/login.css';

interface LoginFormProps {
  onSubmit?: (email: string, password: string) => Promise<void>;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
}

export default function LoginForm({
  onSubmit,
  onForgotPassword,
  onSignUp
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Reset errors
    setEmailError('');
    setPasswordError('');

    let isValid = true;

    // Validate email
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    if (!isValid) return;

    // Submit form
    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(email, password);
      } else {
        // Default behavior (demo)
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Login attempt:', { email, rememberMe });
      }
    } catch (error) {
      setPasswordError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo Area */}
        <div className="login-logo">
          <h1 className="login-logo-text">FLOW NEXUS</h1>
          <p className="login-logo-tagline">Orchestrate the Future</p>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to continue to your account</p>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`form-input ${emailError ? 'error' : ''}`}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                disabled={isLoading}
                autoComplete="email"
              />
              {emailError && (
                <p className="form-error">{emailError}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className={`form-input ${passwordError ? 'error' : ''}`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                disabled={isLoading}
                autoComplete="current-password"
              />
              {passwordError && (
                <p className="form-error">{passwordError}</p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="form-options">
              <div className="form-checkbox-group">
                <input
                  type="checkbox"
                  id="remember"
                  className="form-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <label htmlFor="remember" className="form-checkbox-label">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={onForgotPassword}
                className="form-link"
                disabled={isLoading}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer'
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <p className="login-footer-text">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSignUp}
                className="login-footer-link"
                disabled={isLoading}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer'
                }}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
