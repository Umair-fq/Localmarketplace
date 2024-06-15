import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from '../pages/Login/Login';
import LocalMarketPlace from '../pages/LocalMarketPlace/LocalMarketPlace';
import CreateAd from '../pages/CreateAd/CreateAd';
import AdDetails from '../pages/AdDetails/AdDetails';
import EditAd from '../pages/EditAd/EditAd';
import MyAds from '../pages/MyAds/MyAds';
import SearchResults from '../pages/SearchResults/SearchResults';
import MyFavoriteAds from '../pages/MyFavoriteAds/MyFavoriteAds';

const Stack = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="LocalMarketPlace" component={LocalMarketPlace} />
        <Stack.Screen name="CreateAd" component={CreateAd} />
        <Stack.Screen name="AdDetails" component={AdDetails} />
        <Stack.Screen name="EditAd" component={EditAd} />
        <Stack.Screen name="MyAds" component={MyAds} />
        <Stack.Screen name="SearchResults" component={SearchResults} />
        <Stack.Screen name="MyFavoriteAds" component={MyFavoriteAds} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
