import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import PostsList from '@/components/posts/PostsList';

const IndexPage = ({ locationFilter, searchTerm, categoryFilter }) => {
  return (
    <div className="mt-5 mb-5">
      <PostsList
        locationFilter={locationFilter}
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
      />
    </div>
  );
};

export default IndexPage;