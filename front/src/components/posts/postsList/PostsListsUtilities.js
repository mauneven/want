import { useEffect } from "react";

const fetchPosts = async (resetPosts, {
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
}) => {

  if (!hasLocation) {
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
        subCategoryFilter = categoryFilter?.subcategory || "";
        thirdCategoryFilter = categoryFilter?.thirdCategory || "";
      } else {
        mainCategoryFilter = "";
        subCategoryFilter = "";
        thirdCategoryFilter = "";
      }
    } else {
      mainCategoryFilter = categoryFilter?.mainCategory || "";
      subCategoryFilter = categoryFilter?.subcategory || "";
      thirdCategoryFilter = categoryFilter?.thirdCategory || "";
    }

    const filterParams = new URLSearchParams({
      mainCategory: mainCategoryFilter,
      subcategory: subCategoryFilter,
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
    console.log(`details category: ${detailsCategory}`)

    if (resetPosts) {
      setPosts([]); // Eliminar los posts antiguos
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts?${filterParams}`
    );
    const { posts: postsData, totalPosts } = await response.json();

    setPosts((prevPosts) => {
      const updatedPosts = resetPosts
        ? postsData
        : [
            ...prevPosts,
            ...postsData.filter(
              (post) => !prevPosts.some((prevPost) => prevPost._id === post._id)
            ),
          ];
      localStorage.setItem("cachedPosts", JSON.stringify(updatedPosts));
      return updatedPosts;
    });

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

export default fetchPosts;