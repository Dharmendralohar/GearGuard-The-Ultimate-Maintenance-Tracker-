import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Wrench, Menu, Users, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { useUser, useClerk } from '@clerk/clerk-react';

const Layout = () => {
    const location = useLocation();
    const { user } = useUser();
    const { signOut } = useClerk();
    const [sidebarOpen, setSidebarOpen] = React.useState(true);
    const [userMenuOpen, setUserMenuOpen] = React.useState(false);

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Equipment', path: '/equipment', icon: Package },
        { name: 'Requests', path: '/requests', icon: Wrench },
        { name: 'Technicians', path: '/technicians', icon: Users },
    ];

    const handleLogout = () => {
        signOut();
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={clsx("bg-slate-900 text-white transition-all duration-300 flex flex-col", sidebarOpen ? "w-64" : "w-16")}>
                <div className="p-4 flex items-center justify-between">
                    {sidebarOpen && <h1 className="font-bold text-xl truncate tracking-wider">GEARGUARD</h1>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
                        <Menu size={20} />
                    </button>
                </div>
                <nav className="mt-6 flex-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                "flex items-center p-3 mx-2 rounded-lg mb-1 transition-all",
                                location.pathname === item.path ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon size={20} />
                            {sidebarOpen && <span className="ml-3 font-medium">{item.name}</span>}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className={clsx("flex items-center w-full text-slate-400 hover:text-white transition-colors", !sidebarOpen && "justify-center")}>
                        <LogOut size={20} />
                        {sidebarOpen && <span className="ml-3">Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm border-b p-4 flex justify-between items-center z-10">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {navItems.find(i => i.path === location.pathname)?.name || 'Maintenance System'}
                    </h2>

                    <div className="relative">
                        <button
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="flex items-center space-x-3 focus:outline-none p-1 rounded-full hover:bg-gray-50 transition-colors"
                        >
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium text-gray-900">{user?.fullName || 'User'}</p>
                                <p className="text-xs text-gray-500">{user?.primaryEmailAddress?.emailAddress || 'Account'}</p>
                            </div>
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold overflow-hidden border border-blue-200">
                                {user?.imageUrl ? <img src={user.imageUrl} alt="User" /> : 'A'}
                            </div>
                            <ChevronDown size={14} className="text-gray-400" />
                        </button>

                        {/* Dropdown Menu */}
                        {userMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 ring-1 ring-black ring-opacity-5 animate-in fade-in slide-in-from-top-2 origin-top-right">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm text-gray-500">Signed in as</p>
                                    <p className="text-sm font-medium text-gray-900 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                                </div>
                                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                                    <UserIcon size={16} className="mr-2 text-gray-400" /> Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                >
                                    <LogOut size={16} className="mr-2" /> Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
