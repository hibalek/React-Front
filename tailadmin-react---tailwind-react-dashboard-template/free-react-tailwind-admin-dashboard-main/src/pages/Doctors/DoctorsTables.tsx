// src/pages/doctors/DoctorsTables.tsx

import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import DoctorsListOne from "../../components/BasicTables/DoctorsListOne";
import DoctorsListtwo from "../../components/BasicTables/DoctorsListtwo";

type Doctor = {
  id: number;
  user: {
    image: string;
    name: string;
    role: string;
  };
  projectName: string;
  team: {
    images: string[];
  };
  status: string;
  budget: string;
};

export default function DoctorsTables() {
  const [pendingDoctors, setPendingDoctors] = useState<Doctor[]>([
    {
      id: 1,
      user: {
        image: "/images/user/user-17.jpg",
        name: "Lindsey Curtis",
        role: "Web Designer",
      },
      projectName: "Agency Website",
      team: {
        images: [
          "/images/user/user-22.jpg",
          "/images/user/user-23.jpg",
          "/images/user/user-24.jpg",
        ],
      },
      budget: "3.9K",
      status: "Pending",
    },
    {
      id: 2,
      user: {
        image: "/images/user/user-18.jpg",
        name: "Kaiya George",
        role: "Project Manager",
      },
      projectName: "Technology",
      team: {
        images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg"],
      },
      budget: "24.9K",
      status: "Pending",
    },
  ]);

  const [acceptedDoctors, setAcceptedDoctors] = useState<Doctor[]>([]);

  const handleAccept = (id: number) => {
    const accepted = pendingDoctors.find((doc) => doc.id === id);
    if (accepted) {
      setPendingDoctors((prev) => prev.filter((doc) => doc.id !== id));
      setAcceptedDoctors((prev) => [...prev, { ...accepted, status: "Active" }]);
    }
  };

  const handleReject = (id: number) => {
    setPendingDoctors((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleEdit = (id: number) => {
    console.log("Éditer le médecin :", id);
  };

  const handleBlock = (id: number) => {
    setAcceptedDoctors((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, status: "Blocked" } : doc
      )
    );
  };

  return (
    <>
      <PageMeta title="Doctors list" description="This is page show doctors" />
      <PageBreadcrumb pageTitle="Doctors List" />
      <div className="space-y-6">
        <ComponentCard title="Doctors list">
          <DoctorsListOne
            doctors={pendingDoctors}
            onAccept={handleAccept}
            onReject={handleReject}
          />
          <DoctorsListtwo
            doctors={acceptedDoctors}
            onEdit={handleEdit}
            onBlock={handleBlock}
          />
        </ComponentCard>
      </div>
    </>
  );
}
