import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, ListRenderItemInfo, Text } from 'react-native';
import axios from 'axios';
import { useTheme } from '@react-navigation/native';
import PostCard from '../components/posts/PostCard';
import PostsLocation from '../components/locations/PostsLocation';
import SearchPosts from '../components/search/SearchPosts';

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

interface SearchPosts {
  searchTerm: String;
}


const HomeScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [locationFilter, setLocationFilter] = useState<LocationFilter | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { colors } = useTheme();

  const fetchPosts = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const url = `https://want.com.co/api/posts?page=${page}`;
      const params = {
        ...locationFilter ? {
          latitude: locationFilter.latitude,
          longitude: locationFilter.longitude,
          radius: locationFilter.radius,
        } : {},
        searchTerm,
      };

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
  }, [page, locationFilter, searchTerm, hasMore, loading]);

  useEffect(() => {
    if (page === 1) {
      setPosts([]); // Clear existing posts if page is reset
    }
    fetchPosts();
  }, [page, locationFilter, searchTerm]);

  const handleLocationFilter = (newFilter: LocationFilter) => {
    setLocationFilter(newFilter);
    setPage(1);  // Reset pagination
    setHasMore(true); // Reset hasMore flag
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
    setHasMore(true);
  }

  const renderPost = ({ item }: ListRenderItemInfo<Post>) => {
    return <PostCard post={item} />;
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SearchPosts onSearch={handleSearch} />
      <PostsLocation onFilterChange={handleLocationFilter} />
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 60, color: colors.text }}>No hay posts por mostrar</Text>
          </View>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
};

export default HomeScreen;