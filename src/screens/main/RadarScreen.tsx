import React from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { Text } from '../../components';
import { colors, spacing } from '../../theme';
import { useNavigation } from '@react-navigation/native';

export const RadarScreen = () => {
  const navigation = useNavigation<any>();

  const handleCapture = () => {
    // Navigate to AI scan result screen
    navigation.getParent()?.navigate('ScanResult');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.cameraPlaceholder}>
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text variant="l" weight="bold" color={colors.white}>Le Radar 📸</Text>
            <Text variant="s" color="rgba(255,255,255,0.7)">Photographiez un dépôt sauvage</Text>
          </View>

          {/* Cadre de scan */}
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            <Text style={{ fontSize: 48 }}>📷</Text>
          </View>

          {/* Bouton de capture */}
          <View style={styles.bottomControls}>
            <Text variant="s" color="rgba(255,255,255,0.6)" align="center" style={{ marginBottom: 20 }}>
              Cadrez les déchets dans le viseur
            </Text>
            <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
            <Text variant="xs" color="rgba(255,255,255,0.4)" align="center" style={{ marginTop: 16 }}>
              💡 Appuyez pour lancer l'analyse IA
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  cameraPlaceholder: { flex: 1, backgroundColor: '#1a1a1a' },
  overlay: {
    flex: 1, justifyContent: 'space-between',
    paddingVertical: 60, paddingHorizontal: spacing.screenPadding,
  },
  header: { alignItems: 'center' },
  scanFrame: {
    width: 260, height: 260, alignSelf: 'center',
    justifyContent: 'center', alignItems: 'center',
  },
  corner: {
    position: 'absolute', width: 30, height: 30,
    borderColor: colors.primaryLight, borderWidth: 3,
  },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  bottomControls: { alignItems: 'center' },
  captureButton: {
    width: 76, height: 76, borderRadius: 38,
    borderWidth: 4, borderColor: colors.white,
    justifyContent: 'center', alignItems: 'center',
  },
  captureInner: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: colors.white,
  },
});
