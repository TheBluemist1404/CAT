import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Content from './Content';
import Pagination from './Pagination';
import './forum.scss';

const Forum = () => {
  return (
    <div className="forum">
      <Header />
      <div className="main-layout">
        <Sidebar />
        <Content />
      </div>
      <Pagination />
    </div>
  );
};

export default Forum;