import { useNavigate } from "react-router-dom";

function ProfileMedia({ posts = [] }) {
  const navigate = useNavigate();

  const handlePostClick = (postId) => {
    navigate(`/forum/${postId}`);
  };

  return (
    <div >
      <h1 style={{ margin: "20px" }}>Image Gallery</h1>
      <div 
        className="flex-container" 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(5, 250px)", 
          gridAutoRows: "250px", 
          gap: "20px",
          justifyContent:"center",
          
        }}
      >
        {posts.map((post) =>
          (post?.images || []).map((image, index) => (
            <div 
              key={`${post?._id}-${index}`} 
              className="image-box"
              onClick={() => post?._id && handlePostClick(post._id)}
              style={{
                width: "250px",
                height: "250px",
                cursor: "pointer",
                border: "1px solid #ccc",
                borderRadius: "8px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f0f0f0"
              }}
            >
              <img 
                src={image} 
                alt={`Image ${index + 1}`} 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.005)";
                  e.currentTarget.style.filter = "brightness(80%)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.filter = "brightness(100%)";
                }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProfileMedia;
