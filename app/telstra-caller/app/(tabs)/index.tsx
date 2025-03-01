import { StyleSheet, Text } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { TouchableOpacity } from 'react-native';


import { useAppContext, callNearestTelstra } from '../context';

export default function HomeScreen() {
  const {       
    location, setLocation, 
    closestPhone, setClosestPhone, 
    closestPhoneDistance, setClosestPhoneDistance, 
    errorMsg, setErrorMsg,
    getCurrentLocation,
  } = useAppContext();

  return (
    <ThemedView style={styles.container}>
      
      <Text style={styles.text}>Home</Text>
      <Text style={styles.text}>{errorMsg}</Text>
      <Text style={styles.text}>Nearest payphone:</Text>
      <Text style={styles.text}>{location?.coords.latitude.toFixed(6)}, {location?.coords.longitude.toFixed(6)}</Text>
      <Text style={styles.text}>{closestPhone?.address}</Text>
      <Text style={styles.text}>Distance: {((closestPhoneDistance || 0) * 1000).toFixed(2)} m</Text>
      
      <TouchableOpacity
        onPress={() => {
          getCurrentLocation();
        }}
        style={styles.smallCircleButton}
      >
        <Text style={styles.buttonText}>Refresh GPS location</Text>
      </TouchableOpacity>
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
