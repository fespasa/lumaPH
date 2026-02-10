import { useTriage } from '../context/TriageContext';
import { useAuth } from '../context/AuthContext';
import { ADULTS_QUESTIONS } from '../data/adults';
import { QuestionFlow } from '../components/triage/QuestionFlow';
import { PaymentWall } from '../components/payment/PaymentWall';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AdultsTriage = () => {
    const { state, dispatch } = useTriage();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);
    const [showPayment, setShowPayment] = useState(false);

    useEffect(() => {
        // First check if we are already in progress
        if (state.currentModuleId === 'adults' && state.currentQuestionId) {
            setIsChecking(false);
            return;
        }

        // If not in progress, check subscription
        if (isChecking) {
            if (user?.subscriptionPlan === 'premium') {
                startModule();
            } else {
                setShowPayment(true);
                setIsChecking(false);
            }
        }
    }, [user, state.currentModuleId]);

    const startModule = () => {
        dispatch({
            type: 'START_MODULE',
            moduleId: 'adults',
            startQuestionId: 'A_CRITICAL_1'
        });
        setIsChecking(false);
        setShowPayment(false);
    };

    const handlePaymentComplete = () => {
        startModule();
    };

    const handleSubscribe = () => {
        startModule();
    };

    const handleComplete = () => {
        navigate('/results');
    };

    const handleCriticalStop = () => {
        navigate('/results?emergency=true');
    };

    if (showPayment) {
        return (
            <PaymentWall
                onPaymentComplete={handlePaymentComplete}
                onSubscribe={handleSubscribe}
            />
        );
    }

    if (isChecking) {
        return <div>Cargando...</div>;
    }

    return (
        <QuestionFlow
            questions={ADULTS_QUESTIONS}
            onComplete={handleComplete}
            onCriticalStop={handleCriticalStop}
        />
    );
};
