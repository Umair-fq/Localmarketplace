// Home.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Navbar from '../../components/Navbar/Navbar';
import AdsList from '../AdsList/AdsList';
import SearchBar from '../../components/SearchBar/SearchBar';

const LocalMarketPlace = () => {
  return (
    <View style={styles.container}>
        <Navbar />
        <SearchBar />
        <AdsList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1 // This ensures that the container takes up all available space
  }
});

export default LocalMarketPlace;
