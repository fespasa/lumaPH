import React, { useEffect } from 'react';
import { useTriage } from '../../context/TriageContext';
import type { Question } from '../../lib/types';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface QuestionFlowProps {
    questions: Record<string, Question>;
    onComplete: () => void;
    onCriticalStop: () => void;
}

// Helper to calculate longest path from a given node
const calculateMaxDepth = (startId: string, allQuestions: Record<string, Question>): number => {
    const memo: Record<string, number> = {};
    const visited = new Set<string>();

    const getDepth = (id: string): number => {
        if (visited.has(id)) return 0; // Cycle detected, safe exit
        if (memo[id] !== undefined) return memo[id];

        visited.add(id);
        const question = allQuestions[id];
        if (!question) {
            visited.delete(id);
            return 0;
        }

        let maxChildDepth = 0;

        if (typeof question.next === 'string') {
            maxChildDepth = getDepth(question.next);
        } else if (Array.isArray(question.next)) {
            // Check all branches
            const branchDepths = question.next.map(b => getDepth(b.questionId));
            maxChildDepth = branchDepths.length > 0 ? Math.max(...branchDepths) : 0;
        }

        visited.delete(id);
        const depth = 1 + maxChildDepth;
        memo[id] = depth;
        return depth;
    };

    return getDepth(startId);
};

export const QuestionFlow: React.FC<QuestionFlowProps> = ({ questions, onComplete, onCriticalStop }) => {
    const { state, dispatch } = useTriage();
    const navigate = useNavigate();

    const currentQuestion = state.currentQuestionId ? questions[state.currentQuestionId] : null;

    // Calculate progress
    // We infer the start of the current flow from history if available, or current question.
    // Ideally, the context should know the "startQuestionId" of the module, but looking at history[0] is a good heuristic for "where we started this session".
    // If we just started, history is empty.
    const startNodeId = state.history.length > 0 ? state.history[0] : state.currentQuestionId;

    // Memoize the total steps calculation to avoid recalculating on every render unless startNode changes
    const totalSteps = React.useMemo(() => {
        if (!startNodeId) return 1;
        return calculateMaxDepth(startNodeId, questions);
    }, [startNodeId, questions]);

    const currentStep = state.history.length + 1;

    // Effect to separate side-effects from rendering
    useEffect(() => {
        if (state.isComplete) {
            onComplete();
        }
    }, [state.isComplete, onComplete]);

    // Handle Level A immediate stop
    useEffect(() => {
        if (state.maxSeverity === 'A') {
            onCriticalStop();
        }
    }, [state.maxSeverity, onCriticalStop]);


    const handleAnswer = (answer: boolean) => {
        if (!currentQuestion) return;

        // Check if this answer triggers the Criticality
        let riskLevel: 'A' | 'B' | 'C' | 'D' | undefined = undefined;

        // Logic: If answer is YES (true) and the question has a criticality, assign it.
        if (answer === true && currentQuestion.criticality) {
            riskLevel = currentQuestion.criticality;
        }

        dispatch({
            type: 'ANSWER_QUESTION',
            questionId: currentQuestion.id,
            answer,
            riskLevel
        });

        if (riskLevel === 'A') {
            return;
        }

        // Determine next question
        let nextId: string | null = null;
        if (typeof currentQuestion.next === 'string') {
            nextId = currentQuestion.next;
        } else if (Array.isArray(currentQuestion.next)) {
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
            <div className="w-full max-w-xl mb-4 px-2 md:px-0">
                <ProgressBar current={currentStep} total={totalSteps} />
            </div>

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
