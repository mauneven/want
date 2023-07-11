import React, { useState, useEffect, useRef } from "react";
import ContentLoader from "react-content-loader";
import { useRouter } from "next/router";
import PostsLocation from "../locations/Posts/";
import PostCategory from "../categories/PostCategory";
import Link from "next/link";
import {
  useCheckSession,
  useGetUserPreferences
} from "@/utils/userEffects";
import fetchPosts from "./postsList/PostsListsUtilities";
import PostCard from "./postsList/PostCard";

const PostsList = ({
  searchTerm,
  onMainCategoryChange,
  onSubcategoryChange,
  onThirdCategoryChange,
  onDetailsCategoryChange,
  onDetailsSubcategoryChange,
  onDetailsThirdCategoryChange,
  detailsCategory,
  detailsSubcategory,
  detailsThirdCategory,
  keepCategories,
  onSearchTermChange,
  onResetAll,
  resetAll,
  mainCategory,
  subcategory,
  thirdCategory,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(7);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [radius, setRadius] = useState(10);
  const [hasLocation, setHasLocation] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState({});
  const [posts, setPosts] = useState([]);
  const [isInitialFetchDone, setIsInitialFetchDone] = useState(false); // Variable de estado para indicar si la petición inicial ya se ha realizado
  const user = useCheckSession();
  const { userPreferences, userPreferencesLoaded } =
    useGetUserPreferences(user);

  const router = useRouter();
  const containerRef = useRef(null);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("cachedPosts");
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  const handleMainCategoryChange = (mainCategory) => {
    setCategoryFilter((prevFilter) => ({
      ...prevFilter,
      mainCategory: mainCategory,
    }));

    if (detailsCategory !== "") {
      localStorage.removeItem("cachedPosts");
    }

    setCurrentPage(1);
  };

  const handleSubcategoryChange = (subcategory) => {
    setCategoryFilter((prevFilter) => ({
      ...prevFilter,
      subCategory: subcategory,
    }));

    if (onDetailsSubcategoryChange) {
      onDetailsSubcategoryChange(detailsSubcategory);
    }

    setCurrentPage(1);
  };

  const handleThirdCategoryChange = (thirdCategory) => {
    setCategoryFilter((prevFilter) => ({
      ...prevFilter,
      thirdCategory,
    }));

    if (onDetailsThirdCategoryChange) {
      onDetailsThirdCategoryChange(detailsThirdCategory);
    }

    setCurrentPage(1);
  };

  const handleLatitudeChange = (lat) => {
    setLatitude(lat);
    setCurrentPage(1);
  };

  const handleLongitudeChange = (lng) => {
    setLongitude(lng);
    setCurrentPage(1);
  };

  const handleRadiusChange = (selectedRadius) => {
    setRadius(selectedRadius);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (resetAll) {
      onResetAll(false);
      localStorage.removeItem("cachedPosts");
      setPosts([]);
      setHasMorePosts(false);
      onSearchTermChange("");
      setCurrentPage(1);
      setIsFetchingMore(false);
      setIsLoading(true);
      onDetailsCategoryChange("");
      onDetailsSubcategoryChange("");
      onDetailsThirdCategoryChange("");
      onMainCategoryChange("");
      onSubcategoryChange("");
      onThirdCategoryChange("");

      const timer = setTimeout(() => {
        setIsLoading(false);
        onResetAll(false);
      }, 1);

      return () => clearTimeout(timer);
    }
  }, [resetAll, onResetAll]);

  useEffect(() => {
    if (latitude !== null && longitude !== null && radius !== null) {
      setHasLocation(true);
    }
  }, [latitude, longitude, radius]);

  useEffect(() => {
    const cachedPosts = localStorage.getItem("cachedPosts");

    if (cachedPosts && currentPage === 1) {
      setPosts(JSON.parse(cachedPosts));
      setIsLoading(false);
      setIsInitialFetchDone(true);
    } else if (latitude !== null && longitude !== null && radius !== null) {
      fetchPosts(false, {
        hasLocation,
        searchTerm,
        keepCategories,
        categoryFilter,
        userPreferences,
        currentPage,
        pageSize,
        latitude,
        longitude,
        radius,
        detailsCategory,
        detailsSubcategory,
        detailsThirdCategory,
        setPosts,
        setTotalPosts,
        setHasMorePosts,
        setIsFetching,
        setIsLoading,
        setIsFetchingMore,
      }).then(() => {
        setIsInitialFetchDone(true);
      });
    }
  }, [userPreferences, currentPage, latitude, longitude, radius, detailsCategory, detailsSubcategory, detailsThirdCategory]);

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

    const handleTouchMove = () => {
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

    const handleScrollOrTouchMove = () => {
      if ("ontouchstart" in window) {
        handleTouchMove();
      } else {
        handleScroll();
      }
    };

    window.addEventListener("scroll", handleScrollOrTouchMove);

    return () => {
      window.removeEventListener("scroll", handleScrollOrTouchMove);
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
    if (searchTerm) {
      setPosts([]);
      setCurrentPage(1);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (isInitialFetchDone) { // Verificar si la petición inicial ya se ha realizado antes de hacer la petición adicional
      fetchPosts(true, {
        hasLocation,
        searchTerm,
        keepCategories,
        categoryFilter,
        userPreferences,
        currentPage,
        pageSize,
        latitude,
        longitude,
        radius,
        detailsCategory,
        detailsSubcategory,
        detailsThirdCategory,
        setPosts,
        setTotalPosts,
        setHasMorePosts,
        setIsFetching,
        setIsLoading,
        setIsFetchingMore,
      });
    }
  }, [isInitialFetchDone, categoryFilter, searchTerm, keepCategories, latitude, longitude, radius, detailsCategory, detailsSubcategory, detailsThirdCategory]);

  useEffect(() => {
    onMainCategoryChange(categoryFilter.mainCategory);
    onSubcategoryChange(categoryFilter.subCategory);
    onThirdCategoryChange(categoryFilter.thirdCategory);
  }, [categoryFilter]);

  useEffect(() => {
    const lastPage = Math.ceil(totalPosts / pageSize);
    if (currentPage === lastPage) {
      setHasMorePosts(posts.length === pageSize);
    } else {
      setHasMorePosts(true);
    }
  }, [posts, currentPage, totalPosts, pageSize]);

  useEffect(() => {
    return () => {
      onDetailsCategoryChange("");
      onDetailsSubcategoryChange("");
      onDetailsThirdCategoryChange("");
    };
  }, []);

  // Guardar la categoría seleccionada en el localStorage cuando cambia
  useEffect(() => {
    if (detailsCategory) {
      if (!detailsSubcategory) {
        onDetailsSubcategoryChange("");
      }
      if (!detailsThirdCategory) {
        onDetailsThirdCategoryChange("");
      }
    } else {
      onDetailsSubcategoryChange("");
      onDetailsThirdCategoryChange("");
    }
  }, [detailsCategory]);

  // Restaurar la categoría seleccionada desde el localStorage al cargar el componente
  useEffect(() => {
    const storedCategory = localStorage.getItem("selectedCategory");
    const storedSubcategory = localStorage.getItem("selectedSubcategory");
    const storedThirdCategory = localStorage.getItem("selectedThirdCategory");

    if (storedCategory) {
      setCategoryFilter((prevFilter) => ({
        ...prevFilter,
        mainCategory: storedCategory,
      }));
    }

    if (storedSubcategory) {
      setCategoryFilter((prevFilter) => ({
        ...prevFilter,
        subCategory: storedSubcategory,
      }));
    }

    if (storedThirdCategory) {
      setCategoryFilter((prevFilter) => ({
        ...prevFilter,
        thirdCategory: storedThirdCategory,
      }));
    }
  }, []);

  return (
    <div>
      <div className="text-center">
        <PostCategory
          onMainCategoryChange={handleMainCategoryChange}
          onSubcategoryChange={handleSubcategoryChange}
          onThirdCategoryChange={handleThirdCategoryChange}
          onSearchTermChange={onSearchTermChange}
          searchTerm={searchTerm}
          keepCategories={keepCategories}
          resetAll={resetAll}
          detailsCategory={detailsCategory}
          detailsThirdCategory={detailsThirdCategory}
          detailsSubcategory={detailsSubcategory}
          onDetailsCategoryChange={onDetailsCategoryChange}
          onDetailsSubcategoryChange={onDetailsSubcategoryChange}
          onDetailsThirdCategoryChange={onDetailsThirdCategoryChange}
          mainCategory={mainCategory}
          subcategory={subcategory}
          thirdCategory={thirdCategory}
        />
      </div>
      <div className="text-start m-2 d-flex">
        <PostsLocation
          onLatitudeChange={handleLatitudeChange}
          onLongitudeChange={handleLongitudeChange}
          onRadiusChange={handleRadiusChange}
        />
      </div>
      <div
        className="row row-cols-1 row-cols row-cols-lg-3 row-cols-xl-6"
        ref={containerRef}
      >
        {posts.map((post) => {
          const userReputation = 5 - 0.3 * post.createdBy.reports.length;
          let photoIndex = 0;
          return (
            <PostCard
              key={post._id}
              post={post}
              userReputation={userReputation}
              photoIndex={photoIndex}
            />
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