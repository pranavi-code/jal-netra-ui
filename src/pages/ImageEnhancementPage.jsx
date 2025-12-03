import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Sliders, Eye, RotateCcw, Zap } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useTheme } from '../contexts/ThemeContext';
import {
  Upload,
  RotateCcw,
  Zap,
  Settings,
  Contrast,
  Sun,
  Palette,
  Activity,
  AlertTriangle
} from 'lucide-react';

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

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.bmp', '.tiff']
    },
    multiple: false
  });

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
      theme === 'dark' ? 'bg-transparent' : 'bg-white/10'
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
            Image Enhancement
          </h1>
          <p className={`max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-cyan-200/70' : 'text-slate-600'
          }`}>
            Upload underwater images for advanced AI-powered enhancement and clarity recovery
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mt-16">
          {/* Upload Area */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="underwater-card p-6 opacity-90">
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
            className="underwater-card p-6 opacity-90"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className={`text-xl font-semibold mb-6 ${
              theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
            }`}>Processing Pipeline</h2>

            <div className="space-y-4">
              {processingSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className={`flex items-center space-x-4 p-3 rounded-lg border ${getStepStatus(step.status)}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.3 }}
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    step.status === 'completed'
                      ? 'border-green-400 bg-green-400'
                      : step.status === 'active'
                        ? 'border-cyan-400 bg-cyan-400'
                        : theme === 'dark'
                          ? 'border-slate-600'
                          : 'border-slate-300'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle size={16} className="text-white" />
                    ) : step.status === 'active' ? (
                      <motion.div
                        className="w-3 h-3 bg-white rounded-full"
                        animate={{ scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      />
                    ) : (
                      <div className={`w-3 h-3 rounded-full ${
                        theme === 'dark' ? 'bg-slate-600' : 'bg-slate-300'
                      }`} />
                    )}
                  </div>
                  <span className={`font-medium ${
                    step.status === 'active'
                      ? 'text-cyan-300'
                      : step.status === 'completed'
                        ? 'text-green-300'
                        : theme === 'dark'
                          ? 'text-slate-400'
                          : 'text-slate-600'
                  }`}>
                    {step.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Results Section */}
          {result && (
            <motion.div
              className="underwater-card p-8 lg:col-span-2 opacity-90"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className={`text-xl font-semibold mb-8 ${theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'}`}>Analysis Results</h2>

              <div className="max-w-screen-xl mx-auto">
                {/* Images row - centered, equal size */}
                <div className="flex gap-8 mb-8">
                  <div className="flex-1 flex flex-col items-center">
                    <p className={`text-sm mb-3 text-center ${theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'}`}>Original</p>
                    <div className="w-full rounded-lg overflow-hidden border border-cyan-500/20 h-80 flex items-center justify-center">
                      <img src={result.originalImage} alt="Original" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center">
                    <p className={`text-sm mb-3 text-center ${theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'}`}>Enhanced</p>
                    <div className="w-full rounded-lg overflow-hidden border border-cyan-500/20 h-80 flex items-center justify-center">
                      <img src={result.enhancedImage} alt="Enhanced" className="w-full h-full object-cover" />
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
                </div>

                {/* Metrics row - three equal columns, centered */}
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div className={`p-6 rounded-lg border ${theme === 'dark' ? 'border-slate-700 bg-slate-800/40' : 'border-slate-200 bg-white/60'} flex flex-col items-center justify-center`}>
                    <span className={`text-sm mb-3 ${theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'}`}>SSIM</span>
                    <span className="font-mono text-3xl font-bold text-green-400">{result.metrics.ssim.toFixed(2)}</span>
                  </div>
                  <div className={`p-6 rounded-lg border ${theme === 'dark' ? 'border-slate-700 bg-slate-800/40' : 'border-slate-200 bg-white/60'} flex flex-col items-center justify-center`}>
                    <span className={`text-sm mb-3 ${theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'}`}>UQIM</span>
                    <span className="font-mono text-3xl font-bold text-blue-400">{result.metrics.uqim.toFixed(2)}</span>
                  </div>
                  <div className={`p-6 rounded-lg border ${theme === 'dark' ? 'border-slate-700 bg-slate-800/40' : 'border-slate-200 bg-white/60'} flex flex-col items-center justify-center`}>
                    <span className={`text-sm mb-3 ${theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'}`}>PSNR</span>
                    <span className="font-mono text-3xl font-bold text-yellow-400">{result.metrics.psnr.toFixed(2)} dB</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageEnhancementPage;