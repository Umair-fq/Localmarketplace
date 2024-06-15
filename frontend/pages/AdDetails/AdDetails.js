import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Alert, TouchableOpacity, Linking, Dimensions } from 'react-native';
import axios from 'axios';
import Swiper from 'react-native-swiper';
import { UserContext } from '../../Context/UserContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';


const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  swiperContainer: {
    height: 250,
  },
  image: {
    width: width,
    height: '100%',
    resizeMode: 'cover',
  },
  detailSection: {
    padding: 20,
  },
  price: {
    fontSize: 22,
    color: '#1A8917',
    fontWeight: 'bold',
    marginTop: 5,
  },
  detailText: {
    fontSize: 16,
    marginTop: 5,
    color: '#666666',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    backgroundColor: '#EDEDED',
    padding: 8,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  sellerInfo: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  }
});

const AdDetails = ({ route }) => {
  const { adId } = route.params;
  const [adDetails, setAdDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.100.60:8080/api/product/details/${adId}`);
        setAdDetails(response.data);
        setIsLoading(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch ad details');
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [adId]);

  const handlePhonePress = () => {
    const url = `tel:${adDetails.seller.phoneNo}`;
    Linking.openURL(url);
  };


const handleDelete = async () => {
  const token = await AsyncStorage.getItem('userToken');
  Alert.alert('Confirm Delete', 'Are you sure you want to delete this ad?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Delete', onPress: async () => {
        try {
          await axios.delete(`http://192.168.100.60:8080/api/product/delete/${adId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          navigation.navigate('Home'); // This navigates back to the first screen in the stack, likely your home screen
        } catch (error) {
          Alert.alert('Error', 'Failed to delete the ad');
        }
      }
    }
  ]);
};


  return (
    <>
      {
        isLoading ? (
          <LoadingIndicator />
        ) : (<>
          <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{adDetails.name}</Text>
          </View>
          <Swiper style={styles.swiperContainer} showsButtons={false} autoplay={true}>
            {adDetails.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.image} />
            ))}
          </Swiper>
          <View style={styles.detailSection}>
            <Text style={styles.price}>Rs. {adDetails.price.toFixed(2)}</Text>
            <Text style={styles.detailText}>{adDetails.description}</Text>
            <Text style={styles.detailText}>Location: {adDetails.location}</Text>
            <Text style={styles.detailText}>Published: {new Date(adDetails.publishDate).toLocaleDateString()}</Text>
            <View style={styles.tagContainer}>
              {adDetails.tags.map((tag, index) => (
                <View key={index} style={styles.tag}><Text>{tag}</Text></View>
              ))}
            </View>
            {adDetails && user && adDetails.seller._id === user._id && (
              <>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditAd', { adId })}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleDelete}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          <View style={styles.sellerInfo}>
            <Text style={styles.detailText}>Seller: {adDetails.seller.username}</Text>
            <Text style={styles.detailText}>Email: {adDetails.seller.email}</Text>
            <TouchableOpacity onPress={handlePhonePress}>
              <Text style={styles.phone}>Contact Seller: {adDetails.seller.phoneNo}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

      </>)
      }
    </>
      );
};

export default AdDetails;


