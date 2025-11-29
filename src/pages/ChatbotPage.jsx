import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Fish, Anchor } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useTheme } from '../contexts/ThemeContext';

const ChatbotPage = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Welcome to JAL NETRA AI Assistant! I can help you with mission planning, image analysis insights, system guidance, and report generation. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock responses
  const mockResponses = [
    "Based on the current underwater conditions, I recommend adjusting the image enhancement parameters to account for low visibility.",
    "Threat analysis shows a 94% probability of submarine presence in the northeast quadrant. Recommend increased surveillance.",
    "Image quality metrics suggest optimal processing settings: Gamma 1.2, Contrast +15%, Noise reduction: Medium.",
    "Mission parameters updated. Estimated completion time: 2.5 hours. Weather conditions: Favorable for underwater operations.",
    "Analyzing historical data shows similar patterns detected in previous maritime security operations. Correlation: 87%.",
    "System diagnostics complete. All AI modules functioning optimally. Processing speed: 1.8s average.",
  ];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  // Background particle component
  const FloatingParticle = ({ delay = 0 }) => (
    <motion.div
      className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
      initial={{ 
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 10,
        opacity: 0 
      }}
      animate={{
        y: -10,
        x: Math.random() * window.innerWidth,
        opacity: [0, 1, 0]
      }}
      transition={{
        duration: 12 + Math.random() * 6,
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );

  const MessageBubble = ({ message, index }) => {
    const isUser = message.sender === 'user';
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
        className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
      >
        {/* Avatar */}
        <motion.div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser 
              ? 'bg-gradient-to-r from-cyan-600 to-ocean-600' 
              : 'bg-gradient-to-r from-deepSea-600 to-deepSea-700 border border-cyan-500/30'
          }`}
          whileHover={{ scale: 1.1 }}
          animate={{
            boxShadow: isUser 
              ? ['0 0 0 rgba(34, 211, 238, 0)', '0 0 15px rgba(34, 211, 238, 0.3)', '0 0 0 rgba(34, 211, 238, 0)']
              : ['0 0 0 rgba(100, 116, 139, 0)', '0 0 10px rgba(100, 116, 139, 0.3)', '0 0 0 rgba(100, 116, 139, 0)']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {isUser ? (
            <User className="text-white" size={18} />
          ) : (
            <Bot className="text-cyan-300" size={18} />
          )}
        </motion.div>

        {/* Message Content */}
        <motion.div
          className={`max-w-xs lg:max-w-md p-4 rounded-2xl shadow-underwater ${
            isUser
              ? theme === 'dark'
                ? 'bg-gradient-to-r from-cyan-600 to-ocean-600 text-white rounded-tr-sm'
                : 'bg-blue-600 text-white rounded-tr-sm'
              : theme === 'dark'
                ? 'bg-deepSea-800/80 backdrop-blur-underwater border border-cyan-500/20 text-cyan-100 rounded-tl-sm'
                : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-sm'
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <p className="text-sm leading-relaxed">{message.text}</p>
          <p className={`text-xs mt-2 ${
            theme === 'dark'
              ? (isUser ? 'text-cyan-100/70' : 'text-cyan-300/60')
              : (isUser ? 'text-white/80' : 'text-slate-500')
          }`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </motion.div>
      </motion.div>
    );
  };

  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="flex items-start space-x-3"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-deepSea-600 to-deepSea-700 border border-cyan-500/30 flex items-center justify-center">
        <Bot className="text-cyan-300" size={18} />
      </div>
      <div className="bg-deepSea-800/80 backdrop-blur-underwater border border-cyan-500/20 rounded-2xl rounded-tl-sm p-4">
        <div className="flex space-x-1">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className="w-2 h-2 bg-cyan-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                delay: dot * 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      theme === 'dark' ? 'bg-underwater-gradient' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
    }`}>
      <Navigation />
      
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Floating Particles */}
        {[...Array(10)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 1} />
        ))}
        
        {/* Floating decorative elements */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`fish-${i}`}
            className="absolute opacity-5"
            initial={{ 
              x: -100, 
              y: 100 + i * 200,
              rotate: 0 
            }}
            animate={{
              x: window.innerWidth + 100,
              y: 120 + i * 200 + Math.sin(Date.now() * 0.001) * 30,
              rotate: 5
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {i % 2 === 0 ? <Fish size={32} className="text-cyan-400" /> : <Anchor size={28} className="text-ocean-400" />}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={`text-title font-bold mb-4 ${
            theme === 'dark' 
              ? 'text-cyan-100' 
              : 'text-slate-900'
          }`}>
            AI Assistant
          </h1>
          <p className={`${
            theme === 'dark' ? 'text-cyan-200/70' : 'text-slate-600'
          }`}>
            Intelligent support for mission planning and analysis
          </p>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          className="underwater-card h-[600px] flex flex-col"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Chat Header */}
          <div className="border-b border-cyan-500/20 p-4 flex items-center space-x-3">
            <motion.div
              className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-ocean-600 rounded-full flex items-center justify-center shadow-glow"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(34, 211, 238, 0.3)',
                  '0 0 30px rgba(34, 211, 238, 0.5)',
                  '0 0 20px rgba(34, 211, 238, 0.3)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Bot className="text-white" size={24} />
            </motion.div>
            <div>
              <h3 className={`font-semibold ${
                theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
              }`}>JAL NETRA AI</h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-cyan-300/60' : 'text-slate-500'
              }`}>Ready to assist with your mission</p>
            </div>
            <motion.div
              className="ml-auto w-3 h-3 bg-green-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            <AnimatePresence>
              {messages.map((message, index) => (
                <MessageBubble key={message.id} message={message} index={0} />
              ))}
              
              {isTyping && <TypingIndicator />}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <motion.div
            className="border-t border-cyan-500/20 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <motion.input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about mission planning, threat analysis, or system guidance..."
                className="flex-1 input-underwater"
                whileFocus={{ 
                  boxShadow: '0 0 25px rgba(34, 211, 238, 0.3)',
                  borderColor: 'rgba(34, 211, 238, 0.6)' 
                }}
              />
              <motion.button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="btn-primary px-4 py-3"
                whileHover={inputValue.trim() && !isTyping ? { scale: 1.05 } : {}}
                whileTap={inputValue.trim() && !isTyping ? { scale: 0.95 } : {}}
              >
                <Send size={18} />
              </motion.button>
            </form>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {[
            "System Status",
            "Threat Analysis",
            "Mission Plan",
            "Help Guide"
          ].map((action, index) => (
            <motion.button
              key={action}
              className="btn-secondary text-sm"
              onClick={() => setInputValue(action)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
            >
              {action}
            </motion.button>
          ))}
        </motion.div>
      </div>


    </div>
  );
};

export default ChatbotPage;