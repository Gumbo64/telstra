import { StyleSheet, Text } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';

import * as Location from 'expo-location';
import * as Linking from "expo-linking";


const telstraData = require('../../assets/telstra-data.json');

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1); 
  var a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
}

function phoneDistance(phoneObj: any, location: Location.LocationObject) {
  if (phoneObj.phone_attributes.split(',').includes("Incoming Calls")) {
    return getDistanceFromLatLonInKm(
      phoneObj.latitude,
      phoneObj.longitude,
      location.coords.latitude,
      location.coords.longitude
    );
  } else {
    return 99999999999999;
  }
}

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [closestPhone, setClosestPhone] = useState<any | null>(null);
  const [closestPhoneDistance, setClosestPhoneDistance] = useState<number | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function callNearestTelstra(closestPhone: any) {
    let number = closestPhone.fnn.split(':')[1];
    Linking.openURL(`tel:${number}`);
  }

  useEffect(() => {
    async function getCurrentLocation() {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Find the closest phone
      let cPhone = telstraData[0];
      let cDistance = phoneDistance(telstraData[0], location);
      
      for (const phoneObj of telstraData) {
        const distance = phoneDistance(phoneObj, location);
        if (distance < cDistance ) {
          cPhone = phoneObj;
          cDistance = distance;
        }
      }
      if (cPhone == null) {
        setErrorMsg('No phone found');
        return;
      }
      if (cDistance == null) {
        setErrorMsg('No distance found');
        return;
      }

      setClosestPhone(cPhone);
      setClosestPhoneDistance(cDistance);

    }

    getCurrentLocation();

  }, []);

  return (
    <ThemedView style={styles.container}>
      
      <Text style={styles.text}>Home</Text>
      <Text style={styles.text}>{errorMsg}</Text>
      <Text style={styles.text}>Location: {location?.coords.latitude}, {location?.coords.longitude}</Text>
      <Text style={styles.text}>Closest Phone: {closestPhone?.address}</Text>
      <Text style={styles.text}>Distance: {closestPhoneDistance} km</Text>
      

      <TouchableOpacity
        onPress={() => {
          if (location) {
            callNearestTelstra(closestPhone);
          }
        }}
        style={styles.bigCircleButton}
      >
        <Text style={styles.buttonText}>Call Telstra</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonText: {
    textAlign: 'center',
  },
});
