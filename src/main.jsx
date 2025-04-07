import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { Provider } from '@/components/ui/provider'

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>,
)
