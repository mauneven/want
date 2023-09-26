import React from 'react';
import { View, Image, Text, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { dynamicStyles } from '../../styles/ProfileScreenStyles';
import { BASE_URL } from '../../endpoints/api';
const { width } = Dimensions.get('window');

interface PostProps {
  post: {
    _id: string;
    title: string;
    price: number;
    photos: string[];
  };
  handleDeletePost: (postId: string) => void;
}

const MyPostsCard: React.FC<PostProps> = ({ post, handleDeletePost }) => {
  const { colors } = useTheme();
  const styles = dynamicStyles({
    background: colors.background,
    text: colors.text,
    border: colors.border,
    buttonText: colors.text,
    buttonBackground: colors.primary,
  });

  return (
    <View style={styles.postContainer}>
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
            style={styles.postImage}
          />
        ))}
      </ScrollView>
      <View style={styles.postInformation}>
      <Text style={styles.postTitle}>{post.title}</Text>
      <Text style={styles.postPrice}>${post.price.toLocaleString()}</Text>
      <TouchableOpacity onPress={() => Alert.alert("Eliminar", "¿Quieres eliminar este post?", [
        { text: "Cancelar" },
        { text: "Eliminar", onPress: () => handleDeletePost(post._id) }
      ])}>
        <Text style={styles.deleteText}>Eliminar</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

export default MyPostsCard;