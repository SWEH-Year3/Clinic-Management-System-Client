
import {BrowserRouter} from 'react-router-dom'
// import AboutUsPage from './page/AboutPage/AboutPage.jsx'
import HomePage from './page/HomePage/Home'
import NavBar from './global/components/NavBar'

// To-Do: Add Route to each new page developed
function App() {

  return (
    // <BrowserRouter>
    // </BrowserRouter>
    <div >
      <NavBar/>
      <HomePage/>
      {/* <AboutPage/> */}
    </div>
  )
}

export default App



