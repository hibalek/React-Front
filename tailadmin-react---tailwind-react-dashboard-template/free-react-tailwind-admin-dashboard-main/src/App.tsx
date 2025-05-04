import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import Calendar from "./pages/Calendar";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import "react-datepicker/dist/react-datepicker.css";
import Setting from "./pages/Setting";
import DoctorsTables from "./pages/Doctors/DoctorsTables";
import PatientTables from "./pages/Patient/PatientTables";
import ReportedMessages from "./pages/admin/ReportedMessages";
import AdminChatViewer from "./pages/admin/AdminChatViewer";
import ChatPage from "./pages/Chat/ChatPage";
import DoctorProfile from "./pages/Doctors/DoctorProfile";
import DoctorDashboard from "./pages/Doctors/DoctorDashboard";
import PlannerDiet from "./pages/Doctors/PlannerDiet";



export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route index path="/" element={<SignIn />} />
          <Route path="/Setting" element={<Setting />} />
        </Routes>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
        
          <Route element={<AppLayout />}>
            {/* Others Page */}
            <Route path="/calendar" element={<Calendar />} />
        

            {/* Forms */}
            <Route path="/PlannerDiet" element={<PlannerDiet/>} /> {/*Plan de regime*/}

            
            
            
             {/* FormDiet */}

            {/* Tables */}
            <Route path="/doctors-tables" element={<DoctorsTables />} />
            {/* Tables */}
            <Route path="/patient-tables" element={<PatientTables />} />
            {/* Tables */}
            <Route path="/doctor1-tables" element={<DoctorsTables/>} />
            

            <Route path="/admin/reported-messages" element={<ReportedMessages />} />
             <Route path="/admin/chat/:conversationId" element={<AdminChatViewer />} />
             <Route path="/chat-page" element={<ChatPage />} />
            {/* Ajoutez la route pour le profil du médecin */}
            <Route path="/profil-doctor" element={<DoctorProfile />} />
            <Route path="/dashboard-doctor" element={<DoctorDashboard />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route 
          <Route path="*" element={<NotFound />} />*/}

          {/* Setting */}


          
        </Routes>
      </Router>
    </>
  );
}
