import React, { useState, useEffect, useRef } from "react";
import ContentLoader from "react-content-loader";
import { useRouter } from "next/router";
import PostsLocation from "../locations/Posts/";
import PostCategory from "../categories/PostCategory";
import { useCheckSession, useGetUserPreferences } from "@/utils/userEffects";
import fetchPosts from "./postsList/PostsListsUtilities";
import PostCard from "./postsList/PostCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { useTranslation } from 'react-i18next';

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
  const [pageSize, setPageSize] = useState(13);
  const [totalPosts, setTotalPosts] = useState(0);
  const initialPage = parseInt(localStorage.getItem("currentPage") || "1", 10);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hasMorePosts, setHasMorePosts] = useState(
    localStorage.getItem("hasMorePosts") === "true"
  );
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [radius, setRadius] = useState(10000000000);
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
  const { t } = useTranslation();

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
      localStorage.removeItem("cachedPosts");
      localStorage.removeItem("currentPage");
      localStorage.removeItem("mainCategory");
      localStorage.removeItem("subCategory");
      localStorage.removeItem("thirdCategory");
      localStorage.removeItem("allPostsCharged");
      localStorage.removeItem("hasMorePosts");
      setHasMorePosts(true);
      onSearchTermChange("");
      setIsFetchingMore(true);
      setIsLoading(true);
      onMainCategoryChange("");
      onSubcategoryChange("");
      onThirdCategoryChange("");
      fetchPostsRef.current = false;
      onResetAll(false);
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
    const previousSearchTerm = previousCategoryFilter.current.searchTerm;

    if (previousSearchTerm !== searchTerm) {
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
      previousCategoryFilter.current = {
        ...categoryFilter,
        latitude,
        longitude,
        radius,
        searchTerm,
      };
    }
  }, [searchTerm, keepCategories]);

  useEffect(() => {
    if (isInitialFetchDone) {
      const previousFilter = previousCategoryFilter.current;
      const isFilterChanged =
        previousFilter.mainCategory !== categoryFilter.mainCategory ||
        previousFilter.subCategory !== categoryFilter.subCategory ||
        previousFilter.thirdCategory !== categoryFilter.thirdCategory ||
        previousFilter.latitude !== latitude ||
        previousFilter.longitude !== longitude ||
        previousFilter.radius !== radius;

      if (
        !categoryFilter.mainCategory &&
        !categoryFilter.subCategory &&
        !categoryFilter.thirdCategory &&
        searchTerm !== ""
      ) {
        return; // Skip fetchPosts
      }

      if (isFilterChanged) {
        localStorage.removeItem("allPostsCharged");
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
      previousCategoryFilter.current = {
        ...categoryFilter,
        latitude,
        longitude,
        radius,
      };
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
    setPosts([]);
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
    localStorage.setItem("currentPage", currentPage.toString());
    localStorage.setItem("hasMorePosts", hasMorePosts.toString()); // Save hasMorePosts flag to localStorage
  }, [currentPage, hasMorePosts]);

  useEffect(() => {
    const storedPage = localStorage.getItem("currentPage");
    const storedHasMorePosts = localStorage.getItem("hasMorePosts");

    if (storedPage) {
      setCurrentPage(parseInt(storedPage, 10));
    }
    if (storedHasMorePosts) {
      setHasMorePosts(storedHasMorePosts === "true");
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

  // Set allPostsCharged flag in localStorage when all posts are loaded
  useEffect(() => {
    if (isInitialFetchDone && !isLoading && !isFetching && !hasMorePosts) {
      localStorage.setItem("allPostsCharged", "true");
    }
  }, [isInitialFetchDone, isLoading, isFetching, hasMorePosts]);

  const allPostsCharged = localStorage.getItem("allPostsCharged") === "true";

  useEffect(() => {
    if (allPostsCharged) {
      setHasMorePosts(false);
    }
  }, [allPostsCharged]);

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
      {latitude === null || longitude === null ? (
        <div className="text-center p-5 m-5">
          <h1>{t('postslist.locationAccess')}</h1>
        </div>
      ) : null}
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMorePosts}
        hasMore={!allPostsCharged && hasMorePosts}
        loader={
          <div className="row row-cols-1 row-cols row-cols-lg-3 row-cols-xl-6">
            {[...Array(0)].map((_, index) => (
              <div key={index} style={{ margin: "20px 0" }}>
                {isFetchingMore || isLoading ? (
                  <ContentLoader
                    speed={1.4}
                    width={270}
                    height={200}
                    viewBox="0 0 270 200"
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                  >
                    <rect x="0" y="0" rx="3" ry="3" width="270" height="200" />
                  </ContentLoader>
                ) : null}
              </div>
            ))}
          </div>
        }
        style={{ overflowX: "hidden" }}
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
        </div>

        {allPostsCharged && (
        <div className="text-center p-5">
          <h1>{t('postslist.noMorePosts')}</h1>
        </div>
      )}

      {!hasMorePosts && !isLoading && !isFetchingMore && !allPostsCharged && posts.length > 0 && (
        <div className="text-center p-5 animate__fadeIn animate__animated">
          <h1>{t('postslist.noMorePosts')}</h1>
        </div>
      )}
      </InfiniteScroll>
    </div>
  );
};

export default PostsList;