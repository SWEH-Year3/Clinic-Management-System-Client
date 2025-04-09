
import { BrowserRouter, Route, Routes } from 'react-router-dom'

// Pages
import HomePage from './page/HomePage/Home'
import NavBar from './global/components/NavBar'
import AboutPage from './page/AboutPage/AboutPage'
import ClinicAuth from './page/Auth/ClinicAuth'
import AdminLayout from './components/Admin/AdminLayout'
import DoctorsPage from './page/admin/Doctors'
import AdminDashboard from './page/admin/Dashboard'

// To-Do: Add Route to each new page developed
function App() {

    return (
        <BrowserRouter>
            {/* <NavBar /> */}
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/about' element={<AboutPage />} />
                <Route path='/login' element={<ClinicAuth/>} />
                <Route path='/register' element={<ClinicAuth/>} />
                



            <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard/>} />
            <Route path="/admin/doctors" element={<DoctorsPage />} />
            {/* <Route path="/admin/appointments" element={<AppointmentsPage />} /> */}
            {/* <Route path="/admin/reports" element={<ReportsPage />} /> */}
            </Route>



                <Route path='*' element={<h1 className='alert alert-danger text-center m-5'>Not Found <strong>404</strong></h1>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App



