import { useEffect } from 'react';
import { useTriage } from '../context/TriageContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Phone, Calendar, Clock, AlertTriangle, FileText } from 'lucide-react';

export const Results = () => {
    const { state, dispatch } = useTriage();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const isEmergencyOverride = searchParams.get('emergency') === 'true';
    // Determine final severity: Override A takes precedence, otherwise use maxSeverity from state.
    // If no severity (e.g. direct access), default to 'D' or redirect home.
    const severity = isEmergencyOverride ? 'A' : (state.maxSeverity || 'D');

    // If state is empty and no override, maybe redirect home?
    useEffect(() => {
        if (!isEmergencyOverride && !state.currentModuleId) {
            navigate('/');
        }
    }, [isEmergencyOverride, state.currentModuleId, navigate]);

    const handleReset = () => {
        dispatch({ type: 'RESET' });
        navigate('/');
    };

    const renderContent = () => {
        switch (severity) {
            case 'A':
                return (
                    <div className="text-center space-y-8 animate-fade-in">
                        <div className="bg-red-50 p-6 rounded-3xl inline-block">
                            <AlertTriangle className="w-16 h-16 text-red-600 mx-auto" />
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-slate-900">Atención Necesaria</h1>
                            <p className="text-lg text-slate-600 max-w-md mx-auto">
                                Según sus síntomas, es necesaria una valoración médica inmediata.
                            </p>
                        </div>

                        <a href="tel:112" className="block w-full">
                            <Button variant="danger" size="lg" className="w-full py-6 md:py-8 text-xl md:text-2xl animate-pulse shadow-red-500/50">
                                <Phone className="w-6 h-6 md:w-8 md:h-8 mr-3" />
                                LLAMAR AL 112
                            </Button>
                        </a>

                        <Button variant="ghost" onClick={handleReset} className="text-slate-400">
                            Volver al inicio
                        </Button>
                    </div>
                );

            case 'B':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="text-center mb-8">
                            <div className="bg-orange-50 p-4 rounded-2xl inline-block mb-4">
                                <Clock className="w-10 h-10 text-orange-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900">Valoración Prioritaria</h1>
                            <p className="text-slate-600 mt-2">
                                Hemos registrado sus respuestas. Un profesional sanitario debe valorar su caso a la brevedad.
                            </p>
                        </div>

                        <Card className="space-y-4">
                            <h3 className="font-semibold text-slate-800">Solicitud de llamada</h3>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600">Teléfono de contacto</label>
                                <input
                                    type="tel"
                                    placeholder="600 000 000"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                />
                            </div>

                            <div className="pt-2">
                                <Button variant="secondary" className="w-full justify-start text-slate-600">
                                    <FileText className="w-5 h-5 mr-2" />
                                    Adjuntar documento / foto
                                </Button>
                            </div>

                            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/20">
                                Enviar Solicitud
                            </Button>
                        </Card>

                        <div className="text-center">
                            <Button variant="ghost" onClick={handleReset}>Volver al inicio</Button>
                        </div>
                    </div>
                );

            case 'C':
            case 'D':
            default:
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="text-center mb-8">
                            <div className="bg-luma-teal/10 p-4 rounded-2xl inline-block mb-4">
                                <Calendar className="w-10 h-10 text-luma-teal" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900">Consulta Programada</h1>
                            <p className="text-slate-600 mt-2">
                                Su consulta puede ser gestionada tranquila y eficientemente mediante una visita programada.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <Card className="hover:border-luma-teal transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="bg-luma-teal/10 p-3 rounded-xl group-hover:bg-luma-teal group-hover:text-white transition-colors text-luma-teal">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-slate-900">Prefiero que me llamen</h3>
                                        <p className="text-sm text-slate-500">Nos pondremos en contacto con usted</p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="hover:border-luma-teal transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="bg-luma-teal/10 p-3 rounded-xl group-hover:bg-luma-teal group-hover:text-white transition-colors text-luma-teal">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-slate-900">Concertar Videollamada</h3>
                                        <p className="text-sm text-slate-500">Elija el día y hora que mejor le convenga</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <div className="text-center">
                            <Button variant="ghost" onClick={handleReset}>Volver al inicio</Button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="py-8">
            {renderContent()}
        </div>
    );
};
