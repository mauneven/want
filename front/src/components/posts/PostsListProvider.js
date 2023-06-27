import React, { useState, useEffect, useContext } from "react";
import ContentLoader from "react-content-loader";
import { useRouter } from "next/router";
import UserModal from "../user/UserModal";
import PostsLocation from "../locations/Posts/";
import PostCategory from "../categories/PostCategory";

// Creamos un contexto para almacenar el estado del componente
const PostsListContext = React.createContext();

// Componente de contexto para envolver el componente PostsList y proporcionar el estado
const PostsListProvider = ({ children, searchTerm  }) => {
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
  const [userPreferencesLoaded, setUserPreferencesLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState({});

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
          mainCategoryCounts: mainCategoryPreferences,
          subCategoryCounts: subCategoryPreferences,
          thirdCategoryCounts: thirdCategoryPreferences,
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

  const fetchPosts = async () => {
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
  }, [
    searchTerm,
    categoryFilter,
    latitude,
    longitude,
    radius,
  ]);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setHasLocation(true);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    fetchPosts();
  }, [
    searchTerm,
    categoryFilter,
    currentPage,
    pageSize,
    hasLocation,
    latitude,
    longitude,
    radius,
    userPreferences,
    userPreferencesLoaded,
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

  return (
    <PostsListContext.Provider
      value={{
        posts,
        setPosts,
        isLoading,
        setIsLoading,
        pageSize,
        setPageSize,
        totalPosts,
        setTotalPosts,
        selectedUser,
        setSelectedUser,
        showModal,
        setShowModal,
        currentPage,
        setCurrentPage,
        hasMorePosts,
        setHasMorePosts,
        noMorePosts,
        setNoMorePosts,
        isFetching,
        setIsFetching,
        isFetchingMore,
        setIsFetchingMore,
        latitude,
        setLatitude,
        longitude,
        setLongitude,
        radius,
        setRadius,
        hasLocation,
        setHasLocation,
        userPreferences,
        setUserPreferences,
        userPreferencesLoaded,
        setUserPreferencesLoaded,
        user,
        setUser,
        categoryFilter,
        setCategoryFilter,
        handleLatitudeChange,
        handleLongitudeChange,
        handleRadiusChange,
        handleMainCategoryChange,
        handleSubcategoryChange,
        handleThirdCategoryChange,
        fetchPosts,
        Placeholder,
        openModal,
        closeModal,
      }}
    >
      {children}
    </PostsListContext.Provider>
  );
};

export default PostsListProvider;
