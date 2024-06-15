import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Navbar = () => {
    const navigation = useNavigation();

    const links = [
        { name: "MarketPlace", link: "LocalMarketPlace" },
        { name: "My Ads", link: "MyAds" },
        { name: "Favorites", link: "MyFavoriteAds" },
        { name: "Create Ad", link: "CreateAd" },
    ];

    return (
        <View style={styles.navbar}>
            <Image source={require('../../assets/logo.jpg')} style={styles.logo} />
            {links.map((link, index) => (
                <TouchableOpacity key={index} onPress={() => navigation.navigate(link.link)}>
                    <Text style={styles.link}>{link.name}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        padding: 10,
        backgroundColor: '#f8f8f8'
    },
    logo: {
        width: 50,
        height: 50,
    },
    link: {
        marginHorizontal: 10,
    },
});

export default Navbar;
