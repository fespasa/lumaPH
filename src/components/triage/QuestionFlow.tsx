import React, { useEffect } from 'react';
import { useTriage } from '../../context/TriageContext';
import type { Question } from '../../lib/types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface QuestionFlowProps {
    questions: Record<string, Question>;
    onComplete: () => void;
    onCriticalStop: () => void;
}

export const QuestionFlow: React.FC<QuestionFlowProps> = ({ questions, onComplete, onCriticalStop }) => {
    const { state, dispatch } = useTriage();
    const navigate = useNavigate();

    const currentQuestion = state.currentQuestionId ? questions[state.currentQuestionId] : null;

    // Effect to separate side-effects from rendering
    useEffect(() => {
        if (state.isComplete) {
            onComplete();
        }
    }, [state.isComplete, onComplete]);

    // Handle Level A immediate stop
    useEffect(() => {
        // If we answered YES to a Level A question, the maxSeverity becomes A.
        // We should check if the *last answered question* caused this, or just check state.
        // But we only want to trigger this ONCE when it happens.
        // Actually, let's handle the redirection in the handleAnswer logic or separate effect.
        if (state.maxSeverity === 'A') {
            onCriticalStop();
        }
    }, [state.maxSeverity, onCriticalStop]);


    const handleAnswer = (answer: boolean) => {
        if (!currentQuestion) return;

        // Check if this answer triggers the Criticality
        let riskLevel: 'A' | 'B' | 'C' | 'D' | undefined = undefined;

        // Logic: If answer is YES (true) and the question has a criticality, assign it.
        // Spec says: "Si el usuario marca un síntoma de Nivel A -> Interumpe".
        // So usually boolean questions trigger risk on TRUE.
        if (answer === true && currentQuestion.criticality) {
            riskLevel = currentQuestion.criticality;
        }

        dispatch({
            type: 'ANSWER_QUESTION',
            questionId: currentQuestion.id,
            answer,
            riskLevel
        });

        // If Level A, the effect above will handle the stop.
        // Otherwise calculate next question.
        if (riskLevel === 'A') {
            // Stop immediately, don't set next question, just let effect handle.
            return;
        }

        // Determine next question
        let nextId: string | null = null;
        if (typeof currentQuestion.next === 'string') {
            nextId = currentQuestion.next;
        } else if (Array.isArray(currentQuestion.next)) {
            // Logic for branching
            // Find the first branch where condition is true (or no condition)
            const matchedBranch = currentQuestion.next.find(branch => {
                if (!branch.condition) return true;
                return branch.condition(state.patientData);
            });
            nextId = matchedBranch ? matchedBranch.questionId : null;
        }

        dispatch({ type: 'SET_NEXT_QUESTION', questionId: nextId });
    };

    if (!currentQuestion) {
        if (state.isComplete || state.maxSeverity === 'A') return null; // Handled by effects
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] w-full">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-xl"
                >
                    <Card className="p-6 md:p-12 flex flex-col items-center text-center gap-6 md:gap-8 mx-2 md:mx-0">
                        <h2 className="text-xl md:text-3xl font-medium text-slate-800 leading-relaxed">
                            {currentQuestion.text}
                        </h2>

                        <div className="grid grid-cols-2 gap-4 w-full md:w-auto md:flex">
                            <Button
                                variant="secondary"
                                size="lg"
                                className="w-full md:w-40 text-lg py-4 md:py-6 rounded-xl md:rounded-2xl border-slate-300 hover:border-slate-400"
                                onClick={() => handleAnswer(false)}
                            >
                                NO
                            </Button>
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full md:w-40 text-lg py-4 md:py-6 rounded-xl md:rounded-2xl bg-luma-teal hover:bg-teal-700 shadow-teal-500/30"
                                onClick={() => handleAnswer(true)}
                            >
                                SÍ
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </AnimatePresence>

            <div className="mt-8">
                <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-slate-400">
                    Cancelar Triaje
                </Button>
            </div>
        </div>
    );
};
