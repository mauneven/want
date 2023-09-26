import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { dynamicStyles } from '../../styles/ProfileScreenStyles';
import { BASE_URL } from '../../endpoints/api';
import Modal from 'react-native-modal';

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
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const { colors } = useTheme();
    const styles = dynamicStyles({
        background: colors.background,
        text: colors.text,
        border: colors.border,
        buttonText: colors.text,
        buttonBackground: colors.primary,
    });

    return (
        <View style={[styles.postContainer, {backgroundColor: colors.card}]}>
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
                <TouchableOpacity onPress={toggleModal}>
                    <Text style={styles.deleteText}>Eliminar</Text>
                </TouchableOpacity>
                <Modal isVisible={isModalVisible}>
                    <View style={{ ...styles.modalContent, backgroundColor: colors.background }}>
                        <Text style={styles.postTitle}>¿Quieres eliminar este post?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={toggleModal}>
                                <Text style={styles.deleteText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                handleDeletePost(post._id);
                                toggleModal();
                            }}>
                                <Text style={styles.deleteText}>Eliminar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
};

export default MyPostsCard;