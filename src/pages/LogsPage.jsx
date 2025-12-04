import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar, Shield, Clock, MapPin, AlertTriangle, CheckCircle, X, Eye, Play } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useTheme } from '../contexts/ThemeContext';

const LogsPage = () => {
  const { theme } = useTheme();
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Mock rover trip data - only trips with threats detected
  const roverTrips = [
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

  const getStatusColor = (status) => {
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

  const getThreatColor = (count) => {
    if (count === 0) return 'text-green-400';
    if (count <= 2) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
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
            Critical rover missions with threat detection
          </p>
        </motion.div>

        {/* Trip Cards */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {roverTrips.map((trip, index) => (
            <motion.div
              key={trip.id}
              className="underwater-card p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <FileText className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`} size={24} />
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
                    }`}>{trip.tripName}</h3>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'
                    }`}>Operator: {trip.operator}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(trip.status)}`}>
                    {trip.status}
                  </div>
                  <div className={`flex items-center space-x-2 ${getThreatColor(trip.threatsDetected)}`}>
                    <AlertTriangle size={16} />
                    <span className="font-medium">{trip.threatsDetected} Threats</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className={`${theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'}`} size={16} />
                  <span className={`${theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'}`}>
                    Video Time: {trip.videoTime}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className={`${theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'}`} size={16} />
                  <span className={`${theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'}`}>
                    {trip.location}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className={`${theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'}`} size={16} />
                  <span className={`${theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'}`}>
                    {trip.timestamp.toLocaleDateString()} {trip.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className={`${theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'}`} size={16} />
                  <span className={`${theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'}`}>
                    Depth: {trip.depthReached}
                  </span>
                </div>
              </div>

              {trip.threatDetails.length > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-red-600/10 border border-red-600/30">
                  <h4 className="text-red-400 font-medium mb-2 text-sm">Threat Details:</h4>
                  <ul className="space-y-1">
                    {trip.threatDetails.map((detail, idx) => (
                      <li key={idx} className="text-red-300 text-sm flex items-start space-x-2">
                        <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 flex justify-between items-center">
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-600'
                }`}>
                  {trip.missionSummary}
                </p>
                <button
                  onClick={() => setSelectedTrip(trip)}
                  className="btn-secondary text-sm"
                >
                  <Eye className="inline mr-1" size={14} />
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Trip Detail Modal */}
      <AnimatePresence>
        {selectedTrip && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="underwater-card max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className={`text-xl font-bold ${
                    theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
                  }`}>{selectedTrip.tripName} - Detailed Report</h2>
                  <button
                    onClick={() => setSelectedTrip(null)}
                    className="btn-secondary p-2"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className={`font-medium ${theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'}`}>
                        Mission Time:
                      </span>
                      <p className={`${theme === 'dark' ? 'text-cyan-100' : 'text-slate-600'}`}>
                        {selectedTrip.timestamp.toLocaleDateString()} at {selectedTrip.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <span className={`font-medium ${theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'}`}>
                        Location:
                      </span>
                      <p className={`${theme === 'dark' ? 'text-cyan-100' : 'text-slate-600'}`}>
                        {selectedTrip.location}
                      </p>
                    </div>
                    <div>
                      <span className={`font-medium ${theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'}`}>
                        Depth Reached:
                      </span>
                      <p className={`${theme === 'dark' ? 'text-cyan-100' : 'text-slate-600'}`}>
                        {selectedTrip.depthReached}
                      </p>
                    </div>
                    <div>
                      <span className={`font-medium ${theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'}`}>
                        Distance Covered:
                      </span>
                      <p className={`${theme === 'dark' ? 'text-cyan-100' : 'text-slate-600'}`}>
                        {selectedTrip.distanceCovered}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'}`}>
                      Mission Summary:
                    </h4>
                    <p className={`${theme === 'dark' ? 'text-cyan-100' : 'text-slate-600'}`}>
                      {selectedTrip.missionSummary}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'}`}>
                      Threats Detected ({selectedTrip.threatsDetected}):
                    </h4>
                    <ul className="space-y-2">
                      {selectedTrip.threatDetails.map((threat, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                          <span className={`${theme === 'dark' ? 'text-cyan-100' : 'text-slate-600'}`}>
                            {threat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LogsPage;