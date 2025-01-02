import axios from 'axios';
import { jwtDecode }  from 'jwt-decode';


import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../authentication/AuthProvider'

import './homepage.scss'
import './title.scss'
import './card.css'

//alias set up in vite.config.js
import background from '@homepage-assets/coding-on-laptop.jpg'
import about from '@homepage-assets/teamwork.webp'
import forum from '@homepage-assets/pseudo-forum.png'
import forum_decor from '@homepage-assets/decor2.png'
import team from '@homepage-assets/code-team.png' 

import Header from '../../Header';
import Footer from '../../Footer';
import TypingEffect from './TypingEffect'


function Title({subhead, head}){
    return(
        <div className="title">
            <div className="subhead">{subhead}</div>
            <div className="head">{head}</div>
        </div>
    );
}

function Card({subhead, head}) {
    return(
        <div className="card">
            <div className="head">{head}</div>
            <div className="subhead">{subhead}</div>
        </div>
    );
}

function Homepage({token}){
    const navigate = useNavigate();

    const {isLoggedIn, setIsLoggedIn, user, setUser} = useContext(AuthContext);

    const login = () => {
        navigate('/auth/login');
    }

    const [dropdown, setDropdown] = useState(false)

    const toggleDropdown = ()=>{
        setDropdown(!dropdown);
    }

    const logout = async () => {
        try {
            const refreshToken = token.refreshToken;
            await axios.delete('http://localhost:3000/api/v1/auth/logout', {data: {refreshToken: refreshToken}}) //axios.delete is treated different
            setIsLoggedIn(false)
            localStorage.removeItem('token')
        } catch (error) {
            console.error('logout failed', error)
        }
    }
    return(
        <div className='homepage'>
            <div className='container' style={{'--backgroundImage': `url(${background})`}}>
                <div className="head">
                    <Header/>
                    <div className='login'>
                        {
                           !isLoggedIn ? (<div className="login-button" onClick={login}>Login</div>): ( 
                           <div style={{position: 'absolute', top: '70px', right: '0px'}}>
                               <div className='logged-in' onClick={toggleDropdown}>
                                    <div className="avatar"></div>
                                    <div className='username'>{user.fullName}</div>
                               </div>
                               <div className="action" style={{ display: dropdown ? 'flex' : 'none'}}>
                                    <div className="to-profile" onClick={()=>{navigate('/profile')}}>Profile</div>
                                    <div className="logout" onClick={logout}>Logout</div>
                               </div>
                           </div>
                           )
                        }
                    </div>
                </div>
                <section className="intro">
                    <div className="box">
                        <p>welcome to</p>
                        <h1>c.a.t</h1>
                        <div className="subhead">
                            <div id='where'>where we</div>
                            <TypingEffect text={"code-all-time"} speed={150}></TypingEffect>
                        </div>
                    </div>
                </section>
                <section className="about" style={{position: 'relative', overflow: 'hidden'}}>
                    <div className="decor1"></div>
                    <Title
                      subhead={"who we are"}
                      head={"DevTeam 1"}
                    />
                    <div className='about-content'>
                        <div className="about-img"><img src={about} alt="" /></div>
                        <div style={{marginTop: 20}}>
                            <div className="about-intro">a team of enthusiastic developers</div>
                            <div className="about-desc">with a passion to bring the joy of coding to all the curious minds</div>
                        </div>
                    </div>
                </section>
                <section className="forum">
                    <Title subhead={'Join our'} head={'Forum    '}/>
                    <div className='forum-content'>
                        <div className="forum-intro">
                            <div>A journey is no fun without</div>
                            <div className="forum-pitch">partners</div>
                            <div>Share your passion with fellow C.A.Ts</div>
                        </div>
                        <div className="forum-img">
                            <img src={forum_decor} alt="" />
                            <img id='pseudo' src={forum} alt="" />
                        </div>
                    </div>
                    <div className="forum-desc">
                        <div className={`bubble bub1`}>
                            <div>
                                A <span style={{textDecoration: 'underline', fontWeight: 'bold' }}>large community</span> of developers, varies on all fields.
                            </div>
                            <div>
                                The best place to step out and learn new things!
                            </div>
                        </div>
                        <div className={`bubble bub2`}>
                            <div>
                                Stuck on a <span style={{textDecoration: 'underline', fontWeight: 'bold' }}>problem</span>?
                            </div>
                            <div>
                            <span style={{textDecoration: 'underline', fontWeight: 'bold' }}>Share</span> and the community is here to help!
                            </div>
                        </div>
                        <div className={`bubble bub3`}>
                            <div>
                                Find the topics your are interested in with ease
                            </div>
                            <div>
                                Search with <span style={{textDecoration: 'underline', fontWeight: 'bold' }}>#TAG</span> available
                            </div>
                        </div>
                        <svg width="506" height="1632" viewBox="0 0 506 1632" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M44.4994 0.50107C1080 299.501 47 586.5 44.5 796.5C42 1006.5 521.499 868.502 492 1141C462.5 1413.5 1.00001 1631.5 1.00001 1631.5" stroke="black" stroke-dasharray="10.1 10.1"/>
                        </svg>
                    </div>
                </section>
                <section className="live-code">
                    <Title subhead={'work with team'} head={'Live Code'}/>
                    <div className="code-img"><img src={team} alt="" /></div>
                    <div className="bento-container">                        
                        <div className="item box1">
                            <Card subhead={'languages supported'} head={'N'}></Card>
                        </div>
                        <div className="item box2">
                            <Card subhead={'concurrent editors'} head={'10'}></Card>
                        </div>
                        <div className="item box3">
                            <Card subhead={'environment for popular frameworks, tech stack,...'} head={'built-in'}></Card>
                        </div>
                        <div className="item box4">
                            <Card subhead={'at ease, with all the pre-setup for convenience'} head={'deploying'}></Card>
                        </div>
                        <div className="item box5">
                            <Card subhead={'for team management'} head={'restriction'}></Card>
                        </div>
                    </div>
                    <div className="live-pitch">
                        <div>Colaborating with <span id='blue-span'>no limitations</span></div>
                        <div>-</div>
                        <div>In our <span id='red-span'>modern IDE</span></div>
                    </div>
                </section>
                <section className="outro">
                    <div className="box">
                        <p>and we will continue</p>
                        <h1>our passion</h1>
                        <div className="join-box">
                            <div id='join'>join us now</div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer/>
        </div>
        
    )
}

export default Homepage;