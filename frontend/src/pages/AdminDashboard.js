import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const [slots, setSlots] = useState([]);
    
    // Form State
    const [doctorName, setDoctorName] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [existingDoctors, setExistingDoctors] = useState([]);

    useEffect(() => {
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        try {
            const res = await axios.get('/doctors');
            setSlots(res.data.data);
            const uniqueDocs = [...new Set(res.data.data.map(item => item.doctorName))];
            setExistingDoctors(uniqueDocs);
        } catch (err) {
            console.error(err);
        }
    };

    const generateTimeOptions = () => {
        const times = [];
        let start = 10 * 60; 
        const end = 17 * 60 + 20; 

        while (start <= end) {
            const h = Math.floor(start / 60);
            const m = start % 60;
            const period = h >= 12 ? 'PM' : 'AM';
            const displayH = h > 12 ? h - 12 : h;
            const displayM = m.toString().padStart(2, '0');
            times.push({ value: `${h.toString().padStart(2, '0')}:${displayM}`, label: `${displayH}:${displayM} ${period}` });
            start += 20;
        }
        return times;
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!date || !time) return toast.warn("Please select Date and Time");

        const combinedDateTime = new Date(`${date}T${time}:00`);

        try {
            await axios.post('/doctors', {
                doctorName,
                specialization,
                startTime: combinedDateTime
            });
            toast.success('Schedule Created!');
            fetchSlots();
            setDoctorName(''); setSpecialization(''); setTime('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create slot');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this slot?")) return;
        try {
            await axios.delete(`/doctors/${id}`);
            toast.success("Slot Deleted");
            fetchSlots();
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    const InputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition";

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Admin Management Dashboard</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- LEFT: CREATE FORM --- */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-fit">
                    <h3 className="text-xl font-bold text-gray-700 mb-6 border-b pb-2">Add New Slot</h3>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Doctor Name</label>
                            <input list="doctor-names" type="text" placeholder="e.g. Dr. House" required 
                                className={InputClass} value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
                            <datalist id="doctor-names">{existingDoctors.map((n, i) => <option key={i} value={n} />)}</datalist>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Specialization</label>
                            <input type="text" placeholder="e.g. Diagnostics" required 
                                className={InputClass} value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
                                <input type="date" required className={InputClass} value={date} 
                                    onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Time</label>
                                <select required className={`${InputClass} bg-white`} value={time} onChange={(e) => setTime(e.target.value)}>
                                    <option value="">Select</option>
                                    {generateTimeOptions().map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md mt-2">
                            + Create Schedule
                        </button>
                    </form>
                </div>

                {/* --- RIGHT: SLOT LIST --- */}
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
                                    <th className="p-4">Patient Details / Status</th>
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
                                            <div>{new Date(slot.startTime).toLocaleDateString()}</div>
                                            <div className="font-bold text-blue-600">
                                                {new Date(slot.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                            </div>
                                        </td>
                                        
                                        {/* --- UPDATED STATUS COLUMN --- */}
                                        <td className="p-4">
                                            {slot.availableSlots === 0 ? (
                                                slot.bookingDetails ? (
                                                    // IF BOOKED & DATA EXISTS
                                                    <div className="bg-blue-50 p-2 rounded-lg border border-blue-100">
                                                        <p className="text-sm font-bold text-gray-900">{slot.bookingDetails.patientName}</p>
                                                        <p className="text-xs text-gray-500">{slot.bookingDetails.patientEmail}</p>
                                                    </div>
                                                ) : (
                                                    // IF BOOKED BUT NO DATA (e.g. Seeded dummy data)
                                                    <span className="text-red-500 font-bold text-xs bg-red-100 px-2 py-1 rounded">
                                                        RESERVED (System)
                                                    </span>
                                                )
                                            ) : (
                                                // IF OPEN
                                                <span className="text-green-600 font-bold text-xs bg-green-100 px-2 py-1 rounded">
                                                    OPEN
                                                </span>
                                            )}
                                        </td>

                                        <td className="p-4 text-center">
                                            <button onClick={() => handleDelete(slot._id)} 
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg text-sm font-medium transition">
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
        </div>
    );
};

export default AdminDashboard;