import React from "react";
import PostsList from "@/components/posts/PostsList";
import { useEffect } from "react";
import { useRouter } from "next/router";

const IndexPage = ({ locationFilter, searchTerm, categoryFilter, currentPage, setCurrentPage }) => {

  const router = useRouter();

  useEffect(() => {
    const checkPendingDeletionStatus = async () => {
      const deletionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/check-pending-deletion`, {
        credentials: 'include',
      });
  
      const deletionData = await deletionResponse.json();
      if (deletionData.pendingDeletion) {
        router.push('/deleteOn');
      }
    };
  
    checkPendingDeletionStatus();
  }, []);  

  return (
    <div className="">
      <PostsList
        locationFilter={locationFilter}
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default IndexPage;