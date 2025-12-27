import { useState, useEffect } from 'react';

const MOCK_TEAMS = [
    { id: 'tm1', name: 'Mechanics' },
    { id: 'tm2', name: 'Electricians' },
    { id: 'tm3', name: 'IT Support' },
];

const INITIAL_TECHNICIANS = [
    { id: 't1', name: 'Alice Johnson', role: 'Technician', teamId: 'tm1' },
    { id: 't2', name: 'Bob Smith', role: 'Technician', teamId: 'tm1' },
    { id: 't3', name: 'Charlie Davis', role: 'Technician', teamId: 'tm2' },
    { id: 't4', name: 'Diana Prince', role: 'Technician', teamId: 'tm3' },
];

export const useTechnicians = () => {
    const [technicians, setTechnicians] = useState(() => {
        const stored = localStorage.getItem('gearguard_technicians');
        return stored ? JSON.parse(stored) : INITIAL_TECHNICIANS;
    });

    useEffect(() => {
        localStorage.setItem('gearguard_technicians', JSON.stringify(technicians));
    }, [technicians]);

    const addTechnician = (tech) => {
        const newTech = { ...tech, id: Date.now().toString() };
        setTechnicians([...technicians, newTech]);
    };

    const deleteTechnician = (id) => {
        setTechnicians(technicians.filter(t => t.id !== id));
    };

    const updateTechnician = (id, updates) => {
        setTechnicians(technicians.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const getTeamMembers = (teamId) => technicians.filter(t => t.teamId === teamId);

    return {
        technicians,
        teams: MOCK_TEAMS,
        addTechnician,
        deleteTechnician,
        updateTechnician,
        getTeamMembers
    };
};
