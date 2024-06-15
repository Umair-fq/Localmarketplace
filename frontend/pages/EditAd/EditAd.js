import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Image, Button, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSquare, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const EditingAd = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { adId } = route.params;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [images, setImages] = useState([null, null, null]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdDetails = async () => {
            try {
                const response = await axios.get(`http://192.168.100.60:8080/api/product/details/${adId}`);
                const { name, description, price, location, images: fetchedImages } = response.data;
                setName(name);
                setDescription(description);
                setPrice(price.toString());
                setLocation(location);
                setImages([...fetchedImages, ...Array(3).fill(null)].slice(0, 3));
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch ad details:', error);
                Alert.alert('Error', 'Failed to fetch ad details');
                setLoading(false);
            }
        };

        fetchAdDetails();
    }, [adId]);

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

        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/YOUR CLOUD NAME/image/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setImages(prev => prev.map((img, idx) => idx === index ? response.data.secure_url : img));
        } catch (error) {
            console.error('Failed to upload image:', error);
            Alert.alert('Upload Error', `Failed to upload image: ${error.message}`);
        }
    };

    const handleRemoveImage = (index) => {
        setImages(prev => prev.map((img, idx) => idx === index ? null : img));
    };

const handleSave = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const filteredImages = images.filter(Boolean); // Remove any null entries
    const data = {
        name,
        description,
        price: parseFloat(price),
        location,
        images: filteredImages,
    };

    try {
        await axios.put(`http://192.168.100.60:8080/api/product/update/${adId}`, data, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        Alert.alert('Success', 'Ad updated successfully');
        navigation.navigate('Home');
    } catch (error) {
        console.error('Error updating product:', error);
        Alert.alert('Error', `Failed to update product: ${error.message}`);
    }
};


    const handleCancel = () => {
        navigation.goBack();
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <ScrollView style={styles.container}>
            <TextInput style={styles.input} placeholder="Product Name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} multiline />
            <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
            {images.map((img, index) => (
                <View key={index} style={styles.imagePlaceholder}>
                    {img ? (
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
            <Button title="Save Changes" onPress={handleSave} />
            <Button title="Cancel" onPress={handleCancel} color="red" />
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
});

export default EditingAd;
