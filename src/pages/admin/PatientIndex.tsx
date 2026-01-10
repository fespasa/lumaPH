import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { User, FileText, ChevronRight } from 'lucide-react';

export const PatientIndex = () => {
    const { mockUsers } = useAuth();

    // Filter only patients
    const patients = mockUsers.filter(u => u.role === 'patient');

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Índice de Pacientes</h1>

            <div className="grid gap-4">
                {patients.map(patient => (
                    <Card key={patient.id} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">{patient.name}</h3>
                                <p className="text-sm text-slate-500">{patient.email}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${patient.subscriptionPlan === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {patient.subscriptionPlan === 'premium' ? 'Premium' : 'Básico'}
                                </span>
                            </div>
                        </div>

                        <Link
                            to={`/profile/${patient.id}`}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-luma-teal hover:text-white transition-colors"
                        >
                            <FileText className="w-4 h-4" />
                            <span className="text-sm font-medium">Ver Expediente</span>
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </Card>
                ))}
            </div>
        </div>
    );
};
