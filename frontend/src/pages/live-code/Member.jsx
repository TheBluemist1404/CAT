import axios from "axios";
import { useNavigate } from "react-router-dom";

function Member({ member, projectId, token, fetchProject }) {
  console.log(member)
  const navigate = useNavigate();

  async function handleRemove() {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/v1/projects/${projectId}/remove-collaborator`,
        { email: member.email },
        { headers: { Authorization: `Bearer ${token.accessToken}` } }
      );
      console.log(response.data);
      fetchProject();
    } catch (error) {
      console.error("remove member failed", error.message);
    }
  }
  return (
    <div className="member">
      <div
        className="member-info"
        onClick={() => {
          navigate(`/profile/${member._id}`);
        }}
      >
        <div className="avatar">
          <img src={member.avatar} alt="" />
        </div>
        <div className="name">
          {member.fullName.length <= 15
            ? member.fullName
            : member.fullName.substr(0, 10)}
        </div>
      </div>
      <div className="remove" onClick={handleRemove}>
        -remove
      </div>
    </div>
  );
}
export default Member;
