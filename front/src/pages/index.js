// index.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import PostsList from '@/components/posts/postsList';

const IndexPage = ({ locationFilter, searchTerm }) => {
  return (
    <div>
      <PostsList locationFilter={locationFilter} searchTerm={searchTerm} />
    </div>
  );
};

export default IndexPage;
