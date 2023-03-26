// index.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import PostsList from '@/components/posts/postsList';

const IndexPage = ({ locationFilter }) => {
  return (
    <div>
      <PostsList locationFilter={locationFilter} />
    </div>
  );
};

export default IndexPage;
