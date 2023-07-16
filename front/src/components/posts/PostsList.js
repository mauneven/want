import React, { useState, useEffect, useRef } from "react";
import ContentLoader from "react-content-loader";
import { useRouter } from "next/router";
import PostsLocation from "../locations/Posts/";
import PostCategory from "../categories/PostCategory";
import Link from "next/link";
import { useCheckSession, useGetUserPreferences } from "@/utils/userEffects";
import fetchPosts from "./postsList/PostsListsUtilities";
import PostCard from "./postsList/PostCard";

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
  const [isInitialFetchDone, setIsInitialFetchDone] = useState(false);
  const previousCategoryFilter = useRef(categoryFilter);
  const user = useCheckSession();
  const { userPreferences, userPreferencesLoaded } =
    useGetUserPreferences(user);
  const router = useRouter();
  const containerRef = useRef(null);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("cachedPosts");
      localStorage.removeItem("currentPage");
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
      onMainCategoryChange("");
      onSubcategoryChange("");
      onThirdCategoryChange("");
    }
  }, [resetAll, onResetAll]);

  useEffect(() => {
    if (latitude !== null && longitude !== null && radius !== null) {
      setHasLocation(true);
    }
  }, [latitude, longitude, radius]);

  useEffect(() => {
    const cachedPosts = localStorage.getItem("cachedPosts");
    const cachedPage = localStorage.getItem("currentPage");

    if (cachedPosts && cachedPage && currentPage === 1) {
      setPosts(JSON.parse(cachedPosts));
      setCurrentPage(parseInt(cachedPage));
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
        setCurrentPage(1);
        setPosts([]);
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
    thirdCategory
  ]);

  useEffect(() => {
    onMainCategoryChange(categoryFilter.mainCategory);
    onSubcategoryChange(categoryFilter.subCategory);
    onThirdCategoryChange(categoryFilter.thirdCategory);
  }, [categoryFilter, mainCategory, subCategory, thirdCategory, onMainCategoryChange, onSubcategoryChange, onThirdCategoryChange]);

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