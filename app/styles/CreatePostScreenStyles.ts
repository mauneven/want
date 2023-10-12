import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const extendColors = () => {
    const { colors } = useTheme();
    return {
      background: colors.background,
      text: colors.text,
      border: colors.border,
      buttonText: colors.text,
      buttonBackground: colors.primary
    };
  };

export const dynamicStyles = () => {
    const colors = extendColors();
    return StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: width * 0.03, 
        justifyContent: 'center',
      },
    inputField: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        padding: width * 0.02, 
        margin: height * 0.01, 
        color: colors.text,
        width: width * 0.9, 
      },
    buttonText: {
        fontSize: width * 0.05,
        color: colors.buttonText,
        backgroundColor: colors.buttonBackground,
        padding: width * 0.02,
        margin: height * 0.005,
        textAlign: 'center',
        borderRadius: 10,
    },
    titleText: {
        fontSize: width * 0.1,
        color: colors.text,
        textAlign: 'center',
        marginBottom: height * 0.02,
    },
    label: {
        fontSize: width * 0.035,
        color: colors.text,
        textAlign: 'left',
        marginLeft: width * 0.04,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: height * 0.01,
        borderColor: colors.background,
        borderBottomWidth: 2,
        backgroundColor: colors.background,
    },
    userImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    userInfo: {
        alignItems: 'flex-end',
    },
    userName: {
        fontSize: 18,
        marginBottom: 8,
        color: colors.text
    },
    editButton: {
        padding: 8,
        backgroundColor: colors.background,
        borderRadius: 10,
        borderColor: colors.border,
        borderWidth: 1,
        marginBottom: 8,
    },
    logoutButton: {
        padding: 8,
        backgroundColor: colors.background,
        borderRadius: 10,
        borderColor: colors.border,
        borderWidth: 1,
    },
    postContainer: {
        margin: 10,
        backgroundColor: colors.background,
        borderRadius: 10,
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2.84,
        elevation: 5, 
    },
    postImage: {
        width: width - 20,
        height: 200,
        resizeMode: 'cover',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    postTitle: {
        fontSize: 16,
        marginBottom: 8,
        color: colors.text,
    },
    postPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text
    },
    deleteText: {
        fontSize: 16,
        color: colors.text,
        textAlign: 'center',
        padding: width * 0.02,
        margin: height * 0.005,
        borderRadius: 10,
        borderColor: colors.border,
        borderWidth: 1,
    },
    postInformation: {
        padding: height * 0.02
    },
    modalContent: {
        backgroundColor: colors.background,
        padding: height * 0.02,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: colors.border,
        borderWidth: 1,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedPhotoContainer: {
        margin: 5,
        borderRadius: 10,
        overflow: 'hidden',
    },
    selectedPhoto: {
        width: 100,
        height: 100,
    },
    deletePhotoButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 5,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
    },
    deletePhotoText: {
        color: colors.text,
    }
})};