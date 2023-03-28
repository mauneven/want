import React, { useState, useEffect } from "react";
import Link from "next/link";


const PostsList = ({ locationFilter, userIdFilter, searchTerm }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPostsByLocation = async () => {
    const response = await fetch("http://localhost:4000/api/posts");
    let postsData = await response.json();
  
    if (locationFilter) {
      postsData = postsData.filter((post) => {
        let countryMatch = locationFilter.country ? post.country === locationFilter.country : true;
        let stateMatch = locationFilter.state ? post.state === locationFilter.state : true;
        let cityMatch = locationFilter.city ? post.city === locationFilter.city : true;
  
        return countryMatch && stateMatch && cityMatch;
      });
    }
  
    return postsData;
  };  

  const fetchPostsBySearch = (postsData) => {
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      postsData = postsData.filter(
        (post) =>
          post.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          post.description.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    postsData.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      const searchTermIndexA = titleA.indexOf(searchTerm.toLowerCase());
      const searchTermIndexB = titleB.indexOf(searchTerm.toLowerCase());

      if (searchTermIndexA === -1 && searchTermIndexB !== -1) {
        return 1;
      }
      if (searchTermIndexA !== -1 && searchTermIndexB === -1) {
        return -1;
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setPosts(postsData);
    setIsLoading(false);
    return postsData;
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    let postsData = await fetchPostsByLocation();
    postsData = fetchPostsBySearch(postsData);
    setPosts(postsData);
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchAndSetPosts = async () => {
      await fetchPosts();
    };

    fetchAndSetPosts();
  }, [locationFilter, userIdFilter, searchTerm]);

    return (
      <div className="container">
        <div className="row row-cols-sm-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 g-4">
          {!isLoading ? (
            posts.length > 0 ? (
              posts.map((post) => (
                <div key={post._id}>
                  <div className="card h-100">
                    {post.photo && (
                      <div style={{ height: "200px", overflow: "hidden" }}>
                        <img
                          src={`http://localhost:4000/${post.photo}`}
                          className="card-img-top"
                          alt={post.title}
                          style={{ objectFit: "cover", height: "100%" }}
                        />
                      </div>
                    )}
                    <div className="card-body">
                      <h5 className="card-title post-title">{post.title}</h5>
                      <h5 className="text-success">
                        ${post.price.toLocaleString()}
                      </h5>
                      <p className="card-text post-text">
                        {post.description.length > 100
                          ? post.description.substring(0, 100) + "..."
                          : post.description}
                      </p>
                      <Link href={`/post/[id]`} as={`/post/${post._id}`}>
                        <button className="offer-btn btn float-end rounded-pill">Ver detalles</button>
                      </Link>
                    </div>
                    <div className="card-footer">
                      <small className="text-muted">
                        Created by {post.createdBy.firstName} {post.createdBy.lastName} on{" "}
                        {new Date(post.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-md-12">
                <p>No se encontraron posts con los filtros aplicados.</p>
              </div>
            )
          ) : (
            <div className="col-md-12">
              <p>Cargando posts...</p>
            </div>
          )}
        </div>
      </div>
    );
  
};

export default PostsList;