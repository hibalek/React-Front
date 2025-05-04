// src/pages/admin/ReportedMessages.tsx

import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import AdminReportedTable from "../../components/BasicTables/AdminReportedTable";



type Report = {
  id: number;
  user: {
    name: string;
    image: string;
    email: string;
  };
  message: string;
  date: string;
};

export default function ReportedMessages() {
  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      user: {
        name: "John Doe",
        image: "/images/user/user-17.jpg",
        email: "john@example.com",
      },
      message: "Ce coach m’a insulté pendant notre conversation.",
      date: "2025-04-10",
    },
    {
      id: 2,
      user: {
        name: "Sarah Smith",
        image: "/images/user/user-18.jpg",
        email: "sarah@example.com",
      },
      message: "Spam récurrent sur les messages privés.",
      date: "2025-04-09",
    },
  ]);

  const handleBlock = (id: number) => {
    setReports((prev) => prev.filter((report) => report.id !== id));
    alert("Utilisateur bloqué.");
  };

  const handleIgnore = (id: number) => {
    setReports((prev) => prev.filter((report) => report.id !== id));
  };

  return (
    <>
      <PageMeta title="Reported Messages" description="Admin: manage reported content" />
      <PageBreadcrumb pageTitle="Reported Messages" />
      <ComponentCard title="Reported Messages Management">
        <AdminReportedTable reports={reports} onBlock={handleBlock} onIgnore={handleIgnore} />
      </ComponentCard>
    </>
  );
}
