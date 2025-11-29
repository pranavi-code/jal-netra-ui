import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar, Shield, Clock, MapPin, AlertTriangle, CheckCircle, X, Eye, Play } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useTheme } from '../contexts/ThemeContext';

interface RoverTrip {
  id: string;
  tripName: string;
  threatsDetected: number;
  videoTime: string;
  timestamp: Date;
  location: string;
  status: 'completed' | 'in-progress' | 'failed';
  operator: string;
  threatDetails: string[];
  missionSummary: string;
  depthReached: string;
  distanceCovered: string;
  videoThumbnail?: string;
}

const LogsPage: React.FC = () => {
  const { theme } = useTheme();
  const [selectedTrip, setSelectedTrip] = useState<RoverTrip | null>(null);

  // Mock rover trip data - only trips with threats detected
  const roverTrips: RoverTrip[] = [
    {
      id: '1',
      tripName: 'Rover Trip 1',
      threatsDetected: 2,
      videoTime: '02:45:30',
      timestamp: new Date('2024-11-28T14:30:00'),
      location: 'Indian Ocean - Sector Alpha-7',
      status: 'completed',
      operator: 'Lt. Commander Sharma',
      threatDetails: ['Submarine contact at bearing 045°', 'Unidentified metallic object detected'],
      missionSummary: 'Deep sea reconnaissance mission in sector Alpha-7. Rover deployed at 0800 hours, conducted systematic sweep of designated area. Multiple sonar contacts detected requiring further investigation.',
      depthReached: '450m',
      distanceCovered: '12.5km'
    },
    {
      id: '3',
      tripName: 'Rover Trip 3',
      threatsDetected: 1,
      videoTime: '00:45:20',
      timestamp: new Date('2024-11-27T22:45:00'),
      location: 'Bay of Bengal - Sector Charlie-1',
      status: 'completed',
      operator: 'Major Singh',
      threatDetails: ['Possible underwater mine detected at depth 380m'],
      missionSummary: 'Emergency response mission investigating reported anomaly. Rover successfully identified and catalogued potential underwater mine.',
      depthReached: '380m',
      distanceCovered: '5.8km'
    },
    {
      id: '4',
      tripName: 'Rover Trip 4',
      threatsDetected: 3,
      videoTime: '03:12:45',
      timestamp: new Date('2024-11-27T16:20:00'),
      location: 'Andaman Sea - Sector Delta-5',
      status: 'completed',
      operator: 'Commander Patel',
      threatDetails: ['Foreign submarine detected at bearing 120°', 'Suspicious surface vessel tracked', 'Underwater debris field mapped'],
      missionSummary: 'High priority border patrol mission. Multiple threats encountered and catalogued. Full threat assessment completed.',
      depthReached: '520m',
      distanceCovered: '15.7km'
    },
    {
      id: '6',
      tripName: 'Rover Trip 6',
      threatsDetected: 1,
      videoTime: '01:58:15',
      timestamp: new Date('2024-11-26T13:20:00'),
      location: 'Arabian Sea - Sector Foxtrot-2',
      status: 'completed',
      operator: 'Lt. Commander Nair',
      threatDetails: ['Unidentified underwater vehicle detected'],
      missionSummary: 'Routine surveillance mission that detected unexpected underwater vehicle. Full analysis and documentation completed.',
      depthReached: '390m',
      distanceCovered: '11.2km'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return theme === 'dark'
          ? 'bg-green-600/20 text-green-300 border-green-600/30'
          : 'bg-green-100 text-green-700 border-green-300';
      case 'in-progress':
        return theme === 'dark'
          ? 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30'
          : 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'failed':
        return theme === 'dark'
          ? 'bg-red-600/20 text-red-300 border-red-600/30'
          : 'bg-red-100 text-red-700 border-red-300';
      default:
        return theme === 'dark'
          ? 'bg-cyan-600/20 text-cyan-300 border-cyan-600/30'
          : 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const getThreatColor = (count: number) => {
    if (count === 0) return 'text-green-400';
    if (count <= 2) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-underwater-gradient' : 'bg-gradient-to-br from-slate-50 via-white to-blue-50'
    }`}>
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={`text-title font-bold mb-4 ${
            theme === 'dark' 
              ? 'text-cyan-100 text-glow' 
              : 'text-slate-900'
          }`}>
            Rover Trip Logs
          </h1>
          <p className={`${
            theme === 'dark' ? 'text-cyan-200/70' : 'text-slate-600'
          }`}>
            Critical rover missions with threat detection - only showing trips where threats were identified
          </p>
        </motion.div>

        {/* Trip Statistics */}
        <motion.div
          className="grid md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {[
            { 
              label: 'Threat Missions', 
              value: roverTrips.length, 
              icon: Shield,
              color: 'text-red-400' 
            },
            { 
              label: 'Threats Found', 
              value: roverTrips.reduce((sum, trip) => sum + trip.threatsDetected, 0), 
              icon: Shield,
              color: 'text-red-400' 
            },
            { 
              label: 'Active Trips', 
              value: roverTrips.filter(trip => trip.status === 'in-progress').length, 
              icon: Clock,
              color: 'text-yellow-400' 
            },
            { 
              label: 'Total Runtime', 
              value: roverTrips.reduce((sum, trip) => {
                const [hours, minutes, seconds] = trip.videoTime.split(':').map(Number);
                return sum + hours + minutes / 60 + seconds / 3600;
              }, 0).toFixed(1) + 'h', 
              icon: Play,
              color: 'text-green-400' 
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="underwater-card p-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
              <div className={`text-2xl font-bold mb-1 ${
                theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
              }`}>{stat.value}</div>
              <div className={`text-sm ${
                theme === 'dark' ? 'text-cyan-300/60' : 'text-slate-500'
              }`}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trip Cards - Horizontal Layout */}
        <div className="space-y-6">
          {roverTrips.map((trip, index) => (
            <motion.div
              key={trip.id}
              className="underwater-card p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -2 }}
              onClick={() => setSelectedTrip(trip)}
            >
              <div className="flex items-center justify-between">
                {/* Left Section - Trip Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <h3 className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
                    }`}>{trip.tripName}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(trip.status)}`}>
                      {trip.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex flex-col">
                      <span className={`text-sm mb-1 ${
                        theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-500'
                      }`}>Threats Detected</span>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className={`${getThreatColor(trip.threatsDetected)}`} size={20} />
                        <span className={`font-bold text-lg ${getThreatColor(trip.threatsDetected)}`}>
                          {trip.threatsDetected}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className={`text-sm mb-1 ${
                        theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-500'
                      }`}>Video Time</span>
                      <span className={`font-mono text-lg ${
                        theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
                      }`}>{trip.videoTime}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className={`text-sm mb-1 ${
                        theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-500'
                      }`}>Depth Reached</span>
                      <span className={`text-lg ${
                        theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
                      }`}>{trip.depthReached}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className={`text-sm mb-1 ${
                        theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-500'
                      }`}>Distance</span>
                      <span className={`text-lg ${
                        theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
                      }`}>{trip.distanceCovered}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className={`flex items-center space-x-4 text-sm ${
                      theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-500'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <MapPin size={16} />
                        <span>{trip.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>{trip.timestamp.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={16} />
                        <span>{trip.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                    
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-cyan-300/60' : 'text-slate-500'
                    }`}>Operator: {trip.operator}</span>
                  </div>
                </div>

                {/* Right Section - View Details Button */}
                <div className="ml-6">
                  <motion.button
                    className={`px-6 py-3 border rounded-lg transition-all duration-300 font-medium flex items-center space-x-2 ${
                      theme === 'dark'
                        ? 'bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border-cyan-500/30 hover:border-cyan-400/50'
                        : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye size={18} />
                    <span>View Details</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal for Trip Details */}
        <AnimatePresence>
          {selectedTrip && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedTrip(null)}
              />
              
              {/* Modal Content */}
              <motion.div
                className="relative underwater-card p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
                  }`}>{selectedTrip.tripName} Details</h2>
                  <motion.button
                    onClick={() => setSelectedTrip(null)}
                    className="p-2 hover:bg-deepSea-700 rounded-lg transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className={`${theme === 'dark' ? 'text-cyan-400' : 'text-slate-600'}`} size={20} />
                  </motion.button>
                </div>

                {/* Trip Information */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className={`font-medium mb-2 ${
                        theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
                      }`}>Mission Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className={`${
                            theme === 'dark' ? 'text-cyan-300/60' : 'text-slate-500'
                          }`}>Status:</span>
                          <span className={`font-medium capitalize ${
                            selectedTrip.status === 'completed' 
                              ? (theme === 'dark' ? 'text-green-400' : 'text-green-600')
                              : selectedTrip.status === 'in-progress' 
                                ? (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600')
                                : (theme === 'dark' ? 'text-red-400' : 'text-red-600')
                          }`}>
                            {selectedTrip.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`${
                            theme === 'dark' ? 'text-cyan-300/60' : 'text-slate-500'
                          }`}>Operator:</span>
                          <span className={`${
                            theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
                          }`}>{selectedTrip.operator}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`${
                            theme === 'dark' ? 'text-cyan-300/60' : 'text-slate-500'
                          }`}>Video Duration:</span>
                          <span className={`font-mono ${
                            theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
                          }`}>{selectedTrip.videoTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`${
                            theme === 'dark' ? 'text-cyan-300/60' : 'text-slate-500'
                          }`}>Max Depth:</span>
                          <span className={`${
                            theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
                          }`}>{selectedTrip.depthReached}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`${
                            theme === 'dark' ? 'text-cyan-300/60' : 'text-slate-500'
                          }`}>Distance:</span>
                          <span className={`${
                            theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
                          }`}>{selectedTrip.distanceCovered}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className={`font-medium mb-2 ${
                        theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
                      }`}>Location & Time</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start space-x-2">
                          <MapPin className={`mt-1 ${
                            theme === 'dark' ? 'text-cyan-400' : 'text-blue-500'
                          }`} size={14} />
                          <span className={`${
                            theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
                          }`}>{selectedTrip.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className={`${
                            theme === 'dark' ? 'text-cyan-400' : 'text-blue-500'
                          }`} size={14} />
                          <span className={`${
                            theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
                          }`}>{selectedTrip.timestamp.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className={`${
                            theme === 'dark' ? 'text-cyan-400' : 'text-blue-500'
                          }`} size={14} />
                          <span className={`${
                            theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
                          }`}>{selectedTrip.timestamp.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mission Summary */}
                <div className="mb-6">
                  <h4 className={`font-medium mb-3 ${
                    theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
                  }`}>Mission Summary</h4>
                  <p className={`text-sm leading-relaxed p-4 rounded-lg border ${
                    theme === 'dark' 
                      ? 'text-cyan-300/80 bg-deepSea-800/50 border-cyan-500/20'
                      : 'text-slate-600 bg-slate-50 border-slate-200'
                  }`}>
                    {selectedTrip.missionSummary}
                  </p>
                </div>

                {/* Threat Details */}
                {selectedTrip.threatDetails.length > 0 && (
                  <div className="mb-6">
                    <h4 className={`font-medium mb-3 flex items-center ${
                      theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
                    }`}>
                      <AlertTriangle className={`mr-2 ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-500'
                      }`} size={16} />
                      Threats Detected ({selectedTrip.threatDetails.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedTrip.threatDetails.map((threat, index) => (
                        <motion.div
                          key={index}
                          className={`flex items-start space-x-3 p-3 border rounded-lg ${
                            theme === 'dark'
                              ? 'bg-red-400/10 border-red-400/20'
                              : 'bg-red-50 border-red-200'
                          }`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                        >
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            theme === 'dark' ? 'bg-red-400' : 'bg-red-500'
                          }`}></div>
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-red-200' : 'text-red-700'
                          }`}>{threat}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className={`flex space-x-3 pt-4 border-t ${
                  theme === 'dark' ? 'border-cyan-500/20' : 'border-slate-200'
                }`}>
                  <motion.button
                    className={`flex-1 px-4 py-2 border rounded-lg transition-all duration-300 font-medium ${
                      theme === 'dark'
                        ? 'bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border-cyan-500/30 hover:border-cyan-400/50'
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 hover:border-blue-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Video Recording
                  </motion.button>
                  <motion.button
                    className={`flex-1 px-4 py-2 border rounded-lg transition-all duration-300 font-medium ${
                      theme === 'dark'
                        ? 'bg-deepSea-600/20 hover:bg-deepSea-600/30 text-deepSea-200 border-deepSea-500/30 hover:border-deepSea-400/50'
                        : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200 hover:border-green-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Download Report
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LogsPage;