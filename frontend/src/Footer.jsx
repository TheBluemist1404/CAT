function Footer() {
    return(
        <>
            <div className="footer">
                <div className="left">
                    <img src="./src/assets/bg-logo.svg" alt="" style={{transform: 'translateY(-25px)'}}/>
                    <div>
                        <h1 className="team">DevTeam 1</h1>
                        <p>We create a platform for all the curious minds</p>
                        <div className="social-media">
                            <img src="./src/assets/facebook.svg" alt="facebook" />
                            <img src="./src/assets/github.svg" alt="github" />
                        </div>
                    </div>
                </div>
                <div className="right">
                    <h1>Contact Us:</h1>
                    <div style={{height: "20px"}}></div>
                    <p>cat@devteam1.com</p>
                    <p>0123 456 789</p>
                </div>
            </div>
            <div className="copyright" style={{color: '#d9d9d9'}}>C.A.T - @2025 by DevTeam 1</div>
        </>
    )
}

export default Footer;