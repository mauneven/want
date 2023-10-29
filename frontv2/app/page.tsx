"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import HomePostCard from "@/components/home/HomePostCard";
import AppWithGoogleMap from "../components/maps/mapComponent";
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

interface PostResponse {
  totalPosts: number;
  posts: Post[];
  nextPage: number | null;
}

const fetchPosts = async (
  page: number = 1,
  longitude: number | null,
  latitude: number | null,
  radius: number | null
): Promise<PostResponse> => {
  let query = `?page=${page}`;
  if (longitude !== null) query += `&longitude=${longitude}`;
  if (latitude !== null) query += `&latitude=${latitude}`;
  if (radius !== null) query += `&radius=${radius}`;

  const response = await fetch(`${endpoints.posts}${query}`);
  if (!response.ok) {
    throw new Error("Error fetching posts");
  }
  return response.json();
};

export default function Home() {
  const [longitude, setLongitude] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [radius, setRadius] = useState<number | null>(null);
  
  const isFetching = useRef(false);

  const handleLocationSelect = (
    lat: number,
    lng: number,
    defaultRadius: number
  ) => {
    setLatitude(lat);
    setLongitude(lng);
    setRadius(defaultRadius);
  };

  const {
    data,
    error,
    fetchNextPage,
    isLoading,
    hasNextPage,
  } = useInfiniteQuery<PostResponse, Error>(
    ["posts", longitude, latitude, radius],
    ({ pageParam = 1 }) => fetchPosts(pageParam, longitude, latitude, radius),
    {
      getNextPageParam: (lastPage, allPages) => {
        const totalPagesLoaded = allPages.reduce((acc, page) => acc + page.posts.length, 0);
        if (totalPagesLoaded < lastPage.totalPosts) {
          return allPages.length + 1;
        }
        return null;
      },
      keepPreviousData: true, // mantiene la data anterior mientras se cargan nuevas páginas
      refetchOnWindowFocus: false, // no vuelve a buscar datos cuando la ventana recupera el foco
      refetchOnReconnect: false, // no vuelve a buscar datos cuando se recupera la conexión
      staleTime: 5 * 60 * 1000, // el tiempo (en ms) que los datos se consideran "frescos" y no se refetch de inmediato
    }
  );

  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;

    // Verificamos si ya se está cargando y si hay más páginas por cargar
    if (!isLoading && !isFetching.current && hasNextPage && windowHeight + scrollTop >= documentHeight - 200) {
      isFetching.current = true; // Marcamos que estamos cargando
      fetchNextPage().then(() => {
        isFetching.current = false; // Restablecemos después de cargar
      });
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, hasNextPage]);

  return (
    <>
      <AppWithGoogleMap onLocationSelect={handleLocationSelect} />
      <Container mt="10" fluid classNames={{ root: classes.container }}>
        {data?.pages.flatMap((page) =>
          page.posts.map((post) => <HomePostCard key={post._id} post={post} />)
        )}

        {isLoading ? (
          <p>Loading...</p>
        ) : !hasNextPage ? (
          <p>There&apos;s no more posts to load</p>
        ) : null}

        {error && <p>Error fetching posts: {error.message}</p>}
      </Container>
    </>
  );
}