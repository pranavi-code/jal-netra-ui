import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Zap, CheckCircle } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useTheme } from '../contexts/ThemeContext';

const ImageEnhancementPage = () => {
  const { theme } = useTheme();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState([
    { id: '1', name: 'Uploaded Image', status: 'pending' },
    { id: '2', name: 'Processing', status: 'pending' },
    { id: '3', name: 'Enhancement', status: 'pending' },
    { id: '4', name: 'Completed', status: 'pending' }
  ]);
  const [result, setResult] = useState(null);

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
    if (!selectedImage) return;

    setIsProcessing(true);
    setResult(null);

    // Reset steps
    setProcessingSteps(steps => steps.map(s => ({ ...s, status: 'pending' })));

    const stepsOrder = ['1', '2', '3', '4'];
    for (let i = 0; i < stepsOrder.length; i++) {
      const stepId = stepsOrder[i];

      setProcessingSteps(prevSteps =>
        prevSteps.map(step =>
          step.id === stepId
            ? { ...step, status: 'active' }
            : step.status === 'active'
            ? { ...step, status: 'completed' }
            : step
        )
      );

      // simulate time for each step
      await new Promise(resolve => setTimeout(resolve, 1200));
    }

    // Mark all completed
    setProcessingSteps(prev => prev.map(p => ({ ...p, status: 'completed' })));

    // mock result (no enhancement summary or threats)
    setResult({
      originalImage: selectedImage,
      enhancedImage: selectedImage,
      metrics: {
        ssim: 0.87,
        uqim: 3.42,
        psnr: 24.8
      }
    });

    setIsProcessing(false);
  };

  // Enhancement settings removed per request

  const getStepStatus = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 border-green-400 bg-green-400/10';
      case 'active':
        return 'text-cyan-400 border-cyan-400 bg-cyan-400/10';
      default:
        return theme === 'dark' ? 'text-slate-500 border-slate-600 bg-slate-800/50' : 'text-slate-400 border-slate-300 bg-slate-50';
    }
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="underwater-card p-6">
              <h2 className={`text-xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
              }`}>Image Upload</h2>
              
              <div className="flex-1 flex flex-col justify-center">
                {!selectedImage ? (
                  <div className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors flex flex-col items-center justify-center h-full ${
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
                    
                    <div className="flex justify-between mt-auto">
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
            </div>
          </motion.div>

          {/* Processing Pipeline */}
          <motion.div
            className="underwater-card p-6"
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
              className="underwater-card p-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className={`text-xl font-semibold mb-6 ${theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'}`}>Analysis Results</h2>

              <div className="max-w-5xl mx-auto">
                {/* Images row - centered, equal size */}
                <div className="flex gap-6 mb-6">
                  <div className="flex-1 flex flex-col items-center">
                    <p className={`text-sm mb-2 text-center ${theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'}`}>Original</p>
                    <div className="w-full rounded overflow-hidden border border-cyan-500/20 h-64 flex items-center justify-center">
                      <img src={result.originalImage} alt="Original" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center">
                    <p className={`text-sm mb-2 text-center ${theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'}`}>Enhanced</p>
                    <div className="w-full rounded overflow-hidden border border-cyan-500/20 h-64 flex items-center justify-center">
                      <img src={result.enhancedImage} alt="Enhanced" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                {/* Metrics row - three equal columns, centered */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className={`p-4 rounded border ${theme === 'dark' ? 'border-slate-700 bg-slate-800/40' : 'border-slate-200 bg-white/60'} flex flex-col items-center justify-center`}>
                    <span className={`text-sm mb-2 ${theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'}`}>SSIM</span>
                    <span className="font-mono text-2xl text-green-400">{result.metrics.ssim.toFixed(2)}</span>
                  </div>
                  <div className={`p-4 rounded border ${theme === 'dark' ? 'border-slate-700 bg-slate-800/40' : 'border-slate-200 bg-white/60'} flex flex-col items-center justify-center`}>
                    <span className={`text-sm mb-2 ${theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'}`}>UQIM</span>
                    <span className="font-mono text-2xl text-blue-400">{result.metrics.uqim.toFixed(2)}</span>
                  </div>
                  <div className={`p-4 rounded border ${theme === 'dark' ? 'border-slate-700 bg-slate-800/40' : 'border-slate-200 bg-white/60'} flex flex-col items-center justify-center`}>
                    <span className={`text-sm mb-2 ${theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'}`}>PSNR</span>
                    <span className="font-mono text-2xl text-yellow-400">{result.metrics.psnr.toFixed(2)} dB</span>
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