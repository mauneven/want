"use client";

import React, { useEffect, useState } from "react";
import endpoints from "@/app/connections/enpoints/endpoints";
import PostInfo from "@/components/post/PostInfo";
import { useParams } from "next/navigation";

interface User {
  createdAt: Date;
  firstName: string;
  lastName: string;
  photo: string;
  totalPosts: number;
  reports: Array<any>;
}

interface Post {
  _id: string;
  title: string;
  description: string;
  createdBy: User;
  latitude: number;
  longitude: number;
  mainCategory: string;
  price: number;
  photos: string[];
}

export default function PostPage() {
  const params = useParams();
  const id = params.id;
  const [postData, setPostData] = useState<Post | null>(null);

  useEffect(() => {
    fetch(`${endpoints.getPost}/${id}`)
      .then((response) => response.json())
      .then((data) => setPostData(data))
      .catch((error) => console.error("Error fetching post data:", error));
  }, [id]);

  return (
    <div>{postData ? <PostInfo post={postData} /> : <p>Loading...</p>}</div>
  );
}
