import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

// Mock initial data for demonstration
const INITIAL_USERS = [
    {
        userId: 'user_admin_demo',
        role: 'Admin',
        details: { address: '123 Admin St, Tech City', phone: '555-0100' },
        permissions: { equipment: 'write', requests: 'write', users: 'write' }
    },
    {
        userId: 'user_tech_demo',
        role: 'Technician',
        details: { address: '456 Repair Rd, Fix Town', phone: '555-0101' },
        permissions: { equipment: 'read', requests: 'write', users: 'read' }
    }
];

const UserManagementContext = createContext();

export const UserManagementProvider = ({ children }) => {
    const { user } = useUser();
    const [users, setUsers] = useState(() => {
        const stored = localStorage.getItem('gearguard_users');
        return stored ? JSON.parse(stored) : INITIAL_USERS;
    });

    const [currentUserProfile, setCurrentUserProfile] = useState(null);

    useEffect(() => {
        localStorage.setItem('gearguard_users', JSON.stringify(users));
    }, [users]);

    // specific effect to sync Clerk user with our local mock DB
    useEffect(() => {
        if (user) {
            let profile = users.find(u => u.userId === user.id);
            if (!profile) {
                // Determine role based on email or default to Technician for new signups
                const role = user.primaryEmailAddress?.emailAddress?.includes('admin') ? 'Admin' : 'Technician';
                const initialPermissions = role === 'Admin'
                    ? { equipment: 'write', requests: 'write', users: 'write' }
                    : { equipment: 'read', requests: 'write', users: 'read' }; // Technicians can write requests (updates)

                profile = {
                    userId: user.id,
                    role,
                    details: { address: '', phone: '' },
                    permissions: initialPermissions
                };
                setUsers(prev => [...prev, profile]);
            }
            setCurrentUserProfile(profile);
        }
    }, [user, users]); // Logic to sync Clerk user to local DB

    const updateUser = (userId, updates) => {
        setUsers(prev => prev.map(u => u.userId === userId ? { ...u, ...updates } : u));
    };

    const hasPermission = (resource, action) => {
        if (!currentUserProfile) return false;
        if (currentUserProfile.role === 'Admin') return true; // Admins override
        const perm = currentUserProfile.permissions[resource];
        if (!perm) return false;
        if (action === 'read') return true; // 'write' implies 'read' usually, but here simple string check
        return perm === 'write';
    };

    return (
        <UserManagementContext.Provider value={{ users, currentUserProfile, updateUser, hasPermission }}>
            {children}
        </UserManagementContext.Provider>
    );
};

export const useUserManagement = () => useContext(UserManagementContext);
