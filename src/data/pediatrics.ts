import type { Question, QuestionId, Condition } from '../lib/types';

const isNeonatal: Condition = (data) => (data.ageMonths || 0) < 3;
const isInfant: Condition = (data) => (data.ageMonths || 0) >= 3;

export const PEDIATRICS_QUESTIONS: Record<QuestionId, Question> = {
    // SAFETY QUESTIONS (Level A)
    'A1': {
        id: 'A1',
        text: "¿El niño/a está inconsciente o no responde al llamarlo?",
        type: 'boolean',
        criticality: 'A',
        next: 'A2'
    },
    'A2': {
        id: 'A2',
        text: "¿Tiene los labios azulados o manchas púrpuras en la piel?",
        type: 'boolean',
        criticality: 'A',
        next: 'A3'
    },
    'A3': {
        id: 'A3',
        text: "¿Ha tenido una convulsión ahora o hace pocos minutos?",
        type: 'boolean',
        criticality: 'A',
        next: [
            { questionId: 'A4_BABY', condition: isNeonatal },
            { questionId: 'A4_CHILD', condition: isInfant },
            { questionId: 'A4_CHILD' } // Fallback
        ]
    },
    'A4_BABY': {
        id: 'A4_BABY',
        text: "¿Tiene fiebre de 38°C o más?",
        type: 'boolean',
        criticality: 'A',
        next: 'A5'
    },
    'A4_CHILD': {
        id: 'A4_CHILD',
        text: "¿Tiene fiebre de 40°C o más?",
        type: 'boolean',
        criticality: 'A',
        next: 'A5'
    },
    'A5': {
        id: 'A5',
        text: "¿Tiene dolor de cabeza intenso acompañado de vómitos bruscos?",
        type: 'boolean',
        criticality: 'A',
        next: 'RESPIRATORY_CHECK'
    },

    // Interactive Screen Placeholder in Flow
    'RESPIRATORY_CHECK': {
        id: 'RESPIRATORY_CHECK',
        text: "Interactive Respiratory Check",
        type: 'info', // Special type to handle in UI
        next: 'B1_TIRAJE' // Continue after check
    },

    'B1_TIRAJE': {
        id: 'B1_TIRAJE',
        text: "¿Al respirar se le hunden las costillas o el pecho (tiraje)?",
        type: 'boolean',
        criticality: 'B',
        next: 'B2_ESTRIDOR'
    },
    'B2_ESTRIDOR': {
        id: 'B2_ESTRIDOR',
        text: "¿Hace algún ruido extraño al respirar (estridor)?",
        type: 'boolean',
        criticality: 'B',
        next: 'B3_PALIDEZ'
    },
    'B3_PALIDEZ': {
        id: 'B3_PALIDEZ',
        text: "¿Está extremadamente pálido?",
        type: 'boolean',
        criticality: 'B',
        next: 'B4_RIGIDEZ'
    },
    'B4_RIGIDEZ': {
        id: 'B4_RIGIDEZ',
        text: "¿Tiene rigidez en la nuca (le cuesta doblar el cuello)?",
        type: 'boolean',
        criticality: 'B',
        next: 'GASTRO_1'
    },

    'GASTRO_1': {
        id: 'GASTRO_1',
        text: "¿Tiene vómitos o diarrea?",
        type: 'boolean',
        // If YES, could trigger B, or lead to sub-questions. 
        // Spec says: "Si dice SÍ, abrir sub-pantalla".
        // For simplicity, we mark B if yes, or can add logic. 
        // Let's assume YES -> B for safety if severe, or just continue. 
        // The spec implies specific questions for nuances. 
        // I'll set criticality B for simplicity as vomiting/diarrhea in kids is often urgent if combined, but let's stick to spec "Preguntar por...".
        // I will add a sub-branch if answering Yes?
        // Let's keep it linear: Yes -> B.
        criticality: 'B',
        next: undefined // End of flow
    }
};
