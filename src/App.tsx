import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Donate from './pages/Donate';
import DemoUsers from './components/DemoUsers';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import CharityDashboard from './pages/dashboards/CharityDashboard';
import VolunteerDashboard from './pages/dashboards/VolunteerDashboard';
import DonorDashboard from './pages/dashboards/DonorDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/donate" element={<Donate />} />
                
                {/* Protected Dashboard Routes */}
                <Route path="/dashboard/admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/charity" element={
                  <ProtectedRoute allowedRoles={['charity']}>
                    <CharityDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/volunteer" element={
                  <ProtectedRoute allowedRoles={['volunteer']}>
                    <VolunteerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/donor" element={
                  <ProtectedRoute allowedRoles={['donor', 'restaurant']}>
                    <DonorDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Default dashboard route - redirects based on role */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Navigate to="/dashboard/donor" replace />
                  </ProtectedRoute>
                } />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <DemoUsers />
            <Toaster position="top-right" />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;