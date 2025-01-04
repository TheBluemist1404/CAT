import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Content from './Content';
import Pagination from './Pagination';
import './forum.scss';

const Forum = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const handleCreatePostToggle = () => {
    console.log("sidebar react")
    setIsCreatePostOpen(!isCreatePostOpen);
  };
  return (
    <div className="forum">
      <Header />
      <div className="main-layout">
        <Sidebar handleCreatePostToggle={handleCreatePostToggle}/>
        <Content isCreatePostOpen={isCreatePostOpen} handleCreatePostToggle={handleCreatePostToggle} />
      </div>
      <Pagination />
    </div>
  );
};

export default Forum;