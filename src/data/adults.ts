import type { Question, QuestionId } from '../lib/types';

export const ADULTS_QUESTIONS: Record<QuestionId, Question> = {
    // SAFETY QUESTIONS (LEVEL A - Critical)
    'A1': {
        id: 'A1',
        text: "¿Siente debilidad súbita o entumecimiento, especialmente en un lado del cuerpo?",
        type: 'boolean',
        criticality: 'A',
        next: 'A2'
    },
    'A2': {
        id: 'A2',
        text: "¿Tiene dificultad repentina para hablar o entender?",
        type: 'boolean',
        criticality: 'A',
        next: 'A3'
    },
    'A3': {
        id: 'A3',
        text: "¿Ha perdido la visión o ve doble o borroso de repente?",
        type: 'boolean',
        criticality: 'A',
        next: 'A4'
    },
    'A4': {
        id: 'A4',
        text: "¿Tiene dificultad severa para respirar (ruidos, le cuesta que entre/salga aire)?",
        type: 'boolean',
        criticality: 'A',
        next: 'A5'
    },
    'A5': {
        id: 'A5',
        text: "¿Ha perdido la conciencia o se ha desmayado?",
        type: 'boolean',
        criticality: 'A',
        next: 'A6'
    },
    'A6': {
        id: 'A6',
        text: "¿Siente el peor dolor de cabeza de su vida (muy intenso y nuevo)?",
        type: 'boolean',
        criticality: 'A',
        next: 'A7'
    },
    'A7': {
        id: 'A7',
        text: "¿Está teniendo convulsiones o ataques?",
        type: 'boolean',
        criticality: 'A',
        next: 'A8'
    },
    'A8': {
        id: 'A8',
        text: "¿Tiene algún sangrado abundante que no cesa?",
        type: 'boolean',
        criticality: 'A',
        next: 'A9'
    },
    'A9': {
        id: 'A9',
        text: "¿Siente dolor intenso en el pecho (brazo/mandíbula)?",
        type: 'boolean',
        criticality: 'A',
        next: 'A10'
    },
    'A10': {
        id: 'A10',
        text: "¿Se ha dado un golpe en la cabeza o cuerpo y toma medicación anticoagulante?",
        type: 'boolean',
        criticality: 'A',
        next: 'B1' // Transition to Level B
    },

    // ACCUMULATION QUESTIONS (Level B)
    'B1': {
        id: 'B1',
        text: "¿Tiene dificultad respiratoria leve con ruidos?",
        type: 'boolean',
        criticality: 'B',
        next: 'B2'
    },
    'B2': {
        id: 'B2',
        text: "¿Siente latidos rápidos sin dolor en el pecho?",
        type: 'boolean',
        criticality: 'B',
        next: 'B3'
    },
    'B3': {
        id: 'B3',
        text: "¿Tiene alguna quemadura pequeña?",
        type: 'boolean',
        criticality: 'B',
        next: 'B4'
    },
    'B4': {
        id: 'B4',
        text: "¿Tiene dolor de cabeza fuerte (sin los síntomas anteriores)?",
        type: 'boolean',
        criticality: 'B',
        next: 'B5'
    },
    'B5': {
        id: 'B5',
        text: "¿Presenta reacción alérgica (ronchas)?",
        type: 'boolean',
        criticality: 'B',
        next: 'B6'
    },
    'B6': {
        id: 'B6',
        text: "¿Tiene la presión arterial descompensada?",
        type: 'boolean',
        criticality: 'B',
        next: 'B7'
    },
    'B7': {
        id: 'B7',
        text: "¿Siente vértigo o mareo?",
        type: 'boolean',
        criticality: 'B',
        next: 'FEVER_1'
    },

    // FEVER CHECK
    'FEVER_1': {
        id: 'FEVER_1',
        text: "¿Tiene fiebre mayor de 38.5°C o fiebre con temblores?",
        type: 'boolean',
        criticality: 'B',
        next: 'C1' // Technically if NO, check lower fever, but simplified flow for now logic can handle overrides
    },
    // If FEVER_1 is NO, we might want to check C-level fever, but let's follow the linear list for simplicity and rely on B-check logic.
    // Actually spec says: If NO, ask fever < 38.5 (Case C).
    // So 'C1' could start with that or mix. I'll stick to the list C/D as spec.

    // ACCUMULATION QUESTIONS (Level C/D)
    'C1': {
        id: 'C1',
        text: "¿Siente malestar general?",
        type: 'boolean',
        criticality: 'C',
        next: 'C2'
    },
    'C2': { // Covering throat/ear
        id: 'C2',
        text: "¿Tiene dolor de garganta o de oído?",
        type: 'boolean',
        criticality: 'C',
        next: 'C3'
    },
    'C3': { // Abdominal
        id: 'C3',
        text: "¿Tiene dolor abdominal leve?",
        type: 'boolean',
        criticality: 'C',
        next: 'C4'
    },
    'C4': { // Back pain chronic
        id: 'C4',
        text: "¿Tiene dolor de espalda crónico?",
        type: 'boolean', // Could be D
        criticality: 'D',
        next: 'C5'
    },
    'C5': { // Urine
        id: 'C5',
        text: "¿Tiene síntomas de infección de orina (picor/escozor)?",
        type: 'boolean',
        criticality: 'C',
        next: 'D1'
    },

    // Level D specifics
    'D1': {
        id: 'D1',
        text: "¿Tiene tos sin sensación de ahogo?",
        type: 'boolean',
        criticality: 'D',
        next: 'D2'
    },
    'D2': {
        id: 'D2',
        text: "¿Tiene los ojos rojos?",
        type: 'boolean',
        criticality: 'D',
        next: 'D3'
    },
    'D3': {
        id: 'D3',
        text: "¿Tiene picaduras de insectos?",
        type: 'boolean',
        criticality: 'D',
        next: 'D4'
    },
    'D4': {
        id: 'D4',
        text: "¿Tiene dudas sobre su medicación?",
        type: 'boolean',
        criticality: 'D',
        next: undefined // End of flow
    }
};
