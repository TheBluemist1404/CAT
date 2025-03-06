import axios from "axios";
import { useNavigate}  from 'react-router-dom'
import { useEffect, useState } from "react";

function Noti({ token, noti }) {
  // console.log(noti);
  const navigate = useNavigate()
  const [sender, setSender] = useState();

  useEffect(() => {
    async function getSender() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/profile/detail/${noti.sender}`,
          { headers: { Authorization: `Bearer ${token.accessToken}` } }
        );
        setSender(response.data)
      } catch (error) {
        console.error("failed to get sender", error);
      }
    }

    getSender();
  }, []);

  //Return

  if (noti.type === "post" || noti.type === "comment") {
    const postId = noti.post;
    const [post, setPost] = useState();

    useEffect(() => {
      async function fetchPost() {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/v1/forum/detail/${postId}`,
            { headers: { Authorization: `Bearer ${token.accessToken}` } }
          );
          console.log(response.data);
          setPost(response.data);
        } catch (error) {
          console.error(error);
          if (error.status === 404) {
            console.log("this post is gone");
          }
        }
      }

      fetchPost();
    }, []);

    const [timeDisplay, setTimeDisplay] = useState();

    useEffect(() => {
      //Handle time display
      if (post) {
        const timestamp = post.createdAt;
        const createdDate = new Date(timestamp);
        const now = new Date();
        const timeDiff = now - createdDate; //in miliseconds

        if (timeDiff < 60 * 1000) {
          const seconds = Math.floor(timeDiff / 1000);
          setTimeDisplay(`${seconds} seconds ago`);
        } else if (timeDiff < 60 * 60 * 1000) {
          const minutes = Math.floor(timeDiff / (1000 * 60));
          setTimeDisplay(`${minutes} minutes ago`);
        } else if (timeDiff < 24 * 60 * 60 * 1000) {
          const hours = Math.floor(timeDiff / (1000 * 60 * 60));
          setTimeDisplay(`${hours} hours ago`);
        } else {
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          setTimeDisplay(`${days} days ago`);
        }
      }
    }, [post]);

    if (!post) {
      return <div>Cannot find post {postId}</div>;
    }

    return (
      <div className="noti">
        <div className="message">
          <div className="avatar">
            <img src={sender?.avatar} alt="" />
          </div>
          <div className="text">
            <div>{noti.message}</div>
            <div className="time">{timeDisplay}</div>
          </div>
        </div>
        <div className="post">
          <div className="title" onClick={()=>{navigate(`/forum/${post._id}`)}}>{post?.title}</div>
          <div className="tags">{post.tags.map(
            (tag, index) => (
              <div className="tag" key={index}>{tag.title}</div>
            )
          )}</div>
        </div>
      </div>
    );
  }
}

export default Noti;
