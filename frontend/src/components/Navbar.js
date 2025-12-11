import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user && location.pathname === '/login') return null; // Hide Navbar on Login page

    return (
        <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-teal-400 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">H</div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-500">
                        HealthBooker
                    </span>
                </Link>
                
                {/* Navigation Links */}
                <div className="flex items-center space-x-6">
                    {user ? (
                        <>
                            {/* Role Based Link */}
                            {user.role === 'admin' ? (
                                <Link to="/admin" className="text-gray-600 hover:text-blue-600 font-medium">Dashboard</Link>
                            ) : (
                                <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">Find Doctors</Link>
                            )}

                            {/* User Profile & Logout */}
                            <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-bold text-gray-800">{user.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="text-sm text-red-500 hover:bg-red-50 px-3 py-1 rounded-md transition"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <Link to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;