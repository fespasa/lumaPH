import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { User, Activity, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard = () => {
    const { logout } = useAuth();

    // Mock Data
    const stats = [
        { label: 'Usuarios Totales', value: '1,234', icon: User, color: 'bg-blue-100 text-blue-600' },
        { label: 'Triajes Hoy', value: '45', icon: Activity, color: 'bg-green-100 text-green-600' },
        { label: 'Casos Críticos', value: '3', icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
    ];

    const recentActivity = [
        { id: 1, user: 'María García', type: 'Triaje Adultos', result: 'Urgente (B)', time: 'Hace 5 min' },
        { id: 2, user: 'Antonio López', type: 'Pediatría', result: 'Crítico (A)', time: 'Hace 12 min', isCritical: true },
        { id: 3, user: 'Elena Sanz', type: 'Salud Mental', result: 'Solicitud Enviada', time: 'Hace 30 min' },
        { id: 4, user: 'Pedro Ruíz', type: 'Medicina General', result: 'Rutina (C)', time: 'Hace 1h' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-6 space-y-8 animate-fade-in">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                    <img src="/logo.jpg" alt="LUMA" className="h-8 w-auto" />
                    <span className="font-bold text-slate-700">Panel de Administración</span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>Cerrar Sesión</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="flex items-center gap-4 p-6">
                        <div className={`p-4 rounded-xl ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 space-y-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-slate-400" />
                        Actividad Reciente
                    </h3>
                    <div className="space-y-3">
                        {recentActivity.map(act => (
                            <div key={act.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-900">{act.user}</p>
                                    <p className="text-sm text-slate-500">{act.type}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${act.isCritical ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-slate-200 text-slate-600'
                                        }`}>
                                        {act.result}
                                    </span>
                                    <p className="text-xs text-slate-400 mt-1">{act.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-6 space-y-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-slate-400" />
                        Accesos Directos
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="secondary" className="h-24 flex flex-col gap-2">
                            <CheckCircle className="w-6 h-6" />
                            Validar Médicos
                        </Button>
                        <Button variant="secondary" className="h-24 flex flex-col gap-2">
                            <User className="w-6 h-6" />
                            Gestionar Usuarios
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};
