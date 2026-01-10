import { useState, useEffect } from 'react';
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
    Download,
    Calendar,
    CalendarCheck,
    MapPin,
    File as FileIcon,
    Shield,
    MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import type { UserData } from '../context/AuthContext';
import { useSearchParams, useParams } from 'react-router-dom';

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
        <Card className="p-5 space-y-4 h-full">
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
    const { user, getUserData, mockUsers } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const { userId } = useParams<{ userId: string }>(); // Optional param from route

    // Determine active tab from URL or default to 'data'
    const activeTab = searchParams.get('tab') || 'data';

    // Local State
    const [userData, setUserData] = useState<UserData | null>(null);
    const [targetUser, setTargetUser] = useState<any>(null); // The user being viewed
    const [isSaving, setIsSaving] = useState(false);

    // Determine who we are viewing
    useEffect(() => {
        if (!user) return;

        let targetId = user.id;

        // If admin and viewing a specific ID
        if (user.role === 'admin' && userId) {
            targetId = userId;
            const foundUser = mockUsers.find(u => u.id === targetId);
            setTargetUser(foundUser || null);
        } else {
            // Viewing self
            setTargetUser(user);
        }

        const data = getUserData(targetId);
        setUserData(data);

    }, [user, userId, mockUsers]);

    // Update tab helper
    const handleTabChange = (tabId: string) => {
        setSearchParams({ tab: tabId });
    };

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => setIsSaving(false), 1000);
    };

    // Quick helper to update local mock state (in a real app this would be a dispatch)
    const updateMedical = (field: string, value: any) => {
        if (!userData) return;
        setUserData({
            ...userData,
            medical: {
                ...userData.medical,
                [field]: value
            }
        });
    };

    if (!user || !userData || !targetUser) {
        return <div className="p-8 text-center">Cargando perfil...</div>;
    }

    const isAdminView = user.role === 'admin' && user.id !== targetUser.id;

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* Admin Banner */}
            {isAdminView && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3 text-amber-800 text-sm font-medium">
                    <Shield className="w-5 h-5" />
                    <span>Modo Administrador: Estás viendo el expediente de {targetUser.name}</span>
                </div>
            )}

            {/* Header */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 shrink-0">
                    <User className="w-10 h-10" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">{targetUser.name}</h1>
                    <p className="text-slate-500 text-sm">{targetUser.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-1 bg-luma-teal/10 text-luma-teal text-xs font-bold rounded-full">
                            Paciente {targetUser.subscriptionPlan === 'premium' ? 'Premium' : 'Verificado'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar touch-pan-x">
                {[
                    { id: 'data', label: 'Mi Expediente', icon: FileText },
                    { id: 'history', label: 'Historial', icon: Clock },
                    { id: 'reports', label: 'Informes', icon: FileIcon },
                    { id: 'appointments', label: 'Citas', icon: Calendar },
                    { id: 'invoices', label: 'Facturas', icon: CreditCard }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`flex-1 min-w-[100px] py-3 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <tab.icon className="w-4 h-4 hidden sm:block" />
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
                                            value={userData.medical.weight}
                                            onChange={(e) => updateMedical('weight', Number(e.target.value))}
                                            className="w-full bg-transparent outline-none font-bold text-slate-800"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500 mb-1 block">Altura (cm)</label>
                                    <div className="bg-slate-50 rounded-lg px-3 py-2 border border-slate-200 focus-within:border-luma-teal focus-within:ring-1 focus-within:ring-luma-teal transition-all">
                                        <input
                                            type="number"
                                            value={userData.medical.height}
                                            onChange={(e) => updateMedical('height', Number(e.target.value))}
                                            className="w-full bg-transparent outline-none font-bold text-slate-800"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Lists - Grid Layout */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <ListEditor
                                title="Medicaciones"
                                icon={Syringe}
                                items={userData.medical.medications}
                                onAdd={(item) => updateMedical('medications', [...userData.medical.medications, item])}
                                onRemove={(idx) => updateMedical('medications', userData.medical.medications.filter((_, i) => i !== idx))}
                                placeholder="Ej: Paracetamol 500mg"
                            />

                            <ListEditor
                                title="Alergias"
                                icon={AlertCircle}
                                items={userData.medical.allergies}
                                onAdd={(item) => updateMedical('allergies', [...userData.medical.allergies, item])}
                                onRemove={(idx) => updateMedical('allergies', userData.medical.allergies.filter((_, i) => i !== idx))}
                                placeholder="Ej: Nueces"
                            />

                            <div className="md:col-span-2">
                                <ListEditor
                                    title="Cirugías y Antecedentes"
                                    icon={Scissors}
                                    items={userData.medical.surgeries}
                                    onAdd={(item) => updateMedical('surgeries', [...userData.medical.surgeries, item])}
                                    onRemove={(idx) => updateMedical('surgeries', userData.medical.surgeries.filter((_, i) => i !== idx))}
                                    placeholder="Ej: Rinoplastia (2020)"
                                />
                            </div>
                        </div>

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
                        {userData.history.length === 0 ? (
                            <div className="text-center py-10 text-slate-400">No hay consultas registradas.</div>
                        ) : (
                            userData.history.map((item, i) => (
                                <Card key={i} className="p-4 flex items-center gap-4 hover:shadow-md transition-all">
                                    <div className={`p-3 rounded-full ${item.type === 'videocall' ? 'bg-blue-50 text-blue-500' :
                                        item.type === 'chat' ? 'bg-indigo-50 text-indigo-500' :
                                            'bg-green-50 text-green-500'
                                        }`}>
                                        {item.type === 'videocall' && <Video className="w-5 h-5" />}
                                        {item.type === 'chat' && <MessageSquare className="w-5 h-5" />}
                                        {item.type === 'call' && <Phone className="w-5 h-5" />}
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
                            ))
                        )}
                    </motion.div>
                )}

                {activeTab === 'reports' && (
                    <motion.div
                        key="reports"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-4"
                    >
                        {userData.reports.length === 0 ? (
                            <div className="text-center py-10 text-slate-400">No hay informes médicos disponibles.</div>
                        ) : (
                            userData.reports.map((item, i) => (
                                <Card key={i} className="p-4 flex items-center gap-4 hover:shadow-md transition-all">
                                    <div className="p-3 rounded-full bg-orange-50 text-orange-500">
                                        <FileText className="w-5 h-5" />
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
                            ))
                        )}
                    </motion.div>
                )}

                {activeTab === 'appointments' && (
                    <motion.div
                        key="appointments"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-4"
                    >
                        {userData.appointments.length === 0 ? (
                            <div className="text-center py-10 text-slate-400">No hay visitas concertadas.</div>
                        ) : (
                            userData.appointments.map((item, i) => (
                                <Card key={i} className="p-4 flex items-center gap-4 hover:shadow-md transition-all border-l-4 border-l-luma-teal">
                                    <div className="p-3 rounded-full bg-slate-50 text-luma-teal">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-slate-800">{item.title}</h4>
                                        <div className="space-y-1 mt-1">
                                            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{item.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <User className="w-3.5 h-3.5" />
                                                <span>{item.doctor}</span>
                                                {item.location && (
                                                    <span className="flex items-center gap-1 ml-2">
                                                        <MapPin className="w-3.5 h-3.5" /> {item.location}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button size="sm" variant="secondary" className="text-xs">
                                            Detalles
                                        </Button>
                                        <a
                                            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(item.title)}&dates=${new Date().toISOString().replace(/-|:|\.\d\d\d/g, "")}/${new Date().toISOString().replace(/-|:|\.\d\d\d/g, "")}&details=${encodeURIComponent('Consulta médica con ' + item.doctor)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs flex items-center gap-1 text-luma-teal hover:underline px-3 py-1 bg-luma-teal/5 rounded-lg"
                                        >
                                            <CalendarCheck className="w-3 h-3" /> Añadir Agenda
                                        </a>
                                    </div>
                                </Card>
                            ))
                        )}
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
                        {userData.invoices.length === 0 ? (
                            <div className="text-center py-10 text-slate-400">No hay facturas.</div>
                        ) : (
                            userData.invoices.map((invoice, i) => (
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
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
