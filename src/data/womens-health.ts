import type { Question, QuestionId } from '../lib/types';

export const WOMENS_HEALTH_QUESTIONS: Record<QuestionId, Question> = {
    // --- OPTION 1: EMBARAZADA (PREG) ---
    'PREG_START': {
        id: 'PREG_START',
        text: "¿De cuántas semanas está embarazada?",
        type: 'info', // Ideally numeric input logic, but for now just info/check
        options: [],
        next: 'PREG_A1' // Spec implies checking this but doesn't give logic. Skipping directly to Safety.
    },
    'PREG_A1': {
        id: 'PREG_A1',
        text: "¿Tiene dolor torácico o sensación de asfixia?",
        type: 'boolean',
        criticality: 'A',
        next: 'PREG_A2'
    },
    'PREG_A2': {
        id: 'PREG_A2',
        text: "¿Tiene algún sangrado vaginal que empapa compresas?",
        type: 'boolean',
        criticality: 'A',
        next: 'PREG_A3'
    },
    'PREG_A3': {
        id: 'PREG_A3',
        text: "¿Cree que ha roto aguas y está de menos de 37 semanas?",
        type: 'boolean',
        criticality: 'A',
        next: 'PREG_A4'
    },
    'PREG_A4': {
        id: 'PREG_A4',
        text: "¿Ha dejado de sentir al bebé?",
        type: 'boolean',
        criticality: 'A',
        next: 'PREG_A5'
    },
    'PREG_A5': {
        id: 'PREG_A5',
        text: "¿Tiene dolor de cabeza intenso con visión borrosa?",
        type: 'boolean',
        criticality: 'A',
        next: 'PREG_B1'
    },
    'PREG_B1': {
        id: 'PREG_B1',
        text: "¿Tiene sangrado ligero?",
        type: 'boolean',
        criticality: 'B',
        next: 'PREG_B2'
    },
    'PREG_B2': {
        id: 'PREG_B2',
        text: "¿Tiene contracciones leves?",
        type: 'boolean',
        criticality: 'B',
        next: 'PREG_B3'
    },
    'PREG_B3': {
        id: 'PREG_B3',
        text: "¿Siente dolor lumbar?",
        type: 'boolean',
        criticality: 'B', // Could be C depending on severity, let's say B/C. Spec says B/C accumulation.
        next: 'PREG_C1'
    },
    'PREG_C1': {
        id: 'PREG_C1',
        text: "¿Tiene dudas sobre su rutina o seguimiento?",
        type: 'boolean',
        criticality: 'D',
        next: undefined
    },

    // --- OPTION 2: PUERPERA (POST) ---
    'POST_START': {
        id: 'POST_START',
        text: "¿Ha tenido fiebre alta (38°C+) acompañada de mal olor vaginal?",
        // Jumping straight to A logic actually.
        type: 'boolean',
        criticality: 'A',
        next: 'POST_A2'
    },
    'POST_A2': {
        id: 'POST_A2',
        text: "¿Tiene una hemorragia con coágulos más grandes que una pelota de golf?",
        type: 'boolean',
        criticality: 'A',
        next: 'POST_A3'
    },
    'POST_A3': {
        id: 'POST_A3',
        text: "¿Tiene dolor en el pecho o dificultad para respirar?",
        type: 'boolean',
        criticality: 'A',
        next: 'POST_A4'
    },
    'POST_A4': {
        id: 'POST_A4',
        text: "¿Tiene pensamientos de hacer daño al bebé o a sí misma?",
        type: 'boolean',
        criticality: 'A',
        next: 'POST_B1'
    },
    'POST_B1': {
        id: 'POST_B1',
        text: "¿Tiene sangrado persistente (aunque no sea hemorragia masiva)?",
        type: 'boolean',
        criticality: 'B',
        next: 'POST_B2'
    },
    'POST_B2': {
        id: 'POST_B2',
        text: "¿La cesárea o episiotomía está roja y duele?",
        type: 'boolean',
        criticality: 'B',
        next: 'POST_C1'
    },
    'POST_C1': {
        id: 'POST_C1',
        text: "¿Tiene problemas con la lactancia?",
        type: 'boolean',
        criticality: 'C',
        next: undefined
    },

    // --- OPTION 3: OTRA CONSULTA (GYN) ---
    'GYN_A1': {
        id: 'GYN_A1',
        text: "¿Tiene un sangrado vaginal extremo (se siente mareada o se ha desmayado)?",
        type: 'boolean',
        criticality: 'A',
        next: 'GYN_A2'
    },
    'GYN_A2': {
        id: 'GYN_A2',
        text: "¿Siente un dolor pélvico súbito e intenso?",
        type: 'boolean',
        criticality: 'A',
        next: 'GYN_A3'
    },
    'GYN_A3': {
        id: 'GYN_A3',
        text: "¿Tiene fiebre alta con dolor abdominal?",
        type: 'boolean',
        criticality: 'A',
        next: 'GYN_B1'
    },
    'GYN_B1': {
        id: 'GYN_B1',
        text: "¿Sangrado fuera de la regla?",
        type: 'boolean',
        criticality: 'B',
        next: 'GYN_B2'
    },
    'GYN_B2': {
        id: 'GYN_B2',
        text: "¿Flujo vaginal con mal olor?",
        type: 'boolean',
        criticality: 'B', // Infection
        next: 'GYN_B3'
    },
    'GYN_B3': {
        id: 'GYN_B3',
        text: "¿Se nota bultos en la mama o vulva?",
        type: 'boolean',
        criticality: 'B',
        next: 'GYN_C1'
    },
    'GYN_C1': {
        id: 'GYN_C1',
        text: "¿Dudas sobre anticoncepción o menopausia?",
        type: 'boolean',
        criticality: 'D',
        next: undefined
    }
};
