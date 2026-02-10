import type { Question, QuestionId, Condition } from '../lib/types';

// Conditions for age based logic
const isNeonatal: Condition = (data) => (data.ageMonths || 0) < 3;
// const isInfant: Condition = (data) => (data.ageMonths || 0) >= 3;

export const PEDIATRICS_QUESTIONS: Record<QuestionId, Question> = {
    // LEVEL A - INITIAL EVALUATION
    'P_A_INITIAL': {
        id: 'P_A_INITIAL',
        text: "Evaluación Inicial: ¿Presenta alguno de estos signos de alarma?",
        type: 'multiple_choice',
        options: [
            { label: 'Inconsciencia o no responde', value: 'UNCONSCIOUS', riskLevel: 'A' },
            { label: 'Respiración muy rápida o con mucha dificultad', value: 'BREATHING_FAST', riskLevel: 'A' },
            { label: 'Color azulado en labios o piel', value: 'BLUE_COLOR', riskLevel: 'A' },
            { label: 'Convulsión activa en este momento', value: 'SEIZURE_ACTIVE', riskLevel: 'A' }
        ],
        criticalStop: true, // Stop if A
        next: 'P_FEVER_INPUT'
    },

    // FEVER CHECK (Input)
    'P_FEVER_INPUT': {
        id: 'P_FEVER_INPUT',
        text: "¿Qué temperatura tiene el niño/a? (Grados Centígrados)",
        type: 'numeric',
        min: 35,
        max: 45,
        unit: '°C',
        next: [
            // Logic: < 3 months with > 38 -> A
            {
                questionId: 'P_FEVER_CRITICAL_STOP', // Virtual node to stop
                condition: (data) => {
                    const temp = data['P_FEVER_INPUT'];
                    return isNeonatal(data) && temp >= 38;
                }
            },
            { questionId: 'P_BLOCK1_RESP' }
        ]
    },

    'P_FEVER_CRITICAL_STOP': {
        id: 'P_FEVER_CRITICAL_STOP',
        text: "Fiebre en menores de 3 meses es una emergencia.",
        type: 'info',
        criticalStop: true,
        // We can force riskLevel A via a hidden option or just handle it here
        // Since 'info' type just shows text, we rely on the component to handle 'criticalStop' if we flag it.
        // But better: use a question that auto-answers or just route to A.
        // However, the cleanest way in current flow is to have a node that IS Level A.
        // Let's make it a boolean "Confirm" that has Risk A.
        options: [{ label: 'Entendido', value: true, riskLevel: 'A' }],
        next: undefined
    },

    // BLOCK 1 - RESPIRATORY (Level B)
    'P_BLOCK1_RESP': {
        id: 'P_BLOCK1_RESP',
        text: "Bloque Respiratorio: ¿Nota algo diferente al respirar?",
        type: 'multiple_choice',
        options: [
            { label: 'Tiraje (se hunden las costillas)', value: 'RETRACTIONS', riskLevel: 'B' },
            { label: 'Aleteo nasal (se mueven las narinas)', value: 'NASAL_FLARE', riskLevel: 'B' },
            { label: 'Estridor (ruido al tomar aire)', value: 'STRIDOR', riskLevel: 'B' },
            { label: 'Incapacidad para hablar o comer por fatiga', value: 'CANT_SPEAK_EAT', riskLevel: 'B' }
        ],
        next: 'P_BLOCK2_CIRC'
    },

    // BLOCK 2 - CIRCULATORY (Level B)
    'P_BLOCK2_CIRC': {
        id: 'P_BLOCK2_CIRC',
        text: "Bloque Circulatorio: ¿Cómo está su color y estado?",
        type: 'multiple_choice',
        options: [
            { label: 'Piel muy pálida, moteada o fría', value: 'PALE_COLD', riskLevel: 'B' },
            { label: 'Mareo intenso o desvanecimiento', value: 'DIZZINESS_SEVERE', riskLevel: 'B' }
        ],
        next: 'P_BLOCK3_NEURO'
    },

    // BLOCK 3 - NEUROLOGICAL (Level A/B)
    'P_BLOCK3_NEURO': {
        id: 'P_BLOCK3_NEURO',
        text: "Bloque Neurológico: Signos de alerta",
        type: 'multiple_choice',
        options: [
            { label: 'Dolor de cabeza intenso + vómitos bruscos', value: 'HEADACHE_VOMIT', riskLevel: 'A' }, // Critical
            { label: 'Convulsión febril (hace <30 min)', value: 'SEIZURE_FEBRILE', riskLevel: 'B' },
            { label: 'Rigidez de nuca', value: 'STIFF_NECK', riskLevel: 'B' },
            { label: 'Parálisis o debilidad', value: 'PARALYSIS', riskLevel: 'B' },
            { label: 'Mareo recurrente', value: 'DIZZINESS_RECURRENT', riskLevel: 'B' }
        ],
        criticalStop: true, // Stop if A (Headache+Vomit)
        next: 'P_BLOCK4_SKIN'
    },

    // BLOCK 4 - SKIN & TRAUMA (Level B/C)
    'P_BLOCK4_SKIN': {
        id: 'P_BLOCK4_SKIN',
        text: "Piel y Traumatismos",
        type: 'multiple_choice',
        options: [
            { label: 'Sangrado activo', value: 'BLEEDING', riskLevel: 'B' },
            { label: 'Fractura abierta o deformidad', value: 'FRACTURE', riskLevel: 'B' },
            { label: 'Hinchazón importante', value: 'SWELLING', riskLevel: 'C' },
            { label: 'Herida limpia', value: 'WOUND_CLEAN', riskLevel: 'C' }
        ],
        next: 'P_BLOCK5_EVAL_C'
    },

    // BLOCK 5 - LEVEL C EVALUATION (Fever, Resp, GI, Skin)
    'P_BLOCK5_EVAL_C': {
        id: 'P_BLOCK5_EVAL_C',
        text: "Otros síntomas (Fiebre, Respiratorio, Digestivo, Piel)",
        type: 'multiple_choice',
        options: [
            { label: 'Fiebre persistente (>3 días)', value: 'FEVER_PERSIST', riskLevel: 'C' },
            { label: 'Tos persistente o sibilancias audibles', value: 'COUGH_WHEEZE', riskLevel: 'C' },
            { label: 'Vómitos o diarrea (sin deshidratación)', value: 'VOMIT_DIARRHEA', riskLevel: 'C' },
            { label: 'Erupción cutánea o picor', value: 'RASH_ITCH', riskLevel: 'C' }
        ],
        next: 'P_MINOR_D'
    },

    'P_MINOR_D': {
        id: 'P_MINOR_D',
        text: "¿Alguna otra consulta menor o administrativa?",
        type: 'multiple_choice',
        options: [
            { label: 'Dudas sobre medicación', value: 'MEDS', riskLevel: 'D' },
            { label: 'Revisión niño sano', value: 'CHECKUP', riskLevel: 'D' }
        ],
        next: undefined
    }
};
