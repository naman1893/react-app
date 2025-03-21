import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css'
// import App from './App.tsx'
import DataTable from './components/DataTable.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DataTable />
  </StrictMode>,
)
