import React, { useState } from "react";

// Simuler les données de l'utilisateur
const initialUser = {
  email: "user@obesmart.com",
  password: "********",
  notificationsEnabled: true,
  language: "Français",
  theme: "Clair",
  twoFactorAuth: false,
  activeSessions: ["Session 1: Paris, France - 14/04/2025"],
  isActive: true, // Ajout d'un état pour suivre si le compte est actif
};

const Settings: React.FC = () => {
  // État pour les données de l'utilisateur
  const [user, setUser] = useState(initialUser);
  // État pour le mode édition (par section)
  const [editingSection, setEditingSection] = useState<string | null>(null);
  // État pour les champs modifiés
  const [formData, setFormData] = useState(initialUser);
  // État pour afficher la confirmation de désactivation
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  // Fonction pour activer le mode édition
  const handleEdit = (section: string) => {
    setEditingSection(section);
    setFormData(user); // Charger les données actuelles dans le formulaire
  };

  // Fonction pour sauvegarder les modifications
  const handleSave = () => {
    setUser(formData); // Mettre à jour les données utilisateur avec les modifications
    setEditingSection(null); // Quitter le mode édition
  };

  // Fonction pour annuler l'édition
  const handleCancel = () => {
    setFormData(user); // Réinitialiser les données du formulaire
    setEditingSection(null); // Quitter le mode édition
  };

  // Fonction pour gérer les changements dans les champs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Fonction pour désactiver le compte
  const handleDeactivate = () => {
    setUser((prev) => ({ ...prev, isActive: false }));
    setShowDeactivateConfirm(false);
    alert("Votre compte a été désactivé.");
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        Paramètres
      </h3>

      {/* Titre de la page et informations utilisateur */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <img
            src="/images/user/owner.jpg"
            alt="Utilisateur"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Mohammed Benmohamed
            </h2>
            <p className="text-gray-600">Médecin Nutritionniste | Constantine, Algérie</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-200">🔔</button>
          <button className="p-2 rounded-full hover:bg-gray-200">🔒</button>
          <button className="p-2 rounded-full hover:bg-gray-200">🌐</button>
          <button className="p-2 rounded-full hover:bg-gray-200">✏️</button>
        </div>
      </div>

      {/* Bouton de désactivation du compte */}
      {user.isActive ? (
        <div className="mb-6">
          <button
            onClick={() => setShowDeactivateConfirm(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Désactiver le compte
          </button>
          {showDeactivateConfirm && (
            <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
              <p className="text-yellow-800">
                Êtes-vous sûr de vouloir désactiver votre compte ? Cette action est irréversible.
              </p>
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={handleDeactivate}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  Oui, désactiver
                </button>
                <button
                  onClick={() => setShowDeactivateConfirm(false)}
                  className="bg-gray-300 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-400"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
          <p className="text-red-800">Votre compte est désactivé.</p>
        </div>
      )}

      {/* Section : Paramètres du compte */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Paramètres du compte
          </h3>
          {editingSection !== "account" ? (
            <button
              onClick={() => handleEdit("account")}
              className="text-blue-600 flex items-center hover:underline"
            >
              <span className="mr-1">✏️</span> Modifier
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="text-green-600 flex items-center hover:underline"
              >
                Sauvegarder
              </button>
              <button
                onClick={handleCancel}
                className="text-red-600 flex items-center hover:underline"
              >
                Annuler
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">Adresse e-mail</p>
            {editingSection === "account" ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border rounded-lg px-2 py-1 w-full"
              />
            ) : (
              <p className="text-gray-800">{user.email}</p>
            )}
          </div>
          <div>
            <p className="text-gray-500">Mot de passe</p>
            {editingSection === "account" ? (
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="border rounded-lg px-2 py-1 w-full"
              />
            ) : (
              <p className="text-gray-800">{user.password}</p>
            )}
          </div>
          <div>
            <p className="text-gray-500">Notifications</p>
            {editingSection === "account" ? (
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="notificationsEnabled"
                  checked={formData.notificationsEnabled}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Activer les notifications
              </label>
            ) : (
              <p className="text-gray-800">
                {user.notificationsEnabled ? "Activé" : "Désactivé"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section : Préférences */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Préférences
          </h3>
          {editingSection !== "preferences" ? (
            <button
              onClick={() => handleEdit("preferences")}
              className="text-blue-600 flex items-center hover:underline"
            >
              <span className="mr-1">✏️</span> Modifier
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="text-green-600 flex items-center hover:underline"
              >
                Sauvegarder
              </button>
              <button
                onClick={handleCancel}
                className="text-red-600 flex items-center hover:underline"
              >
                Annuler
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">Langue</p>
            {editingSection === "preferences" ? (
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="border rounded-lg px-2 py-1 w-full"
              >
                <option value="Français">Français</option>
                <option value="Anglais">Anglais</option>
                <option value="Espagnol">Espagnol</option>
              </select>
            ) : (
              <p className="text-gray-800">{user.language}</p>
            )}
          </div>
          <div>
            <p className="text-gray-500">Thème</p>
            {editingSection === "preferences" ? (
              <select
                name="theme"
                value={formData.theme}
                onChange={handleInputChange}
                className="border rounded-lg px-2 py-1 w-full"
              >
                <option value="Clair">Clair</option>
                <option value="Sombre">Sombre</option>
              </select>
            ) : (
              <p className="text-gray-800">{user.theme}</p>
            )}
          </div>
          <div>
            <p className="text-gray-500">Notifications par e-mail</p>
            {editingSection === "preferences" ? (
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="notificationsEnabled"
                  checked={formData.notificationsEnabled}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Activer les notifications par e-mail
              </label>
            ) : (
              <p className="text-gray-800">
                {user.notificationsEnabled ? "Activé" : "Désactivé"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section : Sécurité */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Sécurité</h3>
          {editingSection !== "security" ? (
            <button
              onClick={() => handleEdit("security")}
              className="text-blue-600 flex items-center hover:underline"
            >
              <span className="mr-1">✏️</span> Modifier
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="text-green-600 flex items-center hover:underline"
              >
                Sauvegarder
              </button>
              <button
                onClick={handleCancel}
                className="text-red-600 flex items-center hover:underline"
              >
                Annuler
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">Authentification à deux facteurs</p>
            {editingSection === "security" ? (
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="twoFactorAuth"
                  checked={formData.twoFactorAuth}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Activer l'authentification à deux facteurs
              </label>
            ) : (
              <p className="text-gray-800">
                {user.twoFactorAuth ? "Activé" : "Désactivé"}
              </p>
            )}
          </div>
          <div>
            <p className="text-gray-500">Sessions actives</p>
            <p className="text-gray-800">{user.activeSessions[0]}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;