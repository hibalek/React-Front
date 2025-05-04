import React from "react";
import GridShape from "../../components/common/GridShape";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
import logo from "../../images/logo.png"; // Assure-toi que c’est le bon chemin

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {/* Partie gauche : Formulaire */}
        {children}

        {/* Partie droite : Personnalisée pour ObeSmart */}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-gradient-to-br from-blue-100 to-white dark:from-blue-900 dark:to-gray-800 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            {/* Grille de formes pour un effet visuel */}
            <GridShape />

            {/* Conteneur pour le logo et le texte */}
            <div className="flex items-center max-w-2xl">
              {/* Logo avec reflet (utilisation d’une image) */}
              <div className="mr-6">
                <img
                  width={160} // Ajuste la taille selon ton image
                  height={160}
                  src={logo}
                  alt="ObeseTech Logo"
                />
              </div>

              {/* Texte à droite */}
              <div className="flex flex-col">
                <h2 className="text-4xl font-bold text-[#00AEEF] dark:text-blue-300 font-poppins">
                  ObeseTech
                </h2>
                <p className="mt-2 text-lg font-medium text-[#00AEEF] dark:text-blue-400 font-poppins">
                  Vers une population légère, saine et active
                </p>
                <p className="mt-4 text-gray-600 dark:text-gray-400 font-poppins">
                  Rejoignez ObeSmart pour une vie plus saine et équilibrée !
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Toggler */}
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}