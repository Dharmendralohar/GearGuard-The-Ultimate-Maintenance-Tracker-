import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useUserManagement } from '../hooks/useUserManagement';
import { User, Shield, MapPin, Phone, Lock, Save, Edit2, CheckCircle, XCircle } from 'lucide-react';
import clsx from 'clsx';

const Profile = () => {
    const { user } = useUser();
    const { users, currentUserProfile, updateUser, hasPermission } = useUserManagement();
    const [activeTab, setActiveTab] = useState('my-profile');
    const [isEditing, setIsEditing] = useState(false);

    // Form State for My Profile
    const [formData, setFormData] = useState({
        address: currentUserProfile?.details?.address || '',
        phone: currentUserProfile?.details?.phone || ''
    });

    // Sync form data when profile loads
    React.useEffect(() => {
        if (currentUserProfile) {
            setFormData({
                address: currentUserProfile.details.address || '',
                phone: currentUserProfile.details.phone || ''
            });
        }
    }, [currentUserProfile]);

    const handleSaveProfile = (e) => {
        e.preventDefault();
        // Validation: Address is required
        if (!formData.address.trim()) {
            alert("Address is required.");
            return;
        }

        updateUser(currentUserProfile.userId, {
            details: { ...currentUserProfile.details, ...formData }
        });
        setIsEditing(false);
    };

    const togglePermission = (targetUserId, resource) => {
        // Find user
        const targetUser = users.find(u => u.userId === targetUserId);
        if (!targetUser) return;

        const currentPerm = targetUser.permissions[resource];
        const newPerm = currentPerm === 'write' ? 'read' : 'write';

        updateUser(targetUserId, {
            permissions: { ...targetUser.permissions, [resource]: newPerm }
        });
    };

    if (!currentUserProfile) return <div className="p-8">Loading profile...</div>;

    const isAdmin = currentUserProfile.role === 'Admin';

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">User Profile & Settings</h1>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('my-profile')}
                        className={clsx(
                            "whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors",
                            activeTab === 'my-profile'
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        )}
                    >
                        My Profile
                    </button>
                    {isAdmin && (
                        <button
                            onClick={() => setActiveTab('user-management')}
                            className={clsx(
                                "whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors",
                                activeTab === 'user-management'
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            )}
                        >
                            User Management
                        </button>
                    )}
                </nav>
            </div>

            {/* Content: My Profile */}
            {activeTab === 'my-profile' && (
                <div className="bg-white shadow rounded-lg p-6 max-w-2xl">
                    <div className="flex items-center space-x-4 mb-6">
                        <img
                            src={user?.imageUrl}
                            alt="Profile"
                            className="h-16 w-16 rounded-full border-2 border-gray-100" // Reduced size for better layout
                        />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{user?.fullName}</h2>
                            <p className="text-sm text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
                            <span className={clsx(
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1",
                                currentUserProfile.role === 'Admin' ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                            )}>
                                {currentUserProfile.role}
                            </span>
                        </div>
                        <div className="flex-1 text-right">
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                >
                                    <Edit2 size={16} className="mr-2" />
                                    Edit Details
                                </button>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-6">
                                <label className="block text-sm font-medium text-gray-700">
                                    Full Address <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500"
                                        placeholder="123 Main St, City, Country"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label className="block text-sm font-medium text-gray-700">
                                    Phone Number <span className="text-gray-400">(Optional)</span>
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                >
                                    <Save size={16} className="mr-2" />
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </form>

                    <div className="mt-8">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Effective Permissions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {Object.entries(currentUserProfile.permissions).map(([resource, access]) => (
                                <div key={resource} className="bg-gray-50 p-3 rounded-md border border-gray-200 flex items-center justify-between">
                                    <span className="text-gray-700 font-medium capitalize">{resource}</span>
                                    <span className={clsx(
                                        "px-2 py-1 text-xs font-semibold rounded-full uppercase",
                                        access === 'write' ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                    )}>
                                        {access}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Content: User Management */}
            {activeTab === 'user-management' && isAdmin && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions (Click to Toggle)</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((u) => (
                                <tr key={u.userId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                                {u.userId.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{u.userId}</div>
                                                <div className="text-sm text-gray-500">{u.details?.address ? 'Has Address' : 'No Address'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={clsx(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                            u.role === 'Admin' ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                                        )}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex space-x-2">
                                            {['equipment', 'requests'].map(resource => (
                                                <button
                                                    key={resource}
                                                    onClick={() => togglePermission(u.userId, resource)}
                                                    className={clsx(
                                                        "px-3 py-1 text-xs rounded border transition-colors flex items-center capitalize",
                                                        u.permissions[resource] === 'write'
                                                            ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                                            : "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                                                    )}
                                                    title={`Click to toggle ${resource} permission`}
                                                >
                                                    {resource}: {u.permissions[resource]}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex flex-col space-y-1">
                                            <span className="flex items-center"><MapPin size={12} className="mr-1" /> {u.details.address || '-'}</span>
                                            <span className="flex items-center"><Phone size={12} className="mr-1" /> {u.details.phone || '-'}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Profile;
