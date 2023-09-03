import React from 'react';
import { View, Text, Image, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { BASE_URL } from '../../endpoints/api';
interface PostCardProps {
  post: {
    _id: string;
    price: number;
    title: string;
    description: string;
    photos: string[];
  };
}

const { width } = Dimensions.get('window');

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      {post.photos && post.photos.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={width - 20}
          decelerationRate="fast"
        >
          {post.photos.map((photo) => (
            <Image
              key={photo}
              source={{ uri: `${BASE_URL}/${photo}` }}
              style={styles.photo}
            />
          ))}
        </ScrollView>
      ) : null}
      <View style={{ padding: 10 }}>
        <Text style={[styles.price, { color: colors.text }]} numberOfLines={1}>
          ${post.price}
        </Text>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {post.title}
        </Text>
        <Text style={{ color: colors.text }} numberOfLines={2}>
          {post.description}
        </Text>
      </View>
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
    borderTopRightRadius: 10,
  },
  price: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PostCard;