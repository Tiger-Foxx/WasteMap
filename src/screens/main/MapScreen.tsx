import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Platform, Animated, Easing } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../components';
import { colors, spacing } from '../../theme';
import { useAppStore } from '../../hooks/useAppStore';
import { GravityLevel } from '../../models';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const gravityColors: Record<GravityLevel, string> = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#EF4444',
  critical: '#6366F1',
};

const gravityLabels: Record<GravityLevel, string> = {
  low: 'Faible',
  medium: 'Moyen',
  high: 'Élevé',
  critical: 'Critique',
};

const YAOUNDE_REGION = {
  latitude: 3.8667,
  longitude: 11.5167,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// Composant pour l'animation Pulsante (Radar) — API Animated standard (compatible Expo Go)
const PulsingMarker = ({ color, isSelected }: { color: string; isSelected: boolean }) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.bezier(0.1, 0.4, 0.4, 1),
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 3.5],
  });

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.7, 0.4, 0],
  });

  return (
    <View style={styles.pulseContainer}>
      <Animated.View
        style={[
          styles.markerPulseRing,
          { backgroundColor: color, transform: [{ scale }], opacity },
        ]}
      />
      {/* 2ème ring pour l'effet radar double (décalé via opacité plus forte) */}
      <Animated.View
        style={[
          styles.markerPulseRing,
          { 
            backgroundColor: color, 
            transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 2] }) }], 
            opacity: pulseAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.3, 0] }) 
          },
        ]}
      />
      <View
        style={[
          styles.markerCoreStatic,
          { backgroundColor: color },
          isSelected ? styles.markerCoreStaticActive : null,
        ]}
      >
        <Ionicons name="trash" size={isSelected ? 20 : 16} color={colors.white} />
      </View>
    </View>
  );
};

export const MapScreen = ({ navigation }: any) => {
  const { reports, collectionPoints, activeCleaningSession } = useAppStore();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'cleaned'>('all');
  const insets = useSafeAreaInsets();

  const filteredReports = reports.filter((r) => {
    if (activeFilter === 'all') return true;
    return r.status === activeFilter;
  });

  const selected = reports.find((r) => r.id === selectedReport);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* ── MAP ── */}
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={YAOUNDE_REGION}
        showsUserLocation={false} 
        showsMyLocationButton={false}
        mapPadding={{ top: insets.top + 100, right: 0, bottom: 0, left: 0 }}
      >
        {/* ... markers ... */}
        {collectionPoints.filter(cp => cp.isActive).map((cp) => (
          <Marker
            key={cp.id}
            coordinate={{
              latitude: cp.location.latitude,
              longitude: cp.location.longitude,
            }}
            tracksViewChanges={false}
          >
            <View style={[styles.collectionPin, { borderColor: cp.type === 'hysacam' ? '#1E293B' : colors.primary }]}>
              <Ionicons 
                name={cp.type === 'hysacam' ? "trash-bin" : "leaf"} 
                size={18} 
                color={cp.type === 'hysacam' ? '#1E293B' : colors.primary} 
              />
            </View>
          </Marker>
        ))}

        {filteredReports.map((report) => {
          const isSelected = selectedReport === report.id;
          return (
            <Marker
              key={report.id}
              coordinate={{
                latitude: report.location.latitude,
                longitude: report.location.longitude,
              }}
              onPress={() => setSelectedReport(isSelected ? null : report.id)}
              zIndex={isSelected ? 999 : 1}
              tracksViewChanges={true} // Obligatoire sur Android pour autoriser l'animation Reanimated et empêcher la disparition
            >
              <PulsingMarker color={gravityColors[report.analysis.gravity]} isSelected={isSelected} />
            </Marker>
          );
        })}
      </MapView>

      {/* ── TOP HUD (No overlaps, fully stacked) ── */}
      <View style={[styles.topHudContainer, { paddingTop: Math.max(insets.top, 20) }]}>
        
        {/* Main Header Pill */}
        <View style={styles.headerBlock}>
          <View style={styles.headerPill}>
            <View style={styles.profileBadge}>
               <Ionicons name="scan-outline" size={18} color={colors.white} />
            </View>
            <View style={styles.headerTextContainer}>
              <Text variant="s" weight="bold" color={colors.textDark}>
                Radar Environnemental
              </Text>
              <Text variant="xs" color={colors.textMuted} style={{ marginTop: 2 }}>
                {filteredReports.length} zones signalées • Yaoundé
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.actionBtn, showLegend ? styles.actionBtnActive : null]} 
              onPress={() => setShowLegend(!showLegend)}
            >
              <Ionicons name="options-outline" size={20} color={showLegend ? colors.white : colors.textDark} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Horizontal Filters - Flow layout without overlap */}
        <View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
          >
            {(['all', 'pending', 'cleaned'] as const).map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterChip, isActive ? styles.filterChipActive : null]}
                  onPress={() => setActiveFilter(filter)}
                  activeOpacity={0.8}
                >
                   {filter !== 'all' ? (
                    <Ionicons 
                      name={filter === 'pending' ? 'ellipse' : 'checkmark-circle'} 
                      size={12} 
                      color={isActive ? colors.white : colors.textMuted} 
                      style={{ marginRight: 6 }}
                    />
                  ) : null}
                  <Text
                    variant="xs"
                    weight={isActive ? 'bold' : 'medium'}
                    color={isActive ? colors.white : colors.textMuted}
                  >
                    {filter === 'all' ? 'Toute la ville' : filter === 'pending' ? 'À traiter' : 'Nettoyés'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* ── LÉGENDE ── */}
      {showLegend ? (
        <View style={[styles.legendPanel, { top: insets.top + 140 }]}>
          <Text variant="xs" weight="bold" color={colors.textDark} style={{ marginBottom: 12, letterSpacing: 0.5 }}>
            ANALYSE DES RISQUES
          </Text>
          <View style={styles.legendGrid}>
             {(Object.keys(gravityColors) as GravityLevel[]).map((level) => (
               <View key={level} style={styles.legendItem}>
                 <View style={[styles.legendDot, { backgroundColor: gravityColors[level] }]} />
                 <Text variant="xs" color={colors.textMuted}>Niveau {gravityLabels[level]}</Text>
               </View>
             ))}
             <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#1E293B' }]} />
                <Text variant="xs" color={colors.textMuted}>Bac HYSACAM</Text>
             </View>
          </View>
        </View>
      ) : null}

      {/* ── PANNEAU DÉTAIL EN BAS ── */}
      {selected ? (
        <View style={[styles.bottomSheet, { paddingBottom: Math.max(insets.bottom, 24) + 80 }]}>
          <View style={styles.sheetHeader}>
             <View style={styles.badgeUrgency}>
               <View style={[styles.urgencyDot, { backgroundColor: gravityColors[selected.analysis.gravity] }]} />
               <Text variant="xs" weight="bold" color={gravityColors[selected.analysis.gravity]}>
                 URGENCE {gravityLabels[selected.analysis.gravity].toUpperCase()}
               </Text>
             </View>
             <TouchableOpacity onPress={() => setSelectedReport(null)} style={styles.closeBtn}>
               <Ionicons name="close" size={20} color={colors.textLight} />
             </TouchableOpacity>
          </View>

          <Text variant="l" weight="bold" color={colors.textDark} style={styles.locTitle}>
            {selected.location.quarter || 'Yaoundé, Cameroun'}
          </Text>
          <Text variant="s" color={colors.textMuted} style={styles.locSubtitle}>
            {selected.location.address}
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagWrapper} contentContainerStyle={styles.tagContainer}>
            {selected.analysis.composition.map((comp, i) => (
              <View key={i} style={styles.tagStyle}>
                <Text variant="xs" weight="medium" color={colors.textDark}>
                  {comp.type} • {comp.percentage}%
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.metricsWrapper}>
            <View style={styles.metricCard}>
               <Text variant="xl" weight="bold" color={colors.textDark}>{selected.analysis.estimatedVolumeM3}</Text>
               <Text variant="xs" color={colors.textMuted} style={{marginTop: 2}}>Mètres Cubes (m³)</Text>
            </View>
            <View style={[styles.metricCard, styles.metricCardPrimary]}>
               <Text variant="xl" weight="bold" color={colors.primary}>+{selected.ecoPointsEarned}</Text>
               <Text variant="xs" color={colors.primary} style={{marginTop: 2}}>Impact Points</Text>
            </View>
          </View>

          {selected.status === 'pending' && (
            <TouchableOpacity 
              style={styles.mainActionBtn} 
              activeOpacity={0.9}
              onPress={() => {
                setSelectedReport(null);
                navigation.navigate('CleaningAction', { reportId: selected.id });
              }}
            >
               <Ionicons 
                 name={activeCleaningSession?.reportId === selected.id ? "play-circle" : "trash-bin"} 
                 size={20} 
                 color={colors.white} 
                 style={{ marginRight: 8 }} 
               />
               <Text variant="s" weight="bold" color={colors.white}>
                 {activeCleaningSession?.reportId === selected.id 
                   ? "Continuer le nettoyage" 
                   : "Nettoyer cette zone"}
               </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  map: { flex: 1 },

  topHudContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    gap: 12,
  },
  headerBlock: {
    paddingHorizontal: 16,
  },
  headerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 8,
    paddingRight: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  profileBadge: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#1E293B',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  actionBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F1F5F9', // subtle gray
    justifyContent: 'center', alignItems: 'center',
  },
  actionBtnActive: {
    backgroundColor: colors.textDark,
  },

  filterScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  filterChipActive: {
    backgroundColor: colors.textDark,
    borderColor: colors.textDark,
  },

  legendPanel: {
    position: 'absolute', right: 16, left: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 16, borderRadius: 20, zIndex: 9,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
  },
  legendGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', width: '45%', gap: 8 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },


  collectionPin: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3, elevation: 4,
  },
  
  // Custom Animated Pulse Marker Styles
  pulseContainer: {
    width: 140, height: 140,
    justifyContent: 'center', alignItems: 'center',
    overflow: 'visible',
  },
  markerPulseRing: {
    position: 'absolute',
    width: 48, height: 48,
    borderRadius: 24,
  },
  markerCoreStatic: {
    width: 36, height: 36,
    borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, 
  },
  markerCoreStaticActive: {
    width: 44, height: 44,
    borderRadius: 22,
  },

  bottomSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    paddingTop: 24, paddingHorizontal: 20,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,

  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  badgeUrgency: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8FAFC', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 12, gap: 6,
  },
  urgencyDot: { width: 6, height: 6, borderRadius: 3 },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center',
  },
  locTitle: { fontSize: 22, marginBottom: 4 },
  locSubtitle: { fontSize: 14, marginBottom: 16 },
  tagWrapper: { flexGrow: 0, marginBottom: 16, marginRight: -20 },
  tagContainer: { gap: 8, paddingRight: 20 },
  tagStyle: {
    paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: '#F1F5F9', borderRadius: 8,
  },
  metricsWrapper: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  metricCard: {
    flex: 1, padding: 16, borderRadius: 16,
    backgroundColor: '#F8FAFC', alignItems: 'flex-start',
  },
  metricCardPrimary: { backgroundColor: 'rgba(16, 185, 129, 0.08)' },
  mainActionBtn: {
    backgroundColor: colors.primary, borderRadius: 24,
    height: 48, justifyContent: 'center', alignItems: 'center',
    flexDirection: 'row',
    width:'45%'
  },
});

