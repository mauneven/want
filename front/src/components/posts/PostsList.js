import React, { useState, useEffect } from "react";
import Link from "next/link";
import ContentLoader from "react-content-loader";
import ReportPostModal from "../report/ReportPostModal";
import { useRouter } from "next/router";

const PostsList = ({ locationFilter, userIdFilter, searchTerm, categoryFilter }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalPosts, setTotalPosts] = useState(0);
  const maxPagesToShow = 6;
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  const fetchPostsByLocation = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts`);
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
          // Reinicia la página actual a 1 cuando se realiza una nueva búsqueda
      if (currentPage !== 1) setCurrentPage(1);
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
    postsData = fetchPostsByCategory(postsData);
    postsData = fetchPostsBySearch(postsData);
  
    // Establece el total de posts antes del paginado
    setTotalPosts(postsData.length);
  
    // Realiza la paginación aquí
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

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    setIsMobile(isMobile);
  }, []);  

  const handleReportPost = async (postId, description) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/report/post/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
        credentials: 'include', // Añade esta línea
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Reporte de post exitoso:', data);
        // Puedes agregar cualquier otra acción después de reportar el post aquí, como mostrar una notificación o cerrar el modal.
      } else {
        console.error('Error al reportar el post:', response);
      }
    } catch (error) {
      console.error('Error al reportar el post:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  };

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

    for (let i = startPage; i < startPage + maxPagesToShow && i <= Math.ceil(totalPosts / pageSize); i++) {
      pageNumbers.push(i);
    }

    return (
      <nav aria-label="Page navigation example pt-2 pb-2">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="btn btn-success"
              disabled={currentPage === 1}
            >
              {"<"}
            </button>
          </li>
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
          <li className={`page-item ${currentPage === Math.ceil(totalPosts / pageSize) ? "disabled" : ""}`}>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="btn btn-success"
              disabled={currentPage === Math.ceil(totalPosts / pageSize)}
            >
              {">"}
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="container">
      {isMobile && (
        <div className="floating-btn-container">
  <button className="btn-post rounded-pill p-2" onClick={() => router.push("/createPost")}>
    CREAR POST
  </button>
</div>
)}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 pb-5">
        {!isLoading
          ? posts.length > 0
            ? posts.map((post) => (
              <div key={post._id} className="col">
                <div className="card post rounded-5">
                  <ReportPostModal postId={post._id} onReport={handleReportPost} />
                  <button className="rounded-circle btn-save" title="Save">
                    <i className="bi bi-heart"></i>
                  </button>
                  {post.photo && (
                    <div style={{ height: "200px", overflow: "hidden" }}>
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${post.photo}`}
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
                    <Link className="d-flex justify-content-center" href={`/post/[id]`} as={`/post/${post._id}`}>
                      <button className="offer-btn btn rounded-pill">Ver mas detalles</button>
                    </Link>
                  </div>
                  <div className="card-footer text-center">
                    <img
                      src={
                        post.createdBy.photo
                          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${post.createdBy.photo}`
                          : "icons/person-circle.svg"
                      }
                      alt="Profile"
                      style={{
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                      }}
                    />
                    <small className="text-muted text-center">
                      {console.log(`creador por : ${post.createdBy.role}`)}
                      {post.createdBy.firstName}
                    </small>
                  </div>
                </div>
              </div>
            ))
            : (
              <div className="col-md-12">
                <p>La gente aun no quiere lo que buscas.</p>
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

export default PostsList;


