import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, ListRenderItemInfo } from 'react-native';
import axios from 'axios';
import { useTheme } from '@react-navigation/native';
import PostCard from '../components/posts/PostCard';
import PostsLocation from '../components/locations/PostsLocation';

interface Post {
  _id: string;
  price: number;
  title: string;
  description: string;
  photos: string[];
}

interface LocationFilter {
  latitude: number;
  longitude: number;
  radius: number;
}

const HomeScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [locationFilter, setLocationFilter] = useState<LocationFilter | null>(null);
  const { colors } = useTheme();

  const fetchPosts = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const url = `https://want.com.co/api/posts?page=${page}`;
      const params = locationFilter ? {
        latitude: locationFilter.latitude,
        longitude: locationFilter.longitude,
        radius: locationFilter.radius,
      } : {};

      const response = await axios.get(url, { params });

      if (response.data.posts.length > 0) {
        setPosts(prevPosts => [...prevPosts, ...response.data.posts]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, locationFilter, hasMore, loading]);

  useEffect(() => {
    if (page === 1) {
      setPosts([]); // Clear existing posts if page is reset
    }
    fetchPosts();
  }, [page, locationFilter]);

  const handleLocationFilter = (newFilter: LocationFilter) => {
    setLocationFilter(newFilter);
    setPage(1);  // Reset pagination
    setHasMore(true); // Reset hasMore flag
  };

  const renderPost = ({ item }: ListRenderItemInfo<Post>) => {
    return <PostCard post={item} />;
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <View style={{ backgroundColor: colors.background }}>
      <PostsLocation onFilterChange={handleLocationFilter} />
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item._id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
};

export default HomeScreen;