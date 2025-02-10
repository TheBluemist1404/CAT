import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../authentication/AuthProvider';
import axios from 'axios';

const Header = () => {
    const { isLoggedIn, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const searchbarRef = useRef(null);
    const resultsRef = useRef(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 400);

        return () => clearTimeout(handler); 
    }, [searchQuery]);

    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setFilteredResults([]);
            return;
        }

        const fetchResults = async () => {
            const queryType = debouncedQuery.startsWith("user:")
                ? "users"
                : debouncedQuery.startsWith("title:")
                ? "posts"
                : debouncedQuery.startsWith("tag:")
                ? "tags"
                : "posts";

            const trimmedQuery = debouncedQuery.replace(/^(user:|title:|tag:)/, '').trim();
            setIsLoading(true);

            try {
                const response = await axios.get('http://localhost:3000/api/v1/forum/search', {
                    params: {
                        type: queryType,
                        q: trimmedQuery,
                        limit: 10,
                    },
                });
                if (queryType === "users") {
                    setFilteredResults(response.data || []);
                } else if (queryType === "posts" || queryType === "tags") {
                    setFilteredResults(response.data[0].posts || []);
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
                setFilteredResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [debouncedQuery]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchbarRef.current &&
                !searchbarRef.current.contains(event.target) &&
                resultsRef.current &&
                !resultsRef.current.contains(event.target)
            ) {
                setShowResults(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        setShowResults(true); // Show results when the user types
    };

    const handleResultClick = (result, queryType) => {
        if (queryType === "users") {
            navigate(`/profile/${result._id}`);
        } else if (queryType === "posts" || queryType === "tags") {
            navigate(`/forum/${result._id}`);
        }
        setShowResults(false); // Hide results after a result is clicked
    };

    return (
        <header className="header-guest">
            <div className="logo">
                <img
                    src="/src/pages/forum/assets/logo.svg"
                    alt="N/A"
                    onClick={() => navigate('/')}
                    style={{ cursor: 'pointer' }}
                />
            </div>
            <div className="searchbar" ref={searchbarRef}>
                <div className="search-icon"></div>
                <input
                    type="text"
                    placeholder="Search C.A.T... (e.g., user:abc, title:help, tag:c++)"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={() => setShowResults(true)} // Show results when the search bar gains focus
                />
                {showResults && (
                    <div className="search-results" ref={resultsRef}>
                        {isLoading ? (
                            <div>Loading...</div>
                        ) : filteredResults.length > 0 ? (
                            <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
                                {filteredResults.map((result, index) => (
                                    <li
                                        key={index}
                                        className="search-result-item"
                                        onClick={() =>
                                            handleResultClick(
                                                result,
                                                searchQuery.startsWith("user:")
                                                    ? "users"
                                                    : searchQuery.startsWith("tag:")
                                                    ? "tags"
                                                    : "posts"
                                            )
                                        }
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {result.title || result.fullName || result.slug || "Untitled"}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            searchQuery.trim() && <div>No results found.</div>
                        )}
                    </div>
                )}
            </div>
            {!isLoggedIn ? (
                <div className="header-button">
                    <button className="login-button" onClick={() => navigate('/auth/login')}>
                        Login
                    </button>
                    <button className="signup-button" onClick={() => navigate('/auth/signup')}>
                        Sign up
                    </button>
                </div>
            ) : (
                <div
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        marginRight: '20px',
                    }}
                    onClick={() => navigate(`/profile/${user._id}`)}
                >
                    <img src={user.avatar} alt="User Avatar" style={{ width: '40px' }} />
                </div>
            )}
        </header>
    );
};

export default Header;