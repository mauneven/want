import { StyleSheet } from 'react-native';

interface ThemeColors {
  background: string;
  text: string;
  border: string;
}

interface ButtonColors {
  buttonText: string;
  buttonBackground: string;
}

export type LoginThemeColors = ThemeColors & ButtonColors;

export const dynamicStyles = (colors: LoginThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'center'
  },
  inputField: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 10,
    margin: 10,
    color: colors.text,
    width: 335
  },
  buttonText: {
    fontSize: 18,
    color: colors.buttonText,
    backgroundColor: colors.buttonBackground,
    padding: 10,
    margin: 5,
    textAlign: 'center',
    borderRadius: 10,
  },
  titleText: {
    fontSize: 36,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
});
