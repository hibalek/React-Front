import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
import GeneratePDF from "../components/doctor/GeneratePDF"; // Importer le composant

interface CalendarEvent extends EventInput {
  id: string;
  title: string;
  start: string;
  end?: string;
  extendedProps: {
    calendar: string;
    time: string;
    isNewPatient?: boolean;
    isContinuous?: boolean;
  };
}

interface AppointmentRequest {
  id: string;
  patientName: string;
  date: string;
  time: string;
  isNewPatient: boolean;
  isContinuous: boolean;
  phone: string;
  email: string;
  address: string;
  weightHistory: {
    startAge: string;
    triggeringCircumstances: string;
    lowestAdultWeight: number;
    highestAdultWeight: number;
    recentWeightChanges: string;
    dietsFollowed: string;
    relapses: string;
    idealWeight: number;
  };
  physicalActivity: {
    mainProfession: string;
    workSchedule: string;
    workActivityIntensity: string;
    domesticActivities: string;
    domesticActivityIntensity: string;
    leisureActivities: string;
    leisureActivityIntensity: string;
    sessionDuration: string;
    frequency: string;
    walkingDuringLeisure: string;
    commute: {
      duration: string;
      mode: string;
    };
    elevatorOrStairs: string;
  };
  sedentaryBehavior: {
    screenTime: string;
    sittingTime: string;
  };
  eatingHabits: {
    meals: string;
    snacks: string;
    nibbling: string;
    mealSkipping: string;
    nightEating: string;
    sensations: string;
    portionSize: string;
    foodPurchasing: string;
    mealPreparation: string;
  };
  foodIntake: {
    sugaryDrinks: string;
    alcoholicDrinks: string;
    highEnergyFoods: string;
    lowEnergyFoods: string;
  };
}

interface PatientInfo {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
}

interface DoctorInfo {
  name: string;
  phone: string;
  address: string;
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLevel, setEventLevel] = useState("Primary");
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [isContinuous, setIsContinuous] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [appointmentRequests, setAppointmentRequests] = useState<AppointmentRequest[]>([]);
  const [maxDailyAppointments, setMaxDailyAppointments] = useState(4);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isInfoOpen, openModal: openInfoModal, closeModal: closeInfoModal } = useModal();

  const doctorInfo: DoctorInfo = {
    name: "Dr. Sophie Martin",
    phone: "01 23 45 67 89",
    address: "123 Avenue des Médecins, 75001 Paris",
  };


  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00",
    "14:00", "15:00", "16:00", "17:00",
  ];

  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    const savedMaxAppointments = localStorage.getItem("maxDailyAppointments");
    const savedRequests = localStorage.getItem("appointmentRequests");

    if (savedEvents) setEvents(JSON.parse(savedEvents));
    if (savedMaxAppointments) setMaxDailyAppointments(Number(savedMaxAppointments));

    if (savedRequests) {
      const parsedRequests = JSON.parse(savedRequests);
      setAppointmentRequests(parsedRequests);
      if (parsedRequests.length === 0) {
        initializeSimulatedRequests();
      }
    } else {
      initializeSimulatedRequests();
    }

    console.log("Demandes de rendez-vous après initialisation:", appointmentRequests);
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
    localStorage.setItem("maxDailyAppointments", maxDailyAppointments.toString());
    localStorage.setItem("appointmentRequests", JSON.stringify(appointmentRequests));
    console.log("Mise à jour de appointmentRequests:", appointmentRequests);
  }, [events, maxDailyAppointments, appointmentRequests]);

  const initializeSimulatedRequests = () => {
    const simulatedRequests: AppointmentRequest[] = [
      {
        id: "req1",
        patientName: "Marie Curie",
        date: "2025-04-14",
        time: "14:00",
        isNewPatient: true,
        isContinuous: false,
        phone: "06 12 34 56 78",
        email: "marie.curie@example.com",
        address: "45 Rue de la Science, 75005 Paris",
        weightHistory: {
          startAge: "Adolescence",
          triggeringCircumstances: "Stress scolaire",
          lowestAdultWeight: 55,
          highestAdultWeight: 80,
          recentWeightChanges: "Gain de 5 kg depuis 6 mois (dû à un changement de travail)",
          dietsFollowed: "Régime cétogène (2023, suivi par un nutritionniste), actuellement aucun régime",
          relapses: "2 rechutes (2019, 2022), liées à des périodes de stress",
          idealWeight: 60,
        },
        physicalActivity: {
          mainProfession: "Chercheuse",
          workSchedule: "Horaires normaux",
          workActivityIntensity: "Faible",
          domesticActivities: "Ménage léger (aspirateur, vaisselle)",
          domesticActivityIntensity: "Modérée",
          leisureActivities: "Yoga, marche",
          leisureActivityIntensity: "Modérée",
          sessionDuration: "1 heure",
          frequency: "2 fois par semaine",
          walkingDuringLeisure: "30 minutes par séance de marche",
          commute: {
            duration: "1 heure/jour",
            mode: "Marche et métro",
          },
          elevatorOrStairs: "Préfère les escaliers",
        },
        sedentaryBehavior: {
          screenTime: "4 heures/jour (ordinateur, TV)",
          sittingTime: "6 heures/jour",
        },
        eatingHabits: {
          meals: "Petit-déjeuner à 7h (seul, assis), déjeuner à 12h (au restaurant, vite), dîner à 20h (en famille, en prenant le temps)",
          snacks: "Goûter à 16h (yaourt, fruits)",
          nibbling: "Grignotage occasionnel (soirée, ennui), chocolat, petites quantités",
          mealSkipping: "Rarement (1 fois/mois)",
          nightEating: "Non",
          sensations: "Faim modérée, satiété après repas",
          portionSize: "Assiette standard (25 cm), ne se ressert pas",
          foodPurchasing: "Achats par elle-même, supermarché, 1 fois/semaine, stocke au réfrigérateur",
          mealPreparation: "Prépare elle-même, cuisson vapeur, assaisonnement léger",
        },
        foodIntake: {
          sugaryDrinks: "Jus de fruits (1 verre/jour)",
          alcoholicDrinks: "Vin (1 verre/semaine)",
          highEnergyFoods: "Pâtisseries (1 fois/semaine), chips (rarement)",
          lowEnergyFoods: "Fruits (2/jour), légumes (quotidien)",
        },
      },
      {
        id: "req2",
        patientName: "Jean Dupont",
        date: "2025-04-15",
        time: "10:00",
        isNewPatient: false,
        isContinuous: true,
        phone: "06 98 76 54 32",
        email: "jean.dupont@example.com",
        address: "12 Boulevard des Patients, 75015 Paris",
        weightHistory: {
          startAge: "Âge adulte",
          triggeringCircumstances: "Changement de mode de vie (sédentarité)",
          lowestAdultWeight: 70,
          highestAdultWeight: 95,
          recentWeightChanges: "Perte de 3 kg depuis 3 mois (régime et sport)",
          dietsFollowed: "Régime hypocalorique (2024, suivi seul), actuellement en suivi",
          relapses: "1 rechute (2023), liée à des vacances",
          idealWeight: 75,
        },
        physicalActivity: {
          mainProfession: "Employé de bureau",
          workSchedule: "Horaires normaux",
          workActivityIntensity: "Faible",
          domesticActivities: "Jardinage",
          domesticActivityIntensity: "Élevée",
          leisureActivities: "Course à pied, vélo",
          leisureActivityIntensity: "Élevée",
          sessionDuration: "45 minutes",
          frequency: "3 fois par semaine",
          walkingDuringLeisure: "Marche rapide 20 minutes",
          commute: {
            duration: "30 minutes/jour",
            mode: "Vélo",
          },
          elevatorOrStairs: "Préfère les escaliers",
        },
        sedentaryBehavior: {
          screenTime: "5 heures/jour (ordinateur, jeux vidéo)",
          sittingTime: "8 heures/jour",
        },
        eatingHabits: {
          meals: "Petit-déjeuner à 8h (debout, vite), déjeuner à 13h (seul, assis), dîner à 19h (en famille, vite)",
          snacks: "Collation à 17h (biscuits)",
          nibbling: "Grignotage fréquent (soirée, gourmandise), chips, grandes quantités",
          mealSkipping: "Fréquent (2 fois/semaine)",
          nightEating: "Oui (réveils nocturnes, fromage)",
          sensations: "Faim fréquente, satiété difficile",
          portionSize: "Assiette standard (25 cm), se ressert souvent",
          foodPurchasing: "Achats en couple, supermarché, 2 fois/semaine, stocke au garde-manger",
          mealPreparation: "Prépare avec sa femme, cuisson au four, assaisonnement riche",
        },
        foodIntake: {
          sugaryDrinks: "ākSodas (2 verres/jour)",
          alcoholicDrinks: "Bière (2 verres/semaine)",
          highEnergyFoods: "Frites (2 fois/semaine), viennoiseries (quotidien)",
          lowEnergyFoods: "Légumes (rarement), fruits (1/semaine)",
        },
      },
    ];
    setAppointmentRequests(simulatedRequests);
  };

  const resetLocalStorage = () => {
    localStorage.removeItem("events");
    localStorage.removeItem("maxDailyAppointments");
    localStorage.removeItem("appointmentRequests");
    setEvents([]);
    setMaxDailyAppointments(4);
    initializeSimulatedRequests();
    console.log("LocalStorage réinitialisé, demandes simulées réajoutées.");
  };

  const getEventsCountForDay = (date: string) => {
    return events.filter((event) => event.start.split("T")[0] === date).length;
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const selectedDate = selectInfo.startStr.split("T")[0];
    const eventCount = getEventsCountForDay(selectedDate);
    if (eventCount >= maxDailyAppointments) {
      alert(`Impossible d’ajouter un rendez-vous : la journée est complète (${maxDailyAppointments} maximum).`);
      return;
    }
    resetModalFields();
    setEventDate(selectedDate);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event as unknown as CalendarEvent;
    setSelectedEvent(event);
    setEventTitle(event.title);
    setEventDate(event.start.split("T")[0]);
    setEventTime(event.extendedProps.time || "");
    setEventLevel(event.extendedProps.calendar);
    setIsNewPatient(event.extendedProps.isNewPatient || false);
    setIsContinuous(event.extendedProps.isContinuous || false);
    openModal();
  };

  const handleAddOrUpdateEvent = () => {
    const eventCount = getEventsCountForDay(eventDate);
    if (!selectedEvent && eventCount >= maxDailyAppointments) {
      alert(`Impossible d’ajouter un rendez-vous : la journée est complète (${maxDailyAppointments} maximum).`);
      return;
    }

    if (!eventTitle || !eventDate || !eventTime) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const startDateTime = `${eventDate}T${eventTime}:00`;
    const eventId = selectedEvent?.id || Date.now().toString();

    if (selectedEvent) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                title: eventTitle,
                start: startDateTime,
                extendedProps: {
                  calendar: eventLevel,
                  time: eventTime,
                  isNewPatient,
                  isContinuous,
                },
              }
            : event
        )
      );
    } else {
      const newEvent: CalendarEvent = {
        id: eventId,
        title: eventTitle,
        start: startDateTime,
        extendedProps: {
          calendar: eventLevel,
          time: eventTime,
          isNewPatient,
          isContinuous,
        },
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }

    closeModal();
    resetModalFields();
  };

  const handleValidateRequest = (request: AppointmentRequest) => {
    const eventCount = getEventsCountForDay(request.date);
    if (eventCount >= maxDailyAppointments) {
      alert(`Impossible de valider : la journée est complète (${maxDailyAppointments} maximum).`);
      return;
    }

    const newEvent: CalendarEvent = {
      id: request.id,
      title: request.patientName,
      start: `${request.date}T${request.time}:00`,
      extendedProps: {
        calendar: "Primary",
        time: request.time,
        isNewPatient: request.isNewPatient,
        isContinuous: request.isContinuous,
      },
    };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setAppointmentRequests((prev) => prev.filter((req) => req.id !== request.id));
  };

  const handleRejectRequest = (requestId: string) => {
    setAppointmentRequests((prev) => prev.filter((req) => req.id !== requestId));
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents((prev) => prev.filter((event) => event.id !== selectedEvent.id));
      closeModal();
      resetModalFields();
    }
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventDate("");
    setEventTime("");
    setEventLevel("Primary");
    setIsNewPatient(false);
    setIsContinuous(false);
    setSelectedEvent(null);
  };

  const handleViewPatientInfo = (request: AppointmentRequest) => {
    setPatientInfo({
      id: request.id,
      firstName: request.patientName.split(" ")[0] || "Inconnu",
      lastName: request.patientName.split(" ")[1] || "",
      phone: request.phone,
      email: request.email,
      address: request.address,
    });
    openInfoModal();
  };

  const clearRequests = () => {
    setAppointmentRequests([]);
  };

  const dayCellClassNames = (args: any) => {
    const dateStr = args.date.toISOString().split("T")[0];
    const eventCount = getEventsCountForDay(dateStr);
    if (eventCount >= maxDailyAppointments) {
      return ["bg-red-100"];
    }
    return [];
  };

  return (
    <>
      <PageMeta
        title="ObeseTech | Calendrier"
        description="Gérez les rendez-vous patients dans ObeSmart"
      />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
        <div className="mb-4">
          <button
            onClick={resetLocalStorage}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Réinitialiser les données (pour débogage)
          </button>
        </div>

        {appointmentRequests.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 animate-slide-in">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                Demandes de rendez-vous
              </h3>
              <button
                onClick={clearRequests}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Effacer tout
              </button>
            </div>
            <ul className="space-y-3">
              {appointmentRequests.map((request) => (
                <li key={request.id} className="flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
                  <span>
                    {request.patientName} ({request.date}, {request.time})
                    {request.isNewPatient && " (Nouveau)"}
                  </span>
                  <button
                    onClick={() => handleValidateRequest(request)}
                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                  >
                    Valider
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Refuser
                  </button>
                  {/* Utilisation du composant GeneratePDF */}
                  <GeneratePDF request={request} doctorInfo={doctorInfo} />
                  <button
                    onClick={() => handleViewPatientInfo(request)}
                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                  >
                    Voir infos
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center gap-4 mb-6">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-400">
            Max consultations/jour :
          </label>
          <input
            type="number"
            min="1"
            value={maxDailyAppointments}
            onChange={(e) => setMaxDailyAppointments(Number(e.target.value))}
            className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 focus:ring focus:ring-blue-500/20"
          />
          <button
            onClick={() => {
              resetModalFields();
              openModal();
            }}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
          >
            Ajouter RDV
          </button>
        </div>

        <div className="custom-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            selectable={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            dayCellClassNames={dayCellClassNames}
          />
        </div>

        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md p-6 rounded-xl shadow-xl">
          <div className="flex flex-col">
            <h5 className="mb-4 font-semibold text-gray-800 text-lg dark:text-white/90">
              {selectedEvent ? "Modifier RDV" : "Nouveau RDV"}
            </h5>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                  Nom du patient
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 focus:ring focus:ring-blue-500/20"
                  placeholder="Ex. Jean Dupont"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 focus:ring focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                  Heure
                </label>
                <select
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 focus:ring focus:ring-blue-500/20"
                >
                  <option value="">Choisir un horaire</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="flex items-center text-sm text-gray-700 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={isNewPatient}
                    onChange={(e) => setIsNewPatient(e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  Nouveau patient
                </label>
              </div>
              <div>
                <label className="flex items-center text-sm text-gray-700 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={isContinuous}
                    onChange={(e) => setIsContinuous(e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  Consultation continue
                </label>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6 justify-end">
              <button
                onClick={closeModal}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-colors"
              >
                Annuler
              </button>
              {selectedEvent && (
                <button
                  onClick={handleDeleteEvent}
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 transition-colors"
                >
                  Supprimer
                </button>
              )}
              <button
                onClick={handleAddOrUpdateEvent}
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 transition-colors"
              >
                {selectedEvent ? "Modifier" : "Enregistrer"}
              </button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={isInfoOpen} onClose={closeInfoModal} className="max-w-md p-6 rounded-xl shadow-xl">
          <div className="flex flex-col">
            <h5 className="mb-4 font-semibold text-gray-800 text-lg dark:text-white/90">
              Informations du patient
            </h5>
            {patientInfo && (
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p><strong>Prénom :</strong> {patientInfo.firstName}</p>
                <p><strong>Nom :</strong> {patientInfo.lastName}</p>
                <p><strong>Téléphone :</strong> {patientInfo.phone}</p>
                <p><strong>Email :</strong> {patientInfo.email}</p>
                <p><strong>Adresse :</strong> {patientInfo.address}</p>
              </div>
            )}
            <div className="flex justify-end mt-6">
              <button
                onClick={closeInfoModal}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

const renderEventContent = (eventInfo: any) => {
  const { title, extendedProps } = eventInfo.event;
  const colorClass = `fc-bg-${extendedProps.calendar.toLowerCase()}`;
  return (
    <div className={`flex fc-event-main ${colorClass} p-1 rounded text-xs`}>
      <div className="fc-event-title">
        {title} ({extendedProps.time})
      </div>
    </div>
  );
};

export default Calendar;
