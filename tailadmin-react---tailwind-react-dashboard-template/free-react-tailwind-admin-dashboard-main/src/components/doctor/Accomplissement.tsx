
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card/Card";
//import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { BellIcon, CalendarIcon, UsersIcon, LineChartIcon } from "lucide-react";

const samplePatientStats = [
  { category: "Sommeil", average: 68 },
  { category: "Eau", average: 85 },
  { category: "Sport", average: 76 },
  { category: "Repas", average: 92 },
];

const sampleWeightEvolution = [
  { month: "Janv", poids: 86 },
  { month: "Fév", poids: 84 },
  { month: "Mars", poids: 81 },
  { month: "Avril", poids: 79 },
];

const alerts = [
  { type: "Bilan reçu", count: 3 },
  { type: "Messages non lus", count: 5 },
];

const consultations = [
  { date: "25/04/2025", patient: "Sarah B." },
  { date: "27/04/2025", patient: "Hassan K." },
  { date: "28/04/2025", patient: "Leïla M." },
];

export default function AccomplishmentDashboard() {
  const [totalPatients, setTotalPatients] = useState(0);
  const [averageProgress, setAverageProgress] = useState(0);

  useEffect(() => {
    // Simule des données récupérées
    setTotalPatients(42);
    const moy = samplePatientStats.reduce((acc, el) => acc + el.average, 0) / samplePatientStats.length;
    setAverageProgress(Math.round(moy));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3 p-6">

      {/* Statistiques principales */}
      <Card className="col-span-1 flex items-center gap-4">
        <CardContent className="flex items-center gap-4 py-6">
          <UsersIcon className="text-blue-600 w-8 h-8" />
          <div>
            <h4 className="text-lg font-semibold">Patients suivis</h4>
            <p className="text-2xl font-bold">{totalPatients}</p>
          </div>
        </CardContent>
      </Card>

      {/* Alertes */}
      <Card className="col-span-1">
        <CardContent className="py-6">
          <div className="flex items-center gap-2 mb-4">
            <BellIcon className="w-6 h-6 text-yellow-600" />
            <h4 className="text-lg font-semibold">Alertes</h4>
          </div>
          <ul className="space-y-2">
            {alerts.map((a, i) => (
              <li key={i} className="flex justify-between">
                <span>{a.type}</span>
                <span className="font-semibold text-red-500">{a.count}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Consultations */}
      <Card className="col-span-1">
        <CardContent className="py-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-6 h-6 text-purple-600" />
            <h4 className="text-lg font-semibold">Consultations à venir</h4>
          </div>
          <ul className="space-y-2">
            {consultations.map((c, i) => (
              <li key={i} className="flex justify-between">
                <span>{c.patient}</span>
                <span>{c.date}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}