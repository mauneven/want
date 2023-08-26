import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Image, ScrollView, Dimensions, StyleSheet, ListRenderItemInfo } from 'react-native';
import axios from 'axios';
import { useTheme } from '@react-navigation/native';

interface Post {
  _id: string;
  price: number;
  title: string;
  description: string;
  photos: string[];
  createdBy: {
    photo: string;
    firstName: string;
  };
}

const { width } = Dimensions.get('window');

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
    return (
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        {item.photos && item.photos.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            snapToInterval={width - 20} // Snap to each photo
            decelerationRate="fast" // Stop at each photo
          >
            {item.photos.map((photo: string) => (
              <Image
                key={photo}
                source={{ uri: `https://want.com.co/${photo}` }}
                style={styles.photo}
              />
            ))}
          </ScrollView>
        ) : null}
        <View style={{ padding: 10 }}>
          <Text style={[styles.price, { color: colors.text }]} numberOfLines={1}>
            ${item.price}
          </Text>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={{ color: colors.text }} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: `https://want.com.co/${item.createdBy.photo}` }}
              style={styles.userPhoto}
            />
            <Text style={{ marginLeft: 15, color: colors.text }}>
              {item.createdBy.firstName}
            </Text>
          </View>
        </View>
      </View>
    );
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

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.84,
    elevation: 5,
  },
  photo: {
    width: width - 20,
    height: 200,
    resizeMode: 'cover',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  userPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25
  }
});

export default HomeScreen;