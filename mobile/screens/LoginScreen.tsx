import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Dimensions,
  Keyboard
} from "react-native";
import { useTheme } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../endpoints/api";
import { dynamicStyles, LoginThemeColors } from "../styles/LoginScreenStyles";
import DateInput from "../components/login/DateInput";

type User = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  birthday?: string;
  phone?: string;
};

const LoginScreen = ({ onUpdate }: { onUpdate: () => void }) => {
  const { colors } = useTheme();
  const isDarkTheme = colors.background === '#000';
  const extendedColors: LoginThemeColors = {
    ...colors,
    buttonText: isDarkTheme ? 'white' : 'black',
    buttonBackground: isDarkTheme ? 'blue' : 'lightblue',
  };
  const styles = dynamicStyles(extendedColors);
  const windowHeight = Dimensions.get('window').height;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [user, setUser] = useState<User>({ email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const handleBirthdayChange = (day: string) => {
    // Aquí puedes procesar el día si es necesario
    setUser({ ...user, birthday: day });
  };

  useEffect(() => {
    (async () => {
      const cookie = await AsyncStorage.getItem("cookie");
      if (cookie) {
        const res = await axios.get(`${API_BASE_URL}/user`, {
          headers: { Cookie: cookie },
        });
        if (res.data) {
          setIsLoggedIn(true);
        }
      }
    })();
  }, []);

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, user, {
        withCredentials: true,
      });
      const cookie = res.headers["set-cookie"]?.[0];
      if (cookie) {
        await AsyncStorage.setItem("cookie", cookie);
        setIsLoggedIn(true);
        onUpdate();
      }
    } catch (e) {
      console.error("Error al iniciar sesión:", e);
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post(`${API_BASE_URL}/register`, user);
      handleLogin();
      onUpdate();
    } catch (e) {
      console.error("Error al registrarse:", e);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/logout`,
        {},
        {
          headers: { Cookie: await AsyncStorage.getItem("cookie") },
        }
      );
      await AsyncStorage.removeItem("cookie");
      setIsLoggedIn(false);
      onUpdate();
    } catch (e) {
      console.error("Error al cerrar sesión:", e);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        scrollEnabled={isKeyboardVisible}
      >
        <View style={styles.container}>
          <Text style={styles.titleText}>
            {isRegisterMode ? "REGISTER" : "WELCOME"}
          </Text>
          {isLoggedIn ? (
            <>
              <Text style={{ fontSize: 60, color: extendedColors.text }}>
                Bienvenido
              </Text>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.buttonText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View>
              <TextInput
                style={styles.inputField}
                placeholder="Email"
                placeholderTextColor={extendedColors.text}
                value={user.email}
                onChangeText={(email) => setUser({ ...user, email })}
              />
              <TextInput
                style={styles.inputField}
                placeholder="Contraseña"
                placeholderTextColor={extendedColors.text}
                value={user.password}
                onChangeText={(password) => setUser({ ...user, password })}
                secureTextEntry
              />
              {isRegisterMode && (
                <>
                  <TextInput
                    style={styles.inputField}
                    placeholder="Nombre"
                    placeholderTextColor={extendedColors.text}
                    value={user.firstName}
                    onChangeText={(firstName) =>
                      setUser({ ...user, firstName })
                    }
                  />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Apellido"
                    placeholderTextColor={extendedColors.text}
                    value={user.lastName}
                    onChangeText={(lastName) => setUser({ ...user, lastName })}
                  />
                  <Text style={styles.label}>Fecha de nacimiento</Text>
                  <DateInput onDateChange={handleBirthdayChange} themeColors={extendedColors} />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Teléfono"
                    placeholderTextColor={extendedColors.text}
                    value={user.phone}
                    onChangeText={(phone) => setUser({ ...user, phone })}
                  />
                </>
              )}
              {isRegisterMode ? (
                <>
                  <TouchableOpacity onPress={handleRegister}>
                    <Text style={styles.buttonText}>Registrar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={toggleMode}>
                    <Text style={styles.buttonText}>
                      ¿Ya tienes cuenta? Inicia sesión
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity onPress={handleLogin}>
                    <Text style={styles.buttonText}>Iniciar sesión</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={toggleMode}>
                    <Text style={styles.buttonText}>
                      ¿No tienes cuenta? Regístrate
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
        {isKeyboardVisible && <View style={{ height: windowHeight * 0.2 }}></View>}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;