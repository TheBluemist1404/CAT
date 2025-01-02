import axios from 'axios';

import './app.scss'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { AuthContext } from './authentication/AuthProvider'
import { useState, useEffect, useContext } from 'react'

import Homepage from './pages/homepage/Homepage'
import Login from './authentication/Login'
import Signup from './authentication/Signup'
import Forum from './pages/forum/Forum'
import Profile from './pages/Profile/Profile'

function App() {
    const {setIsLoggedIn, setUser} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);

    
    const tokenStr = localStorage.getItem('token');
    const token = JSON.parse(tokenStr);

    const fetch = async () => {
        try {
            const userResponse = await axios.get('http://localhost:3000/api/v1/profile/me', {headers: {Authorization: `Bearer ${token.accessToken}`}})
            return userResponse.data;
        } catch (error) {
            if (error.response && error.response.status === 403) {
                const getToken = await axios.post('http://localhost:3000/api/v1/token', {refreshToken: token.refreshToken})
                const newAccessToken = getToken.data.accessToken
                token.accessToken = newAccessToken;
                localStorage.setItem('token', JSON.stringify(token))

                const userResponse = await axios.get('http://localhost:3000/api/v1/profile/me', {headers: {Authorization: `Bearer ${newAccessToken}`}})    
                return userResponse.data;            
            }
        }   
    }
    
    const getUser = async () =>{
        const response = await fetch();
        setUser(response);
        setIsLoading(false);
    }

    useEffect(()=>{
        if (tokenStr) {       
            getUser().then(()=> {setIsLoggedIn(true)})
        } else {
            setIsLoading(false)
        }
    }, [])

    if (isLoading) {
        return(
            <div>Loading...</div>
        )
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