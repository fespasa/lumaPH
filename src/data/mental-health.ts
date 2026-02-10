import type { Question, QuestionId } from '../lib/types';

export const MENTAL_HEALTH_QUESTIONS: Record<QuestionId, Question> = {
    // REASON FOR CONSULTATION
    'MH_REASON': {
        id: 'MH_REASON',
        text: "Por favor, describa brevemente el motivo de su consulta:",
        type: 'text',
        next: 'MH_HISTORY'
    },

    // BLOCK 0 - HISTORY
    'MH_HISTORY': {
        id: 'MH_HISTORY',
        text: "Antecedentes y Situación Actual",
        type: 'multiple_choice',
        options: [
            { label: 'He estado ingresado/a en psiquiatría previamente', value: 'HOSPITALIZATION', riskLevel: 'B' },
            { label: 'Consumo activo de alcohol o sustancias', value: 'SUBSTANCE_ACTIVE', riskLevel: 'B' },
            { label: 'Tomo medicación psiquiátrica actualmente', value: 'MEDS_CURRENT' },
            { label: 'Tengo un diagnóstico previo de salud mental', value: 'DIAGNOSIS_PREV' }
        ],
        next: [
            // Logic: If Hospitalization or Substance active -> Jump to Critical Check first (Block 3)
            {
                questionId: 'MH_GRAVE',
                condition: (data) => {
                    const ans = data['MH_HISTORY'];
                    return Array.isArray(ans) && (ans.includes('HOSPITALIZATION') || ans.includes('SUBSTANCE_ACTIVE'));
                }
            },
            { questionId: 'MH_GENERAL' } // Default flow
        ]
    },

    // BLOCK 1 - GENERAL STATE
    'MH_GENERAL': {
        id: 'MH_GENERAL',
        text: "¿Cómo se siente actualmente?",
        type: 'multiple_choice',
        options: [
            { label: 'Ansiedad intensa o insomnio grave', value: 'ANXIETY_SEVERE', riskLevel: 'B' },
            { label: 'Dificultad para realizar actividades diarias', value: 'FUNCTION_IMPAIR', riskLevel: 'B' },
            { label: 'Crisis de pánico recientes', value: 'PANIC', riskLevel: 'C' },
            { label: 'Estado de ánimo bajo o triste', value: 'SAD', riskLevel: 'C' }
        ],
        next: 'MH_MODERATE'
    },

    // BLOCK 2 - MODERATE ALERTS
    'MH_MODERATE': {
        id: 'MH_MODERATE',
        text: "Situaciones específicas",
        type: 'multiple_choice',
        options: [
            { label: 'He abandonado mi medicación por mi cuenta', value: 'MEDS_DROP', riskLevel: 'B' },
            { label: 'Mi entorno está preocupado por mi conducta', value: 'FAMILY_CONCERN', riskLevel: 'B' },
            { label: 'Percepciones extrañas o irreales', value: 'HALLUCINATIONS_MILD', riskLevel: 'B' },
            { label: 'Problemas con la comida (ingesta)', value: 'EATING_DISORDER', riskLevel: 'B' },
            { label: 'Ánimo depresivo mayor a 3 semanas', value: 'DEPRESSION_LONG', riskLevel: 'B' }
        ],
        next: 'MH_GRAVE'
    },

    // BLOCK 3 - GRAVE ALERTS (Critical)
    'MH_GRAVE': {
        id: 'MH_GRAVE',
        text: "Signos de Alarma Grave",
        type: 'multiple_choice',
        options: [
            { label: 'Ideas de muerte o suicidio', value: 'SUICIDE_IDEATION', riskLevel: 'A' },
            { label: 'Planes de hacerme daño o a otros', value: 'HARM_PLAN', riskLevel: 'A' },
            { label: 'Agresividad o violencia incontrolable', value: 'AGGRESSION', riskLevel: 'A' },
            { label: 'Oigo voces o veo cosas que otros no ven', value: 'PSYCHOSIS', riskLevel: 'A' }
        ],
        criticalStop: true, // Stop if A
        next: 'MH_ADMIN'
    },

    // BLOCK 4 - ADMIN
    'MH_ADMIN': {
        id: 'MH_ADMIN',
        text: "Consultas Administrativas",
        type: 'multiple_choice',
        options: [
            { label: 'Necesito renovar recetas', value: 'PRESCRIPTION', riskLevel: 'D' },
            { label: 'Dudas sobre la medicación', value: 'MEDS_DOUBT', riskLevel: 'D' },
            { label: 'Necesito un informe', value: 'REPORT', riskLevel: 'D' }
        ],
        next: undefined
    }
};
