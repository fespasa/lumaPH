import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Mail,
    Lock,
    Calendar,
    Ruler,
    Weight,
    Activity,
    HeartPulse,
    Phone,
    ShieldCheck,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

export const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);

    // Form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        dob: '',
        height: '',
        weight: '',
        bloodType: '',
        hasMutua: false,
        mutuaName: '',
        emergencyContact: '',
        allergies: '',
        medications: '',
        surgeries: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                mutua: formData.hasMutua ? formData.mutuaName : undefined,
                medicalHistory: [
                    `Alergias: ${formData.allergies}`,
                    `Medicaciones: ${formData.medications}`,
                    `Cirugías: ${formData.surgeries}`
                ].filter(s => s.length > 12)
            });
            navigate('/');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0
        })
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-12 relative">
                <div className="max-w-md mx-auto w-full">
                    {/* Header */}
                    <div className="mb-10 text-center lg:text-left">
                        <img src="/logo.jpg" alt="LUMA" className="h-10 w-auto mb-6 mx-auto lg:mx-0" />
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Crear Cuenta</h1>
                        <p className="text-slate-500">
                            Paso {step} de 4: {
                                step === 1 ? 'Datos Personales' :
                                    step === 2 ? 'Datos Físicos' :
                                        step === 3 ? 'Historial Médico' : 'Seguro y Contacto'
                            }
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
                        <motion.div
                            className="h-full bg-luma-teal"
                            initial={{ width: 0 }}
                            animate={{ width: `${(step / 4) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait" custom={step}>
                            <motion.div
                                key={step}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="space-y-4"
                            >
                                {step === 1 && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Nombre Completo</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                <input
                                                    name="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="pl-10 input-field"
                                                    placeholder="Juan Pérez"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Fecha de Nacimiento</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                <input
                                                    name="dob"
                                                    type="date"
                                                    required
                                                    value={formData.dob}
                                                    onChange={handleChange}
                                                    className="pl-10 input-field"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                <input
                                                    name="email"
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="pl-10 input-field"
                                                    placeholder="juan@ejemplo.com"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Contraseña</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                <input
                                                    name="password"
                                                    type="password"
                                                    required
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="pl-10 input-field"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {step === 2 && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700">Altura (cm)</label>
                                                <div className="relative">
                                                    <Ruler className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                    <input
                                                        name="height"
                                                        type="number"
                                                        value={formData.height}
                                                        onChange={handleChange}
                                                        className="pl-10 input-field"
                                                        placeholder="175"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700">Peso (kg)</label>
                                                <div className="relative">
                                                    <Weight className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                    <input
                                                        name="weight"
                                                        type="number"
                                                        value={formData.weight}
                                                        onChange={handleChange}
                                                        className="pl-10 input-field"
                                                        placeholder="70"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Grupo Sanguíneo</label>
                                            <div className="relative">
                                                <Activity className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                <select
                                                    name="bloodType"
                                                    value={formData.bloodType}
                                                    onChange={handleChange}
                                                    className="pl-10 input-field appearance-none"
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    <option value="A+">A+</option>
                                                    <option value="A-">A-</option>
                                                    <option value="B+">B+</option>
                                                    <option value="B-">B-</option>
                                                    <option value="O+">O+</option>
                                                    <option value="O-">O-</option>
                                                    <option value="AB+">AB+</option>
                                                    <option value="AB-">AB-</option>
                                                </select>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {step === 3 && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Alergias Conocidas</label>
                                            <div className="relative">
                                                <AlertCircle className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                <textarea
                                                    name="allergies"
                                                    rows={2}
                                                    value={formData.allergies}
                                                    onChange={handleChange}
                                                    className="pl-10 input-field resize-none pt-3"
                                                    placeholder="Ninguna o especificar..."
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Medicaciones Actuales</label>
                                            <div className="relative">
                                                <HeartPulse className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                <textarea
                                                    name="medications"
                                                    rows={2}
                                                    value={formData.medications}
                                                    onChange={handleChange}
                                                    className="pl-10 input-field resize-none pt-3"
                                                    placeholder="Lista de medicamentos..."
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Cirugías Previas</label>
                                            <div className="relative">
                                                <Activity className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                <textarea
                                                    name="surgeries"
                                                    rows={2}
                                                    value={formData.surgeries}
                                                    onChange={handleChange}
                                                    className="pl-10 input-field resize-none pt-3"
                                                    placeholder="Descripción breve..."
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {step === 4 && (
                                    <>
                                        <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        name="hasMutua"
                                                        id="hasMutua"
                                                        checked={formData.hasMutua}
                                                        onChange={handleChange}
                                                        className="w-5 h-5 accent-luma-teal rounded cursor-pointer"
                                                    />
                                                </div>
                                                <label htmlFor="hasMutua" className="text-sm font-medium text-slate-700 cursor-pointer">
                                                    ¿Tiene Mutua Privada?
                                                </label>
                                            </div>

                                            <AnimatePresence>
                                                {formData.hasMutua && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden space-y-2"
                                                    >
                                                        <label className="text-sm font-medium text-slate-700">Nombre de la Mutua</label>
                                                        <div className="relative">
                                                            <ShieldCheck className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                            <input
                                                                name="mutuaName"
                                                                value={formData.mutuaName}
                                                                onChange={handleChange}
                                                                className="pl-10 input-field bg-white"
                                                                placeholder="Ej: Adeslas, Sanitas..."
                                                            />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Contacto de Emergencia</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                <input
                                                    name="emergencyContact"
                                                    required
                                                    value={formData.emergencyContact}
                                                    onChange={handleChange}
                                                    className="pl-10 input-field"
                                                    placeholder="Nombre y Teléfono"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div className="pt-6 flex gap-3">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    Atrás
                                </button>
                            )}
                            {step < 4 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex-1 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
                                >
                                    Siguiente
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            ) : (
                                <Button
                                    className="flex-1 text-lg py-3 flex items-center justify-center gap-2"
                                    isLoading={isLoading}
                                >
                                    Completar Registro
                                    <CheckCircle2 className="w-5 h-5" />
                                </Button>
                            )}
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        ¿Ya tiene cuenta?{' '}
                        <Link to="/login" className="text-luma-teal font-semibold hover:underline">
                            Inicie sesión aquí
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Image/Deco */}
            <div className="hidden lg:block w-1/2 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-900/40 to-slate-900/80 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                    alt="Medical Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="relative z-20 h-full flex flex-col justify-end p-16 text-white">
                    <h2 className="text-4xl font-bold mb-4">Salud Inteligente</h2>
                    <p className="text-lg text-slate-300 max-w-md">
                        Un sistema integral para la gestión y seguimiento de la salud de sus pacientes.
                    </p>
                </div>
            </div>
        </div>
    );
};
