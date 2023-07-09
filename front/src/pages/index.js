import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import PostsList from "@/components/posts/PostsList";

const IndexPage = ({
  detailsCategory,
  detailsSubcategory,
  detailsThirdCategory,
  onDetailsCategoryChange,
  onDetailsSubcategoryChange,
  onDetailsThirdCategoryChange,
  mainCategory,
  subcategory,
  thirdCategory,
  onMainCategoryChange,
  onSubcategoryChange,
  onThirdCategoryChange,
  searchTerm,
  onSearchTermChange,
  keepCategories,
  onKeepCategoriesChange,
  resetAll,
  onResetAll,
}) => {
  const router = useRouter();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const handleRouteChange = () => {
      sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    };

    const handlePopState = () => {
      const savedScrollPosition = parseInt(
        sessionStorage.getItem("scrollPosition"),
        10
      );
      if (!isNaN(savedScrollPosition)) {
        setScrollPosition(savedScrollPosition);
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    window.addEventListener("popstate", handlePopState);

    const savedScrollPosition = parseInt(
      sessionStorage.getItem("scrollPosition"),
      10
    );
    if (!isNaN(savedScrollPosition)) {
      setScrollPosition(savedScrollPosition);
    }

    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, scrollPosition);

    setTimeout(() => {
      document.documentElement.style.scrollBehavior = "smooth";
    }, 50);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router.events]);

  useEffect(() => {
    window.scrollTo(0, scrollPosition);
  }, [scrollPosition]);

  const handleResetAll = useCallback(() => {
    setKey((prevKey) => prevKey + 1);
    onResetAll(false);
  }, [onResetAll]);

  useEffect(() => {
    if (resetAll) {
      handleResetAll();
    }
  }, [resetAll, handleResetAll]);

  return (
    <div>
      <PostsList
        key={key}
        searchTerm={searchTerm}
        detailsCategory={detailsCategory}
        detailsSubcategory={detailsSubcategory}
        detailsThirdCategory={detailsThirdCategory}
        onDetailsCategoryChange={onDetailsCategoryChange}
        onDetailsSubcategoryChange={onDetailsSubcategoryChange}
        onDetailsThirdCategoryChange={onDetailsThirdCategoryChange}
        onMainCategoryChange={onMainCategoryChange}
        onSubcategoryChange={onSubcategoryChange}
        onThirdCategoryChange={onThirdCategoryChange}
        onSearchTermChange={onSearchTermChange}
        onKeepCategoriesChange={onKeepCategoriesChange}
        keepCategories={keepCategories}
        onResetAll={handleResetAll}
        resetAll={resetAll}
      />
    </div>
  );
};

export default IndexPage;