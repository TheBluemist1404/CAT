import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../authentication/AuthProvider';
import axios from 'axios';

const Header = () => {
    const { isLoggedIn, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (!query.trim()) {
            setFilteredResults([]);
            return;
        }

        const queryType = query.startsWith("user:")
            ? "users"
            : query.startsWith("title:")
            ? "posts"
            : query.startsWith("tag:")
            ? "tags"
            : "posts";

        const trimmedQuery = query.replace(/^(user:|title:|tag:)/, '').trim();
        console.log(queryType);
        console.log(trimmedQuery);
        setIsLoading(true);

        try {
            const response = await axios.get('http://localhost:3000/api/v1/forum/search', {
                params: {
                    type: queryType,
                    q: trimmedQuery,
                    limit: 10,
                },
            });
            console.log(response);
            if (queryType === "users") {
                setFilteredResults(response.data || []);
            }
            else if (queryType === "posts") {
                setFilteredResults(response.data[0].posts || []);
            }
            else {
                setFilteredResults(response.data[0].posts || []);
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
            setFilteredResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResultClick = (result, queryType) => {
        if (queryType === "users") {
            navigate(`/profile/${result._id}`);
        } else if (queryType === "posts") {
            navigate(`/forum/${result._id}`);
        } else if (queryType === "tags") {
            navigate(`/forum/${result._id}`);
        }
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
            <div className="searchbar">
                <div className="search-icon"></div>
                <input
                    type="text"
                    placeholder="Search C.A.T... (e.g., user:abc, title:help)"
                    value={searchQuery}
                    onChange={handleInputChange}
                />
                <div className="search-results">
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
