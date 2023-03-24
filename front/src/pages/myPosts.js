// pages/myPosts.js
import { useState, useEffect } from 'react';
import Link from 'next/link';


export default function MyPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      const response = await fetch('http://localhost:4000/api/my-posts', {
        credentials: 'include',
      });

      if (response.ok) {
        const postsData = await response.json();
        setPosts(postsData);
      }
    };

    fetchMyPosts();
  }, []);

  return (
    <div className="container">
      <h1>Mis Posts</h1>
      <div className="row">
        {posts.map((post) => (
  <div key={post._id} className="col-md-4">
  <div className="card mb-4">
    <div className="card-body">
      <h5 className="card-title">
        <Link href={`/editPost/${post._id}`}>
          <span className="link-with-icon">
            {post.title}
            <i className="bi bi-pencil-fill ms-2"></i>
          </span>
        </Link>
      </h5>
      <p className="card-text">{post.description}</p>
    </div>
  </div>
</div>
        ))}
      </div>
    </div>
  );
}
