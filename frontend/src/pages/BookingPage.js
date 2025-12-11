import React, { useContext, useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const BookingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    const { doctorName, specialization } = location.state || {};

    const [allSlots, setAllSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const selectedSlotRef = useRef(null);

    const [patientData, setPatientData] = useState({
        name: '', email: '', age: '', gender: 'Select Gender', reason: ''
    });

    // 1. Fetch Slots Function (With Refresh Indicator)
    const fetchSlots = async (showLoading = false) => {
        if (showLoading) setIsRefreshing(true);
        try {
            // Add a timestamp to URL to prevent browser caching
            const res = await axios.get(`/doctors?name=${encodeURIComponent(doctorName)}&t=${Date.now()}`);
            const fetchedSlots = res.data.data;
            setAllSlots(fetchedSlots);

            // AUTO-DESELECT LOGIC
            if (selectedSlotRef.current) {
                const updatedSelectedSlot = fetchedSlots.find(s => s._id === selectedSlotRef.current._id);
                
                // If slot is taken (0) OR if it was deleted from DB entirely
                if (!updatedSelectedSlot || updatedSelectedSlot.availableSlots === 0) {
                    if (selectedSlotRef.current) {
                        toast.error("⚠️ Slot status changed. Please choose another.");
                        setSelectedSlot(null);
                        selectedSlotRef.current = null;
                    }
                }
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
        } finally {
            if (showLoading) setIsRefreshing(false);
        }
    };

    // 2. Initial Load & Polling
    useEffect(() => {
        if (!doctorName) return;

        fetchSlots();

        const intervalId = setInterval(() => {
            fetchSlots();
        }, 5000); 

        return () => clearInterval(intervalId);
    }, [doctorName]);

    // Update ref
    useEffect(() => {
        selectedSlotRef.current = selectedSlot;
    }, [selectedSlot]);


    const getUniqueDates = () => {
        const dates = allSlots.map(slot => new Date(slot.startTime).toDateString());
        return [...new Set(dates)];
    };

    const getSlotsForDate = () => {
        return allSlots.filter(slot => new Date(slot.startTime).toDateString() === selectedDate);
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        
        if (!selectedSlot) return toast.warn("Please select a time slot.");

        // Optimistic UI Check
        if (selectedSlot.availableSlots === 0) {
            toast.error("Slot is full. Refreshing data...");
            fetchSlots(true);
            return; 
        }

        try {
            const res = await axios.post('/bookings', {
                doctorId: selectedSlot._id,
                patientName: patientData.name,
                patientEmail: patientData.email,
                patientAge: patientData.age,
                patientGender: patientData.gender,
                reasonForVisit: patientData.reason
            });

            if (res.data.success) {
                toast.success('🎉 Appointment Confirmed!');
                await fetchSlots();
                setTimeout(() => navigate('/'), 2000);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Booking Failed';
            toast.error(errorMsg);
            fetchSlots(true); // Force refresh on error
        }
    };

    if (!doctorName) return <div className="p-10">Invalid Access. Go Home.</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT COLUMN: Time Selection */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 relative">
                        {/* Live Indicator / Manual Refresh */}
                        <div className="absolute top-4 right-4 flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition" onClick={() => fetchSlots(true)}>
                            {isRefreshing ? (
                                <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                                <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                            )}
                            <span className="text-xs text-gray-500 font-medium select-none">
                                {isRefreshing ? 'Refreshing...' : 'Live'}
                            </span>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">{doctorName}</h2>
                            <p className="text-blue-600 font-medium">{specialization}</p>
                        </div>
                        
                        {/* Date Picker */}
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">Select Date</h3>
                        <div className="flex overflow-x-auto pb-2 gap-2 mb-6 scrollbar-hide">
                            {getUniqueDates().map((date) => (
                                <button
                                    key={date}
                                    onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm border transition-all whitespace-nowrap ${
                                        selectedDate === date 
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-400'
                                    }`}
                                >
                                    {new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                </button>
                            ))}
                        </div>

                        {/* Time Grid */}
                        {selectedDate && (
                            <div className="animate-fade-in">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">Select Time</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {getSlotsForDate().map((slot) => (
                                        <button
                                            key={slot._id}
                                            disabled={slot.availableSlots === 0}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`py-2 px-1 rounded-md text-sm font-medium border transition-all ${
                                                selectedSlot?._id === slot._id
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                                                : slot.availableSlots === 0
                                                    ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed line-through'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600'
                                            }`}
                                        >
                                            {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: Patient Form */}
                <div className="lg:col-span-2">
                    {selectedSlot ? (
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-500 animate-fade-in">
                            <div className="mb-6 pb-6 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Appointment Details</h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-blue-600 font-bold text-lg">
                                        {new Date(selectedSlot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <p className="text-gray-400 text-xs uppercase font-bold">
                                        {new Date(selectedSlot.startTime).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                                    <input type="text" required 
                                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                                    <input type="email" required 
                                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        onChange={(e) => setPatientData({...patientData, email: e.target.value})}
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Age</label>
                                        <input type="number" required 
                                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                            onChange={(e) => setPatientData({...patientData, age: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Gender</label>
                                        <select className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition"
                                            onChange={(e) => setPatientData({...patientData, gender: e.target.value})}
                                        >
                                            <option>Select</option>
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Reason for Visit</label>
                                    <textarea rows="3" 
                                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        onChange={(e) => setPatientData({...patientData, reason: e.target.value})}
                                    ></textarea>
                                </div>

                                <div className="md:col-span-2 mt-2">
                                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition transform hover:scale-[1.01]">
                                        Confirm Booking
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl p-10 bg-gray-50">
                            <p className="text-lg font-medium">Select a time slot to proceed</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingPage;