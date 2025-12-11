import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const [slots, setSlots] = useState([]);
    const [formData, setFormData] = useState({
        doctorName: '',
        specialization: '',
        startTime: '',
        totalSlots: 5
    });

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

    const InputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition";

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </span>
                Admin Dashboard
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-fit">
                    <h3 className="text-xl font-bold text-gray-700 mb-6 border-b pb-2">Create Availability</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-1">Doctor Name</label>
                            <input 
                                type="text" placeholder="e.g. Dr. House" required
                                className={InputClass}
                                value={formData.doctorName}
                                onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-1">Specialization</label>
                            <input 
                                type="text" placeholder="e.g. Cardiology" required
                                className={InputClass}
                                value={formData.specialization}
                                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-1">Date & Time</label>
                            <input 
                                type="datetime-local" required
                                className={InputClass}
                                value={formData.startTime}
                                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-1">Total Slots</label>
                            <input 
                                type="number" placeholder="5" required min="1"
                                className={InputClass}
                                value={formData.totalSlots}
                                onChange={(e) => setFormData({...formData, totalSlots: e.target.value})}
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors mt-2">
                            + Create Slot
                        </button>
                    </form>
                </div>

                {/* Table Section */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                         <h3 className="text-xl font-bold text-gray-700">Active Slots</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="p-4">Doctor Details</th>
                                    <th className="p-4">Schedule</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {slots.map((slot) => (
                                    <tr key={slot._id} className="hover:bg-gray-50 transition">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-800">{slot.doctorName}</div>
                                            <div className="text-xs text-blue-500 bg-blue-50 inline-block px-2 rounded mt-1">{slot.specialization}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            <div>📅 {new Date(slot.startTime).toLocaleDateString()}</div>
                                            <div className="mt-1">⏰ {new Date(slot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center">
                                                <div className="flex-1 h-2 bg-gray-200 rounded-full w-24 mr-2">
                                                    <div 
                                                        className={`h-2 rounded-full ${slot.availableSlots > 0 ? 'bg-green-500' : 'bg-red-500'}`} 
                                                        style={{width: `${(slot.availableSlots / slot.totalSlots) * 100}%`}}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium text-gray-600">{slot.availableSlots}/{slot.totalSlots}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {slots.length === 0 && <div className="p-8 text-center text-gray-400">No slots created yet.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;