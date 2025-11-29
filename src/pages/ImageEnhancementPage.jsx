import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Sliders, Eye, RotateCcw, Zap } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useTheme } from '../contexts/ThemeContext';

const ImageEnhancementPage = () => {
  const { theme } = useTheme();
  const [selectedImage, setSelectedImage] = useState(null);
  const [enhancementSettings, setEnhancementSettings] = useState({
    brightness: 0,
    contrast: 0,
    gamma: 1,
    denoise: 0,
    sharpness: 0
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnhancement = async () => {
    setIsProcessing(true);
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsProcessing(false);
  };

  const resetSettings = () => {
    setEnhancementSettings({
      brightness: 0,
      contrast: 0,
      gamma: 1,
      denoise: 0,
      sharpness: 0
    });
  };

  const updateSetting = (key, value) => {
    setEnhancementSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-underwater-gradient' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
    }`}>
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
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
            Image Enhancement
          </h1>
          <p className={`${
            theme === 'dark' ? 'text-cyan-200/70' : 'text-slate-600'
          }`}>
            Advanced underwater image processing and enhancement
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Area */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="underwater-card p-6">
              <h2 className={`text-xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
              }`}>Image Upload</h2>
              
              {!selectedImage ? (
                <div className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  theme === 'dark'
                    ? 'border-cyan-500/30 hover:border-cyan-400/50'
                    : 'border-slate-300 hover:border-blue-400'
                }`}>
                  <Upload className={`mx-auto mb-4 ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
                  }`} size={48} />
                  <p className={`mb-4 ${
                    theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-600'
                  }`}>Drop your underwater image here or click to upload</p>
                  <label className="btn-primary cursor-pointer inline-block">
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className={`text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
                      }`}>Original</h3>
                      <img
                        src={selectedImage}
                        alt="Original"
                        className="w-full h-48 object-cover rounded-lg border border-cyan-500/20"
                      />
                    </div>
                    <div>
                      <h3 className={`text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
                      }`}>Enhanced</h3>
                      <div className={`w-full h-48 rounded-lg border border-cyan-500/20 flex items-center justify-center ${
                        theme === 'dark' ? 'bg-deepSea-900/50' : 'bg-slate-100'
                      }`}>
                        {isProcessing ? (
                          <div className="text-center">
                            <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                            <p className={`text-sm ${
                              theme === 'dark' ? 'text-cyan-300' : 'text-slate-600'
                            }`}>Processing...</p>
                          </div>
                        ) : (
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-cyan-400/60' : 'text-slate-500'
                          }`}>Click enhance to process</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="btn-secondary"
                    >
                      Upload New Image
                    </button>
                    <button
                      onClick={handleEnhancement}
                      disabled={isProcessing}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Zap size={16} />
                      <span>Enhance Image</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="underwater-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
                }`}>Enhancement Settings</h2>
                <button
                  onClick={resetSettings}
                  className="btn-secondary text-xs p-2"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
              
              <div className="space-y-4">
                {[
                  { key: 'brightness', label: 'Brightness', min: -50, max: 50, step: 1 },
                  { key: 'contrast', label: 'Contrast', min: -50, max: 50, step: 1 },
                  { key: 'gamma', label: 'Gamma', min: 0.5, max: 2, step: 0.1 },
                  { key: 'denoise', label: 'Denoise', min: 0, max: 100, step: 1 },
                  { key: 'sharpness', label: 'Sharpness', min: 0, max: 100, step: 1 }
                ].map(control => (
                  <div key={control.key}>
                    <div className="flex justify-between mb-2">
                      <label className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
                      }`}>{control.label}</label>
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-cyan-400' : 'text-slate-600'
                      }`}>{enhancementSettings[control.key]}</span>
                    </div>
                    <input
                      type="range"
                      min={control.min}
                      max={control.max}
                      step={control.step}
                      value={enhancementSettings[control.key]}
                      onChange={(e) => updateSetting(control.key, parseFloat(e.target.value))}
                      className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-deepSea-700 slider-thumb-cyan'
                          : 'bg-slate-200 slider-thumb-blue'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="underwater-card p-6">
              <h3 className={`text-lg font-semibold mb-4 ${
                theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
              }`}>Quick Actions</h3>
              
              <div className="space-y-2">
                <button className="w-full btn-secondary text-left">
                  <Eye className="inline mr-2" size={16} />
                  Preview Changes
                </button>
                <button className="w-full btn-secondary text-left">
                  <Download className="inline mr-2" size={16} />
                  Export Enhanced
                </button>
                <button className="w-full btn-secondary text-left">
                  <Sliders className="inline mr-2" size={16} />
                  Auto Enhance
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ImageEnhancementPage;