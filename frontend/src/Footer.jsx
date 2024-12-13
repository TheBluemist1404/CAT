function Footer() {
    return(
        <div className="footer">
            <div className="left">
                <img src="./src/assets/bg-logo.svg" alt="" />
                <div>
                    <h1 className="team">DevTeam 1</h1>
                    <p>We create a platform for all the curious minds</p>
                    <div className="social-media">
                        <img src="./src/assets/facebook.svg" alt="" />
                        <img src="./src/assets/github.svg" alt="" />
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
    )
}

export default Footer;