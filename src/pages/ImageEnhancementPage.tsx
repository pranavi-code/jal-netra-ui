import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
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

interface EnhancementSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  sharpness: number;
  noiseReduction: number;
  underwaterCorrection: boolean;
}

interface ProcessingResult {
  originalImage: string;
  enhancedImage: string;
  settings: EnhancementSettings;
  metrics: {
    ssim: number;
    uqim: number;
    psnr: number;
  };
}

const ImageEnhancementPage: React.FC = () => {
  const { theme } = useTheme();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [settings, setSettings] = useState<EnhancementSettings>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpness: 50,
    noiseReduction: 30,
    underwaterCorrection: true
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
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

  const handleEnhance = async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockResult: ProcessingResult = {
      originalImage: uploadedImage,
      enhancedImage: uploadedImage, // In real app, this would be the processed image
      settings,
      metrics: {
        ssim: 0.892,
        uqim: 2.347,
        psnr: 28.45
      }
    };

    setResult(mockResult);
    setIsProcessing(false);
  };

  const resetSettings = () => {
    setSettings({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      sharpness: 50,
      noiseReduction: 30,
      underwaterCorrection: true
    });
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' 
        ? 'bg-underwater-gradient' 
        : 'bg-gradient-to-br from-slate-50 via-white to-blue-50'
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload & Controls */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Upload Area */}
            <div className="underwater-card p-6">
              <h3 className={`text-xl font-semibold mb-4 flex items-center ${
                theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
              }`}>
                <Upload className="mr-2" size={20} />
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
                  <Upload className={`w-12 h-12 mx-auto mb-4 ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-blue-500'
                  }`} />
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
                      <p className={`text-xs ${theme === 'dark' ? 'text-cyan-400/50' : 'text-slate-400'}`}>Supports: JPEG, PNG, BMP, TIFF</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
            {/* Upload Button */}
            <motion.button
              onClick={handleEnhance}
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
                  Enhance Image
                </div>
              )}
            </motion.button>
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
                  }`}>Enhanced Image</h3>
                  <div className="aspect-video bg-deepSea-700 rounded-lg overflow-hidden">
                    <img
                      src={result.enhancedImage}
                      alt="Enhanced"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              {/* Quality Metrics Section */}
              <div className="grid md:grid-cols-3 gap-6">
                {result && result.metrics && [
                  { name: 'SSIM', value: result.metrics.ssim.toFixed(3), description: 'Structural Similarity' },
                  { name: 'UQIM', value: result.metrics.uqim.toFixed(3), description: 'Underwater Quality' },
                  { name: 'PSNR', value: `${result.metrics.psnr.toFixed(1)} dB`, description: 'Peak Signal-to-Noise' }
                ].map((metric, index) => (
                  <motion.div
                    key={metric.name}
                    className={`underwater-card p-6 text-center ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-br from-deepSea-800/50 to-deepSea-700/30' 
                        : 'bg-gradient-to-br from-white to-slate-50'
                    }`}
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
                )) || null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ImageEnhancementPage;