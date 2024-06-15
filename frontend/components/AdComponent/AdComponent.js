// // import React from 'react';
// // import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
// // import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// // import { faHeart } from '@fortawesome/free-solid-svg-icons';

// // const AdComponent = ({ ad }) => {
// //   return (
// //     <View style={styles.card}>
// //       <Image source={{ uri: ad.images[0] || 'default-image-url' }} style={styles.image} />
// //       <View style={styles.infoContainer}>
// //         <Text style={styles.title}>{ad.name}</Text>
// //         <Text style={styles.description} numberOfLines={2}>{ad.description}</Text>
// //         <View style={styles.bottomRow}>
// //           <Text style={styles.price}>${ad.price.toFixed(2)}</Text>
// //           <TouchableOpacity style={styles.favoriteButton}>
// //             <FontAwesomeIcon icon={faHeart} size={24} color="red" />
// //           </TouchableOpacity>
// //         </View>
// //       </View>
// //     </View>
// //   );
// // };

// import React from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { faHeart } from '@fortawesome/free-solid-svg-icons';
// import { useNavigation } from '@react-navigation/native'; // Import useNavigation

// const AdComponent = ({ ad }) => {
//   const navigation = useNavigation(); // Get the navigation prop using the hook

//   const openAdDetails = () => {
//     navigation.navigate('AdDetails', { adId: ad._id });
//   };

//   return (
//     <TouchableOpacity onPress={openAdDetails} style={styles.card}>
//       <Image source={{ uri: ad.images[0] || 'default-image-url' }} style={styles.image} />
//       <View style={styles.infoContainer}>
//         <Text style={styles.title}>{ad.name}</Text>
//         <Text style={styles.description} numberOfLines={2}>{ad.description}</Text>
//         <View style={styles.bottomRow}>
//           <Text style={styles.price}>${ad.price.toFixed(2)}</Text>
//           <TouchableOpacity style={styles.favoriteButton}>
//             <FontAwesomeIcon icon={faHeart} size={24} color="red" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.22,
//     shadowRadius: 2.22,
//     elevation: 3,
//     marginBottom: 10,
//     overflow: 'hidden',
//   },
//   image: {
//     width: 100,
//     height: 100,
//     backgroundColor: '#ccc'
//   },
//   infoContainer: {
//     flex: 1,
//     padding: 10,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   description: {
//     fontSize: 14,
//     color: '#666',
//     flex: 1,
//   },
//   bottomRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   price: {
//     fontSize: 16,
//     color: '#333',
//     fontWeight: 'bold',
//   },
//   favoriteButton: {
//     padding: 8,
//   },
// });

// export default AdComponent;



import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { useNavigation } from '@react-navigation/native';
import useFavorites from '../CustomHooks/useFavorites';

const AdComponent = ({ ad }) => {
  const navigation = useNavigation();
  const { toggleFavorite, isFavorite } = useFavorites();

  const openAdDetails = () => {
    navigation.navigate('AdDetails', { adId: ad._id });
  };

  return (
    <TouchableOpacity onPress={openAdDetails} style={styles.card}>
      <Image source={{ uri: ad.images[0] || 'default-image-url' }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{ad.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{ad.description}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.price}>Rs. {ad.price.toFixed(2)}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(ad)} style={styles.favoriteButton}>
            <FontAwesomeIcon icon={isFavorite(ad._id) ? fasHeart : farHeart} size={24} color={isFavorite(ad._id) ? "red" : "gray"} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginBottom: 10,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: '#ccc'
  },
  infoContainer: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  price: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  favoriteButton: {
    padding: 8,
  },
});

export default AdComponent;
