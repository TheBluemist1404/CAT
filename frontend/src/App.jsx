import axios from "axios";
import { jwtDecode } from "jwt-decode";

import "./app.scss";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "./authentication/AuthProvider";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Homepage from "./pages/homepage/Homepage";
import Login from "./authentication/Login";
import Forgot from "./authentication/Forgot";
import Signup from "./authentication/Signup";
import Forum from "./pages/forum/Forum";
import Profile from "./pages/Profile/Profile";
import LiveCode from "./pages/live-code/LiveCode";
import CodeEditor from "./pages/live-code/CodeEditor";
import EditorPreview from "./pages/live-code/EditorPreview";

function App() {
  const { isLoggedIn, setIsLoggedIn, setUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Handle redirect from OAuth
  const hash = window.location.hash;

  if (hash != "") {
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const OAuthToken = { accessToken: accessToken, refreshToken: refreshToken };
    const OAthStr = JSON.stringify(OAuthToken);
    localStorage.setItem("token", OAthStr);

    // Clean up the URL
    window.history.replaceState(null, "", "/");
  }

  //Fetch user on mount
  const tokenStr = localStorage.getItem("token");
  const token = JSON.parse(tokenStr);
  const user = token ? jwtDecode(token.accessToken) : null;
  const userId = user ? user.id : null;

  const fetch = async () => {
    try {
      const userResponse = await axios.get(
        `http://localhost:3000/api/v1/profile/detail/${userId}`,
        { headers: { Authorization: `Bearer ${token.accessToken}` } }
      );
      return userResponse.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          const response = await axios.post(
            "http://localhost:3000/api/v1/token",
            { refreshToken: token.refreshToken }
          );
          const newAccessToken = response.data.accessToken;
          token.accessToken = newAccessToken;
          localStorage.setItem("token", JSON.stringify(token));

          const userResponse = await axios.get(
            `http://localhost:3000/api/v1/profile/detail/${userId}`,
            { headers: { Authorization: `Bearer ${newAccessToken}` } }
          );
          return userResponse.data;
        } catch (error) {
          if (error.response && error.response.status === 400) {
            logout();
          }
        }
      }
    }
  };

  const logout = async () => {
    try {
      await axios.delete("http://localhost:3000/api/v1/auth/logout", {
        data: { refreshToken: token.refreshToken },
      }); //axios.delete is treated different
      setIsLoggedIn(false);
      localStorage.removeItem("token");
    } catch (error) {
      console.error("logout failed", error);
    }
  };

  const getUser = async () => {
    const response = await fetch();
    console.log(response);
    setUser(response);
    setIsLoading(false);
  };

  useEffect(() => {
    if (tokenStr) {
      console.log("rerender");
      getUser().then(() => {
        setIsLoggedIn(true);
      });
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/">
        <Route index element={<Homepage token={token} />} />
        <Route path="auth/login" element={<Login />} />
        <Route path="auth/forgot" element={<Forgot />} />
        <Route path="auth/signup" element={<Signup />} />
        <Route path="forum">
          <Route index element={<Forum token={token} render="forum" />} />
          <Route path=":id" element={<Forum token={token} render="post" />} />
          <Route
            path="search"
            element={<Forum token={token} render="search" />}
          />
        </Route>
        <Route path="profile/:id/*" element={<Profile token={token} />}>
          <Route path="post" element={<></>} />
          <Route path="media" element={<></>} />
          <Route path="saved" element={<></>} />
        </Route>
        <Route path="live-code">
          <Route index element={<LiveCode token={token} />} />
          <Route
            path="editor/:id"
            element={<CodeEditor token={token} preview={false} />}
          />
          <Route
            path="preview/:id"
            element={<EditorPreview token={token} preview={true} />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
