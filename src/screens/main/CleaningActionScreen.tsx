import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, StatusBar, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import LottieView from 'lottie-react-native';
import { Text } from '../../components';
import { colors } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../hooks/useAppStore';

const { width } = Dimensions.get('window');

type Step = 'avant' | 'pendant' | 'apres' | 'analysis';

export const CleaningActionScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const { activeCleaningSession, setActiveCleaningSession, updateCleaningSession } = useAppStore();
  const reportId = route.params?.reportId;

  const [step, setStep] = useState<Step>('avant');
  const [mediaAvant, setMediaAvant] = useState<string | null>(null);
  const [mediaPendant, setMediaPendant] = useState<string | null>(null);
  const [mediaApres, setMediaApres] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert("Désolé, nous avons besoin des permissions de la caméra pour cette fonctionnalité !");
      }
    })();
  }, []);

  // Restore session
  useEffect(() => {
    if (activeCleaningSession && activeCleaningSession.reportId === reportId) {
      setStep(activeCleaningSession.step as Step);
      setMediaAvant(activeCleaningSession.mediaAvant || null);
      setMediaPendant(activeCleaningSession.mediaPendant || null);
      setMediaApres(activeCleaningSession.mediaApres || null);
    } else {
      setActiveCleaningSession({ reportId, step: 'avant' });
    }
  }, [reportId]);

  const openCamera = async (currentStep: Step) => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        
        if (currentStep === 'avant') {
          setMediaAvant(uri);
          setStep('pendant');
          updateCleaningSession({ mediaAvant: uri, step: 'pendant' });
        } else if (currentStep === 'pendant') {
          setMediaPendant(uri);
          setStep('apres');
          updateCleaningSession({ mediaPendant: uri, step: 'apres' });
        } else if (currentStep === 'apres') {
          setMediaApres(uri);
          setStep('analysis');
          updateCleaningSession({ mediaApres: uri, step: 'apres' }); // keep step for a sec
          simulateAnalysis(uri);
        }
      }
    } catch (e) {
      console.log('Error picking media:', e);
    }
  };

  const simulateAnalysis = (finalApres: string) => {
    setTimeout(() => {
      navigation.replace('CleaningResult', {
        reportId,
        mediaAvant,
        mediaPendant,
        mediaApres: finalApres,
      });
    }, 4000);
  };

  const handleAbandon = () => {
    Alert.alert(
      "Abandonner le nettoyage ?",
      "Êtes-vous sûr de vouloir abandonner ce nettoyage ? Toutes les photos prises seront perdues.",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Oui, abandonner", 
          style: "destructive",
          onPress: () => {
            setActiveCleaningSession(null);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
        <Ionicons name="close" size={24} color={colors.textDark} />
      </TouchableOpacity>
      <Text variant="m" weight="bold" color={colors.textDark}>Action Citoyenne</Text>
      <TouchableOpacity onPress={handleAbandon} style={styles.abandonBtn}>
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  const renderStepAvant = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconCircle}>
        <Text variant="xl" weight="bold" color={colors.white}>1</Text>
      </View>
      <Text variant="xl" weight="bold" color={colors.textDark} style={styles.title}>
        Avant le nettoyage
      </Text>
      <Text variant="s" color={colors.textMuted} style={styles.description}>
        Prenez une photo de l'état initial des ordures.
      </Text>

      <TouchableOpacity style={styles.cameraBtn} onPress={() => openCamera('avant')} activeOpacity={0.8}>
        <View style={styles.cameraBtnInner}>
          <Ionicons name="camera" size={32} color={colors.white} />
        </View>
        <Text variant="m" weight="bold" color={colors.white} style={{ marginTop: 16 }}>
          Capturer "Avant"
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderStepPendant = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconCircle}>
        <Text variant="xl" weight="bold" color={colors.white}>2</Text>
      </View>
      <Text variant="xl" weight="bold" color={colors.textDark} style={styles.title}>
        Mi-Nettoyage
      </Text>
      <Text variant="s" color={colors.textMuted} style={styles.description}>
        Montrez-nous votre progression à mi-parcours (ex: sacs remplis, zone partiellement propre).
      </Text>

      {mediaAvant && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: mediaAvant }} style={styles.previewImage} />
          <View style={[styles.previewLabel, { backgroundColor: '#EF4444' }]}>
            <Text variant="xs" weight="bold" color={colors.white}>AVANT</Text>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.cameraBtn} onPress={() => openCamera('pendant')} activeOpacity={0.8}>
        <View style={styles.cameraBtnInner}>
          <Ionicons name="camera" size={32} color={colors.white} />
        </View>
        <Text variant="m" weight="bold" color={colors.white} style={{ marginTop: 16 }}>
          Capturer "Pendant"
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderStepApres = () => (
    <View style={styles.stepContainer}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}>
        <Text variant="xl" weight="bold" color={colors.white}>3</Text>
      </View>
      <Text variant="xl" weight="bold" color={colors.textDark} style={styles.title}>
        Après le nettoyage
      </Text>
      <Text variant="s" color={colors.textMuted} style={styles.description}>
        C'est fini ! Prenez la zone désormais propre pour valider votre action citoyenne.
      </Text>

      {mediaPendant && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: mediaPendant }} style={styles.previewImage} />
          <View style={[styles.previewLabel, { backgroundColor: '#F59E0B' }]}>
            <Text variant="xs" weight="bold" color={colors.white}>PENDANT</Text>
          </View>
        </View>
      )}

      <TouchableOpacity style={[styles.cameraBtn, { backgroundColor: colors.primary }]} onPress={() => openCamera('apres')} activeOpacity={0.8}>
        <View style={styles.cameraBtnInner}>
          <Ionicons name="camera" size={32} color={colors.white} />
        </View>
        <Text variant="m" weight="bold" color={colors.white} style={{ marginTop: 16 }}>
          Capturer "Après"
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAnalysis = () => (
    <View style={styles.analysisContainer}>
      <LottieView
        source={require('../../../assets/lotties/Recycle-Loader.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
      <View style={styles.analysisBadge}>
        <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
        <Text variant="m" weight="bold" color="#FFFFFF" style={{ marginLeft: 8 }}>
          IA en cours d'analyse...
        </Text>
      </View>
      <Text variant="s" color={colors.textMuted} style={{ marginTop: 24, textAlign: 'center', paddingHorizontal: 40 }}>
        L'IA compare vos 3 captures pour valider la réduction significative des déchets.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {step !== 'analysis' && renderHeader()}

      <View style={styles.content}>
        {step === 'avant' && renderStepAvant()}
        {step === 'pendant' && renderStepPendant()}
        {step === 'apres' && renderStepApres()}
        {step === 'analysis' && renderAnalysis()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FAFAFA',
  },
  closeBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  abandonBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center', alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  stepContainer: {
    alignItems: 'center',
    width: '100%',
  },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#1E293B',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  cameraBtn: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 32,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBtnInner: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
  },
  previewContainer: {
    width: '100%',
    height: 160, // Smaller to leave room for camera button
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewLabel: {
    position: 'absolute', top: 12, left: 12,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8,
  },
  analysisContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  lottie: {
    width: 250, height: 250,
  },
  analysisBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: 24,
    marginTop: -20,
  },
});
