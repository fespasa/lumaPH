import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const Login = () => {
    const { login, mockUsers } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const success = await login(email, password);
        setIsLoading(false);

        if (success) {
            // Check if admin to redirect to dashboard? 
            // Current AuthContext sets user instantly, so we can check user role in effect or simple redirect home and router handles it?
            // Simple redirect for now.
            navigate('/');
        } else {
            setError('Credenciales incorrectas');
        }
    };

    const fillCredentials = (mockEmail: string) => {
        setEmail(mockEmail);
        setPassword('password123'); // dummy
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <img src="/logo.jpg" alt="LUMA Logo" className="h-16 w-auto mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-slate-900">Bienvenido a LUMA</h2>
                    <p className="text-slate-500 mt-2">Acceda a su hospital de bolsillo</p>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-luma-teal/20 focus:border-luma-teal transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Contraseña</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-luma-teal/20 focus:border-luma-teal transition-all"
                            />
                        </div>

                        <Button className="w-full" size="lg" isLoading={isLoading}>
                            Iniciar Sesión
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-slate-500">¿No tiene cuenta? </span>
                        <Link to="/register" className="text-luma-teal font-semibold hover:underline">
                            Regístrese aquí
                        </Link>
                    </div>
                </Card>

                {/* Demo Helper */}
                <div className="text-center space-y-2">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Usuarios de Prueba</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {mockUsers.map(u => (
                            <button
                                key={u.id}
                                onClick={() => fillCredentials(u.email)}
                                className="bg-white px-3 py-1 rounded-full text-xs border border-slate-200 hover:border-luma-teal transition-colors text-slate-600"
                            >
                                {u.name} ({u.role})
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
