// src/components/tables/AdminReportedTable.tsx

interface AdminReportedTableProps {
    reports: {
      id: number;
      user: {
        name: string;
        image: string;
        email: string;
      };
      message: string;
      date: string;
    }[];
    onBlock: (id: number) => void;
    onIgnore: (id: number) => void;
  }
  
  export default function AdminReportedTable({ reports, onBlock, onIgnore }: AdminReportedTableProps) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-6 py-3">Utilisateur</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Message</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-b bg-white hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-3">
                  <img src={report.user.image} alt="avatar" className="h-10 w-10 rounded-full" />
                  <span className="font-medium text-gray-900">{report.user.name}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{report.user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-800 max-w-xs">{report.message}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{report.date}</td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => onBlock(report.id)}
                    className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                  >
                    Bloquer
                  </button>
                  <button
                    onClick={() => onIgnore(report.id)}
                    className="rounded bg-gray-300 px-3 py-1 text-gray-800 hover:bg-gray-400"
                  >
                    Ignorer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  