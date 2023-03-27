import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import PostsList from '@/components/posts/postsList';

const IndexPage = ({ locationFilter, searchTerm }) => {
  return (
    <div className="mt-5 mb-5">
      <PostsList locationFilter={locationFilter} searchTerm={searchTerm} />
      <link rel="stylesheet" href="/css/posts.css" />
    </div>
  );
};

export default IndexPage;