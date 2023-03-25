// index.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import PostsList from '@/components/posts/postsList';
import Megamenu from '@/components/navigation/Navbar';
import { useState } from 'react';

// index.js
const index = () => {
  const [locationFilter, setLocationFilter] = useState(null);

  return (
    <div>
      <Megamenu onLocationFilterChange={setLocationFilter} />
      <PostsList locationFilter={locationFilter} />
    </div>
  )
}


export default index;
