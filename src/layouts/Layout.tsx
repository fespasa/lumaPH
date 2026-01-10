import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, Home, Clock, Phone, ChevronDown, FileText, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';

export const Layout = () => {
    const { logout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => location.pathname === path;

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleMenuClick = () => {
        setIsMenuOpen(false);
    };

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
                    <div className="hidden md:flex items-center gap-4">
                        {user?.role === 'admin' && (
                            <Link to="/admin/patients" className="text-sm font-medium text-slate-600 hover:text-luma-teal transition-colors">
                                Pacientes
                            </Link>
                        )}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-2 p-1 pl-3 pr-2 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
                            >
                                <span className="text-sm font-medium text-slate-700">{user?.name || 'Usuario'}</span>
                                <div className="w-8 h-8 rounded-full bg-luma-teal/10 flex items-center justify-center text-luma-teal">
                                    <User className="w-4 h-4" />
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in origin-top-right">
                                    <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                                        <p className="text-xs text-slate-500 font-medium">Conectado como</p>
                                        <p className="text-sm font-bold text-slate-900 truncate">{user?.email}</p>
                                    </div>
                                    <div className="p-2 space-y-1">
                                        <Link
                                            to="/profile?tab=data"
                                            onClick={handleMenuClick}
                                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-luma-teal rounded-xl transition-colors"
                                        >
                                            <User className="w-4 h-4" /> Mi Perfil
                                        </Link>
                                        <Link
                                            to="/profile?tab=history"
                                            onClick={handleMenuClick}
                                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-luma-teal rounded-xl transition-colors"
                                        >
                                            <Clock className="w-4 h-4" /> Historial de Consultas
                                        </Link>
                                        <Link
                                            to="/profile?tab=reports"
                                            onClick={handleMenuClick}
                                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-luma-teal rounded-xl transition-colors"
                                        >
                                            <FileText className="w-4 h-4" /> Informes Médicos
                                        </Link>
                                        <Link
                                            to="/profile?tab=appointments"
                                            onClick={handleMenuClick}
                                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-luma-teal rounded-xl transition-colors"
                                        >
                                            <Calendar className="w-4 h-4" /> Visitas Concertadas
                                        </Link>

                                        <div className="my-1 border-t border-slate-100"></div>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" /> Cerrar Sesión
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button - Keeping logs/profile simple for mobile for now or same dropdown? */}
                    {/* The prompt specifically mentioned "dropdown del menu", typically implying desktop, 
                        but let's update mobile nav to point to profile generally or simple logout. 
                        For strict mobile menu, usually a hamburger is better, but let's stick to the bottom nav for now as it's cleaner 
                        and just ensure the Desktop experience is solid as requested. */}
                    <div className="md:hidden">
                        <button onClick={handleLogout} className="p-2 text-slate-400">
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
