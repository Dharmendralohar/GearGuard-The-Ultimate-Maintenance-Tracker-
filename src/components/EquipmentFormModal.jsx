import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTechnicians } from '../hooks/useTechnicians';

const EquipmentFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const { teams, technicians: allMembers } = useTechnicians();

    const [formData, setFormData] = useState({
        name: '',
        serialNumber: '',
        category: 'Machine',
        department: 'Production',
        employeeId: '',
        maintenanceTeamId: '',
        technicianId: '',
        status: 'Operational',
        location: '',
        purchaseDate: '',
        warrantyEnd: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                serialNumber: '',
                category: 'Machine',
                department: 'Production',
                employeeId: '',
                maintenanceTeamId: '',
                technicianId: '',
                status: 'Operational',
                location: '',
                purchaseDate: '',
                warrantyEnd: '',
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    const technicians = formData.maintenanceTeamId
        ? allMembers.filter(m => m.teamId === formData.maintenanceTeamId)
        : [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto pt-10 pb-10">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <X size={24} />
                </button>
                <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Equipment' : 'Add New Equipment'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Serial Number</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={formData.serialNumber}
                                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="Machine">Machine</option>
                                <option value="Vehicle">Vehicle</option>
                                <option value="Computer">Computer</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Department</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Assigned Employee (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. John Doe"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={formData.employeeId}
                                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="Operational">Operational</option>
                                <option value="Down">Down</option>
                                <option value="Maintenance">Maintenance</option>
                            </select>
                        </div>

                        <div className="border-t pt-2 mt-2 md:col-span-2"><h3 className="font-semibold text-gray-600">Maintenance Responsibility</h3></div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Maintenance Team</label>
                            <select
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={formData.maintenanceTeamId}
                                onChange={(e) => setFormData({ ...formData, maintenanceTeamId: e.target.value, technicianId: '' })}
                            >
                                <option value="">Select Team</option>
                                {teams.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Default Technician</label>
                            <select
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={formData.technicianId}
                                onChange={(e) => setFormData({ ...formData, technicianId: e.target.value })}
                                disabled={!formData.maintenanceTeamId}
                            >
                                <option value="">Select Technician</option>
                                {technicians.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="border-t pt-2 mt-2 md:col-span-2"><h3 className="font-semibold text-gray-600">Purchase & Warranty</h3></div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
                            <input
                                type="date"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={formData.purchaseDate}
                                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Warranty End</label>
                            <input
                                type="date"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={formData.warrantyEnd}
                                onChange={(e) => setFormData({ ...formData, warrantyEnd: e.target.value })}
                            />
                        </div>

                    </div>
                    <div className="flex justify-end space-x-2 pt-6 border-t">
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
                            {initialData ? 'Update Equipment' : 'Create Equipment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EquipmentFormModal;
