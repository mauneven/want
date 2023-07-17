import React, { useState, useEffect, useRef } from "react";
import ContentLoader from "react-content-loader";
import { useRouter } from "next/router";
import PostsLocation from "../locations/Posts/";
import PostCategory from "../categories/PostCategory";
import Link from "next/link";
import { useCheckSession, useGetUserPreferences } from "@/utils/userEffects";
import fetchPosts from "./postsList/PostsListsUtilities";
import PostCard from "./postsList/PostCard";
import InfiniteScroll from "react-infinite-scroll-component";

const PostsList = ({
  searchTerm,
  onMainCategoryChange,
  onSubcategoryChange,
  onThirdCategoryChange,
  keepCategories,
  onSearchTermChange,
  onResetAll,
  resetAll,
  mainCategory,
  subCategory,
  thirdCategory,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  const [totalPosts, setTotalPosts] = useState(0);
  const initialPage = parseInt(localStorage.getItem("currentPage") || "1", 10);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [radius, setRadius] = useState(10);
  const [hasLocation, setHasLocation] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState({});
  const [posts, setPosts] = useState([]);
  const [isInitialFetchDone, setIsInitialFetchDone] = useState(false);
  const previousCategoryFilter = useRef(categoryFilter);
  const user = useCheckSession();
  const fetchPostsRef = useRef(false);
  const { userPreferences, userPreferencesLoaded } =
    useGetUserPreferences(user);
  const router = useRouter();
  const containerRef = useRef(null);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("cachedPosts");
      localStorage.removeItem("currentPage");
      setCurrentPage(1);
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
    setCurrentPage(1);
  };

  const handleSubcategoryChange = (subCategory) => {
    setCategoryFilter((prevFilter) => ({
      ...prevFilter,
      subCategory: subCategory,
    }));
    setCurrentPage(1);
  };

  const handleThirdCategoryChange = (thirdCategory) => {
    setCategoryFilter((prevFilter) => ({
      ...prevFilter,
      thirdCategory: thirdCategory,
    }));
    setCurrentPage(1);
  };

  const handleLatitudeChange = (lat) => {
    setLatitude(lat);
  };

  const handleLongitudeChange = (lng) => {
    setLongitude(lng);
  };

  const handleRadiusChange = (selectedRadius) => {
    setRadius(selectedRadius);
  };

  useEffect(() => {
    if (resetAll) {
      onResetAll(false);
      localStorage.removeItem("cachedPosts");
      localStorage.removeItem("currentPage");
      localStorage.removeItem("mainCategory");
      localStorage.removeItem("subCategory");
      localStorage.removeItem("thirdCategory");
      setCurrentPage(1);
      setPosts([]);
      setHasMorePosts(true);
      onSearchTermChange("");
      setIsFetchingMore(true);
      setIsLoading(true);
      onMainCategoryChange("");
      onSubcategoryChange("");
      onThirdCategoryChange("");
      fetchPostsRef.current = false;
    }
  }, [resetAll, onResetAll]);

  const fetchMorePosts = () => {
    setIsFetchingMore(true);
  };

  useEffect(() => {
    const fetchMore = async () => {
      await fetchPosts(false, {
        hasLocation,
        searchTerm,
        keepCategories,
        categoryFilter,
        userPreferences,
        currentPage: currentPage + 1,
        pageSize,
        latitude,
        longitude,
        radius,
        setPosts,
        setTotalPosts,
        setHasMorePosts,
        setIsFetching,
        setIsLoading,
        setIsFetchingMore,
      });
    };

    if (isFetchingMore && !isLoading && !isFetching && hasMorePosts) {
      fetchMore();
    }
  }, [
    isFetchingMore,
    isLoading,
    isFetching,
    hasMorePosts,
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
  ]);

  useEffect(() => {
    if (latitude !== null && longitude !== null && radius !== null) {
      setHasLocation(true);
    }
  }, [latitude, longitude, radius]);

  useEffect(() => {
    const cachedPosts = localStorage.getItem("cachedPosts");

    if (cachedPosts) {
      setPosts(JSON.parse(cachedPosts));
      setIsLoading(false);
      setIsInitialFetchDone(true);
    } else if (
      latitude !== null &&
      longitude !== null &&
      radius !== null &&
      !fetchPostsRef.current
    ) {
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
        setPosts,
        setTotalPosts,
        setHasMorePosts,
        setIsFetching,
        setIsLoading,
        setIsFetchingMore,
      }).then(() => {
        setIsInitialFetchDone(true);
        fetchPostsRef.current = true;
      });
    }
  }, [
    userPreferences,
    currentPage,
    latitude,
    longitude,
    radius,
    categoryFilter,
    mainCategory,
    subCategory,
    thirdCategory,
  ]);

  useEffect(() => {
    if (isFetchingMore && !isLoading && !isFetching && hasMorePosts) {
      setCurrentPage((prevPage) => prevPage + 1);
      setIsFetchingMore(false);
    }
  }, [isFetchingMore, isLoading, isFetching, hasMorePosts]);

  useEffect(() => {
    if (searchTerm) {
      setPosts([]);
      setCurrentPage(1);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (isInitialFetchDone) {
      const previousFilter = previousCategoryFilter.current;
      const isFilterChanged =
        previousFilter.mainCategory !== categoryFilter.mainCategory ||
        previousFilter.subCategory !== categoryFilter.subCategory ||
        previousFilter.thirdCategory !== categoryFilter.thirdCategory;

      if (isFilterChanged) {
        setPosts([]);
        // setCurrentPage(1); no puedo poner esto porque esto haria que siempre la paginacion se ponga en 1, perderia la persistencia
        fetchPosts(true, {
          hasLocation,
          searchTerm,
          keepCategories,
          categoryFilter,
          userPreferences,
          currentPage: 1,
          pageSize,
          latitude,
          longitude,
          radius,
          setPosts,
          setTotalPosts,
          setHasMorePosts,
          setIsFetching,
          setIsLoading,
          setIsFetchingMore,
        });
      }
      previousCategoryFilter.current = categoryFilter;
    }
  }, [
    isInitialFetchDone,
    categoryFilter,
    searchTerm,
    keepCategories,
    latitude,
    longitude,
    radius,
    mainCategory,
    subCategory,
    thirdCategory,
  ]);

  useEffect(() => {
    onMainCategoryChange(categoryFilter.mainCategory);
    onSubcategoryChange(categoryFilter.subCategory);
    onThirdCategoryChange(categoryFilter.thirdCategory);
  }, [
    categoryFilter,
  ]);

  useEffect(() => {
    const lastPage = Math.ceil(totalPosts / pageSize);
    if (currentPage === lastPage) {
      setHasMorePosts(posts.length === pageSize);
    } else {
      setHasMorePosts(true);
    }
  }, [posts, currentPage, totalPosts, pageSize]);

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    const storedPage = localStorage.getItem("currentPage");
    if (storedPage) {
      setCurrentPage(parseInt(storedPage, 10));
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("currentPage", currentPage.toString());
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentPage]);

  return (
    <div>
      <p>{currentPage}</p>
      <div className="text-center">
        <PostCategory
          onMainCategoryChange={handleMainCategoryChange}
          onSubcategoryChange={handleSubcategoryChange}
          onThirdCategoryChange={handleThirdCategoryChange}
          onSearchTermChange={onSearchTermChange}
          searchTerm={searchTerm}
          keepCategories={keepCategories}
          resetAll={resetAll}
          mainCategory={mainCategory}
          subCategory={subCategory}
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
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMorePosts}
        hasMore={hasMorePosts}
        loader={<ContentLoader />}
      >
        <div
          className="row row-cols-1 row-cols row-cols-lg-3 row-cols-xl-6"
          id="posts-list"
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

          {!hasMorePosts && !isLoading && !isFetchingMore && (
            <div className="col-md-12">
              <p>No more posts available.</p>
            </div>
          )}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default PostsList;