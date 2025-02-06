import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

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
import PlaneAnimation from './MoveEffect'


function Title({ subhead, head }) {
    return (
        <div className="title">
            <div className="subhead">{subhead}</div>
            <div className="head">{head}</div>
        </div>
    );
}

function Card({ subhead, head }) {
    return (
        <div className="card">
            <div className="head">{head}</div>
            <div className="subhead">{subhead}</div>
        </div>
    );
}

function Homepage({ token }) {
    const navigate = useNavigate();

    //Handle scroll-into-view effect
    const pitchRef = useRef();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate");
                        setIsVisible(!isVisible)
                        observer.unobserve(entry.target) //one-time render
                    }
                    // else {
                    //     entry.target.classList.remove("animate")
                    // }
                });
            },
            {
                root: null, // Default: viewport
                rootMargin: "-40% 0px -40% 0px", // Trigger when the element is in the middle
                threshold: 0.3, // Trigger as soon as it enters the margin
            }
        );

        observer.observe(pitchRef.current)

        return () => observer.disconnect(); // Cleanup
    }, []);
    
    return (
        <div className='homepage'>
            <div className='container' style={{ '--backgroundImage': `url(${background})` }}>
                <Header token={token} isAuth={false} />
                <section className="intro">
                    <div className="box">
                        <p>welcome to</p>
                        <h1>c.a.t</h1>
                        <div className="subhead">
                            <div id='where'>where we</div>
                            <TypingEffect text={"code-all-time"} decor={true} loop={true} speed={150}></TypingEffect>
                        </div>
                    </div>
                </section>
                <section className="about" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div className="decor1"></div>
                    <Title
                        subhead={"who we are"}
                        head={"DevTeam 1"}
                    />
                    <div className='about-content'>
                        <div className="about-img"><img src={about} alt="" /></div>
                        <div style={{ marginTop: 20 }}>
                            <div className="about-intro">a team of enthusiastic developers</div>
                            <div className="about-desc">with a passion to bring the joy of coding to all the curious minds</div>
                        </div>
                    </div>
                </section>
                <section className="forum">
                    <Title subhead={'Join our'} head={'Forum    '} />
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
                                A <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>large community</span> of developers, varies on all fields.
                            </div>
                            <div>
                                The best place to step out and learn new things!
                            </div>
                        </div>
                        <div className={`bubble bub2`}>
                            <div>
                                Stuck on a <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>problem</span>?
                            </div>
                            <div>
                                <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Share</span> and the community is here to help!
                            </div>
                        </div>
                        <div className={`bubble bub3`}>
                            <div>
                                Find the topics your are interested in with ease
                            </div>
                            <div>
                                Search with <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>#TAG</span> available
                            </div>
                        </div>
                        <PlaneAnimation />

                    </div>
                </section>
                <section className="live-code">
                    <Title subhead={'work with team'} head={'Live Code'} />
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
                    <div className="live-pitch" ref={pitchRef} style={{ minHeight: '300px' }}>
                        {isVisible && <>
                            <div>Colaborating with <span id='blue-span'><TypingEffect text={"no limitation"} decor={false} cursor={false} speed={150} /></span></div>
                            <div>-</div>
                            <div>In our <span id='red-span'><TypingEffect text={"modern IDE"} decor={false} cursor={false} speed={150} /></span></div>
                        </>}
                    </div>
                </section>
                <section className="outro">
                    <div className="box">
                        <p>and we will continue</p>
                        <h1>our passion</h1>
                        <div className="shimmer-button">
                            <div id='join' onClick={() => { navigate('/auth/signup') }}>join us now</div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>

    )
}

export default Homepage;