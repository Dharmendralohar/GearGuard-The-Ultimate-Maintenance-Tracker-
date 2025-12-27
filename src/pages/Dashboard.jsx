import React from 'react';
import { useEquipment } from '../hooks/useEquipment';
import { useRequests } from '../hooks/useRequests';
import { Activity, AlertTriangle, CheckCircle, Package } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
        <div className={`p-4 rounded-full ${color} bg-opacity-10 mr-4`}>
            <Icon className={color} size={24} />
        </div>
        <div>
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const { equipment } = useEquipment();
    const { requests } = useRequests();

    const stats = [
        { title: 'Total Equipment', value: equipment.length, icon: Package, color: 'text-blue-600' },
        { title: 'Active Requests', value: requests.filter(r => r.stage !== 'Repaired' && r.stage !== 'Scrap').length, icon: Activity, color: 'text-orange-600' },
        { title: 'Critical Issues', value: requests.filter(r => r.priority === 'Critical' && r.stage !== 'Repaired' && r.stage !== 'Scrap').length, icon: AlertTriangle, color: 'text-red-600' },
        { title: 'Completed Jobs', value: requests.filter(r => r.stage === 'Repaired').length, icon: CheckCircle, color: 'text-green-600' },
    ];

    const recentRequests = requests.slice(-5).reverse();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {recentRequests.map(req => (
                            <div key={req.id} className="flex items-start pb-4 border-b last:border-0 last:pb-0">
                                <div className={`mt-1 w-2 h-2 rounded-full mr-3 ${req.status === 'Open' ? 'bg-red-500' :
                                    req.status === 'In Progress' ? 'bg-blue-500' : 'bg-green-500'
                                    }`} />
                                <div>
                                    <p className="font-medium text-sm">{req.description}</p>
                                    <p className="text-xs text-gray-500">
                                        {req.status} • {new Date(req.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {recentRequests.length === 0 && <p className="text-gray-500 text-sm">No activity yet.</p>}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-4">Equipment Status Overview</h2>
                    <div className="space-y-4">
                        {['Operational', 'Down', 'Maintenance'].map(status => {
                            const count = equipment.filter(a => a.status === status).length;
                            const percentage = (count / equipment.length) * 100 || 0;
                            return (
                                <div key={status}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{status}</span>
                                        <span>{count}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${status === 'Operational' ? 'bg-green-500' :
                                                status === 'Down' ? 'bg-red-500' : 'bg-yellow-500'
                                                }`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
