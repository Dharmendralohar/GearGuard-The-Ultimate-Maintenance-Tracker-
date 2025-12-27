import React, { useState } from 'react';
import { X } from 'lucide-react';

const ResolveModal = ({ isOpen, onClose, onSubmit }) => {
    const [duration, setDuration] = useState(0);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(duration);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
                <h2 className="text-xl font-bold mb-4">Complete Maintenance</h2>
                <form onSubmit={handleSubmit}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Hours)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.5"
                        required
                        className="w-full border border-gray-300 rounded p-2 mb-4"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                    />
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Complete</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default ResolveModal;
