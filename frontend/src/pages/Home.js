import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [uniqueDoctors, setUniqueDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                // Fetch all individual slots
                const res = await axios.get('/doctors');
                const allSlots = res.data.data;

                // Group by Doctor Name to create a unique list of doctors
                const uniqueMap = new Map();
                allSlots.forEach(slot => {
                    if (!uniqueMap.has(slot.doctorName)) {
                        uniqueMap.set(slot.doctorName, slot);
                    }
                });
                
                setUniqueDoctors(Array.from(uniqueMap.values()));
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    // Helper to generate initials (e.g., "Dr. House" -> "DH")
    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                <p className="text-gray-500 font-medium">Loading Specialists...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-700 to-teal-500 py-20 px-6 text-center text-white overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-sm">
                        Find Your Specialist
                    </h1>
                    <p className="text-blue-50 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                        Book confirmed appointments with top-rated doctors near you. No waiting lines, just instant booking.
                    </p>
                </div>
            </div>

            {/* Doctor Grid */}
            <div className="container mx-auto px-6 -mt-12 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {uniqueDoctors.map((doc) => (
                        <div key={doc._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-8 flex flex-col items-center text-center border border-gray-100">
                            
                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center font-bold text-3xl mb-6 shadow-inner border border-blue-200">
                                {getInitials(doc.doctorName)}
                            </div>
                            
                            {/* Info */}
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">{doc.doctorName}</h2>
                            <p className="text-blue-500 font-semibold bg-blue-50 px-3 py-1 rounded-full text-sm mb-6">
                                {doc.specialization}
                            </p>
                            
                            {/* Action Button */}
                            <div className="mt-auto w-full">
                                <Link 
                                    to={`/booking/${doc._id}`} 
                                    state={{ doctorName: doc.doctorName, specialization: doc.specialization }}
                                    className="block w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg"
                                >
                                    View Availability
                                </Link>
                            </div>

                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {uniqueDoctors.length === 0 && (
                    <div className="text-center mt-20 p-10 bg-white rounded-xl shadow-sm border border-gray-100 max-w-md mx-auto">
                        <p className="text-gray-500 text-lg">No doctors available at the moment.</p>
                        <p className="text-gray-400 text-sm mt-2">Please check back later.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;