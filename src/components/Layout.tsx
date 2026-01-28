import React, { type ReactNode } from 'react';
import Sidebar from './Sidebar';
import { Menu, Bell } from 'lucide-react';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:ml-64">
                {/* Header */}
                <header className="glass-card sticky top-0 z-40 border-b border-white/20">
                    <div className="flex items-center justify-between px-4 py-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors"
                            >
                                <Menu className="w-6 h-6 text-gray-700" />
                            </button>
                            <h2 className="text-xl font-bold text-gray-800">Seaflow Logistics</h2>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="p-2 rounded-lg hover:bg-primary-50 transition-colors relative">
                                <Bell className="w-5 h-5 text-gray-700" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
