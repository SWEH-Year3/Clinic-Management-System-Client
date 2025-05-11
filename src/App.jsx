import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';


import { ToastContainer } from "react-toastify";

import HomePage from "./page/HomePage/Home";
import NavBar from "./global/components/NavBar";
import AboutPage from "./page/AboutPage/AboutPage";
import ClinicAuth from "./page/Auth/ClinicAuth";
// import AdminLayout from "./page/Admin/AdminLayout";
import DoctorsPage from "./global/components/Doctors";
// import PatientLayout from "./page/patient/PatientLayout";
// import ViewDocPage from "./global/components/ViewDocPage";
import Dashboard from "./page/admin/Dashboard/Dashboard";
// import ProfilePage from "./page/Profile/ProfilePage";
// import Appointments from "./global/components/Appointments";
import ChatPage from './global/layout/ChatPage'
import { ChatProvider } from './Context/ChatContext'

// import PatientDoctorsPage from "./page/patient/DoctorList";
import ViewDocPage from "./global/components/ViewDocPage";
import Prescription from './global/components/Prescription'
import Appointments from './global/components/Appointments'
import ProfilePage from './page/Profile/ProfilePage';


// To-Do: Add Route to each new page developed
function App() {
return (
<HashRouter>
    <NavBar />
    <ToastContainer position='top-right'/>
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
            path="/chat/:docName?/:id?"
           element={<ChatProvider children={<ChatPage />} />}
        />
        <Route path="/login" element={<ClinicAuth />} />
        <Route path="/register" element={<ClinicAuth />} />
        
        <Route path='*' element={<NotFound/>} />
        <Route path='/appointments' element={<Appointments/>} />
        
        <Route path="/view-doctor/:id" element={<ViewDocPage />} />
        <Route path="/profile" element={<ProfilePage />} />


        <Route path="/doctors" element={<DoctorsPage />} />

        <Route path="/admin/" >
            <Route index element={<Dashboard />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='dashboard/:id' element={<Dashboard />} />
        </Route>

        <Route path='/prescriptions/:id?' element={<Prescription />} />

    </Routes>
</HashRouter>
);

}

export default App;

const UnderDevelopment = () => {
  return (
    <h1 className="alert alert-info text-center m-5">Under Development</h1>
  );
};
const NotFound = () => {
  return (
    <h1 className="alert alert-danger text-center m-5 ">
      Not Found <strong>404</strong>
    </h1>
  );
};
