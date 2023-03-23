// pages/myPosts.js
import { useState, useEffect } from 'react';

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
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">
                  {post.description.length > 100
                    ? post.description.substring(0, 100) + '...'
                    : post.description}
                </p>
              </div>
              <div className="card-footer">
                <small className="text-muted">
                  Creado el {new Date(post.createdAt).toLocaleDateString()}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
