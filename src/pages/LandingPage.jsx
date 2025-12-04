import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fish, Waves, Zap, Anchor, Shield, Eye, Cpu, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({
    username: '', email: '', password: '', confirmPassword: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    // Navigate immediately to maintain video continuity
    navigate('/dashboard');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    // Navigate immediately to maintain video continuity
    navigate('/dashboard');
  };

  // Enhanced floating elements
  const FloatingFish = ({ delay = 0, size = 24, direction = 'right' }) => {
    const startX = direction === 'right' ? -100 : window.innerWidth + 100;
    const endX = direction === 'right' ? window.innerWidth + 100 : -100;
    
    return (
      <motion.div
        className="absolute text-cyan-400/30"
        initial={{ x: startX, y: Math.random() * 400 }}
        animate={{ 
          x: [null, endX],
          y: [null, Math.random() * 400 + 50],
          rotate: [0, direction === 'right' ? 10 : -10, 0]
        }}
        transition={{
          duration: 12 + Math.random() * 8,
          delay,
          repeat: Infinity,
          repeatDelay: Math.random() * 3,
          ease: "easeInOut"
        }}
      >
        <Fish size={size} />
      </motion.div>
    );
  };

  const FloatingBubbles = ({ count = 15 }) => (
    <>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-cyan-400/20 rounded-full"
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 20,
            scale: 0.5 + Math.random() * 0.5
          }}
          animate={{
            y: -20,
            x: Math.random() * window.innerWidth,
            scale: [null, 1.2, 0.8, 1]
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      ))}
    </>
  );

  const RippleEffect = () => (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 border border-cyan-400/20 rounded-full"
          animate={{
            scale: [1, 4],
            opacity: [0.6, 0]
          }}
          transition={{
            duration: 4,
            delay: i * 1.3,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );

  // Realistic Underwater Transition Animation
  const TransitionAnimation = () => (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        theme === 'dark' 
          ? 'bg-gradient-to-b from-deepSea-900 via-deepSea-800 to-deepSea-900'
          : 'bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-full h-full overflow-hidden">
        {/* Realistic underwater caustics */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M0 40 Q25 20 50 40 T100 40 Q75 60 50 40 T0 40' fill='%2322d3ee' fill-opacity='0.1'/%3E%3C/svg%3E")`
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Schools of realistic fish */}
        {[...Array(12)].map((_, i) => {
          const delay = i * 0.2;
          const isSchool = i % 3 === 0;
          return (
            <motion.div
              key={i}
              className={`absolute ${
                isSchool ? 'text-blue-300' : i % 2 === 0 ? 'text-cyan-300' : 'text-teal-300'
              } opacity-70`}
              initial={{ 
                x: -100, 
                y: 100 + Math.random() * (window.innerHeight - 200),
                scale: 0.5 + Math.random() * 0.8
              }}
              animate={{ 
                x: [null, window.innerWidth / 3, window.innerWidth * 0.7, window.innerWidth + 100],
                y: [null, 
                    100 + Math.random() * (window.innerHeight - 300),
                    150 + Math.random() * (window.innerHeight - 400),
                    200 + Math.random() * (window.innerHeight - 500)
                ],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 5,
                delay,
                ease: "easeInOut"
              }}
            >
              <Fish size={isSchool ? 16 : 20 + Math.random() * 16} />
            </motion.div>
          );
        })}

        {/* Submarine silhouettes */}
        <motion.div
          className={`absolute top-1/4 opacity-60 ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-400'
          }`}
          initial={{ x: -300, rotate: -5 }}
          animate={{ 
            x: window.innerWidth + 300,
            y: [0, -30, 0],
            rotate: [-5, 0, 5]
          }}
          transition={{ duration: 5, ease: "easeInOut" }}
        >
          <Anchor size={60} />
        </motion.div>

        <motion.div
          className={`absolute top-2/3 opacity-40 ${
            theme === 'dark' ? 'text-slate-500' : 'text-slate-500'
          }`}
          initial={{ x: window.innerWidth + 200, rotate: 5 }}
          animate={{ 
            x: -200,
            y: [0, 20, -10, 0],
            rotate: [5, 0, -5]
          }}
          transition={{ duration: 4.5, delay: 0.3, ease: "easeInOut" }}
        >
          <Anchor size={45} />
        </motion.div>

        {/* Realistic water particles and debris */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-cyan-400/30 rounded-full"
            style={{
              width: Math.random() * 6 + 1,
              height: Math.random() * 6 + 1
            }}
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 20,
              opacity: 0
            }}
            animate={{
              y: -20,
              x: Math.random() * window.innerWidth + (Math.random() - 0.5) * 100,
              opacity: [0, 0.8, 0.4, 0],
              scale: [0.5, 1.2, 0.8, 0.3]
            }}
            transition={{
              duration: 6 + Math.random() * 3,
              delay: Math.random() * 2,
              ease: "easeOut"
            }}
          />
        ))}

        {/* Sunlight rays filtering through water */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-0 bg-gradient-to-b from-cyan-300/20 via-cyan-400/10 to-transparent h-full"
            style={{
              left: `${10 + i * 15}%`,
              width: `${3 + Math.random() * 2}px`,
              transform: `skewX(${-10 + Math.random() * 5}deg)`
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ 
              scaleY: 1, 
              opacity: [0, 0.6, 0.3],
              skewX: [-10 + Math.random() * 5, -5 + Math.random() * 3]
            }}
            transition={{ 
              duration: 4, 
              delay: i * 0.4, 
              ease: "easeOut"
            }}
          />
        ))}

        {/* Sonar waves */}
        <motion.div
          className="absolute bottom-1/3 left-1/4 transform -translate-x-1/2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 4, 8], 
            opacity: [0, 0.6, 0]
          }}
          transition={{ duration: 4, delay: 0.8, ease: "easeOut" }}
        >
          <div className="w-24 h-24 border border-green-400/40 rounded-full" />
        </motion.div>

        {/* Professional mission text */}
        <motion.div
          className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 text-center"
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 2.5, duration: 1.5 }}
        >
          <motion.div 
            className="flex items-center justify-center mb-6"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Shield className="text-cyan-400 mr-3" size={28} />
            <Eye className="text-cyan-400" size={32} />
            <Cpu className="text-cyan-400 ml-3" size={28} />
          </motion.div>
          <h2 className={`text-4xl font-bold mb-3 ${
            theme === 'dark' 
              ? 'text-cyan-100 text-glow' 
              : 'text-white'
          }`}>
            SYSTEM ACTIVATION
          </h2>
          <p className={`text-lg mb-2 ${
            theme === 'dark' ? 'text-cyan-300/90' : 'text-slate-200'
          }`}>JAL NETRA Mission Protocol</p>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-cyan-400/70' : 'text-slate-300'
          }`}>Underwater Surveillance • Threat Assessment • Mission Ready</p>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Fish - varied sizes and directions */}
        {[...Array(8)].map((_, i) => (
          <FloatingFish 
            key={i} 
            delay={i * 1.5} 
            size={20 + Math.random() * 20}
            direction={i % 2 === 0 ? 'right' : 'left'}
          />
        ))}
        
        {/* Floating Bubbles */}
        <FloatingBubbles count={20} />
        
        {/* Multiple Ripple Effects */}
        <div className="absolute top-1/4 left-1/4">
          <RippleEffect />
        </div>
        <div className="absolute bottom-1/3 right-1/4">
          <RippleEffect />
        </div>
        <div className="absolute top-3/4 left-1/3">
          <RippleEffect />
        </div>

        {/* Enhanced wave overlays */}
        <motion.div
          className="absolute inset-0 opacity-15"
          animate={{ 
            backgroundPosition: ['0px 0px', '200px 0px', '0px 0px']
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 10 Q25 0 50 10 T100 10 V20 H0 Z" fill="%2322d3ee33"/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat-x',
            backgroundSize: '200px 40px'
          }}
        />
        
        <motion.div
          className="absolute inset-0 opacity-8"
          animate={{ 
            backgroundPosition: ['200px 0px', '0px 0px', '200px 0px']
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="120" height="25" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 15 Q30 5 60 15 T120 15 V25 H0 Z" fill="%2306b6d422"/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat-x',
            backgroundSize: '240px 50px',
            bottom: '20%'
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Project Info */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-8 xl:p-12 relative">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-xl"
          >
            <div className="mb-6">
              <motion.div
                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-cyan-600 via-ocean-600 to-deepSea-600 rounded-full shadow-glow mb-4"
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(34, 211, 238, 0.3)',
                    '0 0 50px rgba(34, 211, 238, 0.7)',
                    '0 0 20px rgba(34, 211, 238, 0.3)'
                  ],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Waves className="text-white" size={40} />
              </motion.div>
            </div>

            <motion.h1
              className={`text-6xl xl:text-7xl font-bold mb-4 ${
                theme === 'dark' 
                  ? 'text-cyan-100 text-glow' 
                  : 'text-slate-900'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              JAL NETRA
            </motion.h1>

            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <p className={`text-2xl font-medium mb-2 ${
                theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
              }`}>
                Underwater AI Vision System
              </p>
              <p className={`text-lg leading-relaxed ${
                theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-600'
              }`}>
                Advanced maritime surveillance with real-time threat detection and image enhancement
              </p>
            </motion.div>

            <motion.div
              className={`mt-6 flex items-center justify-center space-x-4 ${
                theme === 'dark' ? 'text-cyan-300/60' : 'text-slate-500'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              
            </motion.div>

            {/* Navy/DRDO Badge */}
            <motion.div
              className={`mt-6 flex items-center justify-center space-x-2 text-sm ${
                theme === 'dark' ? 'text-cyan-300/60' : 'text-slate-500'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <Shield size={16} />
              <span>Indian Navy</span>
              <span className={`w-1 h-1 rounded-full ${
                theme === 'dark' ? 'bg-cyan-400' : 'bg-slate-400'
              }`}></span>
              <span>DRDO Project</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Mobile title */}
            <motion.div 
              className="lg:hidden text-center mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h1 className={`text-4xl font-bold mb-2 ${
                theme === 'dark' 
                  ? 'text-cyan-100 text-glow' 
                  : 'text-slate-900'
              }`}>JAL NETRA</h1>
              <p className={`${
                theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-600'
              }`}>Underwater AI Vision System</p>
            </motion.div>

            {/* Enhanced Tab Switcher */}
            <motion.div 
              className="flex mb-6 bg-deepSea-800/70 rounded-xl p-1 backdrop-blur-underwater border border-cyan-500/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <motion.button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  isLogin
                    ? 'bg-gradient-to-r from-cyan-600 to-ocean-600 text-white shadow-glow'
                    : theme === 'dark' 
                      ? 'text-cyan-300 hover:text-cyan-200 hover:bg-deepSea-700/50'
                      : 'text-slate-600 hover:text-slate-700 hover:bg-slate-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign In
              </motion.button>
              <motion.button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  !isLogin
                    ? 'bg-gradient-to-r from-cyan-600 to-ocean-600 text-white shadow-glow'
                    : theme === 'dark'
                      ? 'text-cyan-300 hover:text-cyan-200 hover:bg-deepSea-700/50'
                      : 'text-slate-600 hover:text-slate-700 hover:bg-slate-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign Up
              </motion.button>
            </motion.div>

            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleLogin}
                  className="space-y-6"
                >
                  <div>
                    <label className={`block font-medium mb-2 ${
                      theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
                    }`}>
                      Username
                    </label>
                    <input
                      type="text"
                      value={loginData.username}
                      onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                      className="w-full input-underwater"
                      placeholder="Enter your username"
                      required
                    />
                  </div>

                  <div>
                    <label className={`block font-medium mb-2 ${
                      theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
                    }`}>
                      Password
                    </label>
                    <input
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      className="w-full input-underwater"
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Authenticating...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSignup}
                  className="space-y-6"
                >
                  <div>
                    <label className={`block font-medium mb-2 ${
                      theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
                    }`}>
                      Username
                    </label>
                    <input
                      type="text"
                      value={signupData.username}
                      onChange={(e) => setSignupData({...signupData, username: e.target.value})}
                      className="w-full input-underwater"
                      placeholder="Choose a username"
                      required
                    />
                  </div>

                  <div>
                    <label className={`block font-medium mb-2 ${
                      theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
                    }`}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      className="w-full input-underwater"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className={`block font-medium mb-2 ${
                      theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
                    }`}>
                      Password
                    </label>
                    <input
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      className="w-full input-underwater"
                      placeholder="Create a password"
                      required
                    />
                  </div>

                  <div>
                    <label className={`block font-medium mb-2 ${
                      theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
                    }`}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                      className="w-full input-underwater"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;