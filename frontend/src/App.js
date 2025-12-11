import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import BookingPage from './pages/BookingPage';
import Login from './pages/Login';

// Protected Route Component
const PrivateRoute = ({ children, requiredRole }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" />; // Redirect unauthorized users home
    }

    return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Public/User Route */}
              <Route path="/" element={
                  <PrivateRoute requiredRole="user">
                      <Home />
                  </PrivateRoute>
              } />

              {/* User Only Route */}
              <Route path="/booking/:id" element={
                  <PrivateRoute requiredRole="user">
                      <BookingPage />
                  </PrivateRoute>
              } />

              {/* Admin Only Route */}
              <Route path="/admin" element={
                  <PrivateRoute requiredRole="admin">
                      <AdminDashboard />
                  </PrivateRoute>
              } />
            </Routes>
          </div>
          <ToastContainer position="bottom-right" theme="colored" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;