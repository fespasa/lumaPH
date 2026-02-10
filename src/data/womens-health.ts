import type { Question, QuestionId } from '../lib/types';

export const WOMENS_HEALTH_QUESTIONS: Record<QuestionId, Question> = {
    // PROFILE SELECTION
    'WH_PROFILE_SELECT': {
        id: 'WH_PROFILE_SELECT',
        text: "Seleccione su situación actual:",
        type: 'single_choice',
        options: [
            { label: 'Estoy embarazada', value: 'PREGNANT' },
            { label: 'He dado a luz recientemente (Puérpera/Postparto)', value: 'POSTPARTUM' },
            { label: 'Otras consultas ginecológicas', value: 'GYN' }
        ],
        next: [
            { questionId: 'PREG_PRE_INPUT', condition: (data) => data['WH_PROFILE_SELECT'] && data['WH_PROFILE_SELECT'].includes('PREGNANT') },
            { questionId: 'POST_PRE_INPUT', condition: (data) => data['WH_PROFILE_SELECT'] && data['WH_PROFILE_SELECT'].includes('POSTPARTUM') },
            { questionId: 'GYN_A_CRITICAL', condition: (data) => data['WH_PROFILE_SELECT'] && data['WH_PROFILE_SELECT'].includes('GYN') }
        ]
    },

    // --- PREGNANT BRANCH ---
    'PREG_PRE_INPUT': {
        id: 'PREG_PRE_INPUT',
        text: "¿Tiene diagnósticos conocidos previos? (Escriba 'No' si ninguno)",
        type: 'text',
        next: 'PREG_A_CRITICAL'
    },
    'PREG_A_CRITICAL': {
        id: 'PREG_A_CRITICAL',
        text: "Síntomas Graves (Embarazo)",
        type: 'multiple_choice',
        options: [
            { label: 'Dolor torácico o dificultad respiratoria', value: 'CHEST_PAIN', riskLevel: 'A' },
            { label: 'Sangrado vaginal abundante', value: 'BLEEDING_HEAVY', riskLevel: 'A' },
            { label: 'Pérdida de líquido amniótico', value: 'WATER_BREAK', riskLevel: 'A' },
            { label: 'Movimientos fetales disminuidos o ausentes', value: 'NO_MOVEMENT', riskLevel: 'A' },
            { label: 'Dolor de cabeza intenso + visión borrosa', value: 'PRE_ECLAMPSIA', riskLevel: 'A' }
        ],
        criticalStop: true,
        next: 'PREG_B_MODERATE'
    },
    'PREG_B_MODERATE': {
        id: 'PREG_B_MODERATE',
        text: "Síntomas Moderados (Embarazo)",
        type: 'multiple_choice',
        options: [
            { label: 'Sangrado ligero o manchado', value: 'BLEEDING_LIGHT', riskLevel: 'B' },
            { label: 'Contracciones leves o irregulares', value: 'CONTRACTIONS', riskLevel: 'B' },
            { label: 'Náuseas y vómitos moderados', value: 'NAUSEA', riskLevel: 'B' },
            { label: 'Edema (hinchazón de manos/pies) repentino', value: 'EDEMA', riskLevel: 'B' }
        ],
        next: 'PREG_C_MILD'
    },
    'PREG_C_MILD': {
        id: 'PREG_C_MILD',
        text: "Consultas Leves (Embarazo)",
        type: 'multiple_choice',
        options: [
            { label: 'Dudas sobre rutina o pruebas', value: 'ROUTINE', riskLevel: 'C' },
            { label: 'Cambios menores (piel, sueño)', value: 'MINOR_CHANGES', riskLevel: 'C' },
            { label: 'Preparación al parto', value: 'BIRTH_PREP', riskLevel: 'C' }
        ],
        next: undefined
    },

    // --- POSTPARTUM BRANCH ---
    'POST_PRE_INPUT': {
        id: 'POST_PRE_INPUT',
        text: "Describa brevemente el tipo de parto y si hubo complicaciones:",
        type: 'text',
        next: 'POST_A_CRITICAL'
    },
    'POST_A_CRITICAL': {
        id: 'POST_A_CRITICAL',
        text: "Síntomas Graves (Postparto)",
        type: 'multiple_choice',
        options: [
            { label: 'Hemorragia vaginal (>1 compresa/hora)', value: 'HEMORRHAGE', riskLevel: 'A' },
            { label: 'Fiebre alta (>38.5°C) con mal olor', value: 'FEVER_HIGH', riskLevel: 'A' },
            { label: 'Pensamientos de hacerse daño o al bebé', value: 'HARM_THOUGHTS', riskLevel: 'A' },
            { label: 'Dolor de pecho o dificultad respiratoria', value: 'CHEST_PAIN', riskLevel: 'A' }
        ],
        criticalStop: true,
        next: 'POST_B_MODERATE'
    },
    'POST_B_MODERATE': {
        id: 'POST_B_MODERATE',
        text: "Síntomas Moderados (Postparto)",
        type: 'multiple_choice',
        options: [
            { label: 'Sangrado persistente (loquios abundantes)', value: 'BLEEDING', riskLevel: 'B' },
            { label: 'Fiebre moderada', value: 'FEVER_MOD', riskLevel: 'B' },
            { label: 'Dolor en herida (cesárea/episiotomía) con pus', value: 'WOUND_INFECTED', riskLevel: 'B' },
            { label: 'Retención urinaria (no puede orinar)', value: 'RETENTION', riskLevel: 'B' }
        ],
        next: 'POST_C_MILD'
    },
    'POST_C_MILD': {
        id: 'POST_C_MILD',
        text: "Síntomas Leves (Postparto)",
        type: 'multiple_choice',
        options: [
            { label: 'Dolor herida que mejora', value: 'WOUND_HEALING', riskLevel: 'C' },
            { label: 'Dudas sobre lactancia', value: 'BREASTFEEDING', riskLevel: 'C' },
            { label: 'Tristeza o "Baby Blues"', value: 'BABY_BLUES', riskLevel: 'C' }
        ],
        next: undefined
    },

    // --- GYN BRANCH ---
    'GYN_A_CRITICAL': {
        id: 'GYN_A_CRITICAL',
        text: "Síntomas Graves (Ginecología)",
        type: 'multiple_choice',
        options: [
            { label: 'Sangrado vaginal muy abundante (empapa ropa)', value: 'BLEEDING_SEVERE', riskLevel: 'A' },
            { label: 'Dolor pélvico súbito e intenso', value: 'PELVIC_PAIN_SEVERE', riskLevel: 'A' }
        ],
        criticalStop: true,
        next: 'GYN_B_URGENT'
    },
    'GYN_B_URGENT': {
        id: 'GYN_B_URGENT',
        text: "Síntomas Urgentes (Ginecología)",
        type: 'multiple_choice',
        options: [
            { label: 'Sangrado persistente fuera de ciclo', value: 'BLEEDING_PERSIST', riskLevel: 'B' },
            { label: 'Flujo vaginal inusual o con mal olor', value: 'DISCHARGE', riskLevel: 'B' },
            { label: 'Bulto en mama o vulva', value: 'LUMP', riskLevel: 'B' }
        ],
        next: 'GYN_C_ROUTINE'
    },
    'GYN_C_ROUTINE': {
        id: 'GYN_C_ROUTINE',
        text: "Consultas Programadas",
        type: 'multiple_choice',
        options: [
            { label: 'Fertilidad / Planificación', value: 'FERTILITY', riskLevel: 'C' },
            { label: 'Irregularidad menstrual', value: 'IRREGULARITY', riskLevel: 'C' },
            { label: 'Menopausia', value: 'MENOPAUSE', riskLevel: 'C' },
            { label: 'Chequeo rutinario', value: 'CHECKUP', riskLevel: 'C' }
        ],
        next: undefined
    }
};
