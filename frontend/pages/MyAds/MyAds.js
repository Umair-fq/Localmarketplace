import React, { useState, useEffect } from 'react';
import { ScrollView, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AdComponent from '../../components/AdComponent/AdComponent';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TagsFilter from '../../components/TagsFilter/TagsFilter';  // Ensure the path is correct
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator'; // Import LoadingIndicator component

const MyAds = ({ navigation }) => {
  const [ads, setAds] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Change loading state to isLoading
  const isFocused = useIsFocused();

  const handleTagToggle = (tag) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
    );
  };

  useEffect(() => {
    const fetchMyAds = async () => {
      setIsLoading(true); // Set isLoading to true when fetching ads
      try {
        const token = await AsyncStorage.getItem('userToken');
        const queryParams = selectedTags.length ? `?tags=${selectedTags.join(',')}` : '';
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        const response = await axios.get(`http://192.168.100.60:8080/api/product/myads${queryParams}`, config);
        setAds(response.data);
      } catch (error) {
        console.error('Failed to fetch my ads:', error);
        Alert.alert('Error', error.response?.data?.message || 'Failed to fetch ads');
      } finally {
        setIsLoading(false); // Set isLoading to false after fetching ads (whether successful or not)
      }
    };

    if (isFocused) {
      fetchMyAds();
    }
  }, [isFocused, selectedTags]);

  return (
    <ScrollView style={styles.container}>
      <TagsFilter availableTags={["Indoor", "Outdoor", "Floral", "Medicinal", "Exotic"]} selectedTags={selectedTags} onTagToggle={handleTagToggle} />
      {isLoading ? (
        <LoadingIndicator /> // Display LoadingIndicator if isLoading is true
      ) : (
        ads.length > 0 ? (
          ads.map(ad => <AdComponent key={ad._id} ad={ad} navigation={navigation} />)
        ) : (
          <Text>No ads found.</Text>
        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9'
  }
});

export default MyAds;
