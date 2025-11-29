import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Camera, Save, ArrowLeft } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  rank: string;
  location: string;
  bio: string;
}

const UpdateProfilePage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: 'Lt. Commander Guest',
    email: 'guest@indiannavy.gov.in',
    phone: '+91 98765 43210',
    department: 'Naval Intelligence',
    rank: 'Lieutenant Commander',
    location: 'Mumbai Naval Base',
    bio: 'Experienced naval officer specializing in underwater surveillance and maritime intelligence operations.'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    alert('Profile updated successfully!');
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
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
            }`}>Manage your personal information and preferences</p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <motion.div
            className={`lg:col-span-1 p-6 rounded-xl border ${
              theme === 'dark'
                ? 'bg-deepSea-800/50 border-cyan-500/20 backdrop-blur-underwater'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-center">
              <div className={`w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center ${
                theme === 'dark' ? 'bg-cyan-600' : 'bg-blue-600'
              }`}>
                <User className="text-white" size={48} />
              </div>
              
              <motion.button
                className={`btn-secondary flex items-center space-x-2 mx-auto`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Camera size={16} />
                <span>Change Photo</span>
              </motion.button>
              
              <p className={`text-xs mt-2 ${
                theme === 'dark' ? 'text-cyan-400/60' : 'text-slate-500'
              }`}>
                JPG, PNG or GIF (max. 2MB)
              </p>
            </div>
          </motion.div>

          {/* Profile Form */}
          <motion.div
            className={`lg:col-span-2 p-6 rounded-xl border ${
              theme === 'dark'
                ? 'bg-deepSea-800/50 border-cyan-500/20 backdrop-blur-underwater'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
                }`}>Personal Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-600'
                    }`}>
                      <User size={16} className="inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full input-underwater"
                      required
                    />
                  </div>

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
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
                }`}>Professional Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-600'
                    }`}>Department</label>
                    <select
                      value={profileData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full input-underwater"
                      required
                    >
                      <option value="Naval Intelligence">Naval Intelligence</option>
                      <option value="Maritime Operations">Maritime Operations</option>
                      <option value="Underwater Warfare">Underwater Warfare</option>
                      <option value="Naval Aviation">Naval Aviation</option>
                      <option value="Coastal Security">Coastal Security</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-600'
                    }`}>Rank</label>
                    <select
                      value={profileData.rank}
                      onChange={(e) => handleInputChange('rank', e.target.value)}
                      className="w-full input-underwater"
                      required
                    >
                      <option value="Lieutenant">Lieutenant</option>
                      <option value="Lieutenant Commander">Lieutenant Commander</option>
                      <option value="Commander">Commander</option>
                      <option value="Captain">Captain</option>
                      <option value="Commodore">Commodore</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-600'
                }`}>Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full input-underwater resize-none"
                  placeholder="Tell us about your experience and expertise..."
                />
              </div>

              {/* Submit Button */}
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
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfilePage;