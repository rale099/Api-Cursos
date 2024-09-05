import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
//Importaciones de css para primereact
import 'primereact/resources/themes/saga-blue/theme.css'; //Css del tema
import 'primereact/resources/primereact.min.css'; //css de primereatc
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
