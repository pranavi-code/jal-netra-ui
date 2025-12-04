import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Terminal, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useTheme } from '../contexts/ThemeContext';

const DockerPage = () => {
  const { theme } = useTheme();
  const [copiedCommand, setCopiedCommand] = useState('');

  const essentialCommands = [
    {
      title: 'Pull JAL NETRA Image',
      command: 'docker pull jalnetra/underwater-ai:latest'
    },
    {
      title: 'Run Container',
      command: 'docker run -d --name jalnetra-ai --gpus all -p 8080:8080 jalnetra/underwater-ai:latest'
    },
    {
      title: 'Check Status',
      command: 'docker ps -a | grep jalnetra'
    },
    {
      title: 'View Logs',
      command: 'docker logs -f jalnetra-ai'
    },
    {
      title: 'Stop Container',
      command: 'docker stop jalnetra-ai'
    }
  ];

  const copyToClipboard = async (text, commandTitle) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCommand(commandTitle);
      setTimeout(() => setCopiedCommand(''), 2000);
    } catch (err) {
      console.error('Failed to copy command:', err);
    }
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
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
            Docker Deployment
          </h1>
          <p className={`${
            theme === 'dark' ? 'text-cyan-200/70' : 'text-slate-600'
          }`}>
            Essential Docker commands for JAL NETRA deployment
          </p>
        </motion.div>

        {/* Docker Hub Link */}
        <motion.div
          className="underwater-card p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-ocean-600 rounded-lg flex items-center justify-center shadow-glow">
                <Package className="text-white" size={24} />
              </div>
              <div>
                <h2 className={`text-xl font-semibold ${
                  theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
                }`}>JAL NETRA Docker Image</h2>
                <p className={`${
                  theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'
                }`}>Pre-built container with AI models and dependencies</p>
              </div>
            </div>
            <motion.a
              href="https://hub.docker.com/r/jalnetra/underwater-ai"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-all duration-300 font-medium ${
                theme === 'dark'
                  ? 'bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 hover:text-cyan-200 border-cyan-500/30 hover:border-cyan-400/50'
                  : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink size={18} />
              <span>Docker Hub</span>
            </motion.a>
          </div>
        </motion.div>

        {/* Essential Commands */}
        <motion.div
          className="underwater-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Terminal className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`} size={24} />
            <h2 className={`text-xl font-semibold ${
              theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
            }`}>Essential Commands</h2>
          </div>
          
          <div className="space-y-4">
            {essentialCommands.map((cmd, index) => (
              <motion.div
                key={cmd.title}
                className="border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-500/40 transition-colors duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
              >
                <h4 className={`font-medium mb-3 ${
                  theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
                }`}>{cmd.title}</h4>
                
                <div className="relative">
                  <pre className={`border rounded-lg p-4 text-sm font-mono overflow-x-auto ${
                    theme === 'dark'
                      ? 'bg-deepSea-900 border-deepSea-600 text-cyan-300'
                      : 'bg-slate-100 border-slate-300 text-slate-800'
                  }`}>
                    {cmd.command}
                  </pre>
                  <motion.button
                    onClick={() => copyToClipboard(cmd.command, cmd.title)}
                    className={`absolute top-3 right-3 p-2 rounded transition-colors duration-200 ${
                      theme === 'dark'
                        ? 'bg-deepSea-700 hover:bg-deepSea-600'
                        : 'bg-slate-200 hover:bg-slate-300'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {copiedCommand === cmd.title ? (
                      <CheckCircle className="text-green-400" size={16} />
                    ) : (
                      <Copy className="text-cyan-400" size={16} />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Info */}
        <motion.div
          className="underwater-card p-6 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
          }`}>Quick Info</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className={`${
                theme === 'dark' ? 'text-cyan-300/60' : 'text-slate-500'
              }`}>Image Size:</span>
              <span className={`font-medium ${
                theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
              }`}>~8.5 GB</span>
            </div>
            <div className="flex justify-between">
              <span className={`${
                theme === 'dark' ? 'text-cyan-300/60' : 'text-slate-500'
              }`}>Latest Version:</span>
              <span className={`font-medium ${
                theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
              }`}>v2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className={`${
                theme === 'dark' ? 'text-cyan-300/60' : 'text-slate-500'
              }`}>Ports:</span>
              <span className={`font-medium ${
                theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
              }`}>8080, 5000</span>
            </div>
            <div className="flex justify-between">
              <span className={`${
                theme === 'dark' ? 'text-cyan-300/60' : 'text-slate-500'
              }`}>GPU Support:</span>
              <span className={`font-medium ${
                theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
              }`}>NVIDIA Docker</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DockerPage;