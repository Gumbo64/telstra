import React, { createContext, useState, useContext, ReactNode } from 'react';

import * as Location from 'expo-location';

import { useEffect } from 'react';
const telstraData = require('../assets/telstra-data.json');

interface AppContextType {
    location: Location.LocationObject | null;
    setLocation: React.Dispatch<React.SetStateAction<Location.LocationObject | null>>;
    
    closestPhone: any | null;
    setClosestPhone: React.Dispatch<React.SetStateAction<any | null>>;
    
    closestPhoneDistance: number | null;
    setClosestPhoneDistance: React.Dispatch<React.SetStateAction<number | null>>;
    
    errorMsg: string | null;
    setErrorMsg: React.Dispatch<React.SetStateAction<string | null>>;

    getCurrentLocation: () => Promise<void>;
    telstraData: any;
    findClosestPhone: (loc: Location.LocationObject) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}



import * as Linking from 'expo-linking';

function callNearestTelstra(closestPhone: any) {
    const number = closestPhone.fnn.split(':')[1];
    Linking.openURL(`tel:${number}`);
}

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);  // deg2rad below
  const dLon = deg2rad(lon2 - lon1); 
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const d = R * c; // Distance in km
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




const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [closestPhone, setClosestPhone] = useState<any | null>(null);
    const [closestPhoneDistance, setClosestPhoneDistance] = useState<number | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);


    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      setErrorMsg("Waiting for GPS...");
      let loc = await Location.getCurrentPositionAsync({accuracy: Location.LocationAccuracy.BestForNavigation});
      setErrorMsg(null);
      setLocation(loc);
      findClosestPhone(loc);
    }

    async function findClosestPhone(loc: Location.LocationObject) {

        // Find the closest phone
        let cPhone = telstraData[0];
        let cDistance = phoneDistance(telstraData[0], loc);
        
        for (const phoneObj of telstraData) {
            const distance = phoneDistance(phoneObj, loc);
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

    useEffect(() => {
        getCurrentLocation();
    }, []);
    return (
        <AppContext.Provider value={{ 
            location, setLocation, 
            closestPhone, setClosestPhone, 
            closestPhoneDistance, setClosestPhoneDistance, 
            errorMsg, setErrorMsg,
            getCurrentLocation, telstraData,
            findClosestPhone
        }}>
            {children}
        </AppContext.Provider>
    );
};

const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};


export { AppProvider, useAppContext, callNearestTelstra, phoneDistance };
