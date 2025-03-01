import { StyleSheet } from 'react-native';
import * as React from 'react';
import { ThemedView } from '@/components/ThemedView';

import { useAppContext } from '../context';

import { Text } from 'react-native';

export default function HelpScreen() {
  const {       
    location, setLocation, 
    closestPhone, setClosestPhone, 
    closestPhoneDistance, setClosestPhoneDistance, 
    errorMsg, setErrorMsg,
    getCurrentLocation, telstraData,
    findClosestPhone
  } = useAppContext();


  const defaultLocation = {
    coords: {
    latitude: -37.8136,
    longitude: 144.9631,
    accuracy: 0,
    altitude: 0,
    altitudeAccuracy: 0,
    heading: 0,
    speed: 0
    },
    timestamp: Date.now()
  };

  const loc = location || defaultLocation;
  

  return (
    <ThemedView style={styles.container}>
        <Text style={styles.text}>Help</Text>
        <Text style={styles.text}>1. The home screen describes the closest phone to the blue marker, and you can refresh its position using GPS</Text>
        <Text style={styles.text}>2. Click on a selected marker to call</Text>
        <Text style={styles.text}>2. Drag your blue marker to change the centre of the visible markers</Text>
        <Text style={styles.text}>3. Type in the white box to change the number of visible markers</Text>
        <Text style={styles.text}>4. There is a maximum of ~15000 markers</Text>
    </ThemedView>
  );
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    image: {
      width: 200,
      height: 200,
      borderRadius: 100,
      marginTop: 50,
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 20,
    },
    bigCircleButton: {
      width: 200,
      height: 200,
      borderRadius: 100,
      marginTop: 50,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    },
    smallCircleButton: {
      width: 200,
      height: 50,
      borderRadius: 20,
      marginTop: 20,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      textAlign: 'center',
    },
  });
  