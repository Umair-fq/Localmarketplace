import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../../Context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';


const useFavorites  = () => {
  const { userFavorites, setUserFavorites } = useContext(UserContext);

  const toggleFavorite = async (ad) => {
    const token = await AsyncStorage.getItem('userToken');
    const isCurrentlyFavorite = userFavorites.some(favorite => favorite._id === ad._id)
    const apiUrl = `http://192.168.100.60:8080/api/user/${isCurrentlyFavorite ? 'remFromFav' : 'addToFav'}/${ad._id}`
    // router.put('/addToFav/:adId', authenticateToken, addToFavorites)
    //updating the UI
    const updatedFavorites = isCurrentlyFavorite
      ? userFavorites.filter(favorite => favorite._id !== ad._id)
      : [...userFavorites, ad];
    
    setUserFavorites(updatedFavorites);

        try {
            await axios.put(apiUrl, {}, {
                headers: { 'Authorization': `Bearer ${token}` },
            })
        } catch (error) {
            setUserFavorites(userFavorites);
            return false;
        }
        // Optionally, return true to indicate success
        return true;
      }

    
      const isFavorite = (adId) => {
        return userFavorites.some(favorite => favorite._id === adId)
      }

      return { toggleFavorite, isFavorite, userFavorites}
}

export default useFavorites;
