import jsPDF from "jspdf";
import React from "react";

// Interfaces (inchangées)
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
  weightHistory?: {
    startAge: string;
    triggeringCircumstances: string;
    lowestAdultWeight: number;
    highestAdultWeight: number;
    recentWeightChanges: string;
    dietsFollowed: string;
    relapses: string;
    idealWeight: number;
  };
  physicalActivity?: {
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
    commute?: {
      duration: string;
      mode: string;
    };
    elevatorOrStairs: string;
  };
  sedentaryBehavior?: {
    screenTime: string;
    sittingTime: string;
  };
  eatingHabits?: {
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
  foodIntake?: {
    sugaryDrinks: string;
    alcoholicDrinks: string;
    highEnergyFoods: string;
    lowEnergyFoods: string;
  };
}

interface DoctorInfo {
  name: string;
  phone: string;
  address: string;
}

interface GeneratePDFProps {
  request: AppointmentRequest;
  doctorInfo: DoctorInfo;
}

// Fonction utilitaire pour dessiner un tableau (en noir et blanc, sans fonds colorés)
const drawTable = (
  doc: jsPDF,
  startX: number,
  startY: number,
  data: { label: string; value: string }[],
  title: string
) => {
  let yPosition = startY;
  const pageHeight = doc.internal.pageSize.getHeight();
  const bottomMargin = 15;

  const addPageIfNeeded = () => {
    if (yPosition > pageHeight - bottomMargin - 20) {
      doc.addPage();
      yPosition = 15;
      return true;
    }
    return false;
  };

  // Titre de la section
  if (addPageIfNeeded()) {
    yPosition += 5;
  }
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0); // Noir
  doc.text(title, startX, yPosition);
  yPosition += 8;

  // En-têtes du tableau
  const col1Width = 70;
  const col2Width = doc.internal.pageSize.getWidth() - startX - col1Width - 15;
  const headerHeight = 8;

  if (addPageIfNeeded()) {
    yPosition += 5;
  }

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0); // Noir
  doc.text("Champ", startX + 2, yPosition + headerHeight - 2);
  doc.text("Valeur", startX + col1Width + 2, yPosition + headerHeight - 2);
  yPosition += headerHeight;

  // Lignes du tableau
  doc.setFont("helvetica", "normal");
  data.forEach((row) => {
    const valueText = String(row.value ?? "N/A");
    const valueLines = doc.splitTextToSize(valueText, col2Width - 4);
    const requiredHeight = 6 * valueLines.length + 4;

    if (yPosition + requiredHeight > pageHeight - bottomMargin) {
      doc.addPage();
      yPosition = 15;

      // Redessiner les en-têtes
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0); // Noir
      doc.text("Champ", startX + 2, yPosition + headerHeight - 2);
      doc.text("Valeur", startX + col1Width + 2, yPosition + headerHeight - 2);
      yPosition += headerHeight;
      doc.setFont("helvetica", "normal");
    }

    // Dessiner le texte
    doc.setTextColor(0, 0, 0); // Noir
    doc.text(row.label, startX + 2, yPosition + 6);
    doc.text(valueLines, startX + col1Width + 2, yPosition + 6);

    // Bordures
    doc.setLineWidth(0.2);
    doc.setDrawColor(0, 0, 0); // Noir
    doc.line(startX, yPosition + requiredHeight, startX + col1Width + col2Width, yPosition + requiredHeight);
    doc.line(startX, yPosition, startX, yPosition + requiredHeight);
    doc.line(startX + col1Width, yPosition, startX + col1Width, yPosition + requiredHeight);
    doc.line(startX + col1Width + col2Width, yPosition, startX + col1Width + col2Width, yPosition + requiredHeight);

    yPosition += requiredHeight;
  });

  return yPosition;
};

// Fonction utilitaire pour dessiner un champ (sans soulignement)
const drawField = (
  doc: jsPDF,
  x: number,
  y: number,
  label: string,
  value: string | string[],
  maxWidth: number
): number => {
  const labelFull = label + ":";
  const labelWidth = doc.getTextWidth(labelFull);
  const valueIndent = labelWidth + 2;
  const valueMaxWidth = maxWidth - valueIndent;
  const lineHeight = 6;

  let currentY = y;

  // Dessiner le label
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0); // Noir
  doc.text(labelFull, x, currentY);

  // Dessiner la valeur
  const finalValue = value || "N/A";
  const valueLines = Array.isArray(finalValue) ? finalValue : doc.splitTextToSize(finalValue, valueMaxWidth);
  doc.text(valueLines, x + valueIndent, currentY);

  return currentY + valueLines.length * lineHeight + 2;
};

// Composant principal
const GeneratePDF: React.FC<GeneratePDFProps> = ({ request, doctorInfo }) => {
  const handleDownload = () => {
    try {
      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 10;

      // --- Page 1 ---
      doc.setDrawColor(0, 0, 0); // Noir
      doc.setLineWidth(0.5);
      doc.rect(margin / 2, margin / 2, pageWidth - margin, pageHeight - margin);

      let yPosition = margin + 5;

      // Logo
      const logoWidth = 30;
      const logoHeight = 15;
      try {
        doc.addImage("https://via.placeholder.com/150x75.png?text=ObeSmart+Logo", "PNG", margin, yPosition, logoWidth, logoHeight);
      } catch (imgError) {
        console.error("Erreur lors de l'ajout du logo :", imgError);
        doc.text("Erreur Logo", margin, yPosition + 10);
      }
      yPosition += logoHeight + 10;

      // Titre principal
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0); // Noir
      const title = "Confirmation de Rendez-Vous – Bilan initial";
      const titleWidth = doc.getTextWidth(title);
      const titleX = (pageWidth - titleWidth) / 2;
      doc.text(title, titleX, yPosition);
      yPosition += 15;

      // Informations Patient & Médecin côte à côte
      const leftColumnX = margin;
      const rightColumnX = pageWidth / 2 + margin / 2;
      const columnWidth = pageWidth / 2 - margin * 1.5;
      let yPosLeft = yPosition;
      let yPosRight = yPosition;

      // Colonne Gauche: Informations du patient
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0); // Noir
      doc.text("Informations du patient", leftColumnX, yPosLeft);
      yPosLeft += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      yPosLeft = drawField(doc, leftColumnX, yPosLeft, "Nom", request.patientName, columnWidth);
      yPosLeft = drawField(doc, leftColumnX, yPosLeft, "Téléphone", request.phone, columnWidth);
      yPosLeft = drawField(doc, leftColumnX, yPosLeft, "Email", request.email, columnWidth);
      yPosLeft = drawField(doc, leftColumnX, yPosLeft, "Adresse", request.address, columnWidth);
      yPosLeft = drawField(doc, leftColumnX, yPosLeft, "Statut", request.isNewPatient ? "Nouveau patient" : "Patient existant", columnWidth);
      yPosLeft = drawField(doc, leftColumnX, yPosLeft, "Type", request.isContinuous ? "Consultation continue" : "Consultation ponctuelle", columnWidth);

      // Colonne Droite: Coordonnées du médecin
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0); // Noir
      doc.text("Coordonnées du médecin", rightColumnX, yPosRight);
      yPosRight += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      yPosRight = drawField(doc, rightColumnX, yPosRight, "Nom", doctorInfo.name, columnWidth);
      yPosRight = drawField(doc, rightColumnX, yPosRight, "Téléphone", doctorInfo.phone, columnWidth);
      yPosRight = drawField(doc, rightColumnX, yPosRight, "Adresse", doctorInfo.address, columnWidth);

      // Positionner "Détails du rendez-vous"
      yPosition = Math.max(yPosLeft, yPosRight) + 15;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0); // Noir
      doc.text("Détails du rendez-vous", margin, yPosition);
      yPosition += 10;

      // Date et Heure avec Boîtes
      const dateLabel = "Date:";
      const timeLabel = "Heure:";
      const dateValue = request.date || "N/A";
      const timeValue = request.time || "N/A";
      const dateLabelWidth = doc.getTextWidth(dateLabel);
      const timeLabelWidth = doc.getTextWidth(timeLabel);
      const dateValueWidth = doc.getTextWidth(dateValue) + 4;
      const timeValueWidth = doc.getTextWidth(timeValue) + 4;
      const boxHeight = 8;
      const spaceBetweenFields = 10;
      const totalDetailWidth = dateLabelWidth + 2 + dateValueWidth + spaceBetweenFields + timeLabelWidth + 2 + timeValueWidth;
      const detailStartX = (pageWidth - totalDetailWidth) / 2;
      let currentX = detailStartX;

      doc.text(dateLabel, currentX, yPosition);
      currentX += dateLabelWidth + 2;
      doc.setLineWidth(0.4);
      doc.setDrawColor(0, 0, 0); // Noir
      doc.rect(currentX, yPosition - (boxHeight / 2) - 1, dateValueWidth, boxHeight);
      doc.text(dateValue, currentX + 2, yPosition);
      currentX += dateValueWidth + spaceBetweenFields;

      doc.text(timeLabel, currentX, yPosition);
      currentX += timeLabelWidth + 2;
      doc.setLineWidth(0.4);
      doc.setDrawColor(0, 0, 0); // Noir
      doc.rect(currentX, yPosition - (boxHeight / 2) - 1, timeValueWidth, boxHeight);
      doc.text(timeValue, currentX + 2, yPosition);

      // --- Page 2 et suivantes: Bilan du patient (Tables) ---
      doc.addPage();
      doc.setDrawColor(0, 0, 0); // Noir
      doc.setLineWidth(0.5);
      doc.rect(margin / 2, margin / 2, pageWidth - margin, pageHeight - margin);
      yPosition = margin + 5;

      // Tableaux du bilan
      const weightHistoryData = [
        { label: "Âge de début de la prise de poids", value: request.weightHistory?.startAge || "N/A" },
        { label: "Circonstances déclenchantes", value: request.weightHistory?.triggeringCircumstances || "N/A" },
        { label: "Poids le plus bas à l’âge adulte (kg)", value: String(request.weightHistory?.lowestAdultWeight ?? "N/A") },
        { label: "Poids le plus haut à l’âge adulte (kg)", value: String(request.weightHistory?.highestAdultWeight ?? "N/A") },
        { label: "Variations récentes", value: request.weightHistory?.recentWeightChanges || "N/A" },
        { label: "Régimes suivis", value: request.weightHistory?.dietsFollowed || "N/A" },
        { label: "Rechutes et récidives", value: request.weightHistory?.relapses || "N/A" },
        { label: "Poids de forme (kg)", value: String(request.weightHistory?.idealWeight ?? "N/A") },
      ];
      yPosition = drawTable(doc, margin, yPosition, weightHistoryData, "Histoire pondérale");
      yPosition += 10;

      const physicalActivityData = [
        { label: "Profession principale", value: request.physicalActivity?.mainProfession || "N/A" },
        { label: "Horaires de travail", value: request.physicalActivity?.workSchedule || "N/A" },
        { label: "Intensité activité professionnelle", value: request.physicalActivity?.workActivityIntensity || "N/A" },
        { label: "Activités domestiques", value: request.physicalActivity?.domesticActivities || "N/A" },
        { label: "Intensité activité domestique", value: request.physicalActivity?.domesticActivityIntensity || "N/A" },
        { label: "Activités de loisirs", value: request.physicalActivity?.leisureActivities || "N/A" },
        { label: "Intensité loisirs", value: request.physicalActivity?.leisureActivityIntensity || "N/A" },
        { label: "Durée par session", value: request.physicalActivity?.sessionDuration || "N/A" },
        { label: "Fréquence", value: request.physicalActivity?.frequency || "N/A" },
        { label: "Marche pendant les loisirs", value: request.physicalActivity?.walkingDuringLeisure || "N/A" },
        { label: "Temps de trajet", value: request.physicalActivity?.commute?.duration || "N/A" },
        { label: "Mode de trajet", value: request.physicalActivity?.commute?.mode || "N/A" },
        { label: "Ascenseurs ou escaliers", value: request.physicalActivity?.elevatorOrStairs || "N/A" },
      ];
      yPosition = drawTable(doc, margin, yPosition, physicalActivityData, "Activité physique");
      yPosition += 10;

      const sedentaryBehaviorData = [
        { label: "Temps devant un écran", value: request.sedentaryBehavior?.screenTime || "N/A" },
        { label: "Temps en position assise", value: request.sedentaryBehavior?.sittingTime || "N/A" },
      ];
      yPosition = drawTable(doc, margin, yPosition, sedentaryBehaviorData, "Occupations sédentaires");
      yPosition += 10;

      const eatingHabitsData = [
        { label: "Repas", value: request.eatingHabits?.meals || "N/A" },
        { label: "Goûters/collations", value: request.eatingHabits?.snacks || "N/A" },
        { label: "Grignotage", value: request.eatingHabits?.nibbling || "N/A" },
        { label: "Saut de repas", value: request.eatingHabits?.mealSkipping || "N/A" },
        { label: "Manger la nuit", value: request.eatingHabits?.nightEating || "N/A" },
        { label: "Sensations (faim, satiété, envies)", value: request.eatingHabits?.sensations || "N/A" },
        { label: "Taille des portions", value: request.eatingHabits?.portionSize || "N/A" },
        { label: "Habitudes d’achat", value: request.eatingHabits?.foodPurchasing || "N/A" },
        { label: "Préparation des repas", value: request.eatingHabits?.mealPreparation || "N/A" },
      ];
      yPosition = drawTable(doc, margin, yPosition, eatingHabitsData, "Habitudes alimentaires");
      yPosition += 10;

      const foodIntakeData = [
        { label: "Boissons sucrées", value: request.foodIntake?.sugaryDrinks || "N/A" },
        { label: "Boissons alcoolisées", value: request.foodIntake?.alcoholicDrinks || "N/A" },
        { label: "Aliments riches en lipides/sucres", value: request.foodIntake?.highEnergyFoods || "N/A" },
        { label: "Aliments à faible densité énergétique", value: request.foodIntake?.lowEnergyFoods || "N/A" },
      ];
      yPosition = drawTable(doc, margin, yPosition, foodIntakeData, "Apports alimentaires");
      yPosition += 10;

      // Pied de page sur la dernière page
      const pageCount = doc.getNumberOfPages();
      doc.setPage(pageCount);
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(150); // Gris
      const footerText = `Généré le ${new Date().toLocaleDateString()} - Page ${pageCount}`;
      const footerY = pageHeight - margin / 2;
      doc.text(footerText, margin, footerY);

      // Sauvegarde du PDF
      doc.save(`${request.patientName || 'Patient'}_rendez-vous_${request.date || 'date'}.pdf`);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF :", error);
      alert("Une erreur est survenue lors de la génération du PDF. Vérifiez la console pour plus de détails.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      Télécharger PDF
    </button>
  );
};

export default GeneratePDF;