import { useState, useEffect } from 'react';
import { useTriage } from '../context/TriageContext';
import { PEDIATRICS_QUESTIONS } from '../data/pediatrics';
import { QuestionFlow } from '../components/triage/QuestionFlow';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const PediatricsTriage = () => {
    const { state, dispatch } = useTriage();
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(true);

    // Form State
    const [dob, setDob] = useState('');
    const [isChronic, setIsChronic] = useState(false);
    const [weight, setWeight] = useState('');

    useEffect(() => {
        // If we are already in the module and not complete, hide form
        if (state.currentModuleId === 'pediatrics' && state.currentQuestionId) {
            setShowForm(false);
            // Restore patient data from state if needed? 
            // Actually if we reload, we might lose local state, but Context should hold it.
        }
    }, [state.currentModuleId, state.currentQuestionId]);

    const calculateAgeMonths = (birthDate: string) => {
        const birth = new Date(birthDate);
        const now = new Date();
        let months = (now.getFullYear() - birth.getFullYear()) * 12;
        months -= birth.getMonth();
        months += now.getMonth();
        return months <= 0 ? 0 : months;
    };

    const startTriage = () => {
        if (!dob) return;

        const ageMonths = calculateAgeMonths(dob);

        // Save data
        dispatch({
            type: 'SET_PATIENT_DATA',
            data: {
                ageMonths,
                isChronic,
                weight: weight ? parseFloat(weight) : undefined
            }
        });

        // Start Module
        dispatch({
            type: 'START_MODULE',
            moduleId: 'pediatrics',
            startQuestionId: 'A1'
        });

        setShowForm(false);
    };

    const handleComplete = () => {
        navigate('/results');
    };

    const handleCriticalStop = () => {
        navigate('/results?emergency=true');
    };

    if (showForm) {
        return (
            <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Pediatría</h1>
                    <p className="text-slate-500">Por favor, introduzca los datos del paciente</p>
                </div>

                <Card className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Fecha de Nacimiento</label>
                        <input
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-luma-teal/20 focus:border-luma-teal transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                        <input
                            type="checkbox"
                            id="chronic"
                            checked={isChronic}
                            onChange={(e) => setIsChronic(e.target.checked)}
                            className="w-5 h-5 text-luma-teal rounded focus:ring-luma-teal"
                        />
                        <label htmlFor="chronic" className="text-slate-700 font-medium cursor-pointer flex-1">
                            ¿Es paciente crónico / complejo / MACC?
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Peso (kg) <span className="text-slate-400 font-normal">(Opcional)</span></label>
                        <input
                            type="number"
                            step="0.1"
                            placeholder="Ej: 12.5"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-luma-teal/20 focus:border-luma-teal transition-all"
                        />
                    </div>

                    <Button
                        variant="primary"
                        className="w-full"
                        disabled={!dob}
                        onClick={startTriage}
                    >
                        Comenzar Triaje
                    </Button>
                </Card>
            </div>
        );
    }

    // Question Flow
    return (
        <QuestionFlow
            questions={PEDIATRICS_QUESTIONS}
            onComplete={handleComplete}
            onCriticalStop={handleCriticalStop}
        />
    );
};
