import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Send } from 'lucide-react';

export const AdminForm = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const reasonId = searchParams.get('reason');
    const [isLoading, setIsLoading] = useState(false);

    const getTitle = () => {
        switch (reasonId) {
            case 'insurance': return 'Seguros Médicos';
            case 'appointments': return 'Gestión de Citas';
            case 'billing': return 'Facturación';
            case 'services': return 'Información de Servicios';
            case 'tech-support': return 'Soporte Técnico';
            case 'other': return 'Otro Motivo';
            default: return 'Consulta General';
        }
    };

    const getPlaceholders = () => {
        switch (reasonId) {
            case 'insurance':
                return {
                    subject: 'Ej: ¿Trabajáis con Adeslas?',
                    description: 'Tengo dudas sobre si mi póliza cubre la consulta de pediatría...'
                };
            case 'appointments':
                return {
                    subject: 'Ej: Cambio de fecha cita Dr. López',
                    description: 'Necesito cambiar mi cita del próximo martes por motivos laborales...'
                };
            case 'billing':
                return {
                    subject: 'Ej: Error en cargo tarjeta',
                    description: 'Me han cobrado dos veces la consulta del día 15...'
                };
            case 'services':
                return {
                    subject: 'Ej: Consultas de salud mental',
                    description: '¿Tenéis psicólogos especializados en ansiedad infantil?'
                };
            case 'tech-support':
                return {
                    subject: 'Ej: No funciona el micrófono',
                    description: 'En las videollamadas no se me escucha bien...'
                };
            default:
                return {
                    subject: 'Ej: Consulta general',
                    description: 'Describa su consulta aquí con el mayor detalle posible...'
                };
        }
    };

    const placeholders = getPlaceholders();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            alert('Su consulta ha sido enviada. Un asesor le contactará pronto.');
            navigate('/');
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" className="p-2" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-6 h-6 text-slate-600" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">{getTitle()}</h1>
                    <p className="text-slate-500 text-sm">Complete el formulario para ayudarle mejor</p>
                </div>
            </div>

            <Card className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Asunto Específico</label>
                        <input required className="input-field w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-luma-teal" placeholder={placeholders.subject} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Descripción Detallada</label>
                        <textarea required rows={4} className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-luma-teal resize-none" placeholder={placeholders.description} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Preferencia de Contacto</label>
                        <select className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-luma-teal bg-white">
                            <option>Llamada Telefónica</option>
                            <option>Email</option>
                            <option>Videollamada</option>
                            <option>Whatsapp</option>
                        </select>
                    </div>

                    <Button className="w-full py-4 text-lg mt-4" isLoading={isLoading}>
                        <Send className="w-5 h-5 mr-2" />
                        Enviar Consulta
                    </Button>
                </form>
            </Card>
        </div>
    );
};
