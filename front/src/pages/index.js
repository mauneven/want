import React from "react";
import PostsList from "@/components/posts/PostsList";

const IndexPage = ({ locationFilter, searchTerm, categoryFilter, currentPage, setCurrentPage }) => {
  return (
    <div className="mt-5 mb-5">
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