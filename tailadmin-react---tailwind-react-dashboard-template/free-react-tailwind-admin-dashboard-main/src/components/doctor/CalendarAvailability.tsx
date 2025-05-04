import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "react-datepicker";

// Schéma de validation
const availabilitySchema = Yup.object().shape({
  date: Yup.date().required("Veuillez sélectionner une date").nullable(),
  startTime: Yup.date().required("Veuillez sélectionner une heure de début").nullable(),
  endTime: Yup.date()
    .required("Veuillez sélectionner une heure de fin")
    .nullable()
    .test(
      "is-after-start",
      "L'heure de fin doit être après l'heure de début",
      function (value) {
        const { startTime } = this.parent;
        return startTime && value ? value > startTime : true;
      }
    ),
});

interface AvailabilityFormData {
  date: Date | null;
  startTime: Date | null;
  endTime: Date | null;
}

export default function CalendarAvailability() {
  // État pour stocker les créneaux de disponibilité
  const [availabilities, setAvailabilities] = useState<AvailabilityFormData[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AvailabilityFormData>({
    resolver: yupResolver(availabilitySchema),
    defaultValues: {
      date: null,
      startTime: null,
      endTime: null,
    },
  });

  // Gestion de la soumission
  const onSubmit = (data: AvailabilityFormData) => {
    setAvailabilities((prev) => [...prev, data]);
    reset();
    console.log("Disponibilité soumise :", data);
  };

  // Modifier un créneau
  const handleEdit = (availability: AvailabilityFormData, index: number) => {
    setValue("date", availability.date);
    setValue("startTime", availability.startTime);
    setValue("endTime", availability.endTime);
    setAvailabilities((prev) => prev.filter((_, i) => i !== index));
  };

  // Supprimer un créneau
  const handleDelete = (index: number) => {
    setAvailabilities((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] sm:p-8">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
        Gérer les disponibilités
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date
          </label>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                dateFormat="dd/MM/yyyy"
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 p-2"
                placeholderText="Sélectionnez une date"
              />
            )}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date?.message}</p>
          )}
        </div>
        {/* Heure de début */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Heure de début
          </label>
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Heure"
                dateFormat="HH:mm"
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 p-2"
                placeholderText="Sélectionnez l'heure de début"
              />
            )}
          />
          {errors.startTime && (
            <p className="mt-1 text-sm text-red-600">{errors.startTime?.message}</p>
          )}
        </div>
        {/* Heure de fin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Heure de fin
          </label>
          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Heure"
                dateFormat="HH:mm"
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 p-2"
                placeholderText="Sélectionnez l'heure de fin"
              />
            )}
          />
          {errors.endTime && (
            <p className="mt-1 text-sm text-red-600">{errors.endTime?.message}</p>
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Enregistrer
          </button>
        </div>
      </form>

      {/* Liste des disponibilités */}
      {availabilities.length > 0 && (
        <div className="mt-8">
          <h4 className="text-md font-semibold text-gray-800 dark:text-white/90 mb-4">
            Disponibilités enregistrées
          </h4>
          <ul className="space-y-4">
            {availabilities.map((availability, index) => (
              <li
                key={index}
                className="p-4 border border-gray-200 rounded-lg dark:border-gray-800 dark:bg-white/[0.03] flex justify-between items-center"
              >
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Date :</strong>{" "}
                    {availability.date?.toLocaleDateString("fr-FR")}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Début :</strong>{" "}
                    {availability.startTime?.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Fin :</strong>{" "}
                    {availability.endTime?.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(availability, index)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}