'use client'
import React, { useState, useEffect } from 'react';
import HomePostCard from "@/components/home/HomePostCard";
import { Container} from '@mantine/core';
import endpoints from "./connections/enpoints/endpoints";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  reports: { _id: string }[];
  createdAt: string;
  photo: string;
  totalPosts: number;
  totalOffers: number;
}

interface Post {
  _id: string;
  title: string;
  description: string;
  createdBy: User;
  latitude: number;
  longitude: number;
  mainCategory: string;
  subCategory: string;
  thirdCategory: string;
  price: number;
  photos: string[];
  reports: any[];
  createdAt: string;
  __v: number;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch(endpoints.posts)
      .then(response => response.json())
      .then(data => setPosts(data.posts))
      .catch(error => console.error("Error fetching posts:", error));
  }, []);

  return (
    <Container>
      {posts.map(post => (
        <HomePostCard key={post._id} post={post} />
      ))}
    </Container>
  );
}