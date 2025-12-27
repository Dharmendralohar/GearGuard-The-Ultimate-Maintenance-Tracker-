import { useState, useEffect } from 'react';

const STORAGE_KEY = 'gg_requests';

const INITIAL_REQUESTS = [
    {
        id: 'r1',
        equipmentId: '1',
        type: 'Corrective',
        reportedBy: 'Operator Dave',
        assignedTo: 't1', // Alice
        teamId: 'tm1',
        description: 'Oil leak detected near spindle.',
        priority: 'High',
        stage: 'New',
        scheduledDate: null,
        duration: 0,
        createdAt: new Date().toISOString(),
    },
    {
        id: 'r2',
        equipmentId: '2',
        type: 'Preventive',
        reportedBy: 'System',
        assignedTo: 't2', // Bob
        teamId: 'tm1',
        description: 'Quarterly Battery Check',
        priority: 'Medium',
        stage: 'New',
        scheduledDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        duration: 0,
        createdAt: new Date().toISOString(),
    },
];

export const useRequests = () => {
    const [requests, setRequests] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : INITIAL_REQUESTS;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    }, [requests]);

    const addRequest = (request) => {
        const newRequest = {
            ...request,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            stage: 'New',
            duration: 0,
        };
        setRequests((prev) => [...prev, newRequest]);
    };

    const updateRequestStage = (id, newStage) => {
        setRequests((prev) => prev.map(req => req.id === id ? { ...req, stage: newStage } : req));
    };

    const updateRequest = (id, fields) => {
        setRequests((prev) => prev.map(req => req.id === id ? { ...req, ...fields } : req));
    };

    // Helper to check overdue status (simple logic: created > 48h ago and not done, or scheduled date passed)
    const isOverdue = (req) => {
        if (req.stage === 'Repaired' || req.stage === 'Scrap') return false;
        const now = new Date();
        if (req.type === 'Preventive' && req.scheduledDate) {
            return new Date(req.scheduledDate) < now;
        }
        // Corrective overdue if > 2 days old
        const created = new Date(req.createdAt);
        const diffHours = (now - created) / 36e5;
        return diffHours > 48;
    };

    return { requests, addRequest, updateRequestStage, updateRequest, isOverdue };
};
