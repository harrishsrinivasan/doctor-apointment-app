import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [uniqueDoctors, setUniqueDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await axios.get('/doctors');
                const allSlots = res.data.data;

                // Group by Doctor Name to show unique cards
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

    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-teal-500 py-16 px-6 text-center text-white">
                <h1 className="text-4xl font-bold mb-4">Find Your Specialist</h1>
                <p className="text-blue-100 text-lg">Book appointments with top doctors near you.</p>
            </div>

            {/* Doctor Grid */}
            <div className="container mx-auto px-6 -mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {uniqueDoctors.map((doc) => (
                        <div key={doc._id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition p-6 flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl mb-4">
                                {getInitials(doc.doctorName)}
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">{doc.doctorName}</h2>
                            <p className="text-blue-500 font-medium mb-4">{doc.specialization}</p>
                            
                            <Link 
                                to={`/booking/${doc._id}`} // We use ID just for routing, but we will fetch by Name
                                state={{ doctorName: doc.doctorName, specialization: doc.specialization }}
                                className="mt-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium shadow transition"
                            >
                                Book Appointment
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;