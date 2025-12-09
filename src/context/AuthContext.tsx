import { createContext, useContext, useState, type ReactNode } from 'react';

export type Role = 'patient' | 'admin';

export interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    // Extended profile data (mocked)
    dob?: string;
    mutua?: string;
    medicalHistory?: string[];
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<boolean>;
    register: (userData: Omit<User, 'id' | 'role'> & { password: string }) => Promise<boolean>;
    logout: () => void;
    mockUsers: User[]; // Exposed for debug/demo
}

const MOCK_USERS: User[] = [
    {
        id: '1',
        email: 'maria@luma.com',
        name: 'María García',
        role: 'patient',
        dob: '1985-05-12',
        mutua: 'Adeslas',
        medicalHistory: ['Alergia Penicilina', 'Asma leve']
    },
    {
        id: '2',
        email: 'pepe@luma.com',
        name: 'Pepe Pérez',
        role: 'patient',
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

    const login = async (email: string, _password: string): Promise<boolean> => {
        // Mock login logic
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simple hardcoded check or check against MOCK_USERS (password ignored for basic mock users except admin check logic if we wanted, but let's just match email)
                const foundUser = MOCK_USERS.find(u => u.email === email);

                // For prototype, we allow any password if user exists.
                // For admin, let's enforce a specific one for "realism" if needed, but keeping it simple.
                if (foundUser) {
                    setUser(foundUser);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 500); // Fake network delay
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
                // In a real app we would add to list, here we just authorize immediately
                setUser(newUser);
                resolve(true);
            }, 800);
        });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            register,
            logout,
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
