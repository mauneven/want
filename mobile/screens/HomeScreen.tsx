import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, ListRenderItemInfo } from 'react-native';
import axios from 'axios';
import { useTheme } from '@react-navigation/native';
import PostCard from '../components/posts/PostCard';

interface Post {
  _id: string;
  price: number;
  title: string;
  description: string;
  photos: string[];
}

const HomeScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { colors } = useTheme(); // Utiliza los colores del tema actual

  const fetchPosts = useCallback(async () => {
    if (!hasMore) return;

    try {
      setLoading(true);
      const response = await axios.get(`https://want.com.co/api/posts?page=${page}`);
      
      if (response.data.posts.length > 0) {
        setPosts([...posts, ...response.data.posts]);
      } else {
        setHasMore(false);
      }
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }, [page, posts, hasMore]);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const renderPost = ({ item }: ListRenderItemInfo<Post>) => {
    return <PostCard post={item} />;  // Utiliza el nuevo componente
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(page + 1);
    }
  };

  return (
    <View style={{ backgroundColor: colors.background }}>
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