import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    birthday?: string;
    phone?: string;
};

const LoginScreen = () => {
    const { colors } = useTheme();
    const [user, setUser] = useState<User>({ email: '', password: '' });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegisterMode, setIsRegisterMode] = useState(false);

    useEffect(() => {
        (async () => {
            const cookie = await AsyncStorage.getItem('cookie');
            if (cookie) {
                const res = await axios.get('https://want.com.co/api/user', {
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
            const res = await axios.post('https://want.com.co/api/login', user, {
                withCredentials: true,
            });
            const cookie = res.headers['set-cookie']?.[0];
            if (cookie) {
                await AsyncStorage.setItem('cookie', cookie);
                setIsLoggedIn(true);
            }
        } catch (e) {
            console.error('Error al iniciar sesión:', e);
        }
    };

    const handleRegister = async () => {
        try {
            await axios.post('https://want.com.co/api/register', user);
            handleLogin();
        } catch (e) {
            console.error('Error al registrarse:', e);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post("https://want.com.co/api/logout", {}, {
                headers: { Cookie: await AsyncStorage.getItem("cookie") },
            });
            await AsyncStorage.removeItem("cookie");
            setIsLoggedIn(false);
        } catch (e) {
            console.error("Error al cerrar sesión:", e);
        }
    };

    const toggleMode = () => {
        setIsRegisterMode(!isRegisterMode);
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            {isLoggedIn ? (
                <>
                    <Text style={{ fontSize: 60, color: colors.text }}>Bienvenido</Text>
                    <TouchableOpacity onPress={handleLogout}>
                        <Text style={styles.buttonText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <View>
                    <TextInput
                        placeholder="Email"
                        value={user.email}
                        onChangeText={(email) => setUser({ ...user, email })}
                    />
                    <TextInput
                        placeholder="Contraseña"
                        value={user.password}
                        onChangeText={(password) => setUser({ ...user, password })}
                        secureTextEntry
                    />
                    {isRegisterMode && (
                        <>
                            <TextInput
                                placeholder="Nombre"
                                onChangeText={(firstName) => setUser({ ...user, firstName })}
                            />
                            <TextInput
                                placeholder="Apellido"
                                onChangeText={(lastName) => setUser({ ...user, lastName })}
                            />
                            <TextInput
                                placeholder="Fecha de Nacimiento"
                                onChangeText={(birthday) => setUser({ ...user, birthday })}
                            />
                            <TextInput
                                placeholder="Teléfono"
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
                                <Text style={styles.buttonText}>¿Ya tienes cuenta? Inicia sesión</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity onPress={handleLogin}>
                                <Text style={styles.buttonText}>Iniciar sesión</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={toggleMode}>
                                <Text style={styles.buttonText}>¿No tienes cuenta? Regístrate</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    buttonText: {
        fontSize: 18,
        color: 'white',
        backgroundColor: 'blue',
        padding: 10,
        margin: 5,
        textAlign: 'center',
    },
});

export default LoginScreen;