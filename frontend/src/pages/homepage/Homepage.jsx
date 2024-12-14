import './homepage.css'
import './title.css'
import './card.css'

//alias set up in vite.config.js
import background from '@homepage-assets/coding-on-laptop.jpg'
import about from '@homepage-assets/teamwork.webp'
import forum from '@homepage-assets/pseudo-forum.png'
import forum_decor from '@homepage-assets/decor2.png'
import team from '@homepage-assets/code-team.png' 

import Header from '../../Header';
import Footer from '../../Footer';


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

function Homepage(){
    return(
        <div>
            <div className='container' style={{'--backgroundImage': `url(${background})`}}>
                <Header/>
                <div className="intro">
                    <div className="box">
                        <p>welcome to</p>
                        <h1>c.a.t</h1>
                        <div className="subhead">
                            <div id='where'>where we</div>
                            <div id='code'>code-all-time</div>
                        </div>
                    </div>
                </div>
                <div className="about" style={{position: 'relative', overflow: 'hidden'}}>
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
                </div>
                <div className="forum">
                    <Title subhead={'Join our'} head={'Forum'}/>
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
                                A large community of developers, varies on all fields.
                            </div>
                            <div>
                                The best place to step out and learn new things!
                            </div>
                        </div>
                        <div className={`bubble bub2`}>
                            <div>
                                Stuck on a problem?
                            </div>
                            <div>
                                Share and the community is here to help!
                            </div>
                        </div>
                        <div className={`bubble bub3`}>
                            <div>
                                Find the topics your are interested in with ease
                            </div>
                            <div>
                                Search with #TAGS available
                            </div>
                        </div>
                        <svg width="506" height="1632" viewBox="0 0 506 1632" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M44.4994 0.50107C1080 299.501 47 586.5 44.5 796.5C42 1006.5 521.499 868.502 492 1141C462.5 1413.5 1.00001 1631.5 1.00001 1631.5" stroke="black" stroke-dasharray="10.1 10.1"/>
                        </svg>
                    </div>
                </div>
                <div className="live-code">
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
                </div>
                <div className="outro">
                    <div className="box">
                        <p>and we will continue</p>
                        <h1>our passion</h1>
                        <div className="join-box">
                            <div id='join'>join us now</div>
                        </div>
                    </div>
                </div>
            </div>
                <Footer/>
                
        </div>
        
    )
}

export default Homepage;