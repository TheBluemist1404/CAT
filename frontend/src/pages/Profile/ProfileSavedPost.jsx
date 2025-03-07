import { useNavigate } from "react-router-dom";

function ProfileSavedPost({profileData}) {
  // Post
  const navigate = useNavigate()
  const handlePostClick = (postId) => {
    navigate(`/forum/${postId}`);
  };

  return (
    <div className='mainS'>
      <div className="posts-container">
        {profileData?.savedPosts.slice().reverse().map((post, index) => {
          const date = new Date(post.createdAt);
          const formattedDate = `${date.getDate()} ${date.toLocaleString('en', { month: 'long' })}, ${date.getFullYear()}`;
          return (
            <div className='spost'>
              <div className='post-card' key={index}>
                <div className='post-icon-title'>
                  <img src="/src/assets/save.svg" alt="" width={30} height={30} />
                  <div className='post-title' key={post._id} onClick={() => handlePostClick(post._id)}>{post.title}</div>
                </div>

                <div className='post-date'>{formattedDate}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default ProfileSavedPost