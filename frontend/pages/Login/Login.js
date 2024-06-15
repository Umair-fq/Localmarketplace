import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../Context/UserContext';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useContext(UserContext);


    const handleSubmit = () => {
        axios.post('http://192.168.100.60:8080/api/user/login', {
            email,
            password,
        }).then(response => {
            // Handle login success
            login(response.data.user);
            console.log('res on fe ', response.data.user)
            // Set item
            AsyncStorage.setItem('userToken', response.data.accessToken).catch(err => console.error('AsyncStorage Error:', err));
            // localStorage.setItem('userToken', response.data.accessToken);
            navigation.navigate('Home'); // Assuming you have a 'Home' screen
        }).catch(error => {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                console.log('Login Error:', error); // This will log the error object to your console
                setError('An unexpected error occurred. Please try again later.');
            }
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login to Your Account</Text>
            {error !== '' && <Text style={styles.error}>{error}</Text>}
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Text>{showPassword ? "Hide" : "Show"}</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
                <Text>Login</Text>
            </TouchableOpacity>
            <View style={styles.redirectSection}>
                <Text>Not Registered?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.link}>Create an account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    eyeButton: {
        marginLeft: 10,
    },
    loginButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    redirectSection: {
        flexDirection: 'row',
        marginTop: 20,
    },
    link: {
        marginLeft: 5,
        color: 'green',
    },
});

export default Login;
