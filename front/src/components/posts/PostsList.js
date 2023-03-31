import React, { useState, useEffect } from "react";
import Link from "next/link";
import ContentLoader from "react-content-loader";

const PostsList = ({ locationFilter, userIdFilter, searchTerm, categoryFilter }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalPosts, setTotalPosts] = useState(0);

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

  const fetchPostsByCategory = (postsData) => {
    console.log("Filtering by category:", categoryFilter);
  
    if (categoryFilter && categoryFilter.mainCategory) {
      postsData = postsData.filter((post) => {
        const mainCategoryMatch =
          post.mainCategory === categoryFilter.mainCategory;
  
        const subCategoryMatch =
          categoryFilter.subCategory
            ? post.subCategory === categoryFilter.subCategory
            : true;
  
        const isMatch = mainCategoryMatch && subCategoryMatch;
  
        if (!isMatch) {
          console.log(
            "Filtered out post:",
            post.title,
            "mainCategory:",
            post.mainCategory,
            "subCategory:",
            post.subCategory
          );
        }
  
        return isMatch;
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
    postsData = fetchPostsByCategory(postsData); // Agrega esta línea
    postsData = fetchPostsBySearch(postsData);
  
    // Establece el total de posts antes del paginado
    setTotalPosts(postsData.length);
  
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setPosts(postsData.slice(start, end));
  
    setIsLoading(false);
  };  

  useEffect(() => {
    const fetchAndSetPosts = async () => {
      await fetchPosts();
    };
  
    fetchAndSetPosts();
  }, [locationFilter, userIdFilter, searchTerm, categoryFilter, currentPage, pageSize]);

  const Placeholder = () => (
    <div className="col-md-3">
      <ContentLoader speed={2} width={260} height={450} viewBox="0 0 260 450" backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
        <rect x="0" y="0" rx="10" ry="10" width="260" height="310" />
        <rect x="0" y="330" rx="3" ry="3" width="260" height="20" />
        <rect x="0" y="360" rx="3" ry="3" width="260" height="20" />
        <rect x="0" y="390" rx="3" ry="3" width="260" height="20" />
        <rect x="0" y="420" rx="3" ry="3" width="260" height="20" />
      </ContentLoader>
    </div>
  );

  const renderPageNumbers = () => {
    const pageNumbers = [];
    // Utiliza totalPosts en lugar de posts.length para calcular la cantidad de páginas
    for (let i = 1; i <= Math.ceil(totalPosts / pageSize); i++) {
      pageNumbers.push(i);
    }
    return (
      <nav aria-label="Page navigation example pt-2 pb-2">
        <ul className="pagination justify-content-center">
          {pageNumbers.map((number) => (
            <li key={number} className="page-item">
              <button
                onClick={() => handlePageChange(number)}
                className={`btn btn-success ${number === currentPage ? "active" : ""}`}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  return (
    <div className="container">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 pb-5">
        {!isLoading
          ? posts.length > 0
            ? posts.map((post) => (
                <div key={post._id}>
                  <div className="card post rounded-5">
                    <button className="rounded-circle btn-report" title="Report">
                    <i className="bi bi-flag"></i>
                    </button>
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
                      <h5 className="card-title post-title mb-2">{post.title}</h5>
                      <h5 className="text-success">
                        ${post.price.toLocaleString()}
                      </h5>
                      <p className="card-text post-text mb-2">
                        {post.description.length > 100
                          ? post.description.substring(0, 100) + "..."
                          : post.description}
                      </p>
                      <Link href={`/post/[id]`} as={`/post/${post._id}`}>
                        <button className="offer-btn btn float-end rounded-pill">Ver detalles</button>
                      </Link>
                    </div>
                    
                  </div>
                </div>
              ))
            : (
              <div className="col-md-12">
                <p>No se encontraron posts con los filtros aplicados.</p>
              </div>
            )
          : (
            <>
              <Placeholder />
              <Placeholder />
              <Placeholder />
              <Placeholder />
              <Placeholder />
              <Placeholder />
              <Placeholder />
              <Placeholder />
              <Placeholder />
              <Placeholder />
              <Placeholder />
              <Placeholder />
            </>
          )
        }
      </div>
      {posts.length > 0 && renderPageNumbers()}
    </div>
  );
};

export default PostsList;
 

