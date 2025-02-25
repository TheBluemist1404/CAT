function Member({member}) {
  console.log(member)
  return(
    <div className="member">
      <div className="avatar">
        <img src={member.avatar} alt="" />
      </div>
      <div className="name">{member.fullName}</div>
    </div>
  )
}
export default Member