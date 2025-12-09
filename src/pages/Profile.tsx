import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
    User,
    CreditCard,
    Clock,
    Plus,
    Trash2,
    FileText,
    AlertCircle,
    Syringe,
    Scissors,
    Save,
    Video,
    Phone,
    Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Generic Component for managing a list of strings
const ListEditor = ({
    title,
    icon: Icon,
    items,
    onAdd,
    onRemove,
    placeholder
}: {
    title: string;
    icon: any;
    items: string[];
    onAdd: (item: string) => void;
    onRemove: (index: number) => void;
    placeholder: string;
}) => {
    const [newItem, setNewItem] = useState('');

    const handleAdd = () => {
        if (newItem.trim()) {
            onAdd(newItem.trim());
            setNewItem('');
        }
    };

    return (
        <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                <Icon className="w-5 h-5 text-luma-teal" /> {title}
            </h3>

            <div className="space-y-2">
                {items.length === 0 && (
                    <p className="text-sm text-slate-400 italic py-2">No hay registros</p>
                )}
                <AnimatePresence>
                    {items.map((item, index) => (
                        <motion.div
                            key={`${item}-${index}`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center justify-between bg-slate-50 p-3 rounded-lg group"
                        >
                            <span className="text-slate-700 text-sm font-medium">{item}</span>
                            <button
                                onClick={() => onRemove(index)}
                                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="flex gap-2 pt-2">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    placeholder={placeholder}
                    className="flex-1 text-sm px-3 py-2 rounded-lg border border-slate-200 focus:border-luma-teal focus:ring-0 outline-none"
                />
                <Button size="sm" onClick={handleAdd} disabled={!newItem.trim()}>
                    <Plus className="w-4 h-4" />
                </Button>
            </div>
        </Card>
    );
};

export const Profile = () => {
    const [activeTab, setActiveTab] = useState<'history' | 'data' | 'invoices'>('data');

    // Medical Data State
    const [weight, setWeight] = useState(62);
    const [height, setHeight] = useState(165);
    const [medications, setMedications] = useState<string[]>(['Ibuprofeno 600mg (si dolor)']);
    const [allergies, setAllergies] = useState<string[]>(['Penicilina']);
    const [surgeries, setSurgeries] = useState<string[]>(['Apendicectomía (2015)']);

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => setIsSaving(false), 1000);
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* Header */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                    <User className="w-10 h-10" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">María García</h1>
                    <p className="text-slate-500 text-sm">maria.garcia@email.com</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-1 bg-luma-teal/10 text-luma-teal text-xs font-bold rounded-full">Paciente Verificado</span>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar touch-pan-x">
                {[
                    { id: 'data', label: 'Mi Expediente', icon: FileText },
                    { id: 'history', label: 'Historial', icon: Clock },
                    { id: 'invoices', label: 'Facturas', icon: CreditCard }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 min-w-[110px] py-3 px-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === tab.id
                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'data' && (
                    <motion.div
                        key="data"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* Biometrics */}
                        <Card className="p-5">
                            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-luma-teal" /> Datos Biométricos
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-500 mb-1 block">Peso (kg)</label>
                                    <div className="bg-slate-50 rounded-lg px-3 py-2 border border-slate-200 focus-within:border-luma-teal focus-within:ring-1 focus-within:ring-luma-teal transition-all">
                                        <input
                                            type="number"
                                            value={weight}
                                            onChange={(e) => setWeight(Number(e.target.value))}
                                            className="w-full bg-transparent outline-none font-bold text-slate-800"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500 mb-1 block">Altura (cm)</label>
                                    <div className="bg-slate-50 rounded-lg px-3 py-2 border border-slate-200 focus-within:border-luma-teal focus-within:ring-1 focus-within:ring-luma-teal transition-all">
                                        <input
                                            type="number"
                                            value={height}
                                            onChange={(e) => setHeight(Number(e.target.value))}
                                            className="w-full bg-transparent outline-none font-bold text-slate-800"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Lists */}
                        <ListEditor
                            title="Medicaciones Actuales"
                            icon={Syringe}
                            items={medications}
                            onAdd={(item) => setMedications([...medications, item])}
                            onRemove={(idx) => setMedications(medications.filter((_, i) => i !== idx))}
                            placeholder="Ej: Paracetamol 500mg"
                        />

                        <ListEditor
                            title="Alergias Conocidas"
                            icon={AlertCircle}
                            items={allergies}
                            onAdd={(item) => setAllergies([...allergies, item])}
                            onRemove={(idx) => setAllergies(allergies.filter((_, i) => i !== idx))}
                            placeholder="Ej: Nueces, Penicilina"
                        />

                        <ListEditor
                            title="Cirugías y Antecedentes"
                            icon={Scissors}
                            items={surgeries}
                            onAdd={(item) => setSurgeries([...surgeries, item])}
                            onRemove={(idx) => setSurgeries(surgeries.filter((_, i) => i !== idx))}
                            placeholder="Ej: Rinoplastia (2020)"
                        />

                        <div className="pt-4 sticky bottom-6 z-10">
                            <Button className="w-full shadow-lg" onClick={handleSave} disabled={isSaving}>
                                <Save className="w-4 h-4 mr-2" />
                                {isSaving ? 'Guardando Cambios...' : 'Guardar Expediente'}
                            </Button>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'history' && (
                    <motion.div
                        key="history"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-4"
                    >
                        {[
                            { title: 'Consulta Salud de la Mujer', date: '06 Dic 2025', doctor: 'Dr. López', type: 'videocall' },
                            { title: 'Consulta Pediatría', date: '28 Nov 2025', doctor: 'Dra. Martínez', type: 'call' },
                            { title: 'Consulta Medicina General', date: '15 Nov 2025', doctor: 'Dr. García', type: 'videocall' }
                        ].map((item, i) => (
                            <Card key={i} className="p-4 flex items-center gap-4 hover:shadow-md transition-all">
                                <div className={`p-3 rounded-full ${item.type === 'videocall' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'}`}>
                                    {item.type === 'videocall' ? <Video className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-slate-800">{item.title}</h4>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <span>{item.date}</span>
                                        <span>•</span>
                                        <span>{item.doctor}</span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-luma-teal">
                                    <Download className="w-5 h-5" />
                                </Button>
                            </Card>
                        ))}
                    </motion.div>
                )}

                {activeTab === 'invoices' && (
                    <motion.div
                        key="invoices"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                    >
                        {[
                            { id: 'INV-2025-001', concept: 'Consulta Salud de la Mujer Online', date: '06 Dic 2025', amount: '45.00€' },
                            { id: 'INV-2025-002', concept: 'Consulta Pediatría Urgente', date: '28 Nov 2025', amount: '35.00€' },
                            { id: 'INV-2025-003', concept: 'Suscripción Mensual Premium', date: '01 Nov 2025', amount: '12.99€' }
                        ].map((invoice, i) => (
                            <Card key={i} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-all">
                                <div className="p-3 bg-slate-50 rounded-lg text-slate-400 hidden sm:block">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-slate-800">{invoice.concept}</h4>
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full tracking-wide">Pagado</span>
                                    </div>
                                    <p className="text-xs text-slate-500">{invoice.date} • {invoice.id}</p>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                    <span className="font-bold text-slate-900">{invoice.amount}</span>
                                    <Button variant="ghost" size="sm" className="text-luma-teal hover:bg-luma-teal/10">
                                        <Download className="w-4 h-4 mr-2" /> Factura
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
