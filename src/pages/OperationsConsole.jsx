import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle, Activity } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useTheme } from '../contexts/ThemeContext';

const OperationsConsole = () => {
  const { theme } = useTheme();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState([
    { id: '1', name: 'Uploaded Image', status: 'pending' },
    { id: '2', name: 'Processing', status: 'pending' },
    { id: '3', name: 'Enhancement', status: 'pending' },
    { id: '4', name: 'Threat Detection', status: 'pending' },
    { id: '5', name: 'Completed', status: 'pending' },
  ]);
  const [result, setResult] = useState(null);

  // Mock processing function
  const processImage = async () => {
    setIsProcessing(true);
    setResult(null);
    
    // Reset steps
    setProcessingSteps(steps => 
      steps.map(step => ({ ...step, status: 'pending' }))
    );

    const steps = ['1', '2', '3', '4', '5'];
    
    for (let i = 0; i < steps.length; i++) {
      const stepId = steps[i];
      
      setProcessingSteps(prevSteps =>
        prevSteps.map(step =>
          step.id === stepId
            ? { ...step, status: 'active' }
            : step.status === 'active'
            ? { ...step, status: 'completed' }
            : step
        )
      );

      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Final completion
    setProcessingSteps(prevSteps =>
      prevSteps.map(step => ({ ...step, status: 'completed' }))
    );

    // Set mock result (lower quality metrics to indicate poorer quality)
    setResult({
      isVideo,
      originalImage: uploadedImage,
      enhancedImage: uploadedImage,
      metrics: {
        ssim: 0.45,
        uqim: 1.12,
        psnr: 14.32
      }
    });

    setIsProcessing(false);

    // Scroll to results section after processing is complete
    setTimeout(() => {
      const resultsElement = document.getElementById('results-section');
      if (resultsElement) {
        resultsElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 500);
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.type && file.type.startsWith('video')) {
        const url = URL.createObjectURL(file);
        setUploadedImage(url);
        setIsVideo(true);
        setResult(null);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          setUploadedImage(event.target.result);
          setResult(null);
        };
        reader.readAsDataURL(file);
        setIsVideo(false);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      'image/*': [],
      'video/*': [],
      '.xtf': [],
      '.sdf': [],
      '.s7k': [],
      '.raw': [],
      '.kcd': []
    },
    multiple: false
  });

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
            Operations Console
          </h1>
          <p className={`${
            theme === 'dark' ? 'text-cyan-200/70' : 'text-slate-600'
          }`}>
            Complete underwater image analysis workflow
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mt-16">
          {/* Upload Section */}
          <motion.div
            className="underwater-card p-6 opacity-90"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className={`text-xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
            }`}>Image Upload</h2>

            <div className="flex-1 flex flex-col justify-center">
              <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer flex flex-col items-center justify-center ${
                isDragActive
                  ? theme === 'dark'
                    ? 'border-cyan-400 bg-cyan-400/10'
                    : 'border-blue-400 bg-blue-50'
                  : theme === 'dark'
                    ? 'border-cyan-500/30 hover:border-cyan-400/50'
                    : 'border-slate-300 hover:border-blue-400'
              }`}>
                <input {...getInputProps()} />
                <Upload className={`mx-auto mb-3 ${
                  theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
                }`} size={32} />
                <p className={`mb-2 text-sm ${
                  theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
                }`}>
                  {isDragActive ? 'Drop the file here' : 'Drag & drop an underwater image, video, or sonar file here'}
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
                {uploadedImage && (
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`}>
                    ✓ Image uploaded successfully
                  </p>
                )}
              </div>
              
              {uploadedImage && (
                <div className="mt-4">
                  <button
                    onClick={processImage}
                    disabled={isProcessing}
                    className="btn-primary w-full text-sm py-2"
                  >
                    Start Analysis
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Processing Steps */}
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
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    step.status === 'completed'
                      ? 'border-green-400 bg-green-400'
                      : step.status === 'active'
                        ? 'border-cyan-400 bg-cyan-400'
                        : theme === 'dark'
                          ? 'border-slate-600'
                          : 'border-slate-300'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle size={12} className="text-white" />
                    ) : step.status === 'active' ? (
                      <motion.div
                        className="w-2 h-2 bg-white rounded-full"
                        animate={{ scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    ) : (
                      <div className={`w-2 h-2 rounded-full ${
                        theme === 'dark' ? 'bg-slate-600' : 'bg-slate-300'
                      }`} />
                    )}
                  </div>
                  <span className={`font-medium text-sm ${
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
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              id="results-section"
              className="underwater-card p-6 mt-8"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'}`}>Analysis Results</h2>
                <a
                  href={result.isVideo ? result.enhancedImage : result.enhancedImage}
                  download={result.isVideo ? 'enhanced-video.mp4' : 'enhanced-image.jpg'}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  <span>{result.isVideo ? 'Download Enhanced Video' : 'Download Enhanced Image'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline strokeLinecap="round" strokeLinejoin="round" points="7,10 12,15 17,10" />
                    <line strokeLinecap="round" x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </a>
              </div>

              {/* Images Comparison - Full Width */}
              <div className="mb-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <p className={`text-sm mb-2 ${
                      theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'
                    }`}>Original</p>
                    <div className="w-full h-64 rounded-lg overflow-hidden border border-cyan-500/20">
                      {result.isVideo ? (
                        <video src={result.originalImage} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                      ) : (
                        <img
                          src={result.originalImage}
                          alt="Original"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className={`text-sm mb-2 ${
                      theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'
                    }`}>Enhanced</p>
                    <div className="w-full h-64 rounded-lg overflow-hidden border border-cyan-500/20">
                      {result.isVideo ? (
                        <video src={result.enhancedImage} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                      ) : (
                        <img
                          src={result.enhancedImage}
                          alt="Enhanced"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics Cards - Three Columns */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'SSIM', value: result.metrics.ssim, unit: '', color: 'text-green-400' },
                  { label: 'UQIM', value: result.metrics.uqim, unit: '', color: 'text-blue-400' },
                  { label: 'PSNR', value: result.metrics.psnr, unit: 'dB', color: 'text-yellow-400' }
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className={`p-6 rounded-lg border text-center ${
                      theme === 'dark'
                        ? 'border-slate-700 bg-slate-800/40'
                        : 'border-slate-200 bg-white/60'
                    }`}
                  >
                    <p className={`text-sm mb-2 ${
                      theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'
                    }`}>{metric.label}</p>
                    <p className={`text-2xl font-mono font-bold ${metric.color}`}>
                      {metric.value.toFixed(2)}{metric.unit}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OperationsConsole;