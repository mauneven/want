import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import PostsList from "@/components/posts/PostsList";

const IndexPage = ({
  mainCategory,
  subCategory,
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

  const handleRouteChange = () => {
    localStorage.setItem("scrollPosition", window.pageYOffset.toString());
  };

  useEffect(() => {
    const storedScrollPosition = localStorage.getItem("scrollPosition");
    const yPosition = storedScrollPosition !== null ? parseInt(storedScrollPosition) : 0;
    setScrollPosition(yPosition);

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events]);

  const handleResetAll = useCallback(() => {
    setKey((prevKey) => prevKey + 1);
    onResetAll(false);
  }, [onResetAll]);

  useEffect(() => {
    if (resetAll) {
      handleResetAll();
    }
  }, [resetAll, handleResetAll]);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 100);
  }, [scrollPosition]);  

  return (
    <div>
      <PostsList
      key={key}
        searchTerm={searchTerm}
        onMainCategoryChange={onMainCategoryChange}
        onSubcategoryChange={onSubcategoryChange}
        onThirdCategoryChange={onThirdCategoryChange}
        mainCategory={mainCategory}
        subCategory={subCategory}
        thirdCategory={thirdCategory}
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