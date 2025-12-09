import { useState, useEffect } from 'react';
import { useTriage } from '../context/TriageContext';
import { WOMENS_HEALTH_QUESTIONS } from '../data/womens-health';
import { QuestionFlow } from '../components/triage/QuestionFlow';
import { useNavigate } from 'react-router-dom';

import { Button } from '../components/ui/Button';

export const WomensHealthTriage = () => {
    const { state, dispatch } = useTriage();
    const navigate = useNavigate();
    const [showSelection, setShowSelection] = useState(true);

    useEffect(() => {
        if (state.currentModuleId === 'womens-health' && state.currentQuestionId) {
            setShowSelection(false);
        }
    }, [state.currentModuleId, state.currentQuestionId]);

    const startModule = (startId: string) => {
        dispatch({
            type: 'START_MODULE',
            moduleId: 'womens-health',
            startQuestionId: startId
        });
        setShowSelection(false);
    };

    const handleComplete = () => {
        navigate('/results');
    };

    const handleCriticalStop = () => {
        navigate('/results?emergency=true');
    };

    if (showSelection) {
        return (
            <div className="max-w-xl mx-auto space-y-6 animate-fade-in text-center">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Salud de la Mujer</h1>
                    <p className="text-slate-500">Seleccione el motivo de su consulta</p>
                </div>

                <div className="grid gap-4">
                    <Button
                        size="lg"
                        onClick={() => startModule('PREG_START')}
                        className="h-20 text-xl bg-pink-500 hover:bg-pink-600 shadow-pink-500/30"
                    >
                        Estoy Embarazada
                    </Button>
                    <Button
                        size="lg"
                        onClick={() => startModule('POST_START')}
                        className="h-20 text-xl bg-pink-400 hover:bg-pink-500 shadow-pink-400/30"
                    >
                        Postparto (Puérpera)
                    </Button>
                    <Button
                        size="lg"
                        variant="secondary"
                        onClick={() => startModule('GYN_A1')}
                        className="h-20 text-xl"
                    >
                        Otra consulta ginecológica
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <QuestionFlow
            questions={WOMENS_HEALTH_QUESTIONS}
            onComplete={handleComplete}
            onCriticalStop={handleCriticalStop}
        />
    );
};
