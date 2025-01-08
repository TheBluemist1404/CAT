import { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../authentication/AuthProvider';


const Header = () => {
    const {isLoggedIn, user} = useContext(AuthContext)
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);

    const mockData = [
        "C.A.T Tutorial",
        "C.A.T News",
        "Create Post",
        "Tags and Categories",
        "User Profile Settings",
        "Contact Us",
        "About C.A.T"
    ];

    useEffect(() => {
        const searchResults = document.getElementById('searchResults');
        if (searchQuery.trim() === '') {
            searchResults.style.display = 'none';
            return;
        }

        const results = mockData.filter(item =>
            item.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (results.length > 0) {
            searchResults.style.display = 'block';
            setFilteredResults(results);
        } else {
            searchResults.style.display = 'none';
        }
    }, [searchQuery]);

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchClick = (e) => {
        e.stopPropagation();
        const searchResults = document.getElementById('searchResults');
        if (searchResults.style.display === 'none' || searchResults.style.display === '') {
            searchResults.style.display = 'block';
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const searchResults = document.getElementById('searchResults');
            const searchInput = document.querySelector('header .searchbar input');
            if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
                searchResults.style.display = 'none';
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

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

    return (
        <header className="header-guest">
            <div className="logo">
                <img src="/src/pages/forum/assets/logo.svg" alt="N/A" onClick={()=>navigate('/')} style={{cursor: 'pointer'}}/>
            </div>
            <div className="searchbar">
                <div className="search-icon"></div>
                <input
                    type="text"
                    placeholder="Search C.A.T..."
                    value={searchQuery}
                    onChange={handleInputChange}
                    onClick={handleSearchClick}
                />
                <div id="searchResults" className="search-results">
                    {filteredResults.map((result, index) => (
                        <div key={index} className="search-result-item">
                            {result}
                        </div>
                    ))}
                </div>
            </div>
            {!isLoggedIn ? (<div className='header-button'>
                <button className="login-button" onClick={()=>navigate('/auth/login')}>Login</button>
                <button className="signup-button" onClick={()=>navigate('/auth/signup')}>Sign up</button>
            </div>):(<div style={{width: '40px', height:'40px', borderRadius: '50%', overflow: 'hidden', marginRight: '20px'}} onClick={()=> {navigate(`/profile/${user._id}`)}}>
                <img src={user.avatar} alt="" style={{width: '40px'}}/>
            </div>)}
        </header>
    );
};

export default Header;
