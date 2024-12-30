import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const mockData = [
    'C.A.T Tutorial',
    'C.A.T News',
    'Create Post',
    'Tags and Categories',
    'User Profile Settings',
    'Contact Us',
    'About C.A.T',
  ];

  const filterResults = (query) => {
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = mockData.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };
  return (
    <header className="header-guest">
      <div className="logo" onClick={() => { navigate('/'); }}>
        <img src="Assets/Logo.svg" alt="Logo" />
      </div>
      <div className="searchbar">
        <div className="search-icon"></div>
        <input
          type="text"
          placeholder="Search C.A.T..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            filterResults(e.target.value);
          }}
        />
        {searchResults.length > 0 && (
          <div id="searchResults" className="search-results">
            {searchResults.map((result, index) => (
              <div key={index} className="search-result-item">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="header-button">
        <button className="login-button">Login</button>
        <button className="signup-button">Sign up</button>
      </div>
    </header>
  );
};

export default Header;
