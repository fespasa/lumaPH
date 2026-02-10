export type Severity = 'A' | 'B' | 'C' | 'D' | null;

export type QuestionId = string;

export interface PatientData {
    ageMonths?: number;
    weight?: number;
    isChronic?: boolean;
    temperature?: number;
    // Generic dynamic data
    [key: string]: any;
}

export type Condition = (data: PatientData) => boolean;

export interface Branch {
    questionId: QuestionId;
    condition?: Condition;
}

export interface Option {
    label: string;
    value: string | number | boolean;
    riskLevel?: Severity; // If this option is selected, upgrade risk to this level
    exclusive?: boolean; // If true, selecting this deselects others (e.g. "None of the above")
}

export interface Question {
    id: QuestionId;
    text: string;
    type: 'boolean' | 'numeric' | 'multiple_choice' | 'single_choice' | 'info' | 'text';
    options?: Option[]; // For multiple/single choice
    // For numeric inputs
    min?: number;
    max?: number;
    unit?: string;

    // Logic:
    // If ANY selected option has a riskLevel of 'A', we might want to stop immediately.
    // criticalStop: means if the resulting severity is A (or specified), stop flow.
    criticalStop?: boolean;

    next?: QuestionId | Branch[];
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
    // Answers can be:
    // boolean (YES/NO)
    // number (Temperature)
    // string[] (Multiple choice IDs)
    // string (Single choice / Text)
    answers: Record<QuestionId, any>;
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
    if (!newSeverity) return current;
    if (!current) return newSeverity;
    return SEVERITY_ORDER[newSeverity] > SEVERITY_ORDER[current] ? newSeverity : current;
}
