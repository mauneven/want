// index.js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PostsList from "@/components/posts/PostsList";

const IndexPage = ({
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

  return (
    <div>
      <div>
        <p>Main Category: {mainCategory}</p>
        <p>Subcategory: {subcategory}</p>
        <p>Third Category: {thirdCategory}</p>
        <p>Search Term: {searchTerm}</p>
        <p>Keep Categories: {keepCategories ? "true" : "false"}</p>
        <p>Reset All: {resetAll ? "true" : "false"}</p>
      </div>
      <PostsList
        searchTerm={searchTerm}
        onMainCategoryChange={onMainCategoryChange}
        onSubcategoryChange={onSubcategoryChange}
        onThirdCategoryChange={onThirdCategoryChange}
        onSearchTermChange={onSearchTermChange}
        onKeepCategoriesChange={onKeepCategoriesChange}
        keepCategories={keepCategories}
        onResetAll={onResetAll}
        resetAll={resetAll}
      />
    </div>
  );
};

export default IndexPage;
