import React from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CreditCard, Wallet, Milestone, Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentWallProps {
    onPaymentComplete: () => void;
    onSubscribe: () => void;
}

export const PaymentWall: React.FC<PaymentWallProps> = ({ onPaymentComplete, onSubscribe }) => {
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl grid md:grid-cols-2 gap-6"
            >
                {/* Single Payment Option */}
                <Card className="p-8 relative overflow-hidden bg-white shadow-xl flex flex-col justify-between h-full min-h-[500px]">
                    <div className="space-y-6">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 mb-4">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-medium text-slate-500 mb-1">Consulta Única</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-slate-900">50€</span>
                            </div>
                            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                                Acceso inmediato al cuestionario de triaje y recomendación médica puntual.
                            </p>
                        </div>

                        <div className="space-y-3 pt-6">
                            <div className="p-3 border border-slate-100 rounded-xl flex items-center gap-3 cursor-pointer hover:border-slate-300 transition-colors" onClick={onPaymentComplete}>
                                <div className="w-8 h-8 rounded-full bg-[#635BFF]/10 flex items-center justify-center text-[#635BFF]">S</div>
                                <span className="font-medium text-slate-700">Stripe</span>
                            </div>
                            <div className="p-3 border border-slate-100 rounded-xl flex items-center gap-3 cursor-pointer hover:border-slate-300 transition-colors" onClick={onPaymentComplete}>
                                <div className="w-8 h-8 rounded-full bg-[#003087]/10 flex items-center justify-center text-[#003087]">P</div>
                                <span className="font-medium text-slate-700">PayPal</span>
                            </div>
                            <div className="p-3 border border-slate-100 rounded-xl flex items-center gap-3 cursor-pointer hover:border-slate-300 transition-colors" onClick={onPaymentComplete}>
                                <CreditCard className="w-5 h-5 text-slate-400" />
                                <span className="font-medium text-slate-700">Tarjeta</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Premium Plan Option (Highlighted) */}
                <div className="relative h-full min-h-[500px]">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-[2rem] blur opacity-30" />
                    <Card className="absolute inset-0 p-8 flex flex-col justify-between bg-zinc-900 text-white border-0 shadow-2xl overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-32 -mt-32" />

                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider mb-6">
                                <Star className="w-3 h-3 filled" fill="currentColor" />
                                Recomendado
                            </div>

                            <h3 className="text-xl font-medium text-slate-300 mb-1">Plan Luma Premium</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-bold text-white">29€</span>
                                <span className="text-slate-400">/mes</span>
                            </div>
                            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                                Ahorra dinero y cuida de tu salud todo el año. Consultas ilimitadas.
                            </p>

                            <ul className="mt-8 space-y-4">
                                {[
                                    'Consultas de triaje ilimitadas',
                                    'Historial médico completo',
                                    'Prioridad en atención',
                                    'Descuentos en especialistas'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                        <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 flex-shrink-0">
                                            <Check className="w-3 h-3" strokeWidth={3} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-8">
                            <Button
                                size="lg"
                                className="w-full h-14 bg-white text-slate-900 hover:bg-slate-100 border-0 text-lg font-bold shadow-lg shadow-white/10"
                                onClick={onSubscribe}
                            >
                                Conseguir Plan Premium
                            </Button>
                            <p className="text-center text-xs text-slate-500 mt-4">
                                Cancela cuando quieras. Sin compromiso.
                            </p>
                        </div>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
};
