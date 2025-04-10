
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { ToastContainer } from 'react-toastify'

import HomePage from './page/HomePage/Home'
import NavBar from './global/components/NavBar'
import AboutPage from './page/AboutPage/AboutPage'
import ClinicAuth from './page/Auth/ClinicAuth'
import ChatPage from './global/layout/ChatPage'


// To-Do: Add Route to each new page developed
function App() {

    return (
        <BrowserRouter>
            <NavBar />
            <ToastContainer/>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/about' element={<AboutPage />} />

                {/* To-Do: Insert Component When Developed */}
                {/* <Route path='/login' element={<h1 className='alert alert-info text-center m-5'>Under Development</h1>} />
                <Route path='/register' element={<h1 className='alert alert-info text-center m-5'>Under Development</h1>} /> */}
                <Route path='/login' element={<ClinicAuth/>} />
                <Route path='/register' element={<ClinicAuth/>} />

                <Route path="/chat/:id?" element={<ChatPage/>} />
                <Route path='*' element={<NotFound/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App

const UnderDevelopment = () => {
    return (<h1 className="alert alert-info text-center m-5">Under Development</h1>);
}
const NotFound = () => {
    return (<h1 className='alert alert-danger text-center m-5 '>Not Found <strong>404</strong></h1>);
}

