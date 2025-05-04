import React, { useState, useCallback } from "react";
import { Plus, Trash2, Edit2, Calendar, Award, MapPin, Phone, Mail, User, Stethoscope } from "lucide-react";
import logo from "../../images/logo.png"; // Assure-toi que c’est le bon chemin
import ahlem from "../../images/ahlem.png"; // Assure-toi que c’est le bon chemin
import PageMeta from "../../components/common/PageMeta";

// Types
type Availability = {
  [key: string]: string;
};

type Certificate = {
  id: string;
  name: string;
  year: string;
};

type ContactInfo = {
  email: string;
  phone: string;
  address: string;
};

type Follower = {
  id: string;
  name: string;
  avatar: string;
};

type Patient = {
  id: string;
  name: string;
  avatar: string;
  lastVisit: string;
};

type DoctorProfileData = {
  fullName: string;
  specialty: string;
  profileImage: string;
  bannerImage: string;
  availability: Availability;
  certificates: Certificate[];
  contactInfo: ContactInfo;
  followers: Follower[];
  patients: Patient[];
};

// Composant Publication
const Publication = React.memo(({ 
  authorName, 
  authorImage, 
  content, 
  image, 
  date, 
  onDelete 
}: { 
  authorName: string;
  authorImage: string;
  content?: string; 
  image?: string; 
  date: string; 
  onDelete: () => void 
}) => (
  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6 transition-all hover:shadow-lg">
    <div className="flex justify-between items-start">
      <div className="flex gap-4">
        <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-blue-100">
          <img 
            src={ahlem} 
            alt={authorName} 
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/default-avatar.jpg";
            }}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900">{authorName}</h3>
          <p className="text-sm text-gray-500 mt-1">{date}</p>
          {content && <p className="mt-3 text-gray-800 leading-relaxed">{content}</p>}
          {image && (
            <div className="mt-3 rounded-xl overflow-hidden border border-gray-200">
              <img 
                src={image} 
                alt="Publication" 
                className="w-full h-auto max-h-96 object-cover"
              />
            </div>
          )}
        </div>
      </div>
      <button 
        className="text-gray-400 hover:text-red-600 transition-colors"
        onClick={onDelete}
        aria-label="Supprimer"
      >
        <Trash2 size={18} />
      </button>
    </div>
    <div className="mt-4 flex gap-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
      <button className="hover:text-blue-600 flex items-center gap-1 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        10 Likes
      </button>
      <button className="hover:text-blue-600 flex items-center gap-1 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        5 Commentaires
      </button>
    </div>
  </div>
));

// Composant Modal
const ListModal = React.memo(({ 
  type, 
  items, 
  onClose 
}: { 
  type: string; 
  items: Array<{ id: string; name: string; avatar: string; lastVisit?: string }>; 
  onClose: () => void 
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{type}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Fermer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <img 
                src={item.avatar} 
                alt={item.name} 
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/default-avatar.jpg";
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.name}</p>
                {item.lastVisit && <p className="text-xs text-gray-500 mt-1">Dernière visite: {item.lastVisit}</p>}
              </div>
              <button className="text-blue-600 text-sm font-medium hover:underline whitespace-nowrap">
                Voir profil
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-gray-200 p-4">
        <button 
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          onClick={onClose}
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
));

// Composant Sidebar
const Sidebar = React.memo(({
  doctor,
  onDoctorUpdate
}: {
  doctor: DoctorProfileData;
  onDoctorUpdate: (updatedDoctor: DoctorProfileData) => void;
}) => {
  const [isEditing, setIsEditing] = useState<"availability" | "certificates" | "contact" | null>(null);
  const [newCertificate, setNewCertificate] = useState({ name: "", year: "" });
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  const timeSlots = ["Fermé", "9h-12h", "9h-12h, 14h-17h", "10h-18h", "8h-12h"];

  const validateContactInfo = (info: ContactInfo) => {
    const newErrors: { email?: string; phone?: string } = {};
    if (info.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
      newErrors.email = "Email invalide";
    }
    if (info.phone && !/^\+?\d{10,15}$/.test(info.phone)) {
      newErrors.phone = "Numéro invalide";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (section: "availability" | "certificates" | "contact") => {
    if (section === "contact" && !validateContactInfo(doctor.contactInfo)) {
      return;
    }
    setIsEditing(null);
  };

  const handleChange = (field: keyof DoctorProfileData, value: any) => {
    onDoctorUpdate({
      ...doctor,
      [field]: value
    });
  };

  return (
    <div className="w-full lg:w-80 bg-white rounded-xl shadow-md border border-gray-200 p-5 sticky top-6 h-fit">
      <h3 className="text-xl font-bold text-gray-900 mb-5">Informations Professionnelles</h3>
      
      {/* Disponibilité Hebdomadaire */}
      <div className="mb-6 pb-5 border-b border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar size={20} className="text-blue-600" />
            <span className="font-semibold">Disponibilité</span>
          </div>
          <button 
            onClick={() => isEditing === "availability" ? handleSave("availability") : setIsEditing("availability")}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
          >
            {isEditing === "availability" ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Enregistrer
              </>
            ) : (
              <>
                <Edit2 size={16} />
                Modifier
              </>
            )}
          </button>
        </div>

        {isEditing === "availability" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(doctor.availability).map(([day, hours]) => (
              <div key={day} className="flex items-center gap-2">
                <span className="w-20 text-sm font-medium text-gray-700 capitalize">
                  {day === "monday" ? "Lundi" : 
                   day === "tuesday" ? "Mardi" : 
                   day === "wednesday" ? "Mercredi" : 
                   day === "thursday" ? "Jeudi" : 
                   day === "friday" ? "Vendredi" : 
                   day === "saturday" ? "Samedi" : "Dimanche"}
                </span>
                <select
                  value={hours}
                  onChange={(e) => handleChange("availability", {
                    ...doctor.availability,
                    [day]: e.target.value
                  })}
                  className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {Object.entries(doctor.availability).map(([day, hours]) => (
              <div key={day} className={`flex items-center text-sm ${hours === "Fermé" ? "text-gray-500" : "text-gray-800"}`}>
                <span className="w-20 font-medium capitalize">
                  {day.slice(0, 3)}
                </span>
                <span>{hours}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certificats */}
      <div className="mb-6 pb-5 border-b border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 text-gray-700">
            <Award size={20} className="text-blue-600" />
            <span className="font-semibold">Certificats</span>
          </div>
          <button 
            onClick={() => isEditing === "certificates" ? handleSave("certificates") : setIsEditing("certificates")}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
          >
            {isEditing === "certificates" ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Enregistrer
              </>
            ) : (
              <>
                <Edit2 size={16} />
                Modifier
              </>
            )}
          </button>
        </div>

        {isEditing === "certificates" ? (
          <div className="space-y-3">
            {doctor.certificates.map((cert) => (
              <div key={cert.id} className="flex items-center gap-2">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => handleChange("certificates", doctor.certificates.map(c => 
                      c.id === cert.id ? {...c, name: e.target.value} : c
                    ))}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom"
                  />
                  <input
                    type="text"
                    value={cert.year}
                    onChange={(e) => handleChange("certificates", doctor.certificates.map(c => 
                      c.id === cert.id ? {...c, year: e.target.value} : c
                    ))}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Année"
                  />
                </div>
                <button 
                  onClick={() => handleChange("certificates", doctor.certificates.filter(c => c.id !== cert.id))}
                  className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            
            <div className="pt-3 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  value={newCertificate.name}
                  onChange={(e) => setNewCertificate({...newCertificate, name: e.target.value})}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nouveau certificat"
                />
                <input
                  type="text"
                  value={newCertificate.year}
                  onChange={(e) => setNewCertificate({...newCertificate, year: e.target.value})}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Année"
                />
              </div>
              <button 
                onClick={() => {
                  if (newCertificate.name && newCertificate.year) {
                    handleChange("certificates", [
                      ...doctor.certificates, 
                      { ...newCertificate, id: Date.now().toString() }
                    ]);
                    setNewCertificate({ name: "", year: "" });
                  }
                }}
                className="w-full text-blue-600 text-sm font-medium flex items-center justify-center gap-2 py-2 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                disabled={!newCertificate.name || !newCertificate.year}
              >
                <Plus size={16} />
                Ajouter un certificat
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {doctor.certificates.map((cert) => (
              <div key={cert.id} className="text-sm">
                <p className="font-medium text-gray-900">{cert.name}</p>
                <p className="text-gray-500">{cert.year}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coordonnées */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin size={20} className="text-blue-600" />
            <span className="font-semibold">Coordonnées</span>
          </div>
          <button 
            onClick={() => isEditing === "contact" ? handleSave("contact") : setIsEditing("contact")}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
          >
            {isEditing === "contact" ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Enregistrer
              </>
            ) : (
              <>
                <Edit2 size={16} />
                Modifier
              </>
            )}
          </button>
        </div>

        {isEditing === "contact" ? (
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Mail size={18} className="text-gray-500" />
                <input
                  type="email"
                  value={doctor.contactInfo.email}
                  onChange={(e) => handleChange("contactInfo", {
                    ...doctor.contactInfo,
                    email: e.target.value
                  })}
                  className={`flex-1 text-sm border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Email"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 ml-7">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Phone size={18} className="text-gray-500" />
                <input
                  type="tel"
                  value={doctor.contactInfo.phone}
                  onChange={(e) => handleChange("contactInfo", {
                    ...doctor.contactInfo,
                    phone: e.target.value
                  })}
                  className={`flex-1 text-sm border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Téléphone"
                />
              </div>
              {errors.phone && <p className="text-xs text-red-500 ml-7">{errors.phone}</p>}
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-gray-500" />
              <input
                type="text"
                value={doctor.contactInfo.address}
                onChange={(e) => handleChange("contactInfo", {
                  ...doctor.contactInfo,
                  address: e.target.value
                })}
                className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500"
                placeholder="Adresse"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-800 flex items-center gap-2">
              <Mail size={18} className="text-gray-500" /> {doctor.contactInfo.email}
            </p>
            <p className="text-sm text-gray-800 flex items-center gap-2">
              <Phone size={18} className="text-gray-500" /> {doctor.contactInfo.phone}
            </p>
            <p className="text-sm text-gray-800 flex items-center gap-2">
              <MapPin size={18} className="text-gray-500" /> {doctor.contactInfo.address}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

// Composant Principal
const DoctorProfile = () => {
  const [doctor, setDoctor] = useState<DoctorProfileData>({
    fullName: "Dr. Adrar Ahlem Lemia Hiba",
    specialty: "Nutritionniste & Diététicienne",
    profileImage: "/doctor-avatar.jpg",
    bannerImage: "/doctor-banner.jpg",
    availability: {
      monday: "9h-12h, 14h-17h",
      tuesday: "10h-18h",
      wednesday: "8h-12h",
      thursday: "9h-17h",
      friday: "9h-16h",
      saturday: "Fermé",
      sunday: "Fermé"
    },
    certificates: [
      { id: "1", name: "Certifié en Nutrition", year: "2023" },
      { id: "2", name: "Diplôme de Médecine Générale", year: "2020" }
    ],
    contactInfo: {
      email: "contact@dradrar.com",
      phone: "+213 555 123 456",
      address: "123 Rue de la Santé, Alger"
    },
    followers: [
      { id: "1", name: "Jean Dupont", avatar: "/user-avatar1.jpg" },
      { id: "2", name: "Marie Martin", avatar: "/user-avatar2.jpg" },
      { id: "3", name: "Pierre Durand", avatar: "/user-avatar3.jpg" }
    ],
    patients: [
      { id: "1", name: "Patient Alpha", avatar: "/patient-avatar1.jpg", lastVisit: "15/05/2023" },
      { id: "2", name: "Patient Beta", avatar: "/patient-avatar2.jpg", lastVisit: "10/05/2023" },
      { id: "3", name: "Patient Gamma", avatar: "/patient-avatar3.jpg", lastVisit: "05/05/2023" }
    ]
  });
  const [profileImage, setProfileImage] = useState(doctor.profileImage);
  const [newPublication, setNewPublication] = useState("");
  const [newImage, setNewImage] = useState<string | undefined>(undefined);
  const [publications, setPublications] = useState<{ 
    content?: string; 
    image?: string; 
    date: string 
  }[]>([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showPatients, setShowPatients] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleProfileImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        setDoctor({
          ...doctor,
          profileImage: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  }, [doctor]);

  const handleAddPublication = useCallback(() => {
    if (newPublication || newImage) {
      const now = new Date();
      setPublications([{ 
        content: newPublication || undefined, 
        image: newImage,
        date: now.toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }, ...publications]);
      setNewPublication("");
      setNewImage(undefined);
    }
  }, [newPublication, newImage, publications]);

  const handleDeletePublication = useCallback((index: number) => {
    setPublications(publications.filter((_, i) => i !== index));
  }, [publications]);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageMeta
        title="ObeseTech | Profils Docteur"
        description="Gérez le profils de medecin"
      />
      {/* Header avec bannière et photo de profil */}
      <div className="bg-white shadow-sm">
        {/* Bannière */}
        <div className="h-64 bg-gradient-to-r from-blue-500 to-blue-600 relative overflow-hidden">
          {doctor.bannerImage && (
            <img 
              src={logo} 
              alt="Bannière" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/10"></div>
          <button className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-colors">
            <Edit2 size={18} className="text-blue-600" />
          </button>
        </div>
        
        {/* Photo de profil et informations */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-20 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            {/* Photo de profil */}
            <div className="relative group">
              <div className="h-40 w-40 rounded-full overflow-hidden border-4 border-white bg-white shadow-xl">
                <img 
                  src={ahlem} 
                  alt={doctor.fullName} 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/default-avatar.jpg";
                  }}
                />
              </div>
              <label className="absolute bottom-3 right-3 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors cursor-pointer opacity-0 group-hover:opacity-100">
                <Edit2 size={16} />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleProfileImageChange} 
                  className="hidden" 
                />
              </label>
            </div>
            
            {/* Informations du profil */}
            <div className="flex-1 pb-6 bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
                    {doctor.fullName}
                  </h1>
                  <p className="text-xl text-black mt-2 font-medium">
                    {doctor.specialty}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <button 
                    onClick={() => setShowPatients(true)}
                    className="flex items-center gap-2 text-blue-800 hover:text-blue-600 transition-colors"
                  >
                    <Stethoscope size={18} className="text-blue-600" />
                    <span className="font-medium">{doctor.patients.length} Patients suivis</span>
                  </button>
                </div>
              </div>
              
              {/* Suiveurs seulement */}
              <div className="mt-4">
                <button 
                  onClick={() => setShowFollowers(true)}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User size={18} className="text-blue-500" />
                  <span className="font-medium">{doctor.followers.length} Suiveurs</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* Colonne des publications */}
        <div className="flex-1">
          {/* Formulaire de publication */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-blue-100">
                <img 
                  src={logo} 
                  alt={doctor.fullName} 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/default-avatar.jpg";
                  }}
                />
              </div>
              <div className="flex-1">
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[120px] text-gray-700"
                  placeholder="Partagez une mise à jour, une publication ou une réflexion..."
                  value={newPublication}
                  onChange={(e) => setNewPublication(e.target.value)}
                  rows={4}
                />
                
                {newImage && (
                  <div className="mt-3 relative rounded-xl overflow-hidden border border-gray-200">
                    <img 
                      src={newImage} 
                      alt="Preview" 
                      className="w-full h-auto max-h-96 object-contain bg-gray-50"
                    />
                    <button 
                      onClick={() => setNewImage(undefined)}
                      className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium">Photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="hidden" 
                      />
                    </label>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium">Vidéo</span>
                    </button>
                  </div>
                  <button
                    onClick={handleAddPublication}
                    disabled={!(newPublication || newImage) || isUploading}
                    className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 ${
                      (newPublication || newImage) 
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    } transition-colors`}
                  >
                    {isUploading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : "Publier"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des publications */}
          <div className="space-y-6">
            {publications.map((pub, index) => (
              <Publication 
                key={index}
                authorName={doctor.fullName}
                authorImage={profileImage}
                content={pub.content}
                image={pub.image}
                date={pub.date}
                onDelete={() => handleDeletePublication(index)}
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-80">
          <Sidebar 
            doctor={doctor}
            onDoctorUpdate={setDoctor}
          />
        </div>
      </div>

      {/* Modals */}
      {showFollowers && (
        <ListModal 
          type="Vos Suiveurs" 
          items={doctor.followers} 
          onClose={() => setShowFollowers(false)} 
        />
      )}
      {showPatients && (
        <ListModal 
          type="Patients Suivis" 
          items={doctor.patients} 
          onClose={() => setShowPatients(false)} 
        />
      )}
    </div>
  );
};

export default DoctorProfile;