import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Homepage from './pages/homepage/Homepage'
import Login from './authentication/Login'
import Signup from './authentication/Signup'
import Forum from './pages/forum/Forum'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/auth/login' element={<Login/>}/>
        <Route path='/auth/signup' element={<Signup/>}/>
        <Route path='/forum' element={<Forum/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
