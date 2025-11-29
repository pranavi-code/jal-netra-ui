import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import OperationsConsole from './pages/OperationsConsole';
import ChatbotPage from './pages/ChatbotPage';
import LogsPage from './pages/LogsPage';
import DockerPage from './pages/DockerPage';
import ImageEnhancementPage from './pages/ImageEnhancementPage';
import UpdateProfilePage from './pages/UpdateProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="App">
          <Routes>
              {/* Landing/Auth Page */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Main Application Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/operations" element={<OperationsConsole />} />
              <Route path="/enhancement" element={<ImageEnhancementPage />} />
              <Route path="/chatbot" element={<ChatbotPage />} />
              <Route path="/logs" element={<LogsPage />} />
              <Route path="/docker" element={<DockerPage />} />
              
              {/* Settings Routes */}
              <Route path="/profile" element={<UpdateProfilePage />} />
              <Route path="/change-password" element={<ChangePasswordPage />} />
              
              {/* Redirect any unknown routes to landing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
