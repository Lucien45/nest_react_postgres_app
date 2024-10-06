import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-bootstrap'
import LoadingSpinner from './components/LoadingSpinner';
import AppRoute from './routes/AppRoute';

function App() {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <BrowserRouter>
      {loading && <LoadingSpinner/>}
      <ToastContainer position='top-center'/>
      <Routes>
        <Route path='/*' element={<AppRoute setLoading={setLoading}/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
