import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface ThemeColors {
    background: string;
    text: string;
    border: string;
}

interface ButtonColors {
    buttonText: string;
    buttonBackground: string;
}

export type UniversalThemeColors = ThemeColors & ButtonColors;

export const UniversalStyles = (colors: UniversalThemeColors) => StyleSheet.create({
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
});