import React, { useState, useEffect } from "react";
import Link from "next/link";
import ContentLoader from "react-content-loader";
import ReportPostModal from "../report/ReportPostModal";
import { useRouter } from "next/router";

const PostsList = ({ locationFilter, userIdFilter, searchTerm, categoryFilter, currentPage, setCurrentPage }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(12);
  const [totalPosts, setTotalPosts] = useState(0);
  const maxPagesToShow = 6;
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);

      const filterParams = new URLSearchParams({
        country: locationFilter?.country || '',
        state: locationFilter?.state || '',
        city: locationFilter?.city || '',
        mainCategory: categoryFilter?.mainCategory || '',
        subCategory: categoryFilter?.subCategory || '',
        searchTerm: searchTerm || '',
        page: currentPage,
        pageSize
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts?${filterParams}`);
      const { posts: postsData, totalPosts } = await response.json();

      setTotalPosts(totalPosts);
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    setIsMobile(isMobile);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [locationFilter, userIdFilter, searchTerm, categoryFilter, currentPage, pageSize]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(totalPosts / pageSize);
  const showEllipsis = totalPages > maxPagesToShow;

  const renderPagination = () => {
    const pages = [];

    // Rango de páginas a mostrar
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    // Botón "..."
    if (showEllipsis && endPage < totalPages) {
      pages.push(
        <button key={0} className="btn btn-link" disabled>
          ...
        </button>
      );
    }

    // Páginas
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`btn btn-success m-1${i === currentPage ? " active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  const renderPrevButton = () => {
    if (currentPage > 1) {
      return (
        <button
          className="btn btn-success m-1"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          {"<"}
        </button>
      );
    }

    return null;
  };

  const renderNextButton = () => {
    if (currentPage < totalPages) {
      return (
        <button
          className="btn btn-success m-1"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          {">"}
        </button>
      );
    }

    return null;
  };

  const handleReportPost = async (postId, description) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/report/post/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Reporte de post exitoso:', data);
      } else {
        console.error('Error al reportar el post:', response);
      }
    } catch (error) {
      console.error('Error al reportar el post:', error);
    }
  };

  const Placeholder = () => (
    <div className="col mx-auto">
      <ContentLoader speed={2} width="100%" height={450} viewBox="0 0 260 450" backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
        <rect x="0" y="0" rx="10" ry="10" width="260" height="310" />
        <rect x="0" y="330" rx="3" ry="3" width="260" height="20" />
        <rect x="0" y="360" rx="3" ry="3" width="260" height="20" />
        <rect x="0" y="390" rx="3" ry="3" width="260" height="20" />
        <rect x="0" y="420" rx="3" ry="3" width="260" height="20" />
      </ContentLoader>
    </div>
  );

  return (
    <div className="container">
      {isMobile && (
        <div className="floating-btn-container">
          <button className="btn-post rounded-5 p-2" onClick={() => router.push("/createPost")}>
            Create Post
          </button>
        </div>
      )}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 pb-5">
        {!isLoading ? (
          posts.length > 0 ? (
            posts.map((post) => {
              // Calcular la reputación del usuario
              const userReputation = 5 - (0.3 * post.createdBy.reports.length);

              return (
                <div key={post._id} className="col">
                  <div className="card post rounded-5">
                    {post.photos && post.photos.length > 0 && (
                      <div
                        id={`carousel-${post._id}`}
                        className="carousel slide"
                        data-bs-ride="carousel"
                        style={{ height: "200px", overflow: "hidden" }}
                      >
                        <div className="carousel-inner">
                          {post.photos.map((photos, index) => {
                            console.log("Image URL:", `${process.env.NEXT_PUBLIC_API_BASE_URL}/${photos}`);
                            return (
                              <div
                                className={`carousel-item ${index === 0 ? "active" : ""}`}
                                key={index}
                              >
                                <img
                                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${photos}`}
                                  className="d-block w-100"
                                  alt={`Slide ${index}`}
                                  loading="lazy"
                                />
                              </div>
                            );
                          })}
                        </div>
                        <button
                          className="carousel-control-prev"
                          type="button"
                          data-bs-target={`#carousel-${post._id}`}
                          data-bs-slide="prev"
                        >
                          <span
                            className="carousel-control-prev-icon"
                            aria-hidden="true"
                          ></span>
                          <span className="visually-hidden">Previous</span>
                        </button>
                        <button
                          className="carousel-control-next"
                          type="button"
                          data-bs-target={`#carousel-${post._id}`}
                          data-bs-slide="next"
                        >
                          <span
                            className="carousel-control-next-icon"
                            aria-hidden="true"
                          ></span>
                          <span className="visually-hidden">Next</span>
                        </button>
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
                      <div className="row">
                        <div className="col-2 p-0">
                          <ReportPostModal postId={post._id} onReport={handleReportPost} />
                        </div>
                        <div className="col-8 p-0">
                          <Link className="d-flex justify-content-center" href={`/post/[id]`} as={`/post/${post._id}`}>
                            <button className="offer-btn btn rounded-5">View details</button>
                          </Link>
                        </div>
                        <div className="col-2 p-0">
                          <button className="btn ps-2" title="">
                            <i className="bi bi-heart"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer text-center">
                      <img
                        src={
                          post.createdBy.photo
                            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${post.createdBy.photo}`
                            : "icons/person-circle.svg"
                        }
                        alt=""
                        className="createdBy-photo p-1"
                      />
                      <small className="text-muted text-center">
                        {post.createdBy.firstName} | <i class="bi bi-star-fill"></i> {userReputation.toFixed(1)}
                      </small>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-md-12">
              <p>There are no posts with those filters. Please try something else.</p>
            </div>
          )
        ) : (
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
        )}
      </div>

      <div className="pagination justify-content-center">
        {renderPrevButton()}
        {renderPagination()}
        {renderNextButton()}
      </div>
    </div>
  );
};

export default PostsList;