import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [selectedRole, setSelectedRole] = useState(null);
    const [inputValue, setInputValue] = useState('');

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setInputValue('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedRole === 'user') {
            if (!inputValue.trim()) {
                toast.error("Please enter your name.");
                return;
            }
            login('user', inputValue); 
            navigate('/');
        } 
        else if (selectedRole === 'admin') {
            if (!inputValue.trim()) {
                toast.error("Please enter your email.");
                return;
            }
            
            const adminDomain = "@hospitaladmin.com";
            if (!inputValue.toLowerCase().endsWith(adminDomain)) {
                toast.error("Login Error: Email must end with @hospitaladmin.com");
                return;
            }

            const adminName = inputValue.split('@')[0];
            login('admin', `Admin ${adminName}`); 
            navigate('/admin');
        }
    };

    return (
        // BACKGROUND IMAGE SECTION
        <div 
            className="min-h-screen flex flex-col items-center justify-center p-6 relative bg-cover bg-center"
            style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop')" 
            }}
        >
            {/* Dark Overlay for better contrast */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

            {/* Content Container (z-10 ensures it sits on top of the overlay) */}
            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
                
                {/* --- LOGO SECTION --- */}
                <div className={`flex flex-col items-center mb-10 transition-all duration-300 ${selectedRole ? 'blur-sm scale-95' : ''}`}>
                    <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-teal-400 rounded-2xl flex items-center justify-center text-white font-bold text-4xl shadow-2xl mb-4 border-2 border-white/20">
                        H
                    </div>
                    <h1 className="text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
                        HealthBooker
                    </h1>
                    <p className="text-blue-100 mt-2 text-lg font-medium drop-shadow-md">Your Trusted Medical Booking Partner</p>
                </div>

                {/* SELECTION CARDS */}
                <div className={`w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-300 ${selectedRole ? 'blur-sm scale-95 pointer-events-none' : ''}`}>
                    
                    {/* Left: User Section */}
                    <div className="md:w-1/2 p-12 flex flex-col justify-center items-center hover:bg-blue-50 transition cursor-pointer group border-b md:border-b-0 md:border-r border-gray-100"
                         onClick={() => handleRoleSelect('user')}>
                        <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition duration-300 shadow-md">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">User</h2>
                        <p className="text-gray-500 text-center mb-6">Book appointments & view doctors.</p>
                        <button className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-blue-700 transform transition">
                            Login as User
                        </button>
                    </div>

                    {/* Right: Admin Section */}
                    <div className="md:w-1/2 p-12 flex flex-col justify-center items-center hover:bg-gray-50 transition cursor-pointer group"
                         onClick={() => handleRoleSelect('admin')}>
                        <div className="w-24 h-24 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-gray-800 group-hover:text-white transition duration-300 shadow-md">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin</h2>
                        <p className="text-gray-500 text-center mb-6">Manage hospital slots & schedules.</p>
                        <button className="px-8 py-3 bg-gray-800 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-gray-900 transform transition">
                            Login as Admin
                        </button>
                    </div>
                </div>

                {/* INPUT MODAL */}
                {selectedRole && (
                    <div className="absolute inset-0 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full animate-fade-in border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                {selectedRole === 'user' ? 'Welcome, User!' : 'Admin Verification'}
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {selectedRole === 'user' 
                                    ? 'Please enter your name to continue.' 
                                    : 'Enter your registered hospital email address.'}
                            </p>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        {selectedRole === 'user' ? 'User Name' : 'Hospital Email (@hospitaladmin.com)'}
                                    </label>
                                    <input 
                                        type={selectedRole === 'user' ? "text" : "email"}
                                        required
                                        autoFocus
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                        placeholder={selectedRole === 'user' ? "John Doe" : "admin@hospitaladmin.com"}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setSelectedRole(null)}
                                        className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold transition"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className={`flex-1 px-4 py-3 text-white rounded-lg font-bold shadow-lg transition transform hover:scale-[1.02] ${
                                            selectedRole === 'user' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-900'
                                        }`}
                                    >
                                        Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;