import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userFavorites, setUserFavorites] = useState([]);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        setUserFavorites([]); // Clear favorites when user logs out
    };

    const fetchFavorites = async () => {
        const token = await AsyncStorage.getItem('userToken');
        axios.get(`http://192.168.100.60:8080/api/user/favAds`, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
        .then((res) => {
            setUserFavorites(res.data);
        })
        .catch(err => {
            if (err.response && err.response.status === 404) {
                console.warn('No favorites found or user not found');
                setUserFavorites([]); // Set userFavorites to an empty array if no favorites are found
            }
        });
    };
    

    useEffect(() => {
        if (user) {
            fetchFavorites();
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, login, logout, userFavorites, setUserFavorites }}>
            {children}
        </UserContext.Provider>
    );
};
