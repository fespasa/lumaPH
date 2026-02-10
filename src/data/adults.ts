import type { Question, QuestionId } from '../lib/types';

export const ADULTS_QUESTIONS: Record<QuestionId, Question> = {
    // LEVEL A - SCREEN 1
    'A_CRITICAL_1': {
        id: 'A_CRITICAL_1',
        text: "Marque si presenta alguno de estos síntomas graves:",
        type: 'multiple_choice',
        options: [
            { label: 'Debilidad súbita o entumecimiento (cara/brazo/pierna)', value: 'WEAKNESS', riskLevel: 'A' },
            { label: 'Dificultad repentina para hablar o entender', value: 'SPEECH', riskLevel: 'A' },
            { label: 'Pérdida súbita de visión o visión doble', value: 'VISION', riskLevel: 'A' },
            { label: 'Dificultad severa para respirar (le cuesta hablar)', value: 'BREATHING_SEVERE', riskLevel: 'A' },
            { label: 'Pérdida de conciencia o desmayo', value: 'CONSCIOUSNESS', riskLevel: 'A' }
        ],
        criticalStop: true, // If any A selected, stop immediately
        next: 'A_CRITICAL_2'
    },

    // LEVEL A - SCREEN 2
    'A_CRITICAL_2': {
        id: 'A_CRITICAL_2',
        text: "¿Presenta alguno de estos otros síntomas?",
        type: 'multiple_choice',
        options: [
            { label: 'Dolor de cabeza intenso y súbito (el peor de su vida)', value: 'HEADACHE_SEVERE', riskLevel: 'A' },
            { label: 'Convulsiones o movimientos incontrolables', value: 'SEIZURES', riskLevel: 'A' },
            { label: 'Sangrado abundante que no cesa', value: 'BLEEDING_HEAVY', riskLevel: 'A' },
            { label: 'Dolor en el pecho opresivo', value: 'CHEST_PAIN', riskLevel: 'A' },
            { label: 'Golpe en la cabeza tomando anticoagulantes', value: 'HEAD_TRAUMA_BLOOD_THINNERS', riskLevel: 'A' }
        ],
        criticalStop: true,
        next: 'B_MODERATE'
    },

    // LEVEL B - MODERATE
    'B_MODERATE': {
        id: 'B_MODERATE',
        text: "Seleccione si tiene alguno de estos síntomas moderados:",
        type: 'multiple_choice',
        options: [
            { label: 'Dificultad respiratoria leve', value: 'BREATHING_MILD', riskLevel: 'B' },
            { label: 'Latidos rápidos (palpitaciones)', value: 'PALPITATIONS', riskLevel: 'B' },
            { label: 'Quemadura extensa o dolorosa', value: 'BURN', riskLevel: 'B' },
            { label: 'Dolor de cabeza (sin otros síntomas de alarma)', value: 'HEADACHE_MODERATE', riskLevel: 'B' },
            { label: 'Reacción alérgica leve', value: 'ALLERGY', riskLevel: 'B' },
            { label: 'Presión arterial o azúcar alterados', value: 'BP_SUGAR_ISSUE', riskLevel: 'B' },
            { label: 'Vértigo o sensación de que todo gira', value: 'VERTIGO', riskLevel: 'B' },
            { label: 'Fiebre alta con temblores', value: 'FEVER_SHAKES', riskLevel: 'B' },
            { label: 'Lesión menor (golpe, torcedura)', value: 'INJURY_MINOR', riskLevel: 'B' }
        ],
        next: [
            // If BP/Sugar selected, ask for values
            {
                questionId: 'B_BP_INPUT',
                condition: (data) => {
                    const answers = data['B_MODERATE'];
                    return Array.isArray(answers) && answers.includes('BP_SUGAR_ISSUE');
                }
            },
            { questionId: 'C_MILD' } // Default next
        ]
    },

    'B_BP_INPUT': {
        id: 'B_BP_INPUT',
        text: "Indique sus valores de presión arterial o azúcar si los conoce (opcional):",
        type: 'text',
        // No risk level change, just data collection
        next: 'C_MILD'
    },

    // LEVEL C - MILD
    'C_MILD': {
        id: 'C_MILD',
        text: "Marque si presenta síntomas leves:",
        type: 'multiple_choice',
        options: [
            { label: 'Cansancio o fatiga', value: 'FATIGUE', riskLevel: 'C' },
            { label: 'Problemas digestivos leves', value: 'DIGESTIVE', riskLevel: 'C' },
            { label: 'Dolor de garganta o de oído', value: 'THROAT_EAR', riskLevel: 'C' },
            { label: 'Fiebre baja (menos de 38°C)', value: 'FEVER_LOW', riskLevel: 'C' },
            { label: 'Dolor abdominal o dental soportable', value: 'PAIN_MILD', riskLevel: 'C' },
            { label: 'Dolor crónico conocido', value: 'CHRONIC_PAIN', riskLevel: 'C' },
            { label: 'Molestias ginecológicas o urológicas leves', value: 'GYN_URO', riskLevel: 'C' }
        ],
        next: 'D_MINOR'
    },

    // LEVEL D - MINOR
    'D_MINOR': {
        id: 'D_MINOR',
        text: "¿Necesita ayuda con alguna necesidad menor?",
        type: 'multiple_choice',
        options: [
            { label: 'Lesión en la piel leve / granos', value: 'SKIN', riskLevel: 'D' },
            { label: 'Tos sin asfixia', value: 'COUGH', riskLevel: 'D' },
            { label: 'Ojos rojos o molestia ocular', value: 'EYES', riskLevel: 'D' },
            { label: 'Dolor muscular o de espalda', value: 'MUSCLE', riskLevel: 'D' },
            { label: 'Gestión de enfermedad crónica', value: 'CHRONIC_MGMT', riskLevel: 'D' },
            { label: 'Revisión rutinaria / Recetas', value: 'ROUTINE', riskLevel: 'D' }
        ],
        next: undefined // End of flow
    }
};
