import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";


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
import LiveCodeLayout from "./pages/live-code/LiveCodeLayout";
import ScrollToTopButton from "./pages/Profile/ScrollToTopButton";
import NotFound from "./NotFound";
import Notifications from "./pages/notification/Notification";
import NotificationIcon from "./pages/notification/NotificationIcon";
import NotificationLayout from "./pages/notification/NotificationLayout";
import NotificationPosts from "./pages/notification/NotificationPosts";
import NotificationComments from "./pages/notification/NotificationComments";
import NotificationInvites from "./pages/notification/NotificationInvites";


function App() {
  const { token, isLoggedIn, setIsLoggedIn, setUser, fetch } = useContext(AuthContext);
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
  const user = token ? jwtDecode(token.accessToken) : null;
  const userId = user ? user.id : null;

  const getUser = async () => {
    const response = await fetch(token, axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/v1/profile/detail/${userId}`,
      { headers: { Authorization: `Bearer ${token.accessToken}` } }
    ));
    console.log("get user: ",response);
    setUser(response);
    setIsLoading(false);
  };

  useEffect(() => {
    if (token) {
      console.log("rerender");
      getUser().then(() => {
        setIsLoggedIn(true);
      });
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn, navigate]);

  //Listen to notification
  const [newNoti, setNewNoti] = useState(false)

  useEffect(() => {
    if (token) {
      const socket = io(`${import.meta.env.VITE_APP_API_URL}`, {
        auth: { token: token.accessToken },
      });
  
      socket.on("connect", () => console.log("Connected to server"));
      socket.on("disconnect", () => console.log("Disconnected from server"));
  
      socket.on("newNotification", (data) => {
        console.log("Receive Message", data)
        if (data?.post || data?.project) {
          console.log("update noti")
          setNewNoti(true)
        }
      });

      return () => {
        socket.disconnect();
      };
    }    
  }, [token]); // Ensures socket is reinitialized only when token changes


  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
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
        <Route path="live-code" element={<LiveCodeLayout token={token}/>} >
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
        <Route path="notifications" element={<NotificationLayout/>}>
          <Route index element={<Notifications token={token} newNoti={newNoti} setNewNoti={setNewNoti}/>}/>
          <Route path='posts' element={<NotificationPosts token={token} newNoti={newNoti} setNewNoti={setNewNoti}/>}/>
          <Route path='comments' element={<NotificationComments token={token} newNoti={newNoti} setNewNoti={setNewNoti}/>}/>
          <Route path='invites' element={<NotificationInvites token={token} newNoti={newNoti} setNewNoti={setNewNoti}/>}/>
        </Route>
      </Route>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
    <ScrollToTopButton />
    <NotificationIcon token={token} newNoti={newNoti}/>
    </>
  );
}

export default App;
