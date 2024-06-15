import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSquare, faCheckSquare, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

const predefinedTags = ["Indoor", "Outdoor", "Floral", "Medicinal", "Exotic"];

const CreateAd = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([null, null, null]);
  const [loading, setLoading] = useState([false, false, false]);
  const [selectedTags, setSelectedTags] = useState([]);
  const navigation = useNavigation();


  const handleTagSelection = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const pickImage = async (index) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Permission to access camera roll is required to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });


    if (!result.cancelled && result.assets && result.assets[0].uri) {
      uploadImageToCloudinary(result.assets[0].uri, index);
    } else {
      Alert.alert('Image Upload', 'No image selected or image selection was cancelled.');
    }
  };

  const uploadImageToCloudinary = async (uri, index) => {
    if (!uri) {
      Alert.alert('Error', 'Image URI is missing.');
      return;
    }

    const formData = new FormData();
    const fileType = uri.split('.').pop();
    const fileName = uri.split('/').pop();

    formData.append('file', { uri, type: `image/${fileType}`, name: fileName });
    formData.append('upload_preset', 'PoshProse');
    formData.append('cloud_name', 'dn2yj1swv');

    setLoading(prev => {
      return prev.map((item, idx) => idx === index ? true : item);
    });

    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/your cloudinary cloud name/image/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImages(prev => {
        const updatedImages = prev.map((img, idx) => idx === index ? response.data.secure_url : img);
        return updatedImages;
      });
      setLoading(prev => prev.map((item, idx) => idx === index ? false : item));
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      setLoading(prev => prev.map((item, idx) => idx === index ? false : item));
      Alert.alert('Upload Error', `Failed to upload image: ${error.message}`);
    }
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.map((img, idx) => idx === index ? null : img));
  };

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const data = {
      name,
      description,
      price: parseFloat(price),
      location,
      tags: selectedTags,
      images: images.filter(img => img !== null),
    };


    try {
      const response = await axios.post('http://192.168.100.60:8080/api/product/create', data, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      Alert.alert('Success', 'Product created successfully!');
      navigation.navigate('Home')
    } catch (error) {
      console.error('Error creating product:', error);
      Alert.alert('Error', `Failed to create product: ${error.message}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput style={styles.input} placeholder="Product Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} multiline />
      <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
      {predefinedTags.map((tag, index) => (
        <TouchableOpacity key={index} style={styles.tagItem} onPress={() => handleTagSelection(tag)}>
          <FontAwesomeIcon icon={selectedTags.includes(tag) ? faCheckSquare : faSquare} size={22} />
          <Text style={styles.tagLabel}>{tag}</Text>
        </TouchableOpacity>
      ))}
      <View style={styles.imageContainer}>
        {images.map((img, index) => (
          <View key={index} style={styles.imagePlaceholder}>
            {loading[index] ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : img ? (
              <>
                <Image source={{ uri: img }} style={styles.image} />
                <TouchableOpacity style={styles.deleteIcon} onPress={() => handleRemoveImage(index)}>
                  <FontAwesomeIcon icon={faTrashAlt} size={22} />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={() => pickImage(index)}>
                <FontAwesomeIcon icon={faSquare} size={50} />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
      <Button title="Submit Ad" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    position: 'relative',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  deleteIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 1
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tagLabel: {
    marginLeft: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
});

export default CreateAd;
