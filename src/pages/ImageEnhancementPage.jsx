import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Zap, CheckCircle } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useTheme } from '../contexts/ThemeContext';

const ImageEnhancementPage = () => {
  const { theme } = useTheme();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
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
      setSelectedFile(file); // Save the actual file for processing
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

    // Call backend
    let enhancedData = null;
    try {
      const { enhanceImage } = await import('../services/enhancementApi');
      enhancedData = await enhanceImage(selectedFile); // Use the actual file
    } catch (e) {
      console.error('Enhancement failed', e);
    }

    // Mark all completed
    setProcessingSteps(prev => prev.map(p => ({ ...p, status: 'completed' })));

    // Set result (fallback to original if enhancement failed)
    setResult({
      originalImage: selectedImage,
      enhancedImage: (enhancedData && enhancedData.image) || selectedImage,
      metrics: {
        ssim: enhancedData?.metrics?.ssim ?? 0.0,
        uqim: enhancedData?.metrics?.uqi ?? 0.0,
        psnr: enhancedData?.metrics?.psnr ?? 0.0
      },
      filePath: enhancedData?.file
    });

    setIsProcessing(false);

    // Scroll to results section after processing is complete
    setTimeout(() => {
      const resultsElement = document.getElementById('enhancement-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 500);
  };

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
      theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
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

        <div className="grid lg:grid-cols-2 gap-8 mt-16">
          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="underwater-card p-6 opacity-90">
              <h2 className={`text-xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
              }`}>Image Upload</h2>
              
              <div className="flex-1 flex flex-col justify-center h-full">
                <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[300px] ${
                  theme === 'dark'
                    ? 'border-cyan-500/30 hover:border-cyan-400/50'
                    : 'border-slate-300 hover:border-blue-400'
                }`} onClick={() => document.querySelector('input[type="file"]').click()}>
                  <Upload className={`mx-auto mb-3 ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
                  }`} size={32} />
                  <p className={`mb-2 text-sm ${
                    theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
                  }`}>
                    Drag & drop an underwater image here
                  </p>
                  <p className={`text-xs mb-3 ${
                    theme === 'dark' ? 'text-cyan-400/60' : 'text-slate-500'
                  }`}>
                    or
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.querySelector('input[type="file"]').click();
                    }}
                    className="btn-primary mb-2 text-sm py-2 px-4"
                  >
                    Choose File
                  </button>
                  {selectedImage && (
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`}>
                      ✓ Image uploaded successfully
                    </p>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                
                {selectedImage && (
                  <div className="mt-4">
                    <button
                      onClick={handleEnhancement}
                      disabled={isProcessing}
                      className="btn-primary w-full text-sm py-2"
                    >
                      Enhance Image
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Processing Pipeline */}
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
              id="enhancement-results"
              className="underwater-card p-8 lg:col-span-2 opacity-90"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'}`}>Analysis Results</h2>
                <a
                  href={result.enhancedImage}
                  download="enhanced-image.jpg"
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  <span>Download Enhanced Image</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline strokeLinecap="round" strokeLinejoin="round" points="7,10 12,15 17,10" />
                    <line strokeLinecap="round" x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </a>
              </div>

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