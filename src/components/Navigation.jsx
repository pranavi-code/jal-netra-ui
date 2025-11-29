import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, Settings, MessageCircle, FileText, Package, Image, User, Moon, Sun, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.clear();
    sessionStorage.clear();
    // Navigate back to landing page
    navigate('/');
  };

  const navItems = [
    {
      name: 'Operations',
      path: '/operations',
      icon: Settings
    },
    {
      name: 'Enhancement',
      path: '/enhancement',
      icon: Image
    },
    {
      name: 'Chatbot',
      path: '/chatbot',
      icon: MessageCircle
    },
    {
      name: 'Logs',
      path: '/logs',
      icon: FileText
    },
    {
      name: 'Docker',
      path: '/docker',
      icon: Package
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      className={`${theme === 'dark' ? 'bg-deepSea-900/90' : 'bg-white/95'} backdrop-blur-underwater border-b ${theme === 'dark' ? 'border-cyan-500/20' : 'border-slate-200'} sticky top-0 z-40 shadow-lg`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="w-full px-6">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo Section - Left Corner */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="relative">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-r from-cyan-600 to-ocean-600 rounded-lg flex items-center justify-center"
                >
                  <Waves className="text-white" size={20} />
                </motion.div>
              </div>
              <div>
                <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'}`}>
                  JAL NETRA
                </h1>
                
              </div>
            </Link>
          </motion.div>

          {/* Navigation Links - Center with more spacing */}
          <div className="flex items-center space-x-12">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
                >
                  <Link
                    to={item.path}
                    className={`nav-link flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      active 
                        ? theme === 'dark' 
                          ? 'bg-cyan-600/20 text-cyan-100 border border-cyan-500/30' 
                          : 'bg-blue-100 text-blue-900 border border-blue-300'
                        : theme === 'dark'
                          ? 'hover:bg-deepSea-700/50 text-slate-300'
                          : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon 
                        size={18} 
                        className={active 
                          ? theme === 'dark' ? 'text-cyan-300' : 'text-blue-700'
                          : theme === 'dark' ? 'text-cyan-400/70' : 'text-slate-500'
                        } 
                      />
                    </motion.div>
                    <span className="hidden sm:inline font-medium">
                      {item.name}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Right side - Settings Dropdown */}
          <motion.div
            className="flex items-center relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            {/* Settings Button */}
            <motion.button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                theme === 'dark' 
                  ? 'bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30'
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300 shadow-sm'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings size={18} />
              <span className="hidden sm:inline">Settings</span>
              <ChevronDown size={16} className={`transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            {/* Settings Dropdown */}
            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div
                  className={`absolute top-full right-0 mt-2 w-64 rounded-lg shadow-xl border backdrop-blur-lg ${
                    theme === 'dark' 
                      ? 'bg-deepSea-800/90 border-cyan-500/20' 
                      : 'bg-white/95 border-slate-200 shadow-2xl'
                  }`}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-cyan-500/20">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        theme === 'dark' ? 'bg-cyan-600' : 'bg-blue-600'
                      }`}>
                        <User className="text-white" size={20} />
                      </div>
                      <div>
                        <p className={`font-semibold ${theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'}`}>
                          Guest User
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-500'}`}>
                          guest@example.com
                        </p>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-2">
                      <Link
                        to="/profile"
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors block ${
                          theme === 'dark' 
                            ? 'hover:bg-cyan-600/20 text-cyan-200' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => setIsSettingsOpen(false)}
                      >
                        Update Profile
                      </Link>
                      <Link
                        to="/change-password"
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors block ${
                          theme === 'dark' 
                            ? 'hover:bg-cyan-600/20 text-cyan-200' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => setIsSettingsOpen(false)}
                      >
                        Change Password
                      </Link>
                      
                      {/* Theme Toggle */}
                      <div className="flex items-center justify-between px-3 py-2">
                        <span className={`${theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'}`}>
                          Theme
                        </span>
                        <button
                          onClick={toggleTheme}
                          className={`px-3 py-1 rounded-md transition-colors flex items-center space-x-2 ${
                            theme === 'dark' 
                              ? 'bg-cyan-600 text-white' 
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
                        </button>
                      </div>

                      {/* Logout */}
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-md transition-colors bg-red-600/20 hover:bg-red-600/30 text-red-400"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;