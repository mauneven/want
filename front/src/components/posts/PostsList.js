import React, { useState, useEffect } from "react";
import ContentLoader from "react-content-loader";
import { useRouter } from "next/router";
import UserModal from "../user/UserModal";
import PostsListCategories from "../categories/PostsListCategories";
import SubcategoriesSlider from "../categories/CategorySlider";

const PostsList = ({ locationFilter, userIdFilter, searchTerm, categoryFilter,
}) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(6);
  const [totalPosts, setTotalPosts] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [noMorePosts, setNoMorePosts] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const router = useRouter();

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setIsFetching(true);

      const filterParams = new URLSearchParams({
        country: locationFilter?.country || "",
        state: locationFilter?.state || "",
        city: locationFilter?.city || "",
        mainCategory: categoryFilter?.mainCategory || "",
        subCategory: categoryFilter?.subCategory || "", // Filtro por subcategoría
        thirdCategory: categoryFilter?.thirdCategory || "",
        searchTerm: searchTerm || "",
        page: currentPage,
        pageSize,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts?${filterParams}`
      );
      const { posts: postsData, totalPosts } = await response.json();

      setTotalPosts(totalPosts);
      setHasMorePosts(postsData.length < totalPosts);
      setNoMorePosts(postsData.length === 0);

      if (currentPage === 1) {
        setPosts(postsData);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...postsData]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsFetching(false);
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [locationFilter, userIdFilter, searchTerm, categoryFilter]);

  useEffect(() => {
    fetchPosts();
  }, [
    locationFilter,
    userIdFilter,
    searchTerm,
    categoryFilter,
    currentPage,
    pageSize,
  ]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        (document.documentElement && document.documentElement.scrollTop) ||
        document.body.scrollTop;
      const scrollHeight =
        (document.documentElement && document.documentElement.scrollHeight) ||
        document.body.scrollHeight;
      const clientHeight =
        document.documentElement.clientHeight || window.innerHeight;
      const scrolledToBottom =
        Math.ceil(scrollTop + clientHeight) >= scrollHeight;
      const scrolledToTop = scrollTop === 0;

      if (
        scrolledToBottom &&
        hasMorePosts &&
        !isLoading &&
        !isFetching &&
        !isFetchingMore
      ) {
        setIsFetchingMore(true);
        setCurrentPage((prevPage) => prevPage + 1);
      }

      if (scrolledToTop && !isLoading && !isFetching && !isFetchingMore) {
        setHasMorePosts(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMorePosts, isLoading, isFetching, isFetchingMore]);

  const Placeholder = () => (
    <div className="col mx-auto">
      <ContentLoader
        speed={2}
        width="100%"
        height={450}
        viewBox="0 0 260 450"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
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

  const handleSubcategoryChange = (subcategory) => {
    setCurrentPage(1); // Reiniciar la página al cambiar la subcategoría
    setPosts([]); // Limpiar los posts actuales
    setNoMorePosts(false); // Restablecer el estado de noMorePosts

    // Realizar cualquier acción adicional según sea necesario al cambiar la subcategoría
  };

  return (
    <div className="container-fluid">
      <div className="row row-cols-1 row-cols-md-4 row-cols-lg-5 row-cols-xl-5 g-4">
        {posts.map((post) => {
          const userReputation = 5 - 0.3 * post.createdBy.reports.length;
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
                          className={`carousel-item ${
                            index === 0 ? "active" : ""
                          }`}
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
                      style={{ bottom: "40px" }}
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
                      style={{ bottom: "40px" }}
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
                  <h5
                    className="card-title post-title mb-2"
                    onClick={() => router.push(`/post/${post._id}`)}
                  >
                    <a style={{ color: "inherit", textDecoration: "none" }}>
                      {post.title}
                    </a>
                  </h5>
                  <h5
                    className="text-success"
                    onClick={() => router.push(`/post/${post._id}`)}
                  >
                    ${post.price.toLocaleString()}
                  </h5>
                  <p
                    className="card-text post-text mb-2"
                    onClick={() => router.push(`/post/${post._id}`)}
                  >
                    {post.description.length > 100
                      ? post.description.substring(0, 100) + "..."
                      : post.description}
                  </p>
                </div>
                <div
                  className="card-footer text-center"
                  onClick={() => openModal(post.createdBy)}
                  style={{ cursor: "pointer" }}
                >
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
                        <small className="text-muted">
                          {userReputation.toFixed(1)}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
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

        {!hasMorePosts && !isLoading && !isFetchingMore && (
          <div className="col-md-12">
            <p>No more posts available.</p>
          </div>
        )}
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
