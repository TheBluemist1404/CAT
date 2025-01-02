import './app.scss'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { AuthContext } from './authentication/AuthProvider'
import { useEffect, useContext } from 'react'
import { jwtDecode } from 'jwt-decode'

import Homepage from './pages/homepage/Homepage'
import Login from './authentication/Login'
import Signup from './authentication/Signup'
import Forum from './pages/forum/Forum'
import Profile from './pages/Profile/Profile'

function App() {
    const {setIsLoggedIn, setUser} = useContext(AuthContext);
    
    const tokenStr = localStorage.getItem('token');
    let token;

    if (tokenStr) {
        try {
            token = JSON.parse(tokenStr);
            const decoded = jwtDecode(token.accessToken);
            const user = decoded.fullName;
            useEffect(()=> {
                setUser(user);
                setIsLoggedIn(true); 
            }, [user]) 
            //useEffect to avoid state update during rendering
        } catch (error) {
            console.log(error)
        }  
    }

    return(
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage token={token}/>}/>
          <Route path='/auth/login' element={<Login/>}/>
          <Route path='/auth/signup' element={<Signup/>}/>
          <Route path='/forum' element={<Forum/>}/>
          <Route path='/profile' element={<Profile/>} />
        </Routes>
    </BrowserRouter>
    );
};

export default App;