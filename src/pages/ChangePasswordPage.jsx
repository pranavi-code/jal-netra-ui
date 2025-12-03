import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Shield, Check, ArrowLeft } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

const ChangePasswordPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  // Password strength checker
  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    const strengthValues = Object.values(passwordStrength);
    if (strengthValues.filter(Boolean).length < 4) {
      alert('Password does not meet minimum requirements!');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    alert('Password changed successfully!');
    navigate('/dashboard');
  };

  const handleInputChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'newPassword') {
      checkPasswordStrength(value);
    }
  };

  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;
  const getStrengthColor = () => {
    if (strengthScore < 2) return theme === 'dark' ? 'text-red-400' : 'text-red-600';
    if (strengthScore < 4) return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
    return theme === 'dark' ? 'text-green-400' : 'text-green-600';
  };

  const getStrengthText = () => {
    if (strengthScore < 2) return 'Weak';
    if (strengthScore < 4) return 'Medium';
    return 'Strong';
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' 
        ? 'bg-underwater-gradient' 
        : 'bg-light-underwater-gradient'
    }`}>
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.button
            onClick={() => navigate('/dashboard')}
            className={`mr-4 p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-cyan-600/20 text-cyan-300'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
          </motion.button>
          
          <div>
            <h1 className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
            }`}>Change Password</h1>
            <p className={`mt-2 ${
              theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'
            }`}>Secure your account with a strong password</p>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          className={`p-4 rounded-lg border mb-6 ${
            theme === 'dark'
              ? 'bg-cyan-600/10 border-cyan-500/30 text-cyan-200'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-start space-x-3">
            <Shield size={20} className="mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium mb-1">Security Reminder</h4>
              <p className="text-sm opacity-80">
                Choose a strong password that you haven't used elsewhere. 
                We recommend using a combination of uppercase letters, lowercase letters, numbers, and special characters.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Password Change Form */}
        <motion.div
          className={`p-6 rounded-xl border ${
            theme === 'dark'
              ? 'bg-deepSea-800/50 border-cyan-500/20 backdrop-blur-underwater'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-600'
              }`}>
                <Lock size={16} className="inline mr-2" />
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  className="w-full input-underwater pr-10"
                  placeholder="Enter your current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
                  }`}
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-600'
              }`}>
                <Lock size={16} className="inline mr-2" />
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  className="w-full input-underwater pr-10"
                  placeholder="Enter your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
                  }`}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {passwordData.newPassword && (
                <motion.div
                  className="mt-3 space-y-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${getStrengthColor()}`}>
                      Password Strength: {getStrengthText()}
                    </span>
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-cyan-400/60' : 'text-slate-500'
                    }`}>
                      {strengthScore}/5 requirements met
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { key: 'length', text: 'At least 8 characters' },
                      { key: 'uppercase', text: 'One uppercase letter' },
                      { key: 'lowercase', text: 'One lowercase letter' },
                      { key: 'number', text: 'One number' },
                      { key: 'special', text: 'One special character' }
                    ].map((req, index) => (
                      <div key={req.key} className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          passwordStrength[req.key]
                            ? theme === 'dark' ? 'bg-green-500' : 'bg-green-600'
                            : theme === 'dark' ? 'bg-slate-600' : 'bg-slate-300'
                        }`}>
                          {passwordStrength[req.key] && (
                            <Check size={10} className="text-white" />
                          )}
                        </div>
                        <span className={`${
                          passwordStrength[req.key]
                            ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                            : theme === 'dark' ? 'text-cyan-400/60' : 'text-slate-500'
                        }`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-600'
              }`}>
                <Lock size={16} className="inline mr-2" />
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full input-underwater pr-10"
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
                  }`}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {passwordData.confirmPassword && (
                <motion.p
                  className={`text-sm mt-2 ${
                    passwordData.newPassword === passwordData.confirmPassword
                      ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      : theme === 'dark' ? 'text-red-400' : 'text-red-600'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {passwordData.newPassword === passwordData.confirmPassword
                    ? '✓ Passwords match'
                    : '✗ Passwords do not match'
                  }
                </motion.p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <motion.button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              
              <motion.button
                type="submit"
                disabled={isLoading || strengthScore < 4 || passwordData.newPassword !== passwordData.confirmPassword}
                className="btn-primary flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Changing...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Change Password</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;