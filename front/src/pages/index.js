import React from "react";
import PostsList from "@/components/posts/PostsList";

const IndexPage = ({ locationFilter, searchTerm, categoryFilter, currentPage, setCurrentPage }) => {
  return (
    <div className="">
      <PostsList
        locationFilter={locationFilter}
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default IndexPage;