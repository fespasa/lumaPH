export type Severity = 'A' | 'B' | 'C' | 'D' | null;

export type QuestionId = string;

export interface PatientData {
    ageMonths?: number;
    weight?: number;
    isChronic?: boolean;
}

export type Condition = (data: PatientData) => boolean;

export interface Branch {
    questionId: QuestionId;
    condition?: Condition; // Not serializable in JSON but fine for code-defined data
}

export interface Question {
    id: QuestionId;
    text: string;
    type: 'boolean' | 'numeric' | 'select' | 'info';
    options?: { label: string; value: string | number }[];
    criticality?: 'A' | 'B' | 'C' | 'D';
    next?: QuestionId | Branch[]; // Can be a string or a list of conditional branches
}

export interface TriageModule {
    id: string;
    title: string;
    questions: Record<QuestionId, Question>;
    startQuestionId: QuestionId;
}

export interface TriageState {
    currentModuleId: string | null;
    currentQuestionId: QuestionId | null;
    answers: Record<QuestionId, boolean | string | number>;
    maxSeverity: Severity;
    history: QuestionId[];
    isComplete: boolean;
    patientData: PatientData;
}

export const SEVERITY_ORDER: Record<string, number> = {
    'A': 4,
    'B': 3,
    'C': 2,
    'D': 1,
};

export function determineSeverity(current: Severity, newSeverity: Severity): Severity {
    if (!current) return newSeverity;
    if (!newSeverity) return current;
    return SEVERITY_ORDER[newSeverity] > SEVERITY_ORDER[current] ? newSeverity : current;
}
