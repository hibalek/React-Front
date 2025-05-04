import React, { useState } from "react";
import { Card, CardContent } from "../../components/ui/card/Card";
import PageMeta from "../../components/common/PageMeta";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import {
  MessageSquare,
  ClipboardEdit,
  AlertCircle,
  Droplet,
  Moon,
  Utensils,
  Activity,
  Search,
  ChevronDown,
  Bell,
  CalendarDays,
  Users,
  Mail,
  HeartPulse,
  Dumbbell,
  GlassWater,
} from "lucide-react";

// Types
type GoalKey = "sleep" | "water" | "sport" | "meals";
type PatientStatus = "on-track" | "needs-attention" | "urgent";
type ActiveView = "dashboard" | "messages" | "nutrition" | "activity" | "sleep";

interface Patient {
  id: number;
  name: string;
  age: number;
  weight: number;
  height: number;
  imc: number;
  status: PatientStatus;
  progression: Record<GoalKey, number>;
  goals: Record<GoalKey, number>;
  history: Array<Record<string, any>>;
  lastContact: string;
  unreadMessages?: number;
}

// Données améliorées
const generatePatients = (count: number): Patient[] => {
  const names = [
    "Lina Haddad",
    "Karim Bensaid",
    "Yassine Moulay",
    "Amira Chebbi",
    "Nour Belkacem",
    "Salim Azzi",
    "Aya Toumi",
    "Rayan Ferhat",
  ];
  const statuses: PatientStatus[] = ["on-track", "needs-attention", "urgent"];
  const lastContacts = [
    "Il y a 2 jours",
    "Hier",
    "Aujourd'hui",
    "Il y a 1 semaine",
  ];

  return Array.from({ length: count }, (_, i) => {
    const weight = Math.floor(Math.random() * 50) + 50;
    const height = Math.floor(Math.random() * 50) + 140;
    const imc = +(weight / Math.pow(height / 100, 2)).toFixed(1);

    return {
      id: i,
      name: names[i % names.length],
      age: Math.floor(Math.random() * 40) + 18,
      weight,
      height,
      imc,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastContact: lastContacts[Math.floor(Math.random() * lastContacts.length)],
      unreadMessages: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0,
      progression: {
        sleep: Math.floor(Math.random() * 100),
        water: Math.floor(Math.random() * 100),
        sport: Math.floor(Math.random() * 100),
        meals: Math.floor(Math.random() * 100),
      },
      goals: {
        sleep: 8,
        water: 2.5,
        sport: 1,
        meals: 3,
      },
      history: Array.from({ length: 7 }, (_, day) => ({
        date: `J${day + 1}`,
        sleep: Math.floor(Math.random() * 10),
        water: parseFloat((Math.random() * 3).toFixed(1)),
        sport: Math.floor(Math.random() * 2),
        meals: Math.floor(Math.random() * 3),
        weight: weight - Math.floor(Math.random() * 3),
      })),
    };
  });
};

const samplePatients = generatePatients(8);

// Composant PatientCard
const PatientCard = ({
  patient,
  isSelected,
  onClick,
}: {
  patient: Patient;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const statusColors = {
    "on-track": "bg-green-100 text-green-800",
    "needs-attention": "bg-yellow-100 text-yellow-800",
    urgent: "bg-red-100 text-red-800",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? "bg-indigo-50 border-2 border-indigo-200"
          : "bg-white hover:bg-gray-50 border border-gray-200"
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{patient.name}</h3>
          <p className="text-gray-600 text-sm">{patient.age} ans</p>
        </div>
        <div className="flex items-center gap-2">
          {patient.unreadMessages && (
            <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {patient.unreadMessages}
            </span>
          )}
          <span
            className={`text-xs px-2 py-1 rounded-full ${statusColors[patient.status]}`}
          >
            {patient.status === "on-track"
              ? "En bonne voie"
              : patient.status === "needs-attention"
              ? "Attention"
              : "Urgent"}
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Dernier contact</p>
          <p className="text-sm font-medium">{patient.lastContact}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">IMC</p>
          <p
            className={`text-sm font-bold ${
              patient.imc > 30 ? "text-red-500" : "text-green-500"
            }`}
          >
            {patient.imc}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Composant MetricIcon
const MetricIcon = ({ metric }: { metric: GoalKey }) => {
  const icons = {
    sleep: <Moon className="w-4 h-4" />,
    water: <Droplet className="w-4 h-4" />,
    sport: <Activity className="w-4 h-4" />,
    meals: <Utensils className="w-4 h-4" />,
  };

  return icons[metric];
};

// Composant StatusFilter
const StatusFilter = ({
  activeFilter,
  setActiveFilter,
}: {
  activeFilter: PatientStatus | "all";
  setActiveFilter: (filter: PatientStatus | "all") => void;
}) => {
  return (
    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
      <button
        onClick={() => setActiveFilter("all")}
        className={`px-3 py-1 text-sm rounded-md ${
          activeFilter === "all"
            ? "bg-white shadow"
            : "hover:bg-gray-200"
        }`}
      >
        Tous
      </button>
      <button
        onClick={() => setActiveFilter("on-track")}
        className={`px-3 py-1 text-sm rounded-md flex items-center gap-1 ${
          activeFilter === "on-track"
            ? "bg-white shadow text-green-600"
            : "hover:bg-gray-200"
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        En bonne voie
      </button>
      <button
        onClick={() => setActiveFilter("needs-attention")}
        className={`px-3 py-1 text-sm rounded-md flex items-center gap-1 ${
          activeFilter === "needs-attention"
            ? "bg-white shadow text-yellow-600"
            : "hover:bg-gray-200"
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
        Attention
      </button>
      <button
        onClick={() => setActiveFilter("urgent")}
        className={`px-3 py-1 text-sm rounded-md flex items-center gap-1 ${
          activeFilter === "urgent"
            ? "bg-white shadow text-red-600"
            : "hover:bg-gray-200"
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-red-500"></span>
        Urgent
      </button>
    </div>
  );
};

// Composant NavigationTabs
const NavigationTabs = ({
  activeView,
  setActiveView,
}: {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}) => {
  return (
    <div className="flex border-b border-gray-200 mb-6">
      <button
        onClick={() => setActiveView("dashboard")}
        className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
          activeView === "dashboard"
            ? "border-b-2 border-indigo-500 text-indigo-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <Activity className="w-4 h-4" />
        Tableau de bord
      </button>
      <button
        onClick={() => setActiveView("messages")}
        className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
          activeView === "messages"
            ? "border-b-2 border-indigo-500 text-indigo-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <Mail className="w-4 h-4" />
        Messages
        {samplePatients.some(p => p.unreadMessages) && (
          <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {samplePatients.reduce((acc, p) => acc + (p.unreadMessages || 0), 0)}
          </span>
        )}
      </button>
      <button
        onClick={() => setActiveView("nutrition")}
        className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
          activeView === "nutrition"
            ? "border-b-2 border-indigo-500 text-indigo-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <Utensils className="w-4 h-4" />
        Nutrition
      </button>
      <button
        onClick={() => setActiveView("activity")}
        className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
          activeView === "activity"
            ? "border-b-2 border-indigo-500 text-indigo-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <Dumbbell className="w-4 h-4" />
        Activité
      </button>
      <button
        onClick={() => setActiveView("sleep")}
        className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
          activeView === "sleep"
            ? "border-b-2 border-indigo-500 text-indigo-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <Moon className="w-4 h-4" />
        Sommeil
      </button>
    </div>
  );
};

// Composant MessagesView
const MessagesView = ({ patient }: { patient: Patient }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold mb-4">Messages avec {patient.name}</h2>
      <div className="border border-gray-200 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <Mail className="w-10 h-10 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">Aucun message pour le moment</p>
          <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Envoyer un message
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant NutritionView
const NutritionView = ({ patient }: { patient: Patient }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold mb-4">Plan nutritionnel pour {patient.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Objectifs journaliers</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <GlassWater className="text-blue-500" />
                <span>Eau</span>
              </div>
              <span className="font-bold">{patient.goals.water} L</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Utensils className="text-green-500" />
                <span>Repas</span>
              </div>
              <span className="font-bold">{patient.goals.meals} repas équilibrés</span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Progression</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { name: "Eau", value: patient.progression.water },
                { name: "Repas", value: patient.progression.meals },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant ActivityView
const ActivityView = ({ patient }: { patient: Patient }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold mb-4">Activité physique pour {patient.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Objectifs</h3>
          <div className="p-3 bg-purple-50 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="text-purple-500" />
                <span>Activité sportive</span>
              </div>
              <span className="font-bold">{patient.goals.sport} h/jour</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-purple-600 h-2.5 rounded-full"
                style={{ width: `${patient.progression.sport}%` }}
              ></div>
            </div>
          </div>
          
          <h3 className="font-semibold mb-2">Exercices recommandés</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded-lg">
              <Dumbbell className="text-gray-500" />
              <span>Marche rapide - 30 min</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded-lg">
              <Dumbbell className="text-gray-500" />
              <span>Natation - 20 min</span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Historique cette semaine</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={patient.history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sport"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant SleepView
const SleepView = ({ patient }: { patient: Patient }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold mb-4">Sommeil de {patient.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Objectifs</h3>
          <div className="p-3 bg-indigo-50 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Moon className="text-indigo-500" />
                <span>Temps de sommeil</span>
              </div>
              <span className="font-bold">{patient.goals.sleep} h/nuit</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{ width: `${patient.progression.sleep}%` }}
              ></div>
            </div>
          </div>
          
          <h3 className="font-semibold mb-2">Conseils</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Éviter les écrans 1h avant le coucher</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Maintenir une heure de coucher régulière</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Historique cette semaine</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={patient.history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sleep"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState<Patient>(samplePatients[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<GoalKey>("sleep");
  const [showPatientList, setShowPatientList] = useState(true);
  const [statusFilter, setStatusFilter] = useState<PatientStatus | "all">("all");
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");

  const filteredPatients = samplePatients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const COLORS = ["#0babd4", "#1e9eb0", "#005eb7", "#04aded"];

  const handleMessageClick = () => {
    setActiveView("messages");
  };

  const handleNutritionClick = () => {
    setActiveView("nutrition");
  };

  const handleActivityClick = () => {
    setActiveView("activity");
  };

  const handleSleepClick = () => {
    setActiveView("sleep");
  };

  return (
    
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <PageMeta
        title="ObeseTech | Tableau de bord"
        description="Voire tout les details des patient suivi"
      />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-indigo-120">
          Tableau de bord médical
        </h1>

        <NavigationTabs activeView={activeView} setActiveView={setActiveView} />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Liste des patients (sidebar) */}
          {showPatientList && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="w-full lg:w-1/3 bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Mes patients</h2>
                <button
                  onClick={() => setShowPatientList(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              <div className="mb-4">
                <StatusFilter activeFilter={statusFilter} setActiveFilter={setStatusFilter} />
              </div>

              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-300px)]">
                {filteredPatients.map((patient) => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    isSelected={patient.id === selectedPatient.id}
                    onClick={() => {
                      setSelectedPatient(patient);
                      setActiveView("dashboard");
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Contenu principal */}
          <div className="flex-1">
            {!showPatientList && (
              <button
                onClick={() => setShowPatientList(true)}
                className="mb-4 flex items-center text-indigo-600 hover:text-indigo-800 lg:hidden"
              >
                <ChevronDown className="w-4 h-4 mr-1 transform rotate-90" />
                Voir la liste des patients
              </button>
            )}

            {/* En-tête patient sélectionné */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold">{selectedPatient.name}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-gray-600">
                      {selectedPatient.age} ans
                    </span>
                    <span className="text-sm font-medium">
                      IMC:{" "}
                      <span
                        className={
                          selectedPatient.imc > 30
                            ? "text-red-500"
                            : "text-green-500"
                        }
                      >
                        {selectedPatient.imc}
                      </span>
                    </span>
                    <span className="text-sm text-gray-600">
                      Dernier contact: {selectedPatient.lastContact}
                    </span>
                  </div>
                </div>
                <div className="mt-3 md:mt-0 flex gap-2">
                  <button 
                    onClick={handleMessageClick}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <ClipboardEdit className="w-4 h-4" />
                    <span>Modifier</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Contenu selon la vue active */}
            {activeView === "dashboard" && (
              <>
                {/* Stats rapides */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Poids actuel</p>
                          <p className="text-xl font-semibold">
                            {selectedPatient.weight} kg
                          </p>
                        </div>
                        <div className="text-sm">
                          {selectedPatient.history[0].weight >
                          selectedPatient.history[
                            selectedPatient.history.length - 1
                          ].weight ? (
                            <span className="text-green-500">
                              ↓{" "}
                              {Math.abs(
                                selectedPatient.history[0].weight -
                                  selectedPatient.history[
                                    selectedPatient.history.length - 1
                                  ].weight
                              )}{" "}
                              kg
                            </span>
                          ) : (
                            <span className="text-red-500">
                              ↑{" "}
                              {Math.abs(
                                selectedPatient.history[0].weight -
                                  selectedPatient.history[
                                    selectedPatient.history.length - 1
                                  ].weight
                              )}{" "}
                              kg
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white">
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-500">Taille</p>
                      <p className="text-xl font-semibold">
                        {selectedPatient.height} cm
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white">
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-500">Progrès moyen</p>
                      <p className="text-xl font-semibold">
                        {Math.round(
                          (selectedPatient.progression.sleep +
                            selectedPatient.progression.water +
                            selectedPatient.progression.sport +
                            selectedPatient.progression.meals) /
                            4
                        )}
                        %
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white">
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-500">Prochain RDV</p>
                      <p className="text-xl font-semibold">28/04/2025</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Graphiques */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Progression */}
                  <Card className="bg-white p-4">
                    <h3 className="font-semibold text-lg mb-4">
                      Progression des objectifs
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[
                        { name: "Sommeil", value: selectedPatient.progression.sleep },
                        { name: "Eau", value: selectedPatient.progression.water },
                        { name: "Sport", value: selectedPatient.progression.sport },
                        { name: "Repas", value: selectedPatient.progression.meals },
                      ]} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip />
                        <Bar dataKey="value">
                          {[
                            { name: "Sommeil", value: selectedPatient.progression.sleep },
                            { name: "Eau", value: selectedPatient.progression.water },
                            { name: "Sport", value: selectedPatient.progression.sport },
                            { name: "Repas", value: selectedPatient.progression.meals },
                          ].map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>

                  {/* Historique */}
                  <Card className="bg-white p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-lg">
                        Historique hebdomadaire
                      </h3>
                      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                        {(["sleep", "water", "sport", "meals"] as GoalKey[]).map(
                          (metric) => (
                            <button
                              key={metric}
                              onClick={() => setActiveTab(metric)}
                              className={`px-3 py-1 text-sm rounded-md flex items-center gap-1 ${
                                activeTab === metric
                                  ? "bg-white shadow text-indigo-600"
                                  : "text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              <MetricIcon metric={metric} />
                              {metric === "sleep"
                                ? "Sommeil"
                                : metric === "water"
                                ? "Eau"
                                : metric === "sport"
                                ? "Sport"
                                : "Repas"}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={selectedPatient.history}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey={activeTab}
                          stroke="#4f46e5"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </div>

                {/* Poids et autres métriques */}
                <div className="grid grid-cols-1 gap-6">
                  <Card className="bg-white p-4">
                    <h3 className="font-semibold text-lg mb-4">
                      Évolution du poids
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={selectedPatient.history}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" />
                        <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="weight"
                          stroke="#ef4444"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>

                  {/* Actions rapides */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="font-semibold text-lg mb-4">Actions rapides</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <button 
                        onClick={handleMessageClick}
                        className="flex flex-col items-center justify-center p-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        <MessageSquare className="w-5 h-5 mb-1" />
                        <span className="text-sm">Envoyer un message</span>
                      </button>
                      <button 
                        onClick={handleNutritionClick}
                        className="flex flex-col items-center justify-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <Utensils className="w-5 h-5 mb-1" />
                        <span className="text-sm">Modifier le régime</span>
                      </button>
                      <button 
                        onClick={handleActivityClick}
                        className="flex flex-col items-center justify-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Dumbbell className="w-5 h-5 mb-1" />
                        <span className="text-sm">Planifier activité</span>
                      </button>
                      <button 
                        onClick={handleSleepClick}
                        className="flex flex-col items-center justify-center p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <Moon className="w-5 h-5 mb-1" />
                        <span className="text-sm">Conseils sommeil</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeView === "messages" && (
              <MessagesView patient={selectedPatient} />
            )}

            {activeView === "nutrition" && (
              <NutritionView patient={selectedPatient} />
            )}

            {activeView === "activity" && (
              <ActivityView patient={selectedPatient} />
            )}

            {activeView === "sleep" && (
              <SleepView patient={selectedPatient} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}