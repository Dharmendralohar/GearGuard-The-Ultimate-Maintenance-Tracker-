import { useState, useEffect } from 'react';

const STORAGE_KEY = 'gg_equipment';

const INITIAL_EQUIPMENT = [
    {
        id: '1',
        name: 'CNC Milling Machine',
        serialNumber: 'CNC-2023-001',
        category: 'Machine',
        department: 'Production',
        maintenanceTeamId: 'tm1',
        technicianId: 't1',
        status: 'Operational',
        location: 'Section A',
        purchaseDate: '2023-01-15',
        warrantyEnd: '2025-01-15',
        isScrapped: false
    },
    {
        id: '2',
        name: 'Forklift X500',
        serialNumber: 'FL-X500-99',
        category: 'Vehicle',
        department: 'Logistics',
        maintenanceTeamId: 'tm1',
        technicianId: 't2',
        status: 'Maintenance',
        location: 'Warehouse',
        purchaseDate: '2022-06-10',
        warrantyEnd: '2024-06-10',
        isScrapped: false
    },
    {
        id: '3',
        name: 'Design Workstation',
        serialNumber: 'IT-WS-442',
        category: 'Computer',
        department: 'Design',
        employeeId: 'David Designer',
        maintenanceTeamId: 'tm3',
        technicianId: 't4',
        status: 'Operational',
        location: 'Office 3',
        purchaseDate: '2024-03-01',
        warrantyEnd: '2027-03-01',
        isScrapped: false
    },
];

export const useEquipment = () => {
    const [equipment, setEquipment] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : INITIAL_EQUIPMENT;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(equipment));
    }, [equipment]);

    const addEquipment = (item) => {
        const newItem = { ...item, id: crypto.randomUUID(), isScrapped: false };
        setEquipment((prev) => [...prev, newItem]);
    };

    const updateEquipment = (id, updatedFields) => {
        setEquipment((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item)));
    };

    const deleteEquipment = (id) => {
        setEquipment((prev) => prev.filter((item) => item.id !== id));
    };

    const getEquipment = (id) => equipment.find(e => e.id === id);

    return { equipment, addEquipment, updateEquipment, deleteEquipment, getEquipment };
};
