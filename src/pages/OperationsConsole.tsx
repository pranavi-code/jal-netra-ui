import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, CheckCircle, AlertCircle, Activity, TrendingUp } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useTheme } from '../contexts/ThemeContext';

interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'completed';
  duration?: number;
}

interface Metrics {
  ssim: number;
  uqim: number;
  psnr: number;
}

interface ProcessingResult {
  originalImage: string;
  enhancedImage: string;
  threats: string[];
  enhancement: string;
  metrics: Metrics;
}

const OperationsConsole: React.FC = () => {
  const { theme } = useTheme();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { id: '1', name: 'Uploaded Image', status: 'pending' },
    { id: '2', name: 'Processing', status: 'pending' },
    { id: '3', name: 'Enhancement', status: 'pending' },
    { id: '4', name: 'Threat Detection', status: 'pending' },
    { id: '5', name: 'Completed', status: 'pending' },
  ]);
  const [result, setResult] = useState<ProcessingResult | null>(null);

  // Mock processing function
  const processImage = async () => {
    setIsProcessing(true);
    setResult(null);
    
    // Reset steps
    setProcessingSteps(steps => 
      steps.map(step => ({ ...step, status: 'pending' as const }))
    );

    // Simulate processing steps
    for (let i = 0; i < processingSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProcessingSteps(steps => 
        steps.map((step, index) => ({
          ...step,
          status: index <= i ? 'completed' : index === i + 1 ? 'active' : 'pending'
        }))
      );
    }

    // Mock result
    const mockResult: ProcessingResult = {
      originalImage: uploadedImage!,
      enhancedImage: uploadedImage!, // In real app, this would be the processed image
      threats: ['Submarine contact detected at depth 150m, bearing 045°', 'Unidentified metallic object located in sector B-3'],
      enhancement: 'Underwater image processing completed successfully. Enhanced visibility and contrast applied to improve object detection capabilities.',
      metrics: {
        ssim: 0.892,
        uqim: 2.347,
        psnr: 28.45
      }
    };

    setResult(mockResult);
    setIsProcessing(false);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
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
            {/* Upload Area */}
            <div className="underwater-card p-6">
              <h3 className={`text-xl font-semibold mb-4 flex items-center ${
                theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
              }`}>
                <ImageIcon className="mr-2" size={20} />
                Image Upload
              </h3>
              
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? 'border-cyan-400 bg-cyan-400/10'
                    : 'border-cyan-500/30 hover:border-cyan-400/50 hover:bg-cyan-400/5'
                }`}
              >
                <input {...getInputProps()} />
                
                <motion.div
                  animate={{
                    y: isDragActive ? -5 : 0,
                    scale: isDragActive ? 1.05 : 1
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Upload className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  
                  {uploadedImage ? (
                    <div className="space-y-2">
                      <p className={`${theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'}`}>Image uploaded successfully!</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-cyan-300/60' : 'text-slate-500'}`}>Click to change image</p>
                    </div>
                  ) : isDragActive ? (
                    <p className={`${theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'}`}>Drop the image here...</p>
                  ) : (
                    <div className="space-y-2">
                      <p className={`${theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'}`}>Drag & drop your underwater image here</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-cyan-300/60' : 'text-slate-500'}`}>or click to browse files</p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-cyan-400/50' : 'text-slate-400'}`}>Supports: JPEG, PNG, GIF, BMP</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Upload Button */}
            <motion.button
              onClick={processImage}
              disabled={!uploadedImage || isProcessing}
              className="w-full btn-primary text-lg py-4"
              whileHover={uploadedImage && !isProcessing ? { scale: 1.02 } : {}}
              whileTap={uploadedImage && !isProcessing ? { scale: 0.98 } : {}}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Activity className="mr-2" size={20} />
                  Process Image
                </div>
              )}
            </motion.button>
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
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mt-12 space-y-8"
            >
              {/* Image Comparison */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="underwater-card p-6">
                  <h3 className={`text-lg font-semibold mb-4 ${
                    theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
                  }`}>Original Image</h3>
                  <div className="aspect-video bg-deepSea-700 rounded-lg overflow-hidden">
                    <img
                      src={result.originalImage}
                      alt="Original"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="underwater-card p-6">
                  <h3 className={`text-lg font-semibold mb-4 ${
                    theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
                  }`}>Enhanced + Threats Detected</h3>
                  <div className="aspect-video bg-deepSea-700 rounded-lg overflow-hidden relative">
                    <img
                      src={result.enhancedImage}
                      alt="Enhanced"
                      className="w-full h-full object-cover"
                    />
                    {/* Mock bounding boxes for threats */}
                    <div className="absolute top-4 left-4 w-16 h-16 border-2 border-red-400 bg-red-400/20 rounded"></div>
                    <div className="absolute bottom-8 right-8 w-20 h-12 border-2 border-orange-400 bg-orange-400/20 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Analysis Summary */}
              <div className="underwater-card p-6">
                <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                  theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
                }`}>
                  <AlertCircle className="mr-2" size={20} />
                  Analysis Summary
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className={`font-medium mb-2 ${
                      theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
                    }`}>Enhancement Quality</h4>
                    <p className={`${theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-600'}`}>{result.enhancement}</p>
                  </div>
                  <div>
                    <h4 className={`font-medium mb-2 ${
                      theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
                    }`}>Threats Detected</h4>
                    <ul className="space-y-1">
                      {result.threats.map((threat, index) => (
                        <li key={index} className={`flex items-start ${
                          theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-600'
                        }`}>
                          <span className={`w-2 h-2 rounded-full mt-2 mr-2 flex-shrink-0 ${
                            theme === 'dark' ? 'bg-red-400' : 'bg-red-500'
                          }`}></span>
                          {threat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
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