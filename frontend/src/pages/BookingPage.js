import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const BookingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { doctor } = location.state || {};
    const [loading, setLoading] = useState(false);

    if (!doctor) return <div className="p-10 text-center text-gray-500">No doctor selected. Please go back.</div>;

    const handleBooking = async () => {
        setLoading(true);
        try {
            const res = await axios.post('/bookings', {
                doctorId: doctor._id,
                userEmail: user.email
            });
            if (res.data.success) {
                toast.success('🎉 Appointment Confirmed!');
                setTimeout(() => navigate('/'), 2000);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Booking Failed';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const percentage = (doctor.availableSlots / doctor.totalSlots) * 100;

    return (
        <div className="container mx-auto px-6 py-12 flex justify-center">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-5">
                
                {/* Left Side: Doctor Info */}
                <div className="bg-blue-600 text-white p-8 md:col-span-2 flex flex-col justify-center relative overflow-hidden">
                     <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full"></div>
                     <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-white opacity-10 rounded-full"></div>
                     
                     <h3 className="text-blue-200 font-semibold uppercase tracking-wider text-sm mb-2">Appointment With</h3>
                     <h2 className="text-3xl font-bold mb-1">{doctor.doctorName}</h2>
                     <p className="text-blue-100 text-lg mb-6">{doctor.specialization}</p>

                     <div className="space-y-4">
                        <div className="flex items-center bg-blue-700 bg-opacity-30 p-3 rounded-lg">
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <span className="font-medium">{new Date(doctor.startTime).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center bg-blue-700 bg-opacity-30 p-3 rounded-lg">
                             <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span className="font-medium">{new Date(doctor.startTime).toLocaleTimeString()}</span>
                        </div>
                     </div>
                </div>

                {/* Right Side: Confirmation */}
                <div className="p-8 md:col-span-3 bg-white flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirm Details</h2>
                        
                        <div className="mb-8">
                            <label className="block text-gray-500 text-sm font-semibold mb-2">Booking For</label>
                            <div className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mr-3">
                                    {user.name[0]}
                                </div>
                                <div>
                                    <p className="text-gray-900 font-semibold">{user.name}</p>
                                    <p className="text-gray-500 text-sm">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-gray-500 text-sm font-semibold">Seat Availability</label>
                                <span className="text-sm font-medium text-blue-600">{doctor.availableSlots} seats left</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3">
                                <div 
                                    className={`h-3 rounded-full transition-all duration-1000 ${percentage < 20 ? 'bg-red-500' : 'bg-green-500'}`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleBooking} 
                        disabled={loading}
                        className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transform transition hover:scale-[1.02] ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Processing...
                            </span>
                        ) : 'Confirm Appointment'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;