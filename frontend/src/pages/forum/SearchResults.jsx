import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Post from './Post';  // Make sure to import your Post component

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
                            limit: 50,  // Adjust limit as per your need
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
    return (
        <main className="content">
            <div className="search-results-container">
                {postFeed.length > 0 ? (
                    <section className="post-feed">
                        {postFeed.map((post, index) => (
                            <Post key={index} post={post} token={token} />
                        ))}
                    </section>
                ) : (
                    <div>No results found for your search.</div>
                )}
            </div>
        </main>
    );
};

export default SearchResults;
