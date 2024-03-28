import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { COLORS } from '../constants';
import * as Location from 'expo-location';


export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Location

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationName, setLocationName] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Reverse geocoding to get location name
      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode.length > 0) {
        setLocationName(geocode[0].city || geocode[0].name);
      } else {
        setLocationName('Location not found');
      }
    })();
  }, []);

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
  }

  // Location

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setCameraVisible(false);

    try {
      const response = await fetch('https://lapshop.lk/api/test3.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `type=${location.coords.latitude}&data=${data}`,
      });
    
      if (response.status === 200) {
        const responseData = await response.json();
        if (JSON.stringify(responseData) == 2) {
          Alert.alert("Please going to in you location");
        }else{
          Alert.alert("Mark the attendences");
        }
        // Alert.alert('Success', `Data inserted successfully. Response: ${JSON.stringify(responseData)}`);
      } else {
        Alert.alert('Error', 'Failed to insert data');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to insert data');
    }

    setCameraVisible(true);
    setScanned(false);
  }

  const renderCamera = () => {
    return cameraVisible ? (
      <View style={styles.cameraContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.camera}
        />
      </View>
    ) : null;
  };

  const renderButton = () => {
    return cameraVisible ? null : (
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setScanned(false);
          setCameraVisible(true);
        }}
        disabled={scanned}
      >
        <Text style={styles.buttonText}>Scan QR to Start your job</Text>
      </TouchableOpacity>
    );
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission not granted</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>{text}</Text>
      <Text style={styles.title}>Scanner Your Barcode</Text>
      <Text style={styles.paragraph}>Scan a barcode to start your job.</Text>
      {renderCamera()}
      {renderButton()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 40,
  },
  cameraContainer: {
    width: '80%',
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: 10,
    marginBottom: 40,
  },
  camera: {
    flex: 1,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
