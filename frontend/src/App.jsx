import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './theme/ThemeProvider';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import PageLoader from './components/common/PageLoader';
import './index.css';

// Lazy load pages
const Welcome = lazy(() => import('./pages/Welcome'));
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Ledger = lazy(() => import('./pages/Ledger'));
const Categories = lazy(() => import('./pages/Categories'));
const Reports = lazy(() => import('./pages/Reports'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  useEffect(() => {
    // Ping server to wake it up (Render cold start)
    const wakeUpServer = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';
        await fetch(`${API_URL}/health`);
      } catch (error) {
        console.log('Server wake-up ping failed:', error);
      }
    };

    wakeUpServer();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="ledger" element={<Ledger />} />
                <Route path="categories" element={<Categories />} />
                <Route path="reports" element={<Reports />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* Catch all - redirect to welcome for non-authenticated, dashboard for authenticated */}
              <Route path="*" element={<Navigate to="/welcome" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
