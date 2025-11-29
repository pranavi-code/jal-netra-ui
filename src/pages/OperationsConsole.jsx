import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, CheckCircle, AlertCircle, Activity, TrendingUp } from 'lucide-react';
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
    });

    setIsProcessing(false);
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
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
      theme === 'dark' ? 'bg-underwater-gradient' : 'bg-gradient-to-br from-slate-50 via-white to-blue-50'
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            className="underwater-card p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className={`text-xl font-semibold mb-6 ${
              theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
            }`}>Image Upload</h2>

            <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
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
              <p className={`mb-2 ${
                theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
              }`}>
                {isDragActive ? 'Drop the image here' : 'Drag & drop an underwater image here'}
              </p>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-cyan-400/60' : 'text-slate-500'
              }`}>
                or click to browse files
              </p>
            </div>

            {uploadedImage && (
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-full h-48 object-cover rounded-lg border border-cyan-500/20 mb-4"
                />
                <button
                  onClick={processImage}
                  disabled={isProcessing}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <Activity size={18} />
                  <span>{isProcessing ? 'Processing...' : 'Start Analysis'}</span>
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Processing Steps */}
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
                  transition={{ delay: index * 0.1, duration: 0.4 }}
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
                        transition={{ duration: 1.5, repeat: Infinity }}
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

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Images Comparison */}
                <div>
                  <h3 className={`text-lg font-medium mb-4 ${
                    theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
                  }`}>Image Enhancement</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className={`text-sm mb-2 ${
                        theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'
                      }`}>Original</p>
                      <img
                        src={result.originalImage}
                        alt="Original"
                        className="w-full h-32 object-cover rounded border border-cyan-500/20"
                      />
                    </div>
                    <div>
                      <p className={`text-sm mb-2 ${
                        theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'
                      }`}>Enhanced</p>
                      <img
                        src={result.enhancedImage}
                        alt="Enhanced"
                        className="w-full h-32 object-cover rounded border border-cyan-500/20"
                      />
                    </div>
                  </div>

                  <p className={`text-sm mt-3 ${
                    theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-600'
                  }`}>{result.enhancement}</p>
                </div>

                {/* Metrics and Threats */}
                <div className="space-y-6">
                  {/* Quality Metrics */}
                  <div>
                    <h3 className={`text-lg font-medium mb-4 ${
                      theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
                    }`}>Quality Metrics</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'SSIM', value: result.metrics.ssim, unit: '', color: 'text-green-400' },
                        { label: 'UQIM', value: result.metrics.uqim, unit: '', color: 'text-blue-400' },
                        { label: 'PSNR', value: result.metrics.psnr, unit: 'dB', color: 'text-yellow-400' }
                      ].map((metric) => (
                        <div key={metric.label} className="flex justify-between items-center">
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'
                          }`}>{metric.label}</span>
                          <span className={`font-mono ${metric.color}`}>
                            {metric.value.toFixed(2)}{metric.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Threats */}
                  <div>
                    <h3 className={`text-lg font-medium mb-4 ${
                      theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
                    }`}>Threats Detected</h3>
                    <div className="space-y-2">
                      {result.threats.map((threat, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-red-300' : 'text-red-600'
                          }`}>{threat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OperationsConsole;