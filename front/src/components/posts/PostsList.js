const fetchPosts = async () => {
  setIsLoading(true);
  const response = await fetch('http://localhost:4000/api/posts');
  let postsData = await response.json();

  if (userIdFilter) {
    postsData = postsData.filter((post) => post.createdBy._id === userIdFilter);
  }

  if (locationFilter) {
    postsData = postsData.filter((post) => {
      const countryMatch = locationFilter.country
        ? post.country === locationFilter.country
        : true;
      const stateMatch = locationFilter.state
        ? post.state === locationFilter.state
        : locationFilter.country && !locationFilter.city
        ? post.country === locationFilter.country
        : true;
      const cityMatch = locationFilter.city
        ? post.city === locationFilter.city
        : true;

      return countryMatch && stateMatch && cityMatch;
    });
  }

  if (searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    postsData = postsData.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        post.description.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  // Función de ordenamiento para ordenar primero por título y luego por fecha de creación en orden descendente
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
};
  
useEffect(() => {
  const fetchAndSetPosts = async () => {
    await fetchPosts();
  };

  fetchAndSetPosts();
}, [locationFilter, userIdFilter, searchTerm]);


  return (
    <div className="container">
      <div className="row">
        {!isLoading ? (
          posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="col-md-4">
                <div className="card mb-4">
                  <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text">
                      {post.description.length > 100
                        ? post.description.substring(0, 100) + '...'
                        : post.description}
                    </p>
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

export default PostsList;
