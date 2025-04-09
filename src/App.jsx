import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ToastContainer } from "react-toastify";

import HomePage from "./page/HomePage/Home";
import NavBar from "./global/components/NavBar";
import AboutPage from "./page/AboutPage/AboutPage";
import ClinicAuth from "./page/Auth/ClinicAuth";
import AdminLayout from "./page/Admin/AdminLayout";
import DoctorsPage from "./page/Admin/Doctors";
import AdminDashboard from "./page/Admin/Dashboard";

// To-Do: Add Route to each new page developed
function App() {
return (
<BrowserRouter>
    <NavBar />
    <ToastContainer />
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<ClinicAuth />} />
        <Route path="/register" element={<ClinicAuth />} />

        <Route path="/admin/" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="doctors" element={<DoctorsPage />} />

            <Route path="appointments" element={<UnderDevelopment />} />
            {/* <Route path="appointments" element={<AppointmentsPage />} /> */}

            <Route path="reports" element={<UnderDevelopment />} />
            {/* <Route path="reports" element={<ReportsPage />} /> */}
        </Route>

        <Route path="*" element={<NotFound />} />
    </Routes>
</BrowserRouter>
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
