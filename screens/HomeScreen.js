import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { postPhoto } from '../api/api';

export default function HomeScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePhoto = async () => {
    try {
      const { uri, base64 } = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.9 });
      /* const { base64 } = await ImageManipulator.manipulateAsync(uri,
        [{ resize: { height: 800, width: 600 } }],
        { format: 'jpeg', base64: true, compress: 0.9 }
      ) */
      console.log('image handled, posting...');
      const res = await postPhoto({ base64 });
      console.log('res:', res);
    } catch (e) {
      console.log('error!!', e);
    }
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Camera style={{ flex: 1 }} type={type} ref={cameraRef}>
        <View style={styles.cameraContent}>
          <View style={styles.takePhotoWrapper}>
            <TouchableOpacity onPress={takePhoto} style={styles.photoButton}>
              <Text style={{ color: 'white', fontSize: 15 }}>{ loading ? '...' : 'Take photo' }</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cameraContent: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row'
  },
  takePhotoWrapper: {
    width: '100%',
    height: '15%',
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  photoButton: {
    height: 70,
    width: 70,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 1
  },
});
