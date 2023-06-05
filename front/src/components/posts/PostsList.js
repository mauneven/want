import React, { useState, useEffect } from "react";
import ContentLoader from "react-content-loader";
import { useRouter } from "next/router";
import UserModal from "../user/UserModal";

const PostsList = ({ locationFilter, userIdFilter, searchTerm, categoryFilter, currentPage, setCurrentPage }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(12);
  const [totalPosts, setTotalPosts] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const maxPagesToShow = 6;
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const router = useRouter();

  const fetchPosts = async () => {
    try {
      setIsLoading(true);

      const filterParams = new URLSearchParams({
        country: locationFilter?.country || '',
        state: locationFilter?.state || '',
        city: locationFilter?.city || '',
        mainCategory: categoryFilter?.mainCategory || '',
        subCategory: categoryFilter?.subCategory || '',
        thirdCategory: categoryFilter?.thirdCategory || '', // Incluir tercer categoría
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

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  return (
    <div className="container">
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
                          {post.photos.map((photos, index) => (
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
                          ))}
                        </div>
                        <button
                          className="carousel-control-prev"
                          type="button"
                          data-bs-target={`#carousel-${post._id}`}
                          data-bs-slide="prev"
                          style={{ bottom: "40px" }} // Posición inferior del botón prev
                        >
                          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Previous</span>
                        </button>
                        <button
                          className="carousel-control-next"
                          type="button"
                          data-bs-target={`#carousel-${post._id}`}
                          data-bs-slide="next"
                          style={{ bottom: "40px" }} // Posición inferior del botón next
                        >
                          <span className="carousel-control-next-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Next</span>
                        </button>
                      </div>
                    )}
                    <div className="card-body">
                      <h5 className="card-title post-title mb-2" onClick={() => router.push(`/post/${post._id}`)}>
                        <a style={{ color: "inherit", textDecoration: "none" }}>
                          {post.title}
                        </a>
                      </h5>
                      <h5 className="text-success" onClick={() => router.push(`/post/${post._id}`)}>
                        ${post.price.toLocaleString()}
                      </h5>
                      <p className="card-text post-text mb-2" onClick={() => router.push(`/post/${post._id}`)}>
                        {post.description.length > 100 ? post.description.substring(0, 100) + "..." : post.description}
                      </p>
                    </div>
                    <div className="card-footer text-center" onClick={() => openModal(post.createdBy)} style={{ cursor: "pointer" }}>
                      <div className="d-flex align-items-center justify-content-center">
                        <img
                          src={
                            post.createdBy.photo
                              ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${post.createdBy.photo}`
                              : "/icons/person-circle.svg"
                          }
                          alt=""
                          className="createdBy-photo p-1"
                        />
                        <div className="ms-2">
                          <small className="text-muted text-center">
                            {post.createdBy.firstName}
                          </small>
                          <div className="d-flex align-items-center">
                            <i className="bi bi-star-fill me-1"></i>
                            <small className="text-muted">{userReputation.toFixed(1)}</small>
                          </div>
                        </div>
                      </div>
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

      <UserModal
        selectedUser={selectedUser}
        showModal={showModal}
        closeModal={closeModal}
      />
    </div>
  );
};

export default PostsList;