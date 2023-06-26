import React, { useState, useEffect } from "react";
import ContentLoader from "react-content-loader";
import { useRouter } from "next/router";
import UserModal from "../user/UserModal";
import PostsLocation from "../locations/Posts/";
import PostCategory from "../categories/PostCategory";

const PostsList = ({ userIdFilter, searchTerm, categoryFilter }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(12);
  const [totalPosts, setTotalPosts] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [noMorePosts, setNoMorePosts] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [radius, setRadius] = useState(5);
  const [hasLocation, setHasLocation] = useState(false);
  const [userPreferences, setUserPreferences] = useState({});
  const [userPreferencesLoaded, setUserPreferencesLoaded] = useState(false); // Estado adicional para indicar si las preferencias se han cargado
  const [user, setUser] = useState(null); // Estado del usuario

  const router = useRouter();

  const handleLatitudeChange = (lat) => {
    setLatitude(lat);
  };

  const handleLongitudeChange = (lng) => {
    setLongitude(lng);
  };

  const handleRadiusChange = (event) => {
    if (event && event.target && event.target.value) {
      const selectedRadius = parseInt(event.target.value);
      setRadius(selectedRadius);
      onRadiusChange(selectedRadius);
    }
  };

  const getUserPreferences = async () => {
    try {
      if (user) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/preferences`,
          {
            credentials: "include", // Incluir las cookies en la solicitud
          }
        );
        const data = await response.json();
        setUserPreferences(data);
        setUserPreferencesLoaded(true); // Indicar que las preferencias se han cargado correctamente
        console.log("Datos enviados con el usuario");
      } else {
        const mainCategoryPreferences = JSON.parse(localStorage.getItem("mainCategoryPreferences")) || {};
        const subCategoryPreferences = JSON.parse(localStorage.getItem("subCategoryPreferences")) || {};
        const thirdCategoryPreferences = JSON.parse(localStorage.getItem("thirdCategoryPreferences")) || {};

        setUserPreferences({
          mainCategoryCounts: mainCategoryPreferences,
          subCategoryCounts: subCategoryPreferences,
          thirdCategoryCounts: thirdCategoryPreferences,
        });
        setUserPreferencesLoaded(true); // Indicar que las preferencias se han cargado correctamente
        console.log("Datos enviados con el localStorage");
      }
    } catch (error) {
      console.error("Error al obtener las preferencias de usuario:", error);
    }
  };

  useEffect(() => {
    getUserPreferences();
  }, [user]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`,
          {
            method: "GET",
            credentials: "include",
          }
        );
  
        if (response.ok) {
          const data = await response.json();
          setUser(data.user || null);
        } else if (response.status === 401) {
          setUser(null);
          console.log('no logged')
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
      }
    };
  
    checkSession();
  }, [router.pathname]);  
  

  const fetchPosts = async () => {
    if (!hasLocation || !userPreferencesLoaded) {
      // Verificar si las preferencias se han cargado antes de hacer la solicitud de los posts
      return;
    }

    try {
      setIsLoading(true);
      setIsFetching(true);

      const convertKeysToSingleQuotes = (preferences) => {
        const convertedPreferences = {};
        for (const key in preferences) {
          const convertedKey = key.replace(/"/g, "'");
          convertedPreferences[convertedKey] = preferences[key];
        }
        return convertedPreferences;
      };

      const filterParams = new URLSearchParams({
        mainCategory: categoryFilter?.mainCategory || "",
        subCategory: categoryFilter?.subCategory || "",
        thirdCategory: categoryFilter?.thirdCategory || "",
        searchTerm: searchTerm || "",
        page: currentPage,
        pageSize,
        latitude,
        longitude,
        radius,
        mainCategoryPreferences: JSON.stringify(convertKeysToSingleQuotes(userPreferences.mainCategoryCounts)),
        subCategoryPreferences: JSON.stringify(convertKeysToSingleQuotes(userPreferences.subCategoryCounts)),
        thirdCategoryPreferences: JSON.stringify(convertKeysToSingleQuotes(userPreferences.thirdCategoryCounts)),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts?${filterParams}`
      );
      const { posts: postsData, totalPosts } = await response.json();

      if (currentPage === 1) {
        setPosts(postsData);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...postsData]);
      }

      setTotalPosts(totalPosts);
      setHasMorePosts(postsData.length > 0);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsFetching(false);
      setIsLoading(false);
      setIsFetchingMore(false);
    }
    closeModal();
  };

  useEffect(() => {
    setPosts([]);
    setTotalPosts(0);
    setHasMorePosts(false);
    setCurrentPage(1);
  }, [userIdFilter, searchTerm, categoryFilter, latitude, longitude, radius]);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setHasLocation(true);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    fetchPosts();
  }, [
    userIdFilter,
    searchTerm,
    categoryFilter,
    currentPage,
    pageSize,
    hasLocation,
    latitude,
    longitude,
    radius,
    userPreferences,
    userPreferencesLoaded, // Agregar las preferencias cargadas como dependencia
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
    setCurrentPage(1);
    setPosts([]);
    setNoMorePosts(false);
  };

  return (
    <div className="ps-5 pe-5">
      <PostsLocation
        onLatitudeChange={setLatitude}
        onLongitudeChange={setLongitude}
        onRadiusChange={setRadius}
      />
      <PostCategory/>
      <div className="row row-cols-1 row-cols-md-4 row-cols-lg-5 row-cols-xl-5 g-4 pe-2 ps-2">
        {posts.map((post) => {
          const userReputation = 5 - 0.3 * post.createdBy.reports.length;
          let photoIndex = 0;
          return (
            <div key={post._id} className="col post-card rounded-5">
              <div className="card rounded-5 divhover">
                {post.photos && post.photos.length > 0 && (
                  <div
                    id={`carousel-${post._id}`}
                    className="carousel slide rounded-5 me-2 ms-2 mt-3 img-post"
                    data-bs-ride="carousel"
                    style={{ height: "200px", overflow: "hidden" }}
                  >
                    <div
                      className="carousel-inner "
                      onClick={() => router.push(`/post/${post._id}`)}
                    >
                      {post.photos.map((photo, index) => (
                        <div
                          className={`carousel-item ${
                            index === 0 ? "active" : ""
                          }`}
                          key={index}
                        >
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${photo}`}
                            className="d-block w-100"
                            alt={`Image ${index}`}
                            loading="lazy"
                            onClick={() => router.push(`/post/${post._id}`)}
                          />
                        </div>
                      ))}
                    </div>
                    {post.photos.length > 1 && (
                      <>
                        <button
                          className="carousel-control-prev custom-slider-button ms-1"
                          type="button"
                          data-bs-target={`#carousel-${post._id}`}
                          data-bs-slide="prev"
                          style={{ bottom: "40px" }}
                          disabled={photoIndex === 0}
                          onClick={() => {
                            photoIndex--;
                          }}
                        >
                          <i className="bi bi-chevron-left"></i>
                        </button>
                        <button
                          className="carousel-control-next custom-slider-button me-1"
                          type="button"
                          data-bs-target={`#carousel-${post._id}`}
                          data-bs-slide="next"
                          style={{ bottom: "40px" }}
                          disabled={photoIndex === post.photos.length - 1}
                          onClick={() => {
                            photoIndex++;
                          }}
                        >
                          <i className="bi bi-chevron-right"></i>
                        </button>
                      </>
                    )}
                  </div>
                )}
                <div className="card-body">
                  <h4
                    className="card-title post-title"
                    onClick={() => router.push(`/post/${post._id}`)}
                  >
                    {post.title}
                  </h4>
                  <h3
                    className="text-price"
                    onClick={() => router.push(`/post/${post._id}`)}
                  >
                    ${post.price.toLocaleString()}
                  </h3>
                  <div
                    className="d-flex"
                    onClick={() => openModal(post.createdBy)}
                  >
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
                      <small className="text-muted ">
                        {post.createdBy.firstName}
                      </small>
                      <div className="d-flex">
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