import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Post from './Post';  // Make sure to import your Post component
import User from'./PostUserList';

const SearchResults = ({ token }) => {
    const [postFeed, setPostFeed] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const queryType = params.get('type') || 'posts';
        const query = params.get('q') || '';

        if (query) {
            const fetchSearchResults = async () => {
                try {
                    const response = await axios.get('http://localhost:3000/api/v1/forum/search', {
                        params: {
                            type: queryType,
                            q: query,
                            limit: 10000,
                        },
                    });
                    // Check the response format to ensure you're getting the right data
                    if (queryType === "posts" || queryType === "tags") {
                        setPostFeed(response.data[0]?.posts || []);
                    } else {
                        setPostFeed(response.data || []);
                    }
                } catch (error) {
                    console.error("Error fetching search results:", error);
                }
            };

            fetchSearchResults();
        }
    }, [location.search]);  
    const para = new URLSearchParams(location.search);
    const queryT = para.get('type') || 'posts';
    const screenHeight = window.innerHeight;
    return (
        <main className="content">
            <div className="search-results-container">
                {postFeed.length > 0 ? 
                    (<div>{queryT==="posts" || queryT==="tags" ? (
                        <section className="post-feed" style={{ minHeight: `${screenHeight}px` }}>
                            {postFeed.map((post, index) => (
                                <Post key={index} post={post} token={token} />
                            ))}
                        </section>):(
                        <section className="container-user" style={{ minHeight: `${screenHeight}px` }}> 
                            <div className="post-feed-user">
                            {postFeed.map((post, index) => (
                                <User key={index} post={post} token={token} />
                            ))}
                            </div>
                    </section>)}</div>                          
                    ) : (
                        <div style={{ minHeight: `${screenHeight}px` }}>No results found for your search.</div>
                    )}
            </div>
        </main>
    );
};

export default SearchResults;
