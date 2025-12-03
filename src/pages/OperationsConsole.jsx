import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle, Activity } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useTheme } from '../contexts/ThemeContext';

const OperationsConsole = () => {
  const { theme } = useTheme();
  const [uploadedImage, setUploadedImage] = useState(null);
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

    // Simulate processing steps
    for (let i = 0; i < processingSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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

    // Set mock result
    setResult({
      originalImage: uploadedImage,
      enhancedImage: uploadedImage,
      threats: ['Submarine contact detected at bearing 045°', 'Unidentified metallic object at depth 120m'],
      enhancement: 'Brightness +15%, Contrast +20%, Gamma 1.2, Noise Reduction Applied',
      metrics: {
        ssim: 0.87,
        uqim: 3.42,
        psnr: 24.8
      }
    };

    setResult(mockResult);
    setIsProcessing(false);
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp']
    },
    multiple: false
  });

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
            AquaVision
          </h1>
          <p className={`max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-cyan-200/70' : 'text-slate-600'
          }`}>
            Upload underwater images for AI-powered enhancement and threat detection analysis
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Controls */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className={`text-xl font-semibold mb-6 ${
              theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
            }`}>Image Upload</h2>

            <div className="flex-1 flex flex-col justify-center">
              {!uploadedImage ? (
                <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer flex flex-col items-center justify-center h-full ${
                  isDragActive
                    ? theme === 'dark'
                      ? 'border-cyan-400 bg-cyan-400/10'
                      : 'border-blue-400 bg-blue-50'
                    : theme === 'dark'
                      ? 'border-cyan-500/30 hover:border-cyan-400/50'
                      : 'border-slate-300 hover:border-blue-400'
                }`}>
                  <input {...getInputProps()} />
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
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setUploadedImage(event.target.result);
                            setResult(null);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
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
                        src={uploadedImage}
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
                          }`}>Click process to enhance</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="btn-secondary"
                    >
                      Upload New Image
                    </button>
                    <button
                      onClick={processImage}
                      disabled={isProcessing}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Activity size={16} />
                      <span>Start Analysis</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Processing Pipeline */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="underwater-card p-6">
              <h3 className={`text-xl font-semibold mb-6 flex items-center ${
                theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
              }`}>
                <TrendingUp className="mr-2" size={20} />
                Processing Pipeline
              </h3>
              
              <div className="space-y-4">
                {processingSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                  >
                    {/* Step Number/Icon */}
                    <motion.div
                      className={`pipeline-step ${step.status === 'active' ? 'active' : step.status === 'completed' ? 'completed' : ''}`}
                      animate={{
                        scale: step.status === 'active' ? [1, 1.1, 1] : 1,
                      }}
                      transition={{
                        duration: 1,
                        repeat: step.status === 'active' ? Infinity : 0
                      }}
                    >
                      {step.status === 'completed' ? (
                        <CheckCircle size={20} />
                      ) : step.status === 'active' ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Activity size={20} />
                        </motion.div>
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </motion.div>

                    {/* Step Name */}
                    <div className="flex-1">
                      <p className={`font-medium ${
                        step.status === 'completed' 
                          ? theme === 'dark' ? 'text-green-300' : 'text-green-700'
                          : step.status === 'active' 
                            ? theme === 'dark' ? 'text-cyan-300' : 'text-blue-600'
                            : theme === 'dark' ? 'text-cyan-400/60' : 'text-slate-400'
                      }`}>
                        {step.name}
                      </p>
                      {step.status === 'active' && (
                        <motion.div
                          className="w-full bg-deepSea-700 rounded-full h-1 mt-2"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 1.5 }}
                        >
                          <div className="bg-cyan-400 h-full rounded-full"></div>
                        </motion.div>
                      )}
                    </div>

                    {/* Progress Line */}
                    {index < processingSteps.length - 1 && (
                      <motion.div
                        className="absolute left-6 mt-16 w-0.5 h-8 bg-deepSea-600"
                        animate={{
                          backgroundColor: step.status === 'completed' ? '#22d3ee' : '#475569'
                        }}
                        transition={{ duration: 0.5 }}
                        style={{ marginLeft: '1.5rem' }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              className="underwater-card p-6 mt-8"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={`text-xl font-semibold mb-6 ${
                theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
              }`}>Analysis Results</h2>

              {/* Images Comparison - Full Width */}
              <div className="mb-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <p className={`text-sm mb-2 ${
                      theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'
                    }`}>Original</p>
                    <div className="w-full h-64 rounded-lg overflow-hidden border border-cyan-500/20">
                      <img
                        src={result.originalImage}
                        alt="Original"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className={`text-sm mb-2 ${
                      theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'
                    }`}>Enhanced</p>
                    <div className="w-full h-64 rounded-lg overflow-hidden border border-cyan-500/20">
                      <img
                        src={result.enhancedImage}
                        alt="Enhanced"
                        className="w-full h-full object-cover"
                      />
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

              {/* Metrics Section */}
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { name: 'SSIM', value: result.metrics.ssim.toFixed(3), description: 'Structural Similarity' },
                  { name: 'UQIM', value: result.metrics.uqim.toFixed(3), description: 'Underwater Quality' },
                  { name: 'PSNR', value: `${result.metrics.psnr.toFixed(1)} dB`, description: 'Peak Signal-to-Noise' }
                ].map((metric, index) => (
                  <motion.div
                    key={metric.name}
                    className="metric-card"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -5 }}
                  >
          
                    <div className={`text-3xl font-bold mb-1 ${
                      theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
                    }`}>{metric.name}</div>
                    <div className={`text-lg font-semibold mb-1 ${
                      theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
                    }`}>{metric.value}</div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-cyan-300/60' : 'text-slate-500'
                    }`}>{metric.description}</div>
                  </motion.div>
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