import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';

function PostsList({ userIdFilter }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('http://localhost:4000/api/posts');
      const postsData = await response.json();
      
      if (userIdFilter) {
        const filteredPosts = postsData.filter(post => post.createdBy._id === userIdFilter);
        setPosts(filteredPosts);
      } else {
        setPosts(postsData);
      }
    };

    fetchPosts();
  }, [userIdFilter]);

  return (
    <div className="container">
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
                {/* Botón para ir a la página de detalles del post */}
                <Link href={`/post/[id]`} as={`/post/${post._id}`}>
                  <button className="btn btn-primary">Ver detalles</button>
                </Link>
              </div>
              <div className="card-footer">
                <small className="text-muted">
                  Created by {post.createdBy.firstName} {post.createdBy.lastName} on{' '}
                  {new Date(post.createdAt).toLocaleDateString()}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostsList;
