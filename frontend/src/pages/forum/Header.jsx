import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


const Header = () => {
    const naviagte = useNavigate();

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

    return (
        <header className="header-guest">
            <div className="logo">
                <img src="/src/pages/forum/assets/logo.svg" alt="N/A" onClick={()=>naviagte('/')} style={{cursor: 'pointer'}}/>
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
            <div className="header-button">
                <button className="login-button" onClick={()=>naviagte('/auth/login')}>Login</button>
                <button className="signup-button" onClick={()=>naviagte('/auth/signup')}>Sign up</button>
            </div>
        </header>
    );
};

export default Header;
