import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { TriageState, QuestionId, Severity, PatientData } from '../lib/types';
import { determineSeverity } from '../lib/types';

type Action =
    | { type: 'START_MODULE'; moduleId: string; startQuestionId: QuestionId }
    | { type: 'ANSWER_QUESTION'; questionId: QuestionId; answer: any; riskLevel?: Severity }
    | { type: 'SET_NEXT_QUESTION'; questionId: QuestionId | null } // null means end of flow
    | { type: 'SET_PATIENT_DATA'; data: PatientData }
    | { type: 'RESET' };

const initialState: TriageState = {
    currentModuleId: null,
    currentQuestionId: null,
    answers: {},
    maxSeverity: null,
    history: [],
    isComplete: false,
    patientData: {},
};

const triageReducer = (state: TriageState, action: Action): TriageState => {
    switch (action.type) {
        case 'START_MODULE':
            return {
                ...initialState,
                currentModuleId: action.moduleId,
                currentQuestionId: action.startQuestionId,
            };
        case 'ANSWER_QUESTION':
            // Calculate new severity
            const newSeverity = determineSeverity(state.maxSeverity, action.riskLevel || null);

            return {
                ...state,
                answers: { ...state.answers, [action.questionId]: action.answer },
                maxSeverity: newSeverity,
                history: [...state.history, action.questionId],
            };
        case 'SET_NEXT_QUESTION':
            return {
                ...state,
                currentQuestionId: action.questionId,
                isComplete: action.questionId === null,
            };
        case 'SET_PATIENT_DATA':
            return {
                ...state,
                patientData: { ...state.patientData, ...action.data },
            };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
};

const TriageContext = createContext<{
    state: TriageState;
    dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export const TriageProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(triageReducer, initialState);
    return (
        <TriageContext.Provider value={{ state, dispatch }}>
            {children}
        </TriageContext.Provider>
    );
};

export const useTriage = () => {
    const context = useContext(TriageContext);
    if (!context) {
        throw new Error('useTriage must be used within a TriageProvider');
    }
    return context;
};
