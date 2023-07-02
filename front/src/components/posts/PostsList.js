import React, { useState, useEffect, useRef } from "react";
import ContentLoader from "react-content-loader";
import { useRouter } from "next/router";
import PostsLocation from "../locations/Posts/";
import PostCategory from "../categories/PostCategory";
import Link from "next/link";

const PostsList = ({
  searchTerm,
  onMainCategoryChange,
  onSubcategoryChange,
  onThirdCategoryChange,
  keepCategories,
  onSearchTermChange,
  onResetAll,
  resetAll,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(12);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [radius, setRadius] = useState(10);
  const [hasLocation, setHasLocation] = useState(false);
  const [userPreferences, setUserPreferences] = useState({});
  const [userPreferencesLoaded, setUserPreferencesLoaded] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState({});
  const [user, setUser] = useState(null);
  const [initialCategoryFilter, setInitialCategoryFilter] = useState({});
  const [posts, setPosts] = useState([]);

  const router = useRouter();
  const containerRef = useRef(null);

  const handleMainCategoryChange = (mainCategory) => {
    setCategoryFilter((prevFilter) => ({
      ...prevFilter,
      mainCategory,
    }));
  };

  const handleSubcategoryChange = (subcategory) => {
    setCategoryFilter((prevFilter) => ({
      ...prevFilter,
      subCategory: subcategory,
    }));
  };

  const handleThirdCategoryChange = (thirdCategory) => {
    setCategoryFilter((prevFilter) => ({
      ...prevFilter,
      thirdCategory,
    }));
  };

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
            credentials: "include",
          }
        );
        const data = await response.json();
        setUserPreferences(data);
        setUserPreferencesLoaded(true);
        console.log("Datos enviados con el usuario");
      } else {
        const mainCategoryPreferences =
          JSON.parse(localStorage.getItem("mainCategoryPreferences")) || {};
        const subCategoryPreferences =
          JSON.parse(localStorage.getItem("subCategoryPreferences")) || {};
        const thirdCategoryPreferences =
          JSON.parse(localStorage.getItem("thirdCategoryPreferences")) || {};

        setUserPreferences({
          mainCategoryCounts: mainCategoryPreferences || {},
          subCategoryCounts: subCategoryPreferences || {},
          thirdCategoryCounts: thirdCategoryPreferences || {},
        });
        setUserPreferencesLoaded(true);
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
          console.log("no logged");
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
      }
    };

    checkSession();
  }, [router.pathname]);

  const fetchPosts = async (resetPosts) => {
    if (!hasLocation || !userPreferencesLoaded) {
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

      let mainCategoryFilter = "";
      let subCategoryFilter = "";
      let thirdCategoryFilter = "";

      if (searchTerm) {
        if (keepCategories) {
          mainCategoryFilter = categoryFilter?.mainCategory || "";
          subCategoryFilter = categoryFilter?.subCategory || "";
          thirdCategoryFilter = categoryFilter?.thirdCategory || "";
        } else {
          mainCategoryFilter = "";
          subCategoryFilter = "";
          thirdCategoryFilter = "";
        }
      } else {
        mainCategoryFilter = categoryFilter?.mainCategory || "";
        subCategoryFilter = categoryFilter?.subCategory || "";
        thirdCategoryFilter = categoryFilter?.thirdCategory || "";
      }

      if (resetAll) {
        searchTerm = "";
        keepCategories = false;
        mainCategoryFilter = "";
        subCategoryFilter = "";
        thirdCategoryFilter = "";
        setCategoryFilter("");
        setCurrentPage(1);
        resetPosts = true;
        onResetAll(false);
        
      }

      const filterParams = new URLSearchParams({
        mainCategory: mainCategoryFilter,
        subCategory: subCategoryFilter,
        thirdCategory: thirdCategoryFilter,
        searchTerm: searchTerm || "",
        page: resetPosts ? 1 : currentPage,
        pageSize,
        latitude,
        longitude,
        radius,
        mainCategoryPreferences: JSON.stringify(
          convertKeysToSingleQuotes(userPreferences.mainCategoryCounts)
        ),
        subCategoryPreferences: JSON.stringify(
          convertKeysToSingleQuotes(userPreferences.subCategoryCounts)
        ),
        thirdCategoryPreferences: JSON.stringify(
          convertKeysToSingleQuotes(userPreferences.thirdCategoryCounts)
        ),
      });

      console.log("Fetching posts...");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts?${filterParams}`
      );
      const { posts: postsData, totalPosts } = await response.json();

      if (resetPosts) {
        setPosts(postsData);
        localStorage.setItem("cachedPosts", JSON.stringify(postsData));
      } else {
        setPosts((prevPosts) => {
          const updatedPosts = [...prevPosts, ...postsData];
          localStorage.setItem("cachedPosts", JSON.stringify(updatedPosts));
          return updatedPosts;
        });
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
  };

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setHasLocation(true);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    const cachedPosts = localStorage.getItem("cachedPosts");
    if (cachedPosts) {
      setPosts(JSON.parse(cachedPosts));
      setIsLoading(false);
    } else {
      fetchPosts(false);
    }
  }, [
    categoryFilter,
    searchTerm,
    hasLocation,
    latitude,
    longitude,
    radius,
    userPreferences,
    userPreferencesLoaded,
    resetAll,
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

  useEffect(() => {
    const updateLocalStorage = () => {
      localStorage.setItem(
        "mainCategoryPreferences",
        JSON.stringify(userPreferences.mainCategoryCounts)
      );
      localStorage.setItem(
        "subCategoryPreferences",
        JSON.stringify(userPreferences.subCategoryCounts)
      );
      localStorage.setItem(
        "thirdCategoryPreferences",
        JSON.stringify(userPreferences.thirdCategoryCounts)
      );
    };

    updateLocalStorage();
  }, [userPreferences]);

  useEffect(() => {
    if (isFetchingMore && !isLoading && !isFetching && hasMorePosts) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [isFetchingMore, isLoading, isFetching, hasMorePosts]);

  useEffect(() => {
    fetchPosts(false);
  }, [currentPage]);

  useEffect(() => {
    fetchPosts(true);
  }, [categoryFilter, searchTerm, keepCategories]);

  useEffect(() => {
    if (resetAll) {
      fetchPosts(true);
    }
  }, [resetAll]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("cachedPosts");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    onMainCategoryChange(categoryFilter.mainCategory);
    onSubcategoryChange(categoryFilter.subCategory);
    onThirdCategoryChange(categoryFilter.thirdCategory);
  }, [categoryFilter]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          hasMorePosts &&
          !isLoading &&
          !isFetching &&
          !isFetchingMore
        ) {
          setIsFetchingMore(true);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [hasMorePosts, isLoading, isFetching, isFetchingMore]);

  useEffect(() => {
    if (searchTerm && !keepCategories) {
      onMainCategoryChange("");
      onSubcategoryChange("");
      onThirdCategoryChange("");
    }
  }, [searchTerm]);

  return (
    <div>
      <div className="text-center">
        <PostCategory
          onMainCategoryChange={handleMainCategoryChange}
          onSubcategoryChange={handleSubcategoryChange}
          onThirdCategoryChange={handleThirdCategoryChange}
          initialMainCategory={categoryFilter.mainCategory}
          initialSubcategory={categoryFilter.subCategory}
          initialThirdCategory={categoryFilter.thirdCategory}
          onSearchTermChange={onSearchTermChange}
          searchTerm={searchTerm}
          keepCategories={keepCategories}
          resetAll={resetAll}
        />
      </div>
      <div className="text-start m-2">
        <PostsLocation
          onLatitudeChange={setLatitude}
          onLongitudeChange={setLongitude}
          onRadiusChange={setRadius}
        />
      </div>
      <div
        className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-6 pe-2 ps-2"
        ref={containerRef}
      >
        {posts.map((post) => {
          const userReputation = 5 - 0.3 * post.createdBy.reports.length;
          let photoIndex = 0;
          return (
            <div
              key={post._id}
              className="col post-card want-rounded d-flex align-items-stretch"
            >
              <div className="card want-rounded divhover w-100">
                {post.photos && post.photos.length > 0 && (
                  <div
                    id={`carousel-${post._id}`}
                    className="carousel slide want-rounded me-2 ms-2 mt-3 img-post"
                    data-bs-ride="carousel"
                    style={{ height: "200px", overflow: "hidden" }}
                  >
                    <Link href={`post/${post._id}`} className="carousel-inner">
                      {post.photos.map((photo, index) => (
                        <div
                          className={`carousel-item ${
                            index === 0 ? "active" : ""
                          }`}
                          key={index}
                        >
                          <Link href={`post/${post._id}`}>
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${photo}`}
                              className="d-block w-100"
                              alt={`Image ${index}`}
                              loading="lazy"
                            />
                          </Link>
                        </div>
                      ))}
                    </Link>
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
                <Link href={`post/${post._id}`}>
                  <div className="card-body p-0 m-2">
                    <div className="generic-button mb-2 want-rounded">
                      <h3 className="text-price">
                        ${post.price.toLocaleString()}
                      </h3>
                      <h5 className="card-title post-title p-1">
                        {post.title}
                      </h5>
                    </div>
                    <div className="d-flex generic-button mb-2 generic-button want-rounded">
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
                        <small className="text-muted">
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
                </Link>
              </div>
            </div>
          );
        })}

        {isLoading && <ContentLoader />}

        {!hasMorePosts && !isLoading && !isFetchingMore && (
          <div className="col-md-12">
            <p>No more posts available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsList;