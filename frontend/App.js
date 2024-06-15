import React from 'react';
import { StyleSheet } from 'react-native';
import Routes from './Routes/Routes';
import { UserContextProvider } from './Context/UserContextProvider';

export default function App() {
  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
