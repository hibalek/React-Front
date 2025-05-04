
import PageMeta from "../components/common/PageMeta";
import SettingDoc from "../components/doctor/SettingDoc";

export default function UserProfiles() {
    return (
        <>

        <div className="p-4 sm:p-6">
          <PageMeta
            title="ObeSmart Doctor | Parametre"
            description="Create a personalized regime for patients in ObeSmart"
          />
            <SettingDoc />
        </div>
        </>
      );
}
