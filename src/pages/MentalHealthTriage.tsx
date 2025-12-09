import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Brain, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MentalHealthTriage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'selection' | 'form' | 'success'>('selection');
    const [specialty, setSpecialty] = useState<'psychology' | 'psychiatry' | null>(null);
    const [reason, setReason] = useState('');
    const [phone, setPhone] = useState('');

    const handleSelection = (type: 'psychology' | 'psychiatry') => {
        setSpecialty(type);
        setStep('form');
    };

    const handleSubmit = () => {
        // Here we would submit data to backend
        setStep('success');
    };

    const handleFinish = () => {
        navigate('/');
    };

    if (step === 'selection') {
        return (
            <div className="space-y-6 animate-fade-in text-center max-w-xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Salud Mental</h1>
                    <p className="text-slate-500">Seleccione el servicio que necesita</p>
                </div>

                <div className="grid gap-4">
                    <Button
                        size="lg"
                        onClick={() => handleSelection('psychology')}
                        className="h-24 text-xl bg-purple-500 hover:bg-purple-600 shadow-purple-500/30 flex flex-col gap-2 items-center justify-center"
                    >
                        <Brain className="w-8 h-8 opacity-80" />
                        Psicología
                    </Button>
                    <Button
                        size="lg"
                        onClick={() => handleSelection('psychiatry')}
                        className="h-24 text-xl bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/30 flex flex-col gap-2 items-center justify-center"
                    >
                        <Brain className="w-8 h-8 opacity-80" />
                        Psiquiatría
                    </Button>
                </div>
            </div>
        );
    }

    if (step === 'form') {
        return (
            <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">
                        Consulta de {specialty === 'psychology' ? 'Psicología' : 'Psiquiatría'}
                    </h1>
                    <p className="text-slate-500">Por favor, detalle su consulta</p>
                </div>

                <Card className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Motivo de la consulta</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            placeholder="Describa brevemente cómo se siente..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Teléfono de contacto</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="600 000 000"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                        />
                    </div>

                    <Button
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={handleSubmit}
                        disabled={!reason || !phone}
                    >
                        Solicitar Llamada
                    </Button>

                    <Button variant="ghost" className="w-full" onClick={() => setStep('selection')}>
                        Volver
                    </Button>
                </Card>
            </div>
        );
    }

    // Success Step
    return (
        <div className="space-y-8 animate-fade-in text-center max-w-xl mx-auto py-12">
            <div className="bg-purple-50 p-6 rounded-3xl inline-block">
                <Phone className="w-16 h-16 text-purple-600 mx-auto" />
            </div>

            <div className="space-y-4">
                <h1 className="text-3xl font-bold text-slate-900">Solicitud Enviada</h1>
                <p className="text-lg text-slate-600">
                    Hemos recibido su solicitud. Un profesional se pondrá en contacto con usted en el número <strong>{phone}</strong> a la mayor brevedad posible.
                </p>
            </div>

            <Button size="lg" className="w-full max-w-sm" onClick={handleFinish}>
                Volver al Inicio
            </Button>
        </div>
    );
};
