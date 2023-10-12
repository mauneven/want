import React from 'react';
import {
    View,
    TextInput,
    Image,
    Button,
    TouchableOpacity,
    Text,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

interface CreatePostInputsProps {
    title: string;
    setTitle: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    mainCategory: string;
    setMainCategory: (value: string) => void;
    subCategory: string;
    setSubCategory: (value: string) => void;
    thirdCategory: string;
    setThirdCategory: (value: string) => void;
    price: string;
    setPrice: (value: string) => void;
    photos: string[];
    setPhotos: (photos: string[]) => void;
    styles: any;
}

export const CreatePostInputs: React.FC<CreatePostInputsProps> = ({
    title,
    setTitle,
    description,
    setDescription,
    mainCategory,
    setMainCategory,
    subCategory,
    setSubCategory,
    thirdCategory,
    setThirdCategory,
    price,
    setPrice,
    photos,
    setPhotos,
    styles,
}) => {

    const pickImage = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                includeBase64: true,
                quality: 0.5,
                maxWidth: 400,
                maxHeight: 400,
            },
            (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.errorMessage) {
                    console.log('ImagePicker Error: ', response.errorMessage);
                } else if (response.errorMessage) {
                    console.log('ImagePicker Error Message: ', response.errorMessage);
                } else {
                    const source = response.assets && response.assets[0] && response.assets[0].uri;
                    if (source) {
                        setPhotos([...photos, source]);
                    }
                }
            }
        );
    };

    const handleTitleChange = (value: string) => {
        setTitle(value.slice(0, 60));
    };

    const handleDescriptionChange = (value: string) => {
        setDescription(value.slice(0, 600));
    };

    const handlePriceChange = (value: string) => {
        setPrice(value.slice(0, 11));
    };

    const handleDeletePhoto = (index: number) => {
        const newPhotos = [...photos];
        newPhotos.splice(index, 1);
        setPhotos(newPhotos);
    };

    return (
        <View >
            <Text style={styles.titleText}>Create Post</Text>
            <TextInput
                style={styles.inputField}
                placeholder="Título"
                value={title}
                onChangeText={handleTitleChange}
            />
            <TextInput
                style={styles.inputField}
                placeholder="Descripción"
                value={description}
                onChangeText={handleDescriptionChange}
                multiline={true}
            />
            <TextInput
                style={styles.inputField}
                placeholder="Categoría Principal"
                value={mainCategory}
                onChangeText={setMainCategory}
            />
            <TextInput
                style={styles.inputField}
                placeholder="Subcategoría"
                value={subCategory}
                onChangeText={setSubCategory}
            />
            <TextInput
                style={styles.inputField}
                placeholder="Tercera Categoría"
                value={thirdCategory}
                onChangeText={setThirdCategory}
            />
            <TextInput
                style={styles.inputField}
                placeholder="Precio"
                value={price}
                onChangeText={handlePriceChange}
                keyboardType="number-pad"
            />
            {photos.length < 4 && (
                <Button title="Seleccionar Foto" onPress={pickImage} />
            )}
            {photos.map((photo, index) => (
                <View style={styles.postContainer} key={index}>
                    <Image source={{ uri: photo }} style={styles.postImage} />
                    <TouchableOpacity onPress={() => handleDeletePhoto(index)}>
                        <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};