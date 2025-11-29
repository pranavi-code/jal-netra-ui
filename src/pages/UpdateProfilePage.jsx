import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, Calendar, Camera, ArrowLeft, Save } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

const UpdateProfilePage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Rajesh',
    lastName: 'Sharma',
    email: 'rajesh.sharma@navy.in',
    phone: '+91 98765 43210',
    rank: 'Lieutenant Commander',
    department: 'Naval Intelligence',
    location: 'INS Visakhapatnam',
    joinDate: '2018-03-15',
    specialization: 'Underwater Surveillance Systems'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    alert('Profile updated successfully!');
    navigate('/dashboard');
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' 
        ? 'bg-underwater-gradient' 
        : 'bg-gradient-to-br from-slate-50 via-white to-blue-50'
    }`}>
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
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
            }`}>Update Profile</h1>
            <p className={`mt-2 ${
              theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'
            }`}>Manage your account information and preferences</p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Photo Section */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="underwater-card p-6 text-center">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 bg-gradient-to-r from-cyan-600 to-ocean-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-glow">
                  RS
                </div>
                <motion.button
                  className={`absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                    theme === 'dark'
                      ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Camera size={14} />
                </motion.button>
              </div>
              <h3 className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
              }`}>
                {profileData.firstName} {profileData.lastName}
              </h3>
              <p className={`${
                theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'
              }`}>
                {profileData.rank}
              </p>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-cyan-400/60' : 'text-slate-500'
              }`}>
                {profileData.department}
              </p>
            </div>
          </motion.div>

          {/* Form Section */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="underwater-card p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
                  }`}>Personal Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-600'
                      }`}>
                        <User size={16} className="inline mr-2" />
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full input-underwater"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-600'
                      }`}>
                        <User size={16} className="inline mr-2" />
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full input-underwater"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
                  }`}>Contact Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-600'
                      }`}>
                        <Mail size={16} className="inline mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full input-underwater"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-600'
                      }`}>
                        <Phone size={16} className="inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full input-underwater"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
                  }`}>Professional Details</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-600'
                      }`}>
                        Rank
                      </label>
                      <select
                        value={profileData.rank}
                        onChange={(e) => handleInputChange('rank', e.target.value)}
                        className="w-full input-underwater"
                      >
                        <option value="Lieutenant">Lieutenant</option>
                        <option value="Lieutenant Commander">Lieutenant Commander</option>
                        <option value="Commander">Commander</option>
                        <option value="Captain">Captain</option>
                        <option value="Commodore">Commodore</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-600'
                      }`}>
                        Department
                      </label>
                      <input
                        type="text"
                        value={profileData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className="w-full input-underwater"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-600'
                      }`}>
                        <MapPin size={16} className="inline mr-2" />
                        Location
                      </label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full input-underwater"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-600'
                      }`}>
                        <Calendar size={16} className="inline mr-2" />
                        Join Date
                      </label>
                      <input
                        type="date"
                        value={profileData.joinDate}
                        onChange={(e) => handleInputChange('joinDate', e.target.value)}
                        className="w-full input-underwater"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-600'
                    }`}>
                      Specialization
                    </label>
                    <input
                      type="text"
                      value={profileData.specialization}
                      onChange={(e) => handleInputChange('specialization', e.target.value)}
                      className="w-full input-underwater"
                      placeholder="Your area of expertise"
                      required
                    />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-cyan-500/20">
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
                    disabled={isLoading}
                    className="btn-primary flex items-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>Update Profile</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfilePage;