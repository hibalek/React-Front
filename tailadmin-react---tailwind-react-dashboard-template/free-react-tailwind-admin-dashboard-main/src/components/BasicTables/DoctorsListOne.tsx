// src/components/tables/BasicTables/DoctorsListOne.tsx

interface DoctorsListOneProps {
  doctors: {
    id: number;
    user: { image: string; name: string; role: string };
    projectName: string;
    team: { images: string[] };
    status: string;
    budget: string;
  }[];
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
}

export default function DoctorsListOne({
  doctors,
  onAccept,
  onReject,
}: DoctorsListOneProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-500">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3">User</th>
            <th scope="col" className="px-6 py-3">Project</th>
            <th scope="col" className="px-6 py-3">Team</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Budget</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.id} className="border-b bg-white">
              <td className="flex items-center gap-2 px-6 py-4">
                <img src={doctor.user.image} className="h-10 w-10 rounded-full" />
                <div>
                  <div className="font-medium text-gray-900">{doctor.user.name}</div>
                  <div className="text-sm text-gray-500">{doctor.user.role}</div>
                </div>
              </td>
              <td className="px-6 py-4">{doctor.projectName}</td>
              <td className="px-6 py-4">
                <div className="flex -space-x-2">
                  {doctor.team.images.map((img, index) => (
                    <img key={index} className="h-8 w-8 rounded-full border-2 border-white" src={img} />
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                  {doctor.status}
                </span>
              </td>
              <td className="px-6 py-4">{doctor.budget}</td>
              <td className="px-6 py-4 space-x-2">
                <button onClick={() => onAccept(doctor.id)} className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600">Accepter</button>
                <button onClick={() => onReject(doctor.id)} className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600">Rejeter</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
