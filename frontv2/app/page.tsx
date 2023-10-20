"use client";

import React, { useState, useEffect, useRef } from "react";
import HomePostCard from "@/components/home/HomePostCard";
import AppWithGoogleMap from "../components/maps/mapComponent";
import { Container, Text } from "@mantine/core";
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
  const [longitude, setLongitude] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [radius, setRadius] = useState<number | null>(null);
  const page = useRef(1);
  const loadingRef = useRef(false);

  const handleLocationSelect = (
    lat: number,
    lng: number,
    defaultRadius: number
) => {
    setLatitude(lat);
    setLongitude(lng);
    setRadius(defaultRadius);
    page.current = 1;
    setPosts([]);
    setNoMorePosts(false);
};

  useEffect(() => {
    loadPosts();
  }, []);

  // Agrega longitud, latitud y radio a la query de la petición
  const loadPosts = () => {
    if (loadingRef.current || noMorePosts) return;

    setLoading(true);
    loadingRef.current = true;

    // Agrega longitude, latitude y radius a la query de la petición
    const query = `?page=${page.current}&longitude=${longitude}&latitude=${latitude}&radius=${radius}`;

    fetch(`${endpoints.posts}${query}`)
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
        loadingRef.current = false;
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
        loadingRef.current = false;
      });
  };

  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;

    if (
      !loadingRef.current &&
      !noMorePosts &&
      windowHeight + scrollTop >= documentHeight - 200
    ) {
      loadPosts();
    }
  };

  useEffect(() => {
    if (latitude !== null && longitude !== null && radius !== null) {
        loadPosts();
        setPosts([]);
    }
}, [latitude, longitude, radius]);


  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [noMorePosts]);

  return (
    <>
      <AppWithGoogleMap onLocationSelect={handleLocationSelect} />
      <Container mt="10" fluid classNames={{ root: classes.container }}>
        {posts.map((post) => (
          <HomePostCard key={post._id} post={post} />
        ))}
        {noMorePosts && <p>There&apos;s no more posts to load</p>}
        {loading && <p>Loading...</p>}
      </Container>
    </>
  );
}