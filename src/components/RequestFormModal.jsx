import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useEquipment } from '../hooks/useEquipment';
import { useTechnicians } from '../hooks/useTechnicians';

const RequestFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const { equipment } = useEquipment();
    const { teams, technicians } = useTechnicians();

    const [formData, setFormData] = useState({
        equipmentId: '',
        type: 'Corrective',
        description: '',
        priority: 'Medium',
        assignedTo: '',
        teamId: '',
        reportedBy: '',
        scheduledDate: '',
    });

    // Effect to auto-fill team and technician when Equipment is selected
    useEffect(() => {
        if (formData.equipmentId && !initialData) {
            const eq = equipment.find(e => e.id === formData.equipmentId);
            if (eq) {
                setFormData(prev => ({
                    ...prev,
                    teamId: eq.maintenanceTeamId || '',
                    assignedTo: eq.technicianId || '',
                }));
            }
        }
    }, [formData.equipmentId, equipment, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
        // Simplified reset
        if (!initialData) {
            setFormData({
                equipmentId: '',
                type: 'Corrective',
                description: '',
                priority: 'Medium',
                assignedTo: '',
                teamId: '',
                reportedBy: '',
                scheduledDate: '',
            });
        }
    };

    const getTeamMembers = (teamId) => technicians.filter(m => m.teamId === teamId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <X size={24} />
                </button>
                <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Request' : 'New Maintenance Request'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Request Type</label>
                        <div className="flex space-x-4 mt-1">
                            <label className="inline-flex items-center">
                                <input type="radio" className="form-radio text-blue-600" name="type" value="Corrective" checked={formData.type === 'Corrective'} onChange={(e) => setFormData({ ...formData, type: e.target.value })} />
                                <span className="ml-2">Corrective (Breakdown)</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input type="radio" className="form-radio text-blue-600" name="type" value="Preventive" checked={formData.type === 'Preventive'} onChange={(e) => setFormData({ ...formData, type: e.target.value })} />
                                <span className="ml-2">Preventive (Scheduled)</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Equipment</label>
                        <select
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            value={formData.equipmentId}
                            onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
                        >
                            <option value="">Select Equipment</option>
                            {equipment.filter(e => !e.isScrapped).map(eq => (
                                <option key={eq.id} value={eq.id}>{eq.name} - {eq.serialNumber}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description / Subject</label>
                        <textarea
                            required
                            placeholder="e.g. Leaking Oil"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            rows={2}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {formData.type === 'Preventive' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Scheduled Date</label>
                            <input
                                type="date"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={formData.scheduledDate ? formData.scheduledDate.split('T')[0] : ''}
                                onChange={(e) => setFormData({ ...formData, scheduledDate: new Date(e.target.value).toISOString() })}
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Team</label>
                            <select
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={formData.teamId}
                                onChange={(e) => setFormData({ ...formData, teamId: e.target.value, assignedTo: '' })}
                            >
                                <option value="">Select Team</option>
                                {teams.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Assign To</label>
                            <select
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={formData.assignedTo}
                                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                                disabled={!formData.teamId}
                            >
                                <option value="">Select Technician</option>
                                {getTeamMembers(formData.teamId).map(member => (
                                    <option key={member.id} value={member.id}>{member.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                        <select
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Reported By</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            value={formData.reportedBy}
                            onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Create Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestFormModal;
