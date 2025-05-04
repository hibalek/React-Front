import { useState } from "react";
import { ChevronDown, User, Stethoscope, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import PageMeta from "../../components/common/PageMeta";

const weekDays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const meals = ["Petit Déjeuner", "Déjeuner", "Dîner"];
const sports = ["Course à pied", "Natation", "Cyclisme", "Yoga", "Musculation", "Marche", "Aucun"];

const categories: Record<string, { name: string; emoji: string }[]> = {
  Fruits: [
    { name: "Banane", emoji: "🍌" },
    { name: "Pomme", emoji: "🍎" },
    { name: "Fraise", emoji: "🍓" },
    { name: "Orange", emoji: "🍊" },
  ],
  Légumes: [
    { name: "Carotte", emoji: "🥕" },
    { name: "Épinard", emoji: "🥬" },
    { name: "Tomate", emoji: "🍅" },
  ],
  Protéines: [
    { name: "Poulet", emoji: "🍗" },
    { name: "Œuf", emoji: "🥚" },
    { name: "Tofu", emoji: "🧈" },
  ],
  Féculents: [
    { name: "Riz", emoji: "🍚" },
    { name: "Pâtes", emoji: "🍝" },
    { name: "Pain complet", emoji: "🍞" },
  ],
  Laitiers: [
    { name: "Yaourt", emoji: "🥛" },
    { name: "Fromage blanc", emoji: "🧀" },
  ],
};

type SelectedItems = {
  [key: string]: string[];
};

type Comments = {
  [key: string]: string;
};

type Patient = {
  id: string;
  name: string;
  avatar: string;
};

type RegimeDetails = {
  waterIntake: string;
  preferredSport: string;
  duration: string;
};

export default function RegimePlanner() {
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [selected, setSelected] = useState<SelectedItems>({});
  const [comments, setComments] = useState<Comments>({});
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<Record<string, string>>({});
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientList, setShowPatientList] = useState(false);
  const [regimeDetails, setRegimeDetails] = useState<RegimeDetails>({
    waterIntake: "1.5",
    preferredSport: "Aucun",
    duration: "7"
  });
  const [currentStep, setCurrentStep] = useState<"planning" | "details">("planning");

  const patients: Patient[] = [
    { id: "1", name: "Patient Alpha", avatar: "/patient-avatar1.jpg" },
    { id: "2", name: "Patient Beta", avatar: "/patient-avatar2.jpg" },
    { id: "3", name: "Patient Gamma", avatar: "/patient-avatar3.jpg" },
  ];

  const toggleItem = (day: string, meal: string, item: string) => {
    const key = `${day}-${meal}`;
    const current = selected[key] || [];
    const newList = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];
    setSelected({ ...selected, [key]: newList });
  };

  const isSelected = (day: string, meal: string, item: string) => {
    const key = `${day}-${meal}`;
    return selected[key]?.includes(item);
  };

  const handleCommentChange = (day: string, meal: string, value: string) => {
    const key = `${day}-${meal}`;
    setComments({ ...comments, [key]: value });
  };

  const exportToPDF = () => {
    if (!selectedPatient) {
      alert("Veuillez sélectionner un patient avant d'exporter");
      return;
    }

    const doc = new jsPDF();
    let yOffset = 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(`Régime Hebdomadaire pour ${selectedPatient.name}`, 14, yOffset);
    yOffset += 10;

    // Détails du régime
    doc.setFontSize(12);
    doc.text(`Hydratation: ${regimeDetails.waterIntake}L/jour`, 14, yOffset);
    yOffset += 7;
    doc.text(`Sport: ${regimeDetails.preferredSport}`, 14, yOffset);
    yOffset += 7;
    doc.text(`Durée: ${regimeDetails.duration} jours`, 14, yOffset);
    yOffset += 15;

    // Planning alimentaire
    weekDays.forEach((day) => {
      doc.setFontSize(12);
      doc.text(day, 14, yOffset);
      yOffset += 7;

      meals.forEach((meal) => {
        const mealKey = `${day}-${meal}`;
        const mealItems = selected[mealKey] || [];
        const comment = comments[mealKey] || "";
        const mealText = `${meal}: ${mealItems.join(", ") || "Aucun aliment sélectionné"}`;
        doc.text(mealText, 14, yOffset);
        yOffset += 7;
        if (comment) {
          doc.text(`📝 Commentaire: ${comment}`, 14, yOffset);
          yOffset += 7;
        }
      });

      yOffset += 5;
    });

    doc.save(`regime_${selectedPatient.name.replace(/\s+/g, '_')}.pdf`);
  };

  const clearAllSelections = () => {
    setSelected({});
    setComments({});
  };

  const toggleCategory = (cat: string) => {
    setOpenCategory(openCategory === cat ? null : cat);
  };

  const handleDetailsChange = (field: keyof RegimeDetails, value: string) => {
    setRegimeDetails({
      ...regimeDetails,
      [field]: value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageMeta
        title="ObeseTech | Regime"
        description="Gérez les regeme de patient"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* En-tête avec sélection du patient */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {currentStep === "planning" ? "Planification de Régime" : "Détails du Régime"}
              </h1>
              <p className="text-gray-600 mt-2">
                {currentStep === "planning" 
                  ? "Créez un régime personnalisé pour vos patients" 
                  : "Complétez les informations supplémentaires"}
              </p>
            </div>

            {selectedPatient && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                    <img 
                      src={selectedPatient.avatar} 
                      alt={selectedPatient.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/default-avatar.jpg";
                      }}
                    />
                  </div>
                  <span className="font-medium">{selectedPatient.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {!selectedPatient && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <User size={40} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Sélectionnez un patient
            </h3>
            <p className="text-gray-600 mb-6">
              Veuillez sélectionner un patient pour commencer à planifier son régime alimentaire.
            </p>
            <button
              onClick={() => setShowPatientList(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Stethoscope size={18} />
              Choisir un patient
            </button>
          </div>
        )}

        {selectedPatient && currentStep === "planning" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne de sélection des jours */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Jours de la semaine</h2>
                <div className="space-y-2">
                  {weekDays.map((day, idx) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(idx)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition ${
                        selectedDay === idx
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Colonne principale */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {meals.map((meal) => {
                  const day = weekDays[selectedDay];
                  const commentKey = `${day}-${meal}`;
                  return (
                    <div
                      key={meal}
                      className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
                    >
                      <h2 className="text-xl font-bold text-gray-900 mb-4">
                        {meal}
                      </h2>

                      {Object.entries(categories).map(([catName, items]) => {
                        const filtered = items.filter((i) =>
                          i.name.toLowerCase().includes((searchQuery[catName] || "").toLowerCase())
                        );
                        return (
                          <div key={catName} className="mb-4 border-b pb-2 border-gray-200">
                            <button
                              className="flex items-center justify-between w-full text-left mb-2 font-semibold text-gray-800"
                              onClick={() => toggleCategory(catName)}
                            >
                              {catName}
                              <ChevronDown
                                className={`transition-transform ${openCategory === catName ? "rotate-180" : ""}`}
                              />
                            </button>

                            {openCategory === catName && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <input
                                  type="text"
                                  placeholder="Rechercher..."
                                  value={searchQuery[catName] || ""}
                                  onChange={(e) =>
                                    setSearchQuery({ ...searchQuery, [catName]: e.target.value })
                                  }
                                  className="mb-3 px-3 py-2 text-sm w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                                  {filtered.length > 0 ? (
                                    filtered.map(({ name, emoji }) => (
                                      <button
                                        key={name}
                                        onClick={() => toggleItem(day, meal, name)}
                                        className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm transition ${
                                          isSelected(day, meal, name)
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "bg-gray-100 text-gray-800 hover:bg-blue-50 border-gray-300"
                                        }`}
                                      >
                                        <span>{emoji}</span> {name}
                                      </button>
                                    ))
                                  ) : (
                                    <p className="text-gray-400 text-sm italic">
                                      Aucun aliment trouvé.
                                    </p>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        );
                      })}

                      <textarea
                        placeholder="Ajouter un commentaire sur ce repas..."
                        value={comments[commentKey] || ""}
                        onChange={(e) => handleCommentChange(day, meal, e.target.value)}
                        className="w-full mt-4 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-4 justify-between">
                <button
                  onClick={clearAllSelections}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Tout effacer
                </button>
                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep("details")}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                  >
                    Suivant <ArrowRight size={18} />
                  </button>
                </div>
              </div>

              {/* Récapitulatif */}
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Récapitulatif des Aliments Sélectionnés
                </h2>
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jour
                        </th>
                        {meals.map((meal) => (
                          <th key={meal} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {meal}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {weekDays.map((day) => (
                        <tr key={day} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            {day}
                          </td>
                          {meals.map((meal) => {
                            const key = `${day}-${meal}`;
                            const mealItems = selected[key] || [];
                            const comment = comments[key];
                            return (
                              <td key={meal} className="px-6 py-4">
                                {mealItems.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {mealItems.map(item => (
                                      <span key={item} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                        {item}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">Aucun</span>
                                )}
                                {comment && (
                                  <div className="mt-1 text-sm text-gray-500">
                                    📝 {comment}
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedPatient && currentStep === "details" && (
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Détails supplémentaires du régime</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hydratation quotidienne (en litres)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="5"
                    step="0.5"
                    value={regimeDetails.waterIntake}
                    onChange={(e) => handleDetailsChange("waterIntake", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sport préféré
                  </label>
                  <select
                    value={regimeDetails.preferredSport}
                    onChange={(e) => handleDetailsChange("preferredSport", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {sports.map((sport) => (
                      <option key={sport} value={sport}>{sport}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durée du régime (en jours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={regimeDetails.duration}
                    onChange={(e) => handleDetailsChange("duration", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">Résumé du patient</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                    <img 
                      src={selectedPatient.avatar} 
                      alt={selectedPatient.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/default-avatar.jpg";
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{selectedPatient.name}</p>
                    <p className="text-sm text-gray-600">Patient</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p><span className="font-medium">Hydratation:</span> {regimeDetails.waterIntake}L/jour</p>
                  <p><span className="font-medium">Sport:</span> {regimeDetails.preferredSport}</p>
                  <p><span className="font-medium">Durée:</span> {regimeDetails.duration} jours</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep("planning")}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Retour
              </button>
              <button
                onClick={exportToPDF}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Exporter en PDF
              </button>
            </div>
          </div>
        )}

        {/* Modal de sélection des patients */}
        {showPatientList && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Sélectionner un patient</h2>
                  <button 
                    onClick={() => setShowPatientList(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <ul className="space-y-3">
                  {patients.map((patient) => (
                    <li 
                      key={patient.id} 
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedPatient(patient);
                        setShowPatientList(false);
                      }}
                    >
                      <img 
                        src={patient.avatar} 
                        alt={patient.name} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/default-avatar.jpg";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{patient.name}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-gray-200 p-4">
                <button 
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  onClick={() => setShowPatientList(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}