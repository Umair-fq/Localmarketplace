import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, Text, StyleSheet, Alert } from 'react-native';
import { UserContext } from '../../Context/UserContext';
import AdComponent from '../../components/AdComponent/AdComponent';
import Navbar from '../../components/Navbar/Navbar';
import TagsFilter from '../../components/TagsFilter/TagsFilter'; // Ensure this is imported correctly
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';

const MyFavoriteAds = ({ navigation }) => {
    const { userFavorites } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredAds, setFilteredAds] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        if (selectedTags.length === 0) {
            setFilteredAds(userFavorites); // If no tags are selected, show all favorites
        } else {
            const filtered = userFavorites.filter(ad =>
                ad.tags && selectedTags.some(tag => ad.tags.includes(tag))
            );
            setFilteredAds(filtered);
        }
        setIsLoading(false);
    }, [userFavorites, selectedTags]);

    const handleTagToggle = (tag) => {
        setSelectedTags(prevTags =>
            prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
        );
    };

    return (
        <>
            <Navbar />
            <TagsFilter
                availableTags={["Indoor", "Outdoor", "Floral", "Medicinal", "Exotic"]} // Example tags
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
            />
            <ScrollView style={styles.container}>
                {isLoading ? (
                    <LoadingIndicator />
                ) : (
                    filteredAds.length > 0 ? (
                        filteredAds.map(ad => <AdComponent key={ad._id} ad={ad} navigation={navigation} />)
                    ) : (
                        <Text>No ads found related to your filters.</Text>
                    )
                )}
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f9f9f9'
    }
});

export default MyFavoriteAds;
