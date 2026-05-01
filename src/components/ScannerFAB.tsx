import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme';

export const ScannerFAB = () => {
  const navigation = useNavigation<any>();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleQuickScan = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      // @ts-ignore
      navigation.navigate('Radar', { photoUri: result.assets[0].uri });
    }
  };

  return (
    <Animated.View style={[styles.fabContainer, { opacity: fadeAnim }]}>
      <TouchableOpacity 
        style={styles.fab} 
        activeOpacity={0.8}
        onPress={handleQuickScan}
      >
        <View style={styles.fabInner}>
          <Ionicons name="scan" size={26} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    zIndex: 999,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fab: {
    backgroundColor: colors.primary,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabInner: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
