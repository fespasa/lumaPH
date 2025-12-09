
import { Outlet, Link, useLocation } from 'react-router-dom';
import { User, LogOut, Home, Clock, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Layout = () => {
    const { logout } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Header - Simplified for Mobile */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo.jpg" alt="LUMA Logo" className="h-8 w-auto object-contain" />
                        <span className="font-bold text-xl text-luma-dark">Luma</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        <button
                            onClick={logout}
                            title="Cerrar Sesión"
                            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                        <Link to="/profile" className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
                            <User className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Mobile Menu Button (Optional, maybe for logout) */}
                    <div className="md:hidden">
                        <button onClick={logout} className="p-2 text-slate-400">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content - Added padding bottom for mobile nav */}
            <main className="flex-1 container mx-auto px-4 py-6 max-w-2xl pb-24 md:pb-6">
                <Outlet />
            </main>

            {/* Bottom Navigation for Mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 z-50 safe-area-bottom">
                <div className="flex justify-between items-center max-w-sm mx-auto">
                    <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-luma-teal' : 'text-slate-400'}`}>
                        <Home className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Inicio</span>
                    </Link>
                    <Link to="/profile" className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-luma-teal' : 'text-slate-400'}`}>
                        <Clock className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Historial</span>
                    </Link>
                    <a href="tel:112" className="flex flex-col items-center gap-1 text-red-500">
                        <div className="bg-red-50 p-2 rounded-full -mt-6 border-4 border-slate-50 shadow-sm">
                            <Phone className="w-6 h-6 fill-current" />
                        </div>
                        <span className="text-[10px] font-bold">112</span>
                    </a>
                    <Link to="/profile" className={`flex flex-col items-center gap-1 ${isActive('/profile') && !isActive('/profile?tab=history') ? 'text-luma-teal' : 'text-slate-400'}`}>
                        <User className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Perfil</span>
                    </Link>
                </div>
            </nav>

            {/* Footer (Desktop Only) */}
            <footer className="hidden md:block bg-white border-t border-slate-100 py-6 mt-auto">
                <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
                    <p>© 2025 Luma Pocket Hospital</p>
                </div>
            </footer>
        </div>
    );
};
