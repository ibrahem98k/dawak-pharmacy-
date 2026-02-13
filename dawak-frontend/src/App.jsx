import { useState, useEffect } from 'react';
import OrderComponent from './OrderComponent';
import './App.css';
import { LogIn, Pill, Lock, User, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('dawak_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    setError('');

    // Hardcoded credentials for the Pharmacy User
    if (email === 'pharmacy@dawak.com' && password === '123456') {
      localStorage.setItem('dawak_token', `pharmacy-token-${Date.now()}`);
      setIsAuthenticated(true);
    } else {
      setError('Invalid credentials! Please use the provided pharmacy login.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dawak_token');
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-primary animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        {/* Background decorations matching dawak-mandob */}
        <div className="bg-blob blob-1" />
        <div className="bg-blob blob-2" />
        <div className="bg-blob blob-center" />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="login-card-wrapper"
          style={{ width: '100%', maxWidth: '360px', padding: '32px', gap: '24px' }} // FORCE COMPACT
        >
          {/* Logo Area */}
          <div className="logo-area">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="logo-box"
              style={{ width: '64px', height: '64px' }}
            >
              <Pill className="h-10 w-10 text-primary" />
            </motion.div>
            <div>
              <h1 className="app-title" style={{ fontSize: '1.35rem' }}>Dawak Pharmacy</h1>
              <p className="app-subtitle" style={{ fontSize: '0.85rem' }}>تسجيل دخول الصيدلية</p>
            </div>
          </div>

          {/* Login Form */}
          <motion.form
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleLogin}
            className="login-form"
            style={{ gap: '16px' }}
          >
            <div className="input-group">
              <label className="input-label">اسم المستخدم</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <User size={16} />
                </div>
                <input
                  type="email"
                  name="email"
                  className="input-field-styled"
                  placeholder="Username"
                  defaultValue="pharmacy@dawak.com"
                  required
                  style={{ height: '44px', borderRadius: '10px' }} // FORCE HEIGHT
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">كلمة المرور</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="input-field-styled"
                  placeholder="Password"
                  defaultValue="123456"
                  required
                  style={{ height: '44px', borderRadius: '10px' }} // FORCE HEIGHT
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="error-message"
              >
                {error}
              </motion.div>
            )}

            <button type="submit" className="btn btn-primary submit-btn" style={{ height: '44px', borderRadius: '10px' }}>
              <LogIn size={20} style={{ marginRight: '8px' }} />
              تسجيل الدخول
            </button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="footer-hint"
          >
            بيانات الدخول يتم توفيرها من قبل المسؤول
          </motion.p>

        </motion.div>
      </div>
    );
  }

  return <OrderComponent onLogout={handleLogout} />;
}

export default App;
