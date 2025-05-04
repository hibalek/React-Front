import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/BasicTables/BasicTableOne";
import PatientListOne from "../../components/BasicTables/PatientListOne";

export default function PatientTables() {
  return (
    <>
      <PageMeta
        title="Patient list"
        description="This is page show doctors"
      />
      <PageBreadcrumb pageTitle="Patient List" />
      <div className="space-y-6">
        <ComponentCard title="Patient list">
          <PatientListOne />
          {/* <BasicTableOne /> */}
        </ComponentCard>
      </div>
    </>
  );
}
