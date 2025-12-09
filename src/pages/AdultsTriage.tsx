
import { useTriage } from '../context/TriageContext';
import { ADULTS_QUESTIONS } from '../data/adults';
import { QuestionFlow } from '../components/triage/QuestionFlow';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AdultsTriage = () => {
    const { dispatch } = useTriage();
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize the module
        dispatch({
            type: 'START_MODULE',
            moduleId: 'adults',
            startQuestionId: 'A1'
        });
    }, [dispatch]);

    const handleComplete = () => {
        navigate('/results');
    };

    const handleCriticalStop = () => {
        navigate('/results?emergency=true');
    };

    return (
        <QuestionFlow
            questions={ADULTS_QUESTIONS}
            onComplete={handleComplete}
            onCriticalStop={handleCriticalStop}
        />
    );
};
