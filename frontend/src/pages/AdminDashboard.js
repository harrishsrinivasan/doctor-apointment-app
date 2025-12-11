import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const [slots, setSlots] = useState([]);
    // Form State
    const [formData, setFormData] = useState({
        doctorName: '', specialization: '', startTime: '', totalSlots: 5
    });
    
    // Modal State
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        try {
            const res = await axios.get('/doctors');
            setSlots(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    // ACTION: Delete Slot
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this slot? This cannot be undone.")) return;
        try {
            await axios.delete(`/doctors/${id}`);
            toast.success("Slot Deleted");
            fetchSlots(); // Refresh list
        } catch (err) {
            toast.error("Failed to delete slot");
        }
    };

    // ACTION: View Bookings
    const handleViewBookings = async (slot) => {
        setSelectedSlot(slot);
        setShowModal(true);
        setBookings([]); // Clear previous data
        try {
            const res = await axios.get(`/doctors/${slot._id}/bookings`);
            setBookings(res.data.data);
        } catch (err) {
            toast.error("Could not load bookings");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/doctors', formData);
            toast.success('Slot Created Successfully!');
            fetchSlots();
            setFormData({ doctorName: '', specialization: '', startTime: '', totalSlots: 5 });
        } catch (err) {
            toast.error('Failed to create slot');
        }
    };

    const InputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition";

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Admin Management Dashboard</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Create Form */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-fit">
                    <h3 className="text-xl font-bold text-gray-700 mb-6 border-b pb-2">Add New Slot</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Doctor Name</label>
                            <input type="text" placeholder="e.g. Dr. House" required className={InputClass}
                                value={formData.doctorName} onChange={(e) => setFormData({...formData, doctorName: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Specialization</label>
                            <input type="text" placeholder="e.g. Diagnostics" required className={InputClass}
                                value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Date & Time</label>
                            <input type="datetime-local" required className={InputClass}
                                value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Total Capacity</label>
                            <input type="number" placeholder="5" required min="1" className={InputClass}
                                value={formData.totalSlots} onChange={(e) => setFormData({...formData, totalSlots: e.target.value})} />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors mt-2 shadow-md">
                            + Create Schedule
                        </button>
                    </form>
                </div>

                {/* Right Column: Manage Slots */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                         <h3 className="text-xl font-bold text-gray-700">Active Schedules</h3>
                         <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{slots.length} Active</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead className="bg-white text-gray-500 font-semibold uppercase text-xs border-b">
                                <tr>
                                    <th className="p-4">Doctor</th>
                                    <th className="p-4">Time</th>
                                    <th className="p-4">Capacity</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {slots.map((slot) => (
                                    <tr key={slot._id} className="hover:bg-blue-50 transition group">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-800">{slot.doctorName}</div>
                                            <div className="text-xs text-gray-500">{slot.specialization}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {new Date(slot.startTime).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                                    <div className={`h-2 rounded-full ${slot.availableSlots > 0 ? 'bg-green-500' : 'bg-red-500'}`} 
                                                         style={{width: `${(slot.availableSlots / slot.totalSlots) * 100}%`}}></div>
                                                </div>
                                                <span className="text-xs font-mono">{slot.availableSlots}/{slot.totalSlots}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 flex justify-center gap-3 opacity-100 lg:opacity-60 group-hover:opacity-100 transition">
                                            <button onClick={() => handleViewBookings(slot)} 
                                                className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg text-sm font-medium flex items-center gap-1 transition">
                                                <span>Patients</span>
                                            </button>
                                            <button onClick={() => handleDelete(slot._id)} 
                                                className="text-red-600 hover:bg-red-100 p-2 rounded-lg text-sm font-medium transition">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {slots.length === 0 && <div className="p-10 text-center text-gray-400">No active schedules found.</div>}
                    </div>
                </div>
            </div>

            {/* MODAL: View Patients */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Patient List</h3>
                                <p className="text-sm text-gray-500">For {selectedSlot?.doctorName} • {new Date(selectedSlot?.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 text-3xl leading-none">&times;</button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto">
                            {bookings.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="text-6xl mb-4">📭</div>
                                    <p className="text-gray-500 font-medium">No bookings yet for this slot.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {bookings.map((booking, index) => (
                                        <div key={booking._id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition flex justify-between items-start">
                                            <div className="flex gap-4">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{booking.patientName}</p>
                                                    <p className="text-sm text-gray-600">{booking.patientEmail}</p>
                                                    <div className="flex gap-4 mt-1 text-xs text-gray-500">
                                                        <span>Age: {booking.patientAge}</span>
                                                        <span>Gender: {booking.patientGender}</span>
                                                    </div>
                                                    {booking.reasonForVisit && (
                                                        <p className="mt-2 text-sm text-gray-700 italic bg-white p-2 rounded border border-gray-100">
                                                            "{booking.reasonForVisit}"
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold tracking-wide shadow-sm">
                                                CONFIRMED
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="p-4 border-t bg-gray-50 flex justify-end">
                            <button onClick={() => setShowModal(false)} className="px-6 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;