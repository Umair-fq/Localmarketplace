import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigation.navigate('SearchResults', { query: searchQuery.trim() });
            setSearchQuery(''); // Clear the search query
        }
    };

    return (
        <View style={styles.searchBar}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search Ads..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
            />
            <TouchableOpacity onPress={handleSearch} style={styles.searchIcon}>
                <FontAwesomeIcon icon={faSearch} size={24} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    searchBar: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        height: 40,
        margin: 10
    },
    searchInput: {
        flex: 1,
        marginRight: 10,
    },
    searchIcon: {
        padding: 10,
    },
});

export default SearchBar;
