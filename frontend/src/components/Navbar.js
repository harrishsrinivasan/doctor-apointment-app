import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    // Helper to check active link
    const isActive = (path) => location.pathname === path ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50";

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-teal-400 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition">
                        H
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-500">
                        HealthBooker
                    </span>
                </Link>
                
                <div className="flex space-x-2">
                    <Link to="/" className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${isActive('/')}`}>
                        Find Doctors
                    </Link>
                    <Link to="/admin" className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${isActive('/admin')}`}>
                        Admin Panel
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;