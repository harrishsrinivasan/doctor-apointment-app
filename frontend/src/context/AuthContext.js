import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Mock User - In a real app, this comes from Login
    const [user] = useState({
        email: 'patient_demo@example.com',
        role: 'user', // change to 'admin' to simulate admin rights if needed
        name: 'John Doe'
    });

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
};