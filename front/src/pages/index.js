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
  const [showOverlay, setShowOverlay] = useState(true);

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
    const overlayTimer = setTimeout(() => {
      window.scrollTo(0, scrollPosition);
      setShowOverlay(false);
    }, 220); // Timer de 220 ms (200 ms + 20 ms adicionales)

    return () => {
      clearTimeout(overlayTimer);
    };
  }, [scrollPosition]);

  return (
    <div>
      {showOverlay && <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "white", zIndex: 2 }}></div>}
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