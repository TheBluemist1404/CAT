import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { AuthProvider } from './authentication/AuthProvider'

import Homepage from './pages/homepage/Homepage'
import Login from './authentication/Login'
import Signup from './authentication/Signup'
import Forum from './pages/forum/Forum'
import Profile from './pages/Profile/Profile'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage/>}/>
          <Route path='/auth/login' element={<Login/>}/>
          <Route path='/auth/signup' element={<Signup/>}/>
          <Route path='/forum' element={<Forum/>}/>
          <Route path='/profile' element={<Profile/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)
