"use client";

import React, { useState, useEffect, useRef } from "react";
import HomePostCard from "@/components/home/HomePostCard";
import { Container } from "@mantine/core";
import endpoints from "./connections/enpoints/endpoints";
import classes from "./globals.module.css";

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
  const [loading, setLoading] = useState(false);
  const [noMorePosts, setNoMorePosts] = useState(false);
  const page = useRef(1);
  const loadingRef = useRef(false); // Nuevo ref para manejar el estado de carga

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    if (loadingRef.current || noMorePosts) return;

    setLoading(true);
    loadingRef.current = true; // Actualizar el ref cuando inicie la carga

    fetch(`${endpoints.posts}?page=${page.current}`)
      .then((response) => response.json())
      .then((data) => {
        const newPosts = data.posts;

        if (newPosts.length === 0) {
          setNoMorePosts(true);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...newPosts]);
          page.current += 1;
        }

        setLoading(false);
        loadingRef.current = false; // Actualizar el ref cuando termine la carga
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
        loadingRef.current = false; // Asegurarse de actualizar el ref incluso si hay un error
      });
  };

  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;

    if (!loadingRef.current && !noMorePosts && windowHeight + scrollTop >= documentHeight - 200) {
      loadPosts();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [noMorePosts]);

  return (
    <Container fluid classNames={{ root: classes.container }}>
      {posts.map((post) => (
        <HomePostCard key={post._id} post={post} />
      ))}
      {noMorePosts && <p>There&apos;s no more posts to load</p>}
      {loading && <p>Loading...</p>}
    </Container>
  );
}