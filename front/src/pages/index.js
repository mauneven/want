// index.js
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '@/components/navigation/Navbar';
import React from 'react'
import PostsList from '@/components/posts/postsList';

const index = () => {
  return (
    <div>
      <Navbar/>
      <PostsList/>
    </div>
  )
}

export default index;
