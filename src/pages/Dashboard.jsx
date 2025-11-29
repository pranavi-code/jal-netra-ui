import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Settings, MessageCircle } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useTheme } from '../contexts/ThemeContext';

const Dashboard = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const { theme } = useTheme();

  // Feature cards data
  const featureCards = [
    {
      id: 'manual',
      title: 'Image Processing',
      description: 'Upload underwater images for real-time AI enhancement and threat detection analysis',
      icon: Settings,
      path: '/operations',
      color: 'from-cyan-600 to-ocean-600',
      features: ['Drag & Drop Upload', 'Real-time Processing', 'Threat Detection', 'Quality Metrics']
    },
    {
      id: 'chatbot',
      title: 'Chatbot Assistant',
      description: 'Intelligent AI assistant for mission planning, analysis insights, and system guidance',
      icon: MessageCircle,
      path: '/chatbot',
      color: 'from-ocean-600 to-navy-700',
      features: ['Mission Planning', 'Data Analysis', 'System Help', 'Report Generation']
    }
  ];

  // Background particle component
  const FloatingParticle = ({ delay = 0 }) => (
    <motion.div
      className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
      initial={{ 
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 10,
        opacity: 0 
      }}
      animate={{
        y: -10,
        x: Math.random() * window.innerWidth,
        opacity: [0, 1, 0]
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      theme === 'dark' 
        ? 'bg-underwater-gradient' 
        : 'bg-gradient-to-br from-slate-50 via-white to-blue-50'
    }`}>
      <Navigation />
      
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Floating Particles */}
        {theme === 'dark' && [...Array(15)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.5} />
        ))}
        
        {/* Wave overlay */}
        <motion.div
          className="absolute inset-0 opacity-5"
          animate={{ 
            backgroundPosition: ['0px 0px', '200px 0px', '0px 0px']
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundImage: theme === 'dark' 
              ? 'url("data:image/svg+xml,%3Csvg width="200" height="40" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 20 Q50 0 100 20 T200 20 V40 H0 Z" fill="%2322d3ee33"/%3E%3C/svg%3E")'
              : 'url("data:image/svg+xml,%3Csvg width="200" height="40" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 20 Q50 0 100 20 T200 20 V40 H0 Z" fill="%233b82f633"/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat-x',
            backgroundSize: '400px 80px'
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="text-center py-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className={`text-hero font-bold mb-6 ${
                theme === 'dark' ? 'text-cyan-100' : 'text-slate-900'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            >
              JAL NETRA
            </motion.h1>
            
            <motion.p
              className={`text-xl max-w-4xl mx-auto leading-relaxed ${
                theme === 'dark' ? 'text-cyan-200/80' : 'text-slate-600'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              An AI-driven underwater vigilance system enabling real-time image enhancement, 
              threat detection, and mission intelligence for maritime security operations.
            </motion.p>

            {/* Stats Section */}
            <motion.div
              className="flex flex-wrap justify-center items-center mt-12 space-x-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              
            </motion.div>
          </motion.div>
        </div>

        {/* Feature Cards Section */}
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid md:grid-cols-2 gap-8">
            {featureCards.map((card, index) => {
              const Icon = card.icon;
              const isHovered = hoveredCard === card.id;
              
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.2, duration: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  onHoverStart={() => setHoveredCard(card.id)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <Link to={card.path}>
                    <div className={`p-8 transition-all duration-500 group relative overflow-hidden rounded-2xl border ${
                      theme === 'dark' 
                        ? 'bg-deepSea-800/50 border-cyan-500/30 hover:border-cyan-400/50 backdrop-blur-md' 
                        : 'bg-white/90 border-slate-200 hover:border-blue-400 shadow-lg hover:shadow-xl backdrop-blur-sm'
                    }`}>
                      {/* Background gradient effect */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                        initial={false}
                        animate={{
                          opacity: isHovered ? 0.1 : 0
                        }}
                      />

                      <div className="relative z-10">
                        {/* Icon and Title */}
                        <div className="flex items-center mb-6">
                          <motion.div
                            className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center mr-4`}
                            transition={{ duration: 0.3 }}
                          >
                            <Icon className="text-white" size={24} />
                          </motion.div>
                          
                          <motion.h3
                            className={`text-2xl font-bold ${
                              theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
                            }`}
                            animate={{
                              y: isHovered ? -5 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            {card.title}
                          </motion.h3>
                        </div>

                        {/* Description */}
                        <motion.p
                          className={`leading-relaxed mb-6 ${
                            theme === 'dark' ? 'text-cyan-200/70' : 'text-slate-600'
                          }`}
                          animate={{
                            opacity: isHovered ? 0.9 : 0.7
                          }}
                        >
                          {card.description}
                        </motion.p>

                        {/* Features List - appears on hover */}
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{
                            opacity: isHovered ? 1 : 0,
                            height: isHovered ? 'auto' : 0
                          }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className={`space-y-2 pt-4 border-t ${theme === 'dark' ? 'border-cyan-500/20' : 'border-gray-200'}`}>
                            {card.features.map((feature, featureIndex) => (
                              <motion.div
                                key={feature}
                                className={`flex items-center text-sm ${
                                  theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-500'
                                }`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{
                                  opacity: isHovered ? 1 : 0,
                                  x: isHovered ? 0 : -20
                                }}
                                transition={{ delay: featureIndex * 0.1, duration: 0.3 }}
                              >
                                <div className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 ${theme === 'dark' ? 'bg-cyan-400' : 'bg-blue-500'}`} />
                                {feature}
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>

                        {/* Action Button */}
                        <motion.div
                          className="mt-6"
                          animate={{
                            y: isHovered ? -2 : 0
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className={`text-center inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 font-semibold ${
                            theme === 'dark' 
                              ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-600/30'
                              : 'bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 shadow-md'
                          }`}>
                            <span>Launch Module</span>
                            <motion.div
                              animate={{ x: isHovered ? 5 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              →
                            </motion.div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Dashboard;