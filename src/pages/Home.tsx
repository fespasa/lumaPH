
import { Card } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Baby, Heart, Brain } from 'lucide-react';

export const Home = () => {
    const navigate = useNavigate();

    const specialties = [
        {
            id: 'adults',
            title: 'Medicina General',
            icon: Stethoscope,
            color: 'bg-blue-500',
            desc: 'Síntomas generales en adultos'
        },
        {
            id: 'pediatrics',
            title: 'Pediatría',
            icon: Baby,
            color: 'bg-orange-500',
            desc: 'Atención para niños y bebés'
        },
        {
            id: 'womens-health',
            title: 'Salud de la Mujer',
            icon: Heart,
            color: 'bg-pink-500',
            desc: 'Embarazo, postparto y ginecología'
        },
        {
            id: 'mental-health',
            title: 'Salud Mental',
            icon: Brain,
            color: 'bg-purple-500',
            desc: 'Psicología y psiquiatría'
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-4 pt-4">
            <div className="text-center space-y-4 py-8">
                <div className="inline-block p-2 px-4 rounded-full bg-white/50 backdrop-blur-sm border border-white/50 text-xs font-bold text-luma-teal uppercase tracking-widest mb-2 shadow-sm">
                    Hospital de Bolsillo
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                    Tu salud, en tus <br />
                    <span className="bg-gradient-to-r from-luma-teal to-blue-500 bg-clip-text text-transparent">manos ahora.</span>
                </h1>
                <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
                    Selecciona una especialidad para iniciar tu triaje inteligente al instante.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specialties.map((item) => (
                    <Card
                        key={item.id}
                        animated
                        className="cursor-pointer group overflow-hidden border-0 ring-1 ring-slate-200/50 hover:ring-luma-teal/50"
                        onClick={() => navigate(`/triage/${item.id}`)}
                    >
                        <div className="flex items-center md:items-start gap-5 p-2 md:p-0">
                            <div className={`p-4 rounded-2xl ${item.color} bg-opacity-10 text-white shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-slate-800 group-hover:text-luma-teal transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300">
                                <div className="p-2 bg-slate-100 rounded-full text-luma-teal">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="mt-12">
                <Card className="bg-gradient-to-br from-luma-teal to-teal-800 text-white p-8 text-center space-y-6 relative overflow-hidden border-0 shadow-lg shadow-teal-900/20">
                    {/* Background Pattern */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10">
                        <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md shadow-inner border border-white/20">
                            <div className="text-3xl">💼</div>
                        </div>

                        <h2 className="text-2xl font-bold mb-3">¿Necesitas ayuda administrativa?</h2>
                        <p className="text-teal-50 mb-8 max-w-lg mx-auto text-lg leading-relaxed opacity-90">
                            Consulta con nuestros asesores especializados para temas administrativos, seguros médicos, gestión de citas o cualquier duda.
                        </p>

                        <button
                            onClick={() => navigate('/admin-support')}
                            className="bg-white text-luma-teal px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-teal-50 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 mx-auto w-full md:w-auto"
                        >
                            <span>Contactar Asesor</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};
