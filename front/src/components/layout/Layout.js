// components/Layout.js

import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <>
      <div className="">
        <link rel="stylesheet" href="/css/app.css" />
        <header className="sticky-top">
          <MegaMenu
            onLocationFilterChange={handleLocationFilterChange}
            onSearchTermChange={handleSearchTermChange}
            onCategoryFilterChange={handleCategoryFilterChange}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          <link rel="stylesheet" href="/css/navbar.css" />
        </header>

        <div className="want-container">
          <Suspense fallback="Loading...">
          <main>{children}</main>
            <Component
              {...pageProps}
              locationFilter={locationFilter}
              searchTerm={searchTerm}
              categoryFilter={categoryFilter}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </Suspense>
          <link rel="stylesheet" href="/css/posts.css" />
          <link rel="stylesheet" href="/css/modals.css" />
          <link rel="stylesheet" href="/css/login.css" />
          <link rel="stylesheet" href="/css/notifications.css" />
          <link rel="stylesheet" href="/css/postById.css" />
          <link rel="stylesheet" href="/css/receivedOffers.css" />
        </div>

        <footer>
          <div className="want-container">
          <Footer />
          <link rel="stylesheet" href="/css/footer.css" />
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;
