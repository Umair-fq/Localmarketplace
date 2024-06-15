// import React, { useState, useEffect } from 'react';
// import { ScrollView, Text, StyleSheet, Alert } from 'react-native';
// import axios from 'axios';
// import AdComponent from '../../components/AdComponent/AdComponent';
// import TagsFilter from '../../components/TagsFilter/TagsFilter';
// import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator'; // Import LoadingIndicator component

// const AdsList = ({ navigation }) => {
//   const [ads, setAds] = useState([]);
//   const [selectedTags, setSelectedTags] = useState([]);
//   const [isLoading, setIsLoading] = useState(true); // Add isLoading state

//   const handleTagToggle = (tag) => {
//     setSelectedTags(prevTags =>
//       prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
//     );
//   };

//   useEffect(() => {
//     const fetchAds = async () => {
//       setIsLoading(true); // Set isLoading to true when fetching ads
//       try {
//         const queryParams = new URLSearchParams(selectedTags.length ? { tags: selectedTags.join(',') } : {});
//         const response = await axios.get(`http://192.168.100.60:8080/api/product/allads?${queryParams}`);
//         setAds(response.data.products);
//       } catch (error) {
//         const errorMessage = error.response?.data?.message || 'Failed to fetch ads';
//         Alert.alert('Error', errorMessage);
//       } finally {
//         setIsLoading(false); // Set isLoading to false after fetching ads (whether successful or not)
//       }
//     };

//     fetchAds();
//   }, [selectedTags]);

//   return (
//     <ScrollView style={styles.container}>
//       <TagsFilter availableTags={["Indoor", "Outdoor", "Floral", "Medicinal", "Exotic"]} selectedTags={selectedTags} onTagToggle={handleTagToggle} />
//       {isLoading ? ( // Display LoadingIndicator if isLoading is true
//         <LoadingIndicator />
//       ) : (
//         ads.length > 0 ? ads.map(ad => <AdComponent key={ad._id} ad={ad} navigation={navigation} />) : <Text>No ads to display</Text>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//   }
// });

// export default AdsList;



import React, { useState, useEffect } from 'react';
import { ScrollView, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AdComponent from '../../components/AdComponent/AdComponent';
import TagsFilter from '../../components/TagsFilter/TagsFilter';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused

const AdsList = ({ navigation }) => {
  const [ads, setAds] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused(); // Get the current focus state of the screen

  const handleTagToggle = (tag) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
    );
  };

  useEffect(() => {
    const fetchAds = async () => {
      if (isFocused) { // Check if the screen is focused
        setIsLoading(true);
        try {
          const queryParams = new URLSearchParams(selectedTags.length ? { tags: selectedTags.join(',') } : {});
          const response = await axios.get(`http://192.168.100.60:8080/api/product/allads?${queryParams}`);
          setAds(response.data.products);
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Failed to fetch ads';
          Alert.alert('Error', errorMessage);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAds();
  }, [selectedTags, isFocused]); // Add isFocused to dependency array to re-fetch when navigated back

  return (
    <ScrollView style={styles.container}>
      <TagsFilter availableTags={["Indoor", "Outdoor", "Floral", "Medicinal", "Exotic"]} selectedTags={selectedTags} onTagToggle={handleTagToggle} />
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        ads.length > 0 ? ads.map(ad => <AdComponent key={ad._id} ad={ad} navigation={navigation} />) : <Text>No ads to display</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  }
});

export default AdsList;
