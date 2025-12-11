import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { toast } from 'react-toastify';

const BookingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { doctor } = location.state || {}; // Data passed from Home
    
    // Form State
    const [patientData, setPatientData] = useState({
        name: '',
        email: '',
        age: '',
        gender: 'Select Gender',
        reason: ''
    });
    
    const [loading, setLoading] = useState(false);

    if (!doctor) return <div className="p-10 text-center text-gray-500">No doctor selected. Please go back.</div>;

    const handleInputChange = (e) => {
        setPatientData({ ...patientData, [e.target.name]: e.target.value });
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        
        // Basic Validation
        if (!patientData.name || !patientData.email || !patientData.age || patientData.gender === 'Select Gender') {
            return toast.warn('Please fill in all required fields.');
        }

        setLoading(true);
        try {
            const res = await axios.post('/bookings', {
                doctorId: doctor._id,
                patientName: patientData.name,
                patientEmail: patientData.email,
                patientAge: patientData.age,
                patientGender: patientData.gender,
                reasonForVisit: patientData.reason
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
        <div className="container mx-auto px-6 py-10 flex justify-center">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full grid grid-cols-1 md:grid-cols-2">
                
                {/* Left Side: Doctor & Slot Info */}
                <div className="bg-blue-600 p-8 text-white flex flex-col justify-between relative overflow-hidden">
                     <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
                     <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>

                     <div>
                        <h3 className="text-blue-200 font-semibold uppercase tracking-wider text-sm mb-2">Selected Specialist</h3>
                        <h2 className="text-3xl font-bold mb-1">{doctor.doctorName}</h2>
                        <p className="text-blue-100 text-lg mb-6">{doctor.specialization}</p>

                        <div className="space-y-4">
                            <div className="flex items-center bg-blue-700 bg-opacity-40 p-3 rounded-lg border border-blue-500">
                                <svg className="w-5 h-5 mr-3 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                <div>
                                    <p className="text-xs text-blue-200 uppercase">Date</p>
                                    <p className="font-semibold">{new Date(doctor.startTime).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center bg-blue-700 bg-opacity-40 p-3 rounded-lg border border-blue-500">
                                <svg className="w-5 h-5 mr-3 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <div>
                                    <p className="text-xs text-blue-200 uppercase">Time Slot</p>
                                    <p className="font-semibold">{new Date(doctor.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                </div>
                            </div>
                        </div>
                     </div>

                     <div className="mt-8">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-medium text-blue-100">Live Availability</span>
                            <span className="text-sm font-bold text-white">{doctor.availableSlots} seats left</span>
                        </div>
                        <div className="w-full bg-blue-800 rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full transition-all duration-1000 ${percentage < 20 ? 'bg-red-400' : 'bg-green-400'}`}
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                     </div>
                </div>

                {/* Right Side: Patient Form */}
                <div className="p-8 bg-gray-50">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Patient Details</h2>
                    
                    <form onSubmit={handleBooking} className="space-y-4">
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-1">Full Name</label>
                            <input 
                                type="text" name="name" 
                                placeholder="John Doe"
                                value={patientData.name} onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 text-sm font-semibold mb-1">Age</label>
                                <input 
                                    type="number" name="age" 
                                    placeholder="25"
                                    value={patientData.age} onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 text-sm font-semibold mb-1">Gender</label>
                                <select 
                                    name="gender" 
                                    value={patientData.gender} onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                >
                                    <option disabled>Select Gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-1">Email Address</label>
                            <input 
                                type="email" name="email" 
                                placeholder="john@example.com"
                                value={patientData.email} onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-1">Reason for Visit (Optional)</label>
                            <textarea 
                                name="reason" 
                                rows="2"
                                placeholder="Briefly describe your symptoms..."
                                value={patientData.reason} onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            ></textarea>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className={`w-full mt-4 py-3 rounded-xl text-white font-bold text-lg shadow-lg transform transition hover:scale-[1.02] ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}`}
                        >
                            {loading ? 'Processing Booking...' : 'Confirm Appointment'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;