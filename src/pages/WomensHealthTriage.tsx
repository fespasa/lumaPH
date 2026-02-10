import { useState, useEffect } from 'react';
import { useTriage } from '../context/TriageContext';
import { useAuth } from '../context/AuthContext';
import { WOMENS_HEALTH_QUESTIONS } from '../data/womens-health';
import { QuestionFlow } from '../components/triage/QuestionFlow';
import { PaymentWall } from '../components/payment/PaymentWall';
import { useNavigate } from 'react-router-dom';

export const WomensHealthTriage = () => {
    const { state, dispatch } = useTriage();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);
    const [showPayment, setShowPayment] = useState(false);

    useEffect(() => {
        if (state.currentModuleId === 'womens-health' && state.currentQuestionId) {
            setIsChecking(false);
            return;
        }

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
            moduleId: 'womens-health',
            startQuestionId: 'WH_PROFILE_SELECT'
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
            questions={WOMENS_HEALTH_QUESTIONS}
            onComplete={handleComplete}
            onCriticalStop={handleCriticalStop}
        />
    );
};
