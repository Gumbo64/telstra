import { StyleSheet } from 'react-native';
import * as React from 'react';

import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; 
import { UrlTile } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { Polyline } from 'react-native-maps';
import { useAppContext, phoneDistance, callNearestTelstra } from '../context';
import { TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function MapScreen() {
  const {       
    location, setLocation, 
    closestPhone, setClosestPhone, 
    closestPhoneDistance, setClosestPhoneDistance, 
    errorMsg, setErrorMsg,
    getCurrentLocation, telstraData,
    findClosestPhone
  } = useAppContext();

  const [closestPhonesAmount, setClosestPhonesAmount] = useState(50);

  const defaultLocation = {
    coords: {
      latitude: -33.86785,
      longitude: 151.20732,
      accuracy: 0,
      altitude: 0,
      altitudeAccuracy: 0,
      heading: 0,
      speed: 0
    },
    timestamp: Date.now()
  };

  let loc = location;
  if (!loc) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.containerSpareSpace}>
          <ThemedText>Please wait for your location to be retrieved</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }
  let markers = telstraData.sort((a: any, b: any) => phoneDistance(a, loc) - phoneDistance(b, loc));
  markers = markers.slice(0, closestPhonesAmount);

  const markersSelections: { [key: string]: boolean } = {};

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.containerSpareSpace}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: location?.coords.latitude || defaultLocation.coords.latitude,
            longitude: location?.coords.longitude || defaultLocation.coords.latitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          <UrlTile
            /**
             * The url template of the tile server. The patterns {x} {y} {z} will be replaced at runtime
             * For example, 
             */
            urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
            /**
             * The maximum zoom level for this tile overlay. Corresponds to the maximumZ setting in
             * MKTileOverlay. iOS only.
             */
            maximumZ={19}
            /**
             * flipY allows tiles with inverted y coordinates (origin at bottom left of map)
             * to be used. Its default value is false.
             */
            flipY={false}
          />
          {markers.map((marker: any, index: any) => (
            <Marker
              key={index}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              title={marker.address}
              description={marker.fnn}
              onPress={
                () => {
                  if (markersSelections[index]) {
                    callNearestTelstra(marker);
                  }
                }
              }
              onSelect={
                () => {
                  markersSelections[index] = true;
                }
              }
              onDeselect={
                () => {
                  markersSelections[index] = false;
                }
              }
            /> 
          ))}
          <Marker
            coordinate={{ latitude: loc.coords.latitude, longitude: loc.coords.longitude }}
            title={"You are here"}
            description={"Your current location"}
            pinColor='blue'
            style={{ zIndex: 1, transform: [{ scale: 2 }] }}
            draggable
            onDragEnd={(e) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              const newLocation = {
                coords: {
                  latitude: latitude,
                  longitude: longitude,
                  accuracy: 0,
                  altitude: 0,
                  altitudeAccuracy: 0,
                  heading: 0,
                  speed: 0
                },
                timestamp: Date.now()
              };
              setLocation(newLocation);
              findClosestPhone(newLocation);
            }}
          />
          {closestPhone && (
            <Polyline
              coordinates={[
                { latitude: location?.coords.latitude || defaultLocation.coords.latitude, longitude: location?.coords.longitude || defaultLocation.coords.longitude },
                { latitude: closestPhone.latitude, longitude: closestPhone.longitude }
              ]}
              strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
              strokeColors={[
                '#7F0000',
                '#00000000', // no color, creates a "gradient" effect
                '#B24112',
                '#E5845C',
                '#238C23',
                '#7F0000'
              ]}
              strokeWidth={3}
            />
          )}
        </MapView>
      </ThemedView>
      <TextInput
        style={styles.numInput}
        onChangeText={(text: string) => {
          const value = parseInt(text, 10);
          if (!isNaN(value)) {
            setClosestPhonesAmount(value);
          }
        }}
        keyboardType="numeric"
      />
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  numInput: {
    width: 200,
    height: 50,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 5,
    margin: 5,
    backgroundColor: 'white',
  },

  containerSpareSpace: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom:"15%",
    
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
    width: 100,
    height: 50,
    borderRadius: 75,
    marginTop: 50,
    backgroundColor: 'lightgreen',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 50,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
  },
});