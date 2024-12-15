import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Content from "./Content";
import Pagination from "./Pagination";
import "./style.css";

function Forum() {
  return (
    <div className="Forum">
      <Header />
      <Sidebar />
      <Content />
      <Pagination />
    </div>
  );
}

export default Forum;
