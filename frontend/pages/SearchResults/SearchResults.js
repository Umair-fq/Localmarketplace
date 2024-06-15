import React, { useState, useEffect } from 'react';
import { ScrollView, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AdComponent from '../../components/AdComponent/AdComponent';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';

const SearchResults = ({ route }) => {
  const { query } = route.params;
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get(`http://192.168.100.60:8080/api/product/search?query=${encodeURIComponent(query)}`);
        setAds(response.data);
        setIsLoading(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch ads');
        setIsLoading(false);
      }
    };

    fetchAds();
  }, [query]);

  return (
    <ScrollView style={styles.container}>
      {isLoading ? (
        <LoadingIndicator />
      ) : ads.length ? (
        ads.map(ad => <AdComponent key={ad._id} ad={ad} />)
      ) : (
        <Text>No results found.</Text>
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

export default SearchResults;
