import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await axios.get('/doctors');
                setDoctors(res.data.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    // Function to generate initials for avatar
    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-blue-600 pb-32 pt-12 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')]"></div>
                <div className="container mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
                        Your Health, Our Priority
                    </h1>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8 animate-fade-in">
                        Book appointments with top specialists seamlessly. Real-time availability, instant confirmation.
                    </p>
                </div>
            </div>

            {/* Content Section - Overlapping the Hero */}
            <div className="container mx-auto px-6 -mt-20 relative z-20 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {doctors.map((doc, index) => (
                        <div key={doc._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col">
                            {/* Card Header with Color Strip */}
                            <div className={`h-2 w-full ${doc.availableSlots > 0 ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-red-400'}`}></div>
                            
                            <div className="p-6 flex-grow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl border-2 border-blue-100">
                                            {getInitials(doc.doctorName)}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-800 leading-tight">{doc.doctorName}</h2>
                                            <span className="text-sm font-medium text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">
                                                {doc.specialization}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mt-4">
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        {new Date(doc.startTime).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        {new Date(doc.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>

                            {/* Footer / Action Area */}
                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                <div className="text-sm">
                                    <span className={`font-bold ${doc.availableSlots > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {doc.availableSlots > 0 ? doc.availableSlots : '0'} 
                                    </span>
                                    <span className="text-gray-500 ml-1">slots left</span>
                                </div>
                                
                                {doc.availableSlots > 0 ? (
                                    <Link 
                                        to={`/booking/${doc._id}`} state={{ doctor: doc }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
                                    >
                                        Book Now
                                    </Link>
                                ) : (
                                    <button disabled className="bg-gray-300 text-gray-500 text-sm font-medium px-5 py-2 rounded-lg cursor-not-allowed">
                                        Full
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;