import { createContext, useContext, useState, type ReactNode } from 'react';

export type Role = 'patient' | 'admin';

export interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    subscriptionPlan?: 'free' | 'premium';
    // Base biometrics (optional in base user, but good to have)
    dob?: string;
    mutua?: string;
}

// Extended Data Interfaces
export interface MedicalRecord {
    medications: string[];
    allergies: string[];
    surgeries: string[];
    weight: number;
    height: number;
}

export interface HistoryItem {
    id: string;
    title: string;
    date: string;
    doctor: string;
    type: 'videocall' | 'call' | 'chat';
}

export interface InvoiceItem {
    id: string;
    concept: string;
    date: string;
    amount: string;
    status: 'paid' | 'pending';
}

export interface ReportItem {
    id: string;
    title: string;
    date: string;
    doctor: string;
    fileUrl?: string;
}

export interface AppointmentItem {
    id: string;
    title: string;
    date: string; // ISO or readable
    doctor: string;
    type: 'videocall' | 'in-person';
    location?: string;
}

export interface UserData {
    medical: MedicalRecord;
    history: HistoryItem[];
    invoices: InvoiceItem[];
    reports: ReportItem[];
    appointments: AppointmentItem[];
}

const DEFAULT_MEDICAL: MedicalRecord = {
    medications: [],
    allergies: [],
    surgeries: [],
    weight: 0,
    height: 0
};

// Mock Data Store - Digital Hospital Context
const MOCK_USER_DATA: Record<string, UserData> = {
    '1': { // Maria - Focus: Women's Health & Pediatrics
        medical: {
            medications: ['Ácido Fólico', 'Ibuprofeno 400mg (si dolor)'],
            allergies: ['Penicilina'],
            surgeries: ['Apendicectomía (2015)'],
            weight: 62,
            height: 165
        },
        history: [
            { id: 'h1', title: 'Consulta Salud de la Mujer', date: '06 Dic 2025', doctor: 'Dra. López', type: 'videocall' },
            { id: 'h2', title: 'Consulta Pediatría Online', date: '28 Nov 2025', doctor: 'Dr. Martínez', type: 'videocall' },
            { id: 'h4', title: 'Seguimiento Chat', date: '20 Nov 2025', doctor: 'Dra. López', type: 'chat' },
            { id: 'h5', title: 'Consulta General', date: '10 Oct 2025', doctor: 'Dr. García', type: 'videocall' }
        ],
        invoices: [
            { id: 'INV-2025-001', concept: 'Consulta Salud de la Mujer', date: '06 Dic 2025', amount: '45.00€', status: 'paid' },
            { id: 'INV-2025-002', concept: 'Consulta Pediatría', date: '28 Nov 2025', amount: '35.00€', status: 'paid' },
            { id: 'INV-2025-004', concept: 'Suscripción Mensual', date: '01 Nov 2025', amount: '12.99€', status: 'paid' }
        ],
        reports: [
            { id: 'r1', title: 'Informe Alta Digital', date: '06 Dic 2025', doctor: 'Dra. López' },
            { id: 'r2', title: 'Resultados Analítica General', date: '15 Oct 2025', doctor: 'Lab. Digital' },
            { id: 'r5', title: 'Receta Electrónica', date: '06 Dic 2025', doctor: 'Dra. López' }
        ],
        appointments: [
            { id: 'a1', title: 'Revisión Resultados (Video)', date: '15 Ene 2026 - 10:00', doctor: 'Dra. Riera', type: 'videocall' },
            { id: 'a3', title: 'Consulta Seguimiento', date: '01 Feb 2026 - 11:30', doctor: 'Dr. López', type: 'videocall' }
        ]
    },
    '2': { // Pepe - Focus: Mental Health & General Medicine
        medical: {
            medications: ['Diazepam 5mg (si ansiedad)', 'Paracetamol 1g'],
            allergies: [],
            surgeries: [],
            weight: 85,
            height: 180
        },
        history: [
            { id: 'h3', title: 'Consulta Salud Mental', date: '01 Dic 2025', doctor: 'Dr. Psique', type: 'videocall' },
            { id: 'h6', title: 'Seguimiento Telefónico', date: '15 Nov 2025', doctor: 'Dr. General', type: 'call' },
            { id: 'h7', title: 'Consulta Urgencia', date: '01 Nov 2025', doctor: 'Dra. Guardia', type: 'videocall' }
        ],
        invoices: [
            { id: 'INV-2025-003', concept: 'Suscripción Premium (Anual)', date: '01 Ene 2026', amount: '120.00€', status: 'paid' },
            { id: 'INV-2025-005', concept: 'Pack Sesiones Terapia', date: '15 Nov 2025', amount: '150.00€', status: 'paid' }
        ],
        reports: [
            { id: 'r3', title: 'Informe Evaluación Psicológica', date: '01 Dic 2025', doctor: 'Dr. Psique' },
            { id: 'r4', title: 'Baja Médica Digital', date: '15 Nov 2025', doctor: 'Dr. General' }
        ],
        appointments: [
            { id: 'a2', title: 'Sesión Terapia Online', date: '20 Ene 2026 - 16:00', doctor: 'Dr. Psique', type: 'videocall' },
            { id: 'a4', title: 'Consulta Medicina General', date: '25 Ene 2026 - 09:00', doctor: 'Dr. General', type: 'videocall' }
        ]
    }
};

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<boolean>;
    register: (userData: Omit<User, 'id' | 'role'> & { password: string }) => Promise<boolean>;
    logout: () => void;
    getUserData: (userId: string) => UserData;
    updateUserData: (userId: string, section: keyof UserData, data: any) => void;
    mockUsers: User[]; // Exposed for debug/demo
}

const MOCK_USERS: User[] = [
    {
        id: '1',
        email: 'maria@luma.com',
        name: 'María García',
        role: 'patient',
        subscriptionPlan: 'free',
        dob: '1985-05-12',
        mutua: 'Adeslas'
    },
    {
        id: '2',
        email: 'pepe@luma.com',
        name: 'Pepe Pérez',
        role: 'patient',
        subscriptionPlan: 'premium',
        dob: '1990-01-01'
    },
    {
        id: 'ADMIN',
        email: 'admin@luma.com',
        name: 'Super Admin',
        role: 'admin'
    }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    // In a real app we'd trigger a fetch here, for now we just reference MOCK_USER_DATA directly

    const login = async (email: string, _password: string): Promise<boolean> => {
        // Mock login logic
        return new Promise((resolve) => {
            setTimeout(() => {
                const foundUser = MOCK_USERS.find(u => u.email === email);
                if (foundUser) {
                    setUser(foundUser);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 500);
        });
    };

    const register = async (userData: any): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser: User = {
                    id: Math.random().toString(),
                    role: 'patient',
                    ...userData
                };
                setUser(newUser);
                resolve(true);
            }, 800);
        });
    };

    const logout = () => {
        setUser(null);
    };

    const getUserData = (userId: string): UserData => {
        return MOCK_USER_DATA[userId] || {
            medical: DEFAULT_MEDICAL,
            history: [],
            invoices: [],
            reports: [],
            appointments: []
        };
    };

    const updateUserData = (userId: string, section: keyof UserData, data: any) => {
        // Mock update
        // In a real app we would immutably update state or call API
        console.log(`Updating ${section} for user ${userId}`, data);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            register,
            logout,
            getUserData,
            updateUserData,
            mockUsers: MOCK_USERS
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
