import { useNavigate } from "react-router-dom";

function ProfileMedia({user,profileData,token,id,posts}) {
  // Post
  const navigate = useNavigate()
  const handlePostClick = (postId) => {
    navigate(`/forum/${postId}`);
  };
 console.log(postId);
  return (
    <div className='im'>
  <h1 style={{ margin: "20px" }}>Image Gallery</h1>
  <div 
    className="flex-container" 
    style={{ 
      display: "grid", 
      gridTemplateColumns: "repeat(5, minmax(150px, 1fr))", 
      gridAutoRows: "1fr",
      gap: "10px"
    }}
  >
    {posts.flatMap(post => post.images || []).map((image, index) => (
      <div key={index} 
        className="flex-item" 
        style={{ 
          width: "100%", 
          height: "100%", 
          backgroundColor: "transparent", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          border: "1px solid #ccc", 
          borderRadius: "8px"
        }}
        onClick={() => handlePostClick(post._id)}
      >
        <img 
          src={image} 
          alt={`Image ${index + 1}`} 
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px",cursor:"pointer" }} 
          
        />
      </div>
    ))}
  </div>
</div>


  )
}

export default ProfileMedia