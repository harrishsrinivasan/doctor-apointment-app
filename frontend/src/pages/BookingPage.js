import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const BookingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    // Get basic doctor info passed from Home
    const { doctorName, specialization } = location.state || {};

    const [allSlots, setAllSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form Data
    const [patientData, setPatientData] = useState({
        name: '', email: '', age: '', gender: 'Select Gender', reason: ''
    });

    // 1. Fetch all slots for this specific doctor
    useEffect(() => {
        if (!doctorName) return;
        const fetchSlots = async () => {
            try {
                const res = await axios.get(`/doctors?name=${encodeURIComponent(doctorName)}`);
                setAllSlots(res.data.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load schedule");
            }
        };
        fetchSlots();
    }, [doctorName]);

    // 2. Extract Unique Dates from slots
    const getUniqueDates = () => {
        const dates = allSlots.map(slot => new Date(slot.startTime).toDateString());
        return [...new Set(dates)];
    };

    // 3. Filter Time Slots based on selected Date
    const getSlotsForDate = () => {
        return allSlots.filter(slot => new Date(slot.startTime).toDateString() === selectedDate);
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!selectedSlot) return toast.warn("Please select a time slot.");

        try {
            const res = await axios.post('/bookings', {
                doctorId: selectedSlot._id, // The specific time slot ID
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
            toast.error(err.response?.data?.message || 'Booking Failed');
        }
    };

    if (!doctorName) return <div className="p-10">Invalid Access. Go Home.</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT COLUMN: Schedule Selection */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">{doctorName}</h2>
                        <p className="text-blue-600 font-medium mb-4">{specialization}</p>
                        <hr className="border-gray-100 mb-4"/>
                        
                        {/* Date Picker */}
                        <h3 className="font-semibold text-gray-700 mb-3">1. Select Date</h3>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {getUniqueDates().map((date) => (
                                <button
                                    key={date}
                                    onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                                    className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                                        selectedDate === date 
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                                    }`}
                                >
                                    {new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                </button>
                            ))}
                        </div>

                        {/* Time Picker */}
                        {selectedDate && (
                            <div className="animate-fade-in">
                                <h3 className="font-semibold text-gray-700 mb-3">2. Select Time</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {getSlotsForDate().map((slot) => (
                                        <button
                                            key={slot._id}
                                            disabled={slot.availableSlots === 0}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`py-2 px-3 rounded-md text-sm font-medium border transition-all ${
                                                selectedSlot?._id === slot._id
                                                ? 'bg-green-600 text-white border-green-600 ring-2 ring-green-200'
                                                : slot.availableSlots === 0
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-green-500 hover:text-green-600'
                                            }`}
                                        >
                                            {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            <span className="block text-xs font-normal opacity-75">
                                                {slot.availableSlots} seats left
                                            </span>
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
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-green-500 animate-fade-in">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">3. Patient Details</h2>
                            <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-600">Full Name</label>
                                    <input type="text" required 
                                        className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">Email</label>
                                    <input type="email" required 
                                        className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        onChange={(e) => setPatientData({...patientData, email: e.target.value})}
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Age</label>
                                        <input type="number" required 
                                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                            onChange={(e) => setPatientData({...patientData, age: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Gender</label>
                                        <select className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
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
                                    <label className="text-sm font-semibold text-gray-600">Reason for Visit</label>
                                    <textarea rows="3" 
                                        className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        onChange={(e) => setPatientData({...patientData, reason: e.target.value})}
                                    ></textarea>
                                </div>

                                <div className="md:col-span-2 mt-4">
                                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition transform hover:scale-[1.01]">
                                        Confirm Booking for {new Date(selectedSlot.startTime).toLocaleString([], {weekday:'short', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-xl p-10 bg-gray-50">
                            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <p className="text-xl font-medium">Please select a Date and Time to proceed</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingPage;