import React, { useEffect, useState, useMemo } from 'react';
import { useTriage } from '../../context/TriageContext';
import type { Question, Option, Severity, PatientData, Branch } from '../../lib/types';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { SEVERITY_ORDER } from '../../lib/types';

interface QuestionFlowProps {
    questions: Record<string, Question>;
    onComplete: () => void;
    onCriticalStop: () => void;
}



export const QuestionFlow: React.FC<QuestionFlowProps> = ({ questions, onComplete, onCriticalStop }) => {
    const { state, dispatch } = useTriage();
    const navigate = useNavigate();

    // Local state for inputs (text, numeric, multiple choice selection)
    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [numericValue, setNumericValue] = useState<string>('');

    const currentQuestion = state.currentQuestionId ? questions[state.currentQuestionId] : null;

    // Reset local state when question changes
    useEffect(() => {
        setSelectedOptions([]);
        setInputValue('');
        setNumericValue('');
    }, [state.currentQuestionId]);

    // Handle Critical Level A immediate stop
    useEffect(() => {
        if (state.maxSeverity === 'A' && state.answers[state.currentQuestionId || '']) {
            // Only stop if we just answered? 
            // Logic moved to handleNext to be more controlled
        }
    }, [state.maxSeverity]);

    // Progress calculation
    const currentStep = state.history.length + 1;
    // Estimate total steps
    const totalSteps = useMemo(() => Object.keys(questions).length, [questions]);


    const handleNext = () => {
        if (!currentQuestion) return;

        let riskLevel: Severity = null;
        let answer: any = null;
        let newPatientData: Partial<PatientData> = {};

        // Process Answer based on type
        if (currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'single_choice') {
            answer = selectedOptions; // Array of values

            // Calculate max risk from selected options
            // Find the options in the definition
            if (currentQuestion.options) {
                currentQuestion.options.forEach(opt => {
                    if (selectedOptions.includes(opt.value)) {
                        if (opt.riskLevel) {
                            // Update max risk
                            if (!riskLevel || SEVERITY_ORDER[opt.riskLevel] > SEVERITY_ORDER[riskLevel]) {
                                riskLevel = opt.riskLevel;
                            }
                        }
                    }
                });
            }
        } else if (currentQuestion.type === 'boolean') {
            // Handled directly in render via separate buttons, but if we unify:
            // Logic usually inside the click handler for Yes/No
        } else if (currentQuestion.type === 'numeric') {
            answer = parseFloat(numericValue);
            newPatientData = { ...state.patientData, [currentQuestion.id]: answer };
            // Risk logic could be here if defined, or via branches later
        } else if (currentQuestion.type === 'text') {
            answer = inputValue;
            newPatientData = { ...state.patientData, [currentQuestion.id]: answer };
        } else if (currentQuestion.type === 'info') {
            answer = true; // Ack
        }

        // Dispatch Answer
        dispatch({
            type: 'ANSWER_QUESTION',
            questionId: currentQuestion.id,
            answer,
            riskLevel
        });

        if (Object.keys(newPatientData).length > 0) {
            dispatch({
                type: 'SET_PATIENT_DATA',
                data: newPatientData
            });
        }

        // Check Critical Stop
        if (currentQuestion.criticalStop && riskLevel === 'A') {
            onCriticalStop();
            return;
        }

        // Immediate Stop for Level A if configured globally or explicitly
        if (riskLevel === 'A') {
            onCriticalStop();
            return;
        }

        // Calculate Next Question
        let nextId: string | null = null;

        if (typeof currentQuestion.next === 'string') {
            nextId = currentQuestion.next;
        } else if (Array.isArray(currentQuestion.next)) {
            // Evaluate branches
            // We need to pass the *current* accumulated data + new answer if needed
            // For now, assume conditions use passed patientData.
            // We might need to mix in the current answer if the condition relies on it.
            const dataForEnc = { ...state.patientData, ...newPatientData, [currentQuestion.id]: answer };

            const matchedBranch = (currentQuestion.next as Branch[]).find(branch => {
                if (!branch.condition) return true;
                return branch.condition(dataForEnc);
            });
            nextId = matchedBranch ? matchedBranch.questionId : null;
        }

        dispatch({ type: 'SET_NEXT_QUESTION', questionId: nextId });

        if (!nextId) {
            onComplete();
        }
    };

    const toggleOption = (option: Option) => {
        if (currentQuestion?.type === 'single_choice') {
            setSelectedOptions([option.value]);
            // If single choice with no confirm button needed (optional UX), we could auto-advance
            // But let's keep it consistent with specific logic if needed
        } else {
            // Multiple choice
            if (selectedOptions.includes(option.value)) {
                setSelectedOptions(selectedOptions.filter(v => v !== option.value));
            } else {
                // Handle exclusive options
                if (option.exclusive) {
                    setSelectedOptions([option.value]);
                } else {
                    // Remove any exclusive options if strictly enforcing
                    const newOptions = selectedOptions.filter(v => {
                        const optDef = currentQuestion?.options?.find(o => o.value === v);
                        return !optDef?.exclusive;
                    });
                    setSelectedOptions([...newOptions, option.value]);
                }
            }
        }
    };

    const handleBoolean = (val: boolean) => {
        // Shortcut for boolean type
        // Use options if available, otherwise just use value
        const optionDef = currentQuestion!.options?.find(o => o.value === val);
        const risk = optionDef?.riskLevel;

        dispatch({
            type: 'ANSWER_QUESTION',
            questionId: currentQuestion!.id,
            answer: val,
            riskLevel: risk
        });

        if (risk === 'A') {
            onCriticalStop();
            return;
        }

        // Next logic duplication (refactor later)
        let nextId: string | null = null;
        if (typeof currentQuestion!.next === 'string') {
            nextId = currentQuestion!.next as string;
        } else if (Array.isArray(currentQuestion!.next)) {
            // For boolean, we might want to pass the answer val in data?
            // Or just use existing data. 
            const dataForEnc = { ...state.patientData, [currentQuestion!.id]: val };
            const matchedBranch = (currentQuestion!.next as Branch[]).find(branch => {
                if (!branch.condition) return true;
                return branch.condition(dataForEnc);
            });
            nextId = matchedBranch ? matchedBranch.questionId : null;
        }

        dispatch({ type: 'SET_NEXT_QUESTION', questionId: nextId });
        if (!nextId) onComplete();
    };


    if (!currentQuestion) {
        if (state.isComplete) return null;
        return <div className="p-8 text-center animate-pulse">Cargando pregunta...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] w-full px-4">
            <div className="w-full max-w-xl mb-6">
                <ProgressBar current={currentStep} total={totalSteps} />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-2xl"
                >
                    <Card className="p-6 md:p-10 flex flex-col gap-6">
                        <h2 className="text-xl md:text-2xl font-medium text-slate-800 text-center">
                            {currentQuestion.text}
                        </h2>

                        {/* Render Input Types */}

                        {/* BOOLEAN */}
                        {currentQuestion.type === 'boolean' && (
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="h-16 text-lg border-slate-200"
                                    onClick={() => handleBoolean(false)}
                                >
                                    NO
                                </Button>
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="h-16 text-lg bg-luma-teal hover:bg-teal-700"
                                    onClick={() => handleBoolean(true)}
                                >
                                    SÍ
                                </Button>
                            </div>
                        )}

                        {/* MULTIPLE / SINGLE CHOICE */}
                        {(currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'single_choice') && (
                            <div className="space-y-3 mt-2">
                                {currentQuestion.options?.map((opt) => {
                                    const isSelected = selectedOptions.includes(opt.value);
                                    return (
                                        <div
                                            key={String(opt.value)}
                                            onClick={() => toggleOption(opt)}
                                            className={`
                                                flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer
                                                ${isSelected
                                                    ? 'border-luma-teal bg-luma-teal/5'
                                                    : 'border-slate-100 hover:border-slate-200 bg-white'}
                                            `}
                                        >
                                            <div className={`
                                                w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors
                                                ${isSelected ? 'border-luma-teal bg-luma-teal text-white' : 'border-slate-300'}
                                            `}>
                                                {isSelected && <Check className="w-4 h-4" />}
                                            </div>
                                            <span className={`font-medium ${isSelected ? 'text-luma-teal' : 'text-slate-600'}`}>
                                                {opt.label}
                                            </span>
                                        </div>
                                    );
                                })}

                                <div className="pt-4">
                                    <Button
                                        className="w-full h-14 text-lg bg-luma-teal hover:bg-teal-700"
                                        onClick={handleNext}
                                        disabled={currentQuestion.type === 'single_choice' && selectedOptions.length === 0}
                                    >
                                        Siguiente
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* NUMERIC */}
                        {currentQuestion.type === 'numeric' && (
                            <div className="space-y-6 mt-4">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        value={numericValue}
                                        onChange={(e) => setNumericValue(e.target.value)}
                                        placeholder="0"
                                        min={currentQuestion.min}
                                        max={currentQuestion.max}
                                        className="w-full text-3xl font-bold p-4 text-center rounded-xl border border-slate-200 focus:border-luma-teal focus:ring-4 focus:ring-luma-teal/10 outline-none transition-all"
                                    />
                                    {currentQuestion.unit && (
                                        <span className="text-xl text-slate-500 font-medium">
                                            {currentQuestion.unit}
                                        </span>
                                    )}
                                </div>
                                <Button
                                    className="w-full h-14 text-lg bg-luma-teal hover:bg-teal-700"
                                    onClick={handleNext}
                                    disabled={!numericValue}
                                >
                                    Siguiente
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        )}

                        {/* TEXT */}
                        {currentQuestion.type === 'text' && (
                            <div className="space-y-6 mt-4">
                                <textarea
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Escriba aquí..."
                                    rows={4}
                                    className="w-full p-4 text-lg rounded-xl border border-slate-200 focus:border-luma-teal focus:ring-4 focus:ring-luma-teal/10 outline-none transition-all resize-none"
                                />
                                <Button
                                    className="w-full h-14 text-lg bg-luma-teal hover:bg-teal-700"
                                    onClick={handleNext}
                                    disabled={!inputValue.trim()}
                                >
                                    Siguiente
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        )}

                        {/* INFO */}
                        {currentQuestion.type === 'info' && (
                            <div className="pt-4">
                                <Button
                                    className="w-full h-14 text-lg bg-luma-teal hover:bg-teal-700"
                                    onClick={handleNext}
                                >
                                    Entendido
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        )}

                    </Card>
                </motion.div>
            </AnimatePresence>

            <div className="mt-8">
                <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-slate-400 hover:text-red-500">
                    Cancelar y salir
                </Button>
            </div>
        </div>
    );
};
