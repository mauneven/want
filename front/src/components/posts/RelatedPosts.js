import React, { useState, useEffect } from "react";
import Link from "next/link";
import ContentLoader from "react-content-loader";
import { useRouter } from "next/router";
import UserModal from "../user/UserModal";

const RelatedPosts = ({ locationFilter, categoryFilter, post }) => {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [totalPosts, setTotalPosts] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const maxPagesToShow = 6;
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const router = useRouter();

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts`);
      const params = {
        country: locationFilter.country,
        mainCategory: categoryFilter.mainCategory,
        subCategory: categoryFilter.subCategory,
      };
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

      const response = await fetch(url);
      const data = await response.json();

      const filteredPosts = data.posts.filter(p => p._id !== post._id);

      setRelatedPosts(filteredPosts);
      setTotalPosts(data.totalPosts - 1);
      setIsLoading(false);
    };

    if (post) {
      fetchRelatedPosts();
    }
  }, [post, currentPage, pageSize]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    localStorage.setItem("currentPage", pageNumber);
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

  const getPaginatedPosts = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return relatedPosts.slice(startIndex, endIndex);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (let i = startPage; i < startPage + maxPagesToShow && i <= Math.ceil(totalPosts / pageSize); i++) {
      pageNumbers.push(i);
    }

    return (
      <nav aria-label="Page navigation example pt-2 pb-2">
        <ul className="pagination justify-content-center">
          <li className={`page-item m-1 ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="btn want-button"
              disabled={currentPage === 1}
            >
              {"<"}
            </button>
          </li>
          {pageNumbers.map((number) => (
            <li key={number} className="page-item m-1">
              <button
                onClick={() => handlePageChange(number)}
                className={`btn want-button ${number === currentPage ? "active" : ""}`}
              >
                {number}
              </button>
            </li>
          ))}
          <li className={`page-item m-1 ${currentPage === Math.ceil(totalPosts / pageSize) ? "disabled" : ""}`}>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="btn want-button"
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
      <h3 className="text-center mb-4">Some people may Want similar things</h3>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 pb-5">
        {!isLoading ? (
          getPaginatedPosts().length > 0 ? (
            getPaginatedPosts().map((relatedPost) => {
              const userReputation = relatedPost.createdBy.reports ? 5 - (0.3 * relatedPost.createdBy.reports.length) : 5;

              return (
                <div key={relatedPost._id} className="col">
                  <div className="card post rounded-5">
                    <button className="rounded-circle btn-save" title="Save">
                      <i className="bi bi-heart"></i>
                    </button>
                    {relatedPost.photos && relatedPost.photos.length > 0 && (
                      <div
                        id={`carousel-${relatedPost._id}`}
                        className="carousel slide"
                        data-bs-ride="carousel"
                        style={{ height: "200px", overflow: "hidden" }}
                      >
                        <div className="carousel-inner">
                          {relatedPost.photos.map((photos, index) => {
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
                                />
                              </div>
                            );
                          })}
                        </div>
                        <button
                          className="carousel-control-prev"
                          type="button"
                          data-bs-target={`#carousel-${relatedPost._id}`}
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
                          data-bs-target={`#carousel-${relatedPost._id}`}
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
                      <h5 className="card-title post-title mb-2" onClick={() => router.push(`/post/${relatedPost._id}`)}>{relatedPost.title}</h5>
                      <h5 className="text-success" onClick={() => router.push(`/post/${relatedPost._id}`)}>
                        ${relatedPost.price.toLocaleString()}
                      </h5>
                      <p className="card-text post-text mb-2" onClick={() => router.push(`/post/${relatedPost._id}`)}>
                        {relatedPost.description.length > 100
                          ? relatedPost.description.substring(0, 100) + "..."
                          : relatedPost.description}
                      </p>
                    </div>
                    <div
                      className="card-footer text-center"
                      onClick={() => openModal(relatedPost.createdBy)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={
                          relatedPost.createdBy.photo
                            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${relatedPost.createdBy.photo}`
                            : "/icons/person-circle.png"
                        }
                        alt=""
                        className="createdBy-photo p-1"
                      />
                      <small className="text-muted text-center">
                        {relatedPost.createdBy.firstName} | <i className="bi bi-star-fill"></i> {userReputation.toFixed(1)}
                      </small>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-md-12">
              <p>We apologize, but there are still no people who Want things similar to this in these categories and location</p>
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
      {relatedPosts.length > 0 && renderPageNumbers()}

      <UserModal
        selectedUser={selectedUser}
        showModal={showModal}
        closeModal={closeModal}
      />
    </div>
  );
};

export default RelatedPosts;