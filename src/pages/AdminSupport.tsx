import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
    Shield,
    Calendar,
    CreditCard,
    ClipboardList,
    Wrench,
    MessageCircle,
    ArrowLeft,
    Briefcase
} from 'lucide-react';

export const AdminSupport = () => {
    const navigate = useNavigate();

    const reasons = [
        {
            id: 'insurance',
            title: 'Seguros médicos',
            description: 'Información sobre pólizas, coberturas y tramitación',
            icon: Shield,
            color: 'text-luma-teal'
        },
        {
            id: 'appointments',
            title: 'Gestión de citas',
            description: 'Programar, modificar o cancelar citas médicas',
            icon: Calendar,
            color: 'text-red-500' // Using red/brownish tone from image idea
        },
        {
            id: 'billing',
            title: 'Facturación',
            description: 'Consultas sobre facturas, pagos y reembolsos',
            icon: CreditCard,
            color: 'text-blue-500'
        },
        {
            id: 'services',
            title: 'Información de servicios',
            description: 'Detalles sobre especialidades y tratamientos',
            icon: ClipboardList,
            color: 'text-orange-500'
        },
        {
            id: 'tech-support',
            title: 'Soporte técnico',
            description: 'Problemas con la app o videollamadas',
            icon: Wrench,
            color: 'text-slate-500'
        },
        {
            id: 'other',
            title: 'Otro motivo',
            description: 'Especifica tu consulta personalizada',
            icon: MessageCircle,
            color: 'text-slate-400'
        }
    ];

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* Header */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-luma-teal/10 p-2 rounded-lg">
                        <Briefcase className="w-6 h-6 text-luma-teal" />
                    </div>
                    <h1 className="text-xl font-bold text-slate-800">Consulta con Asesor</h1>
                </div>
                <Button
                    variant="primary"
                    size="sm"
                    className="bg-luma-teal hover:bg-teal-700"
                    onClick={() => navigate('/')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver
                </Button>
            </div>

            <div className="text-center py-4">
                <h2 className="text-slate-600 font-medium">Selecciona el motivo de tu consulta administrativa</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reasons.map((reason) => (
                    <Card
                        key={reason.id}
                        className="p-6 text-center hover:ring-2 hover:ring-luma-teal transition-all cursor-pointer group"
                        onClick={() => navigate(`/admin-support/form?reason=${reason.id}`)}
                    >
                        <div className="mx-auto w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <reason.icon className={`w-7 h-7 ${reason.color}`} />
                        </div>
                        <h3 className="text-lg font-bold text-luma-teal mb-2">{reason.title}</h3>
                        <p className="text-sm text-slate-500">{reason.description}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
};
