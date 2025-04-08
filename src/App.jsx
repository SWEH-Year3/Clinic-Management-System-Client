
import { BrowserRouter, Route, Routes } from 'react-router-dom'


import HomePage from './page/HomePage/Home'
import NavBar from './global/components/NavBar'
import AboutPage from './page/AboutPage/AboutPage'

// To-Do: Add Route to each new page developed
function App() {

    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/about' element={<AboutPage />} />

                {/* To-Do: Insert Component When Developed */}
                <Route path='/login' element={<h1 className='alert alert-info text-center m-5'>Under Development</h1>} />
                <Route path='/register' element={<h1 className='alert alert-info text-center m-5'>Under Development</h1>} />
                
                <Route path='*' element={<h1 className='alert alert-danger text-center m-5'>Not Found <strong>404</strong></h1>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App



