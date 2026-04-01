import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loginEmployee, loginAdmin, loginHr } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const roleConfig = {
  employee: {
    title: 'Employee Login',
    subtitle: 'Enter your password',
    label: 'Employee Email',
    placeholder: 'name@company.com',
    desc: 'Employee login for attendance, leave records, payroll insights, and personal profile access',
    footerText: 'Use the credentials created by your Admin.',
    gradient: 'employee',
    loginFn: loginEmployee,
  },
  hr: {
    title: 'HR Login',
    subtitle: 'Enter your password',
    label: 'HR Email',
    placeholder: 'hr@company.com',
    desc: 'HR login for employee operations, approvals, and workforce workflows',
    footerText: 'Contact Admin if you forgot your password.',
    gradient: 'hr',
    loginFn: loginHr,
  },
  admin: {
    title: 'Admin Login',
    subtitle: 'Enter your password',
    label: 'Admin Email',
    placeholder: 'admin@company.com',
    desc: 'Admin login for the management dashboard',
    footerText: 'Contact system administrator for access.',
    gradient: 'admin',
    loginFn: loginAdmin,
  },
};

const Login = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const config = roleConfig[role] || roleConfig.employee;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStep(2);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await config.loginFn({ email, password });
      if (response.success) {
        // Backend returns { success: true, data: userDoc, token }
        // userDoc has: _id, email, role, profileCompleted, isActive
        const userData = {
          _id: response.data._id,
          email: response.data.email,
          role: response.data.role,
          profileCompleted: response.data.profileCompleted,
          isActive: response.data.isActive,
        };
        loginUser(userData, response.token);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Left gradient panel */}
        <div className={`auth-left ${config.gradient}`}>
          <div className="auth-left-logo">HR</div>
          <div className="auth-left-title">HRMS Portal</div>
          <div className="auth-left-desc">{config.desc}</div>
        </div>

        {/* Right form panel */}
        <div className="auth-right">
          <h2>{config.title}</h2>
          <p className="subtitle">
            {step === 1 ? `Enter your ${config.label}` : config.subtitle}
          </p>

          {error && <div className="auth-error">{error}</div>}

          {step === 1 ? (
            <form onSubmit={handleNext}>
              <div className="auth-form-group">
                <label>{config.label}</label>
                <input
                  type="email"
                  placeholder={config.placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <button type="submit" className="btn-login" style={{ width: '100%' }}>
                Next
              </button>
              <p className="auth-footer-text">{config.footerText}</p>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="auth-form-group">
                <label>{config.label}</label>
                <input type="email" value={email} disabled style={{ opacity: 0.6 }} />
              </div>
              <div className="auth-form-group">
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                    style={{ width: '100%', paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      color: 'var(--text-muted)'
                    }}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              <div className="auth-buttons">
                <button type="button" className="btn-back" onClick={() => { setStep(1); setError(''); }}>
                  Back
                </button>
                <button type="submit" className="btn-login" disabled={loading}>
                  {loading ? 'Signing in...' : 'Login'}
                </button>
              </div>
              <p className="auth-footer-text">{config.footerText}</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
