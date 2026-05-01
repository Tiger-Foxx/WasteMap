const fs = require('fs');

const content = import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../components';
import { colors, spacing } from '../../theme';
import { useAppStore } from '../../hooks/useAppStore';
import { GravityLevel } from '../../models';

const { width } = Dimensions.get('window');

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

export const MapScreen = () => {
  const { reports, collectionPoints } = useAppStore();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'cleaned'>('all');

  const filteredReports = reports.filter(r => {
    if (activeFilter === 'all') return true;
    return r.status === activeFilter;
  });

  const selected = reports.find(r => r.id === selectedReport);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* ── Carte ── */}
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={YAOUNDE_REGION}
        showsUserLocation
        showsMyLocationButton={false}
        mapPadding={{ top: 120, right: 0, bottom: 0, left: 0 }}
      >
        {/* Marqueurs Points de Collecte */}
        {collectionPoints.filter(cp => cp.isActive).map((cp) => (
          <Marker
            key={cp.id}
            coordinate={{
              latitude: cp.location.latitude,
              longitude: cp.location.longitude,
            }}
            tracksViewChanges={false}
          >
            <View style={styles.collectionPin}>
              <View style={[styles.collectionDot, { backgroundColor: cp.type === 'hysacam' ? '#1E293B' : colors.primary }]} />
            </View>
          </Marker>
        ))}

        {/* Marqueurs Signalements */}
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
              tracksViewChanges={false}
            >
              <View style={[
                  styles.markerContainer,
                  isSelected && styles.markerContainerActive
              ]}>
                <View
                  style={[
                    styles.markerCore,
                    { backgroundColor: gravityColors[report.analysis.gravity] },
                    isSelected && styles.markerCoreActive
                  ]}
                />
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* ── Top HUD Premium ── */}
      <View style={styles.topHud}>
        <View style={styles.headerPill}>
          <TouchableOpacity style={styles.profileBadge} activeOpacity={0.8}>
             <Ionicons name="scan-outline" size={18} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text variant="s" weight="bold" color={colors.textDark}>
              Radar Environnemental
            </Text>
            <Text variant="xs" color={colors.textMuted} style={{ marginTop: 2 }}>
              {filteredReports.length} zones détectées
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.actionBtn, showLegend && styles.actionBtnActive]} 
            onPress={() => setShowLegend(!showLegend)}
          >
            <Ionicons name="options-outline" size={20} color={showLegend ? colors.white : colors.textDark} />
          </TouchableOpacity>
        </View>

        {/* Filtres horizontaux */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {(['all', 'pending', 'cleaned'] as const).map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveFilter(filter)}
                activeOpacity={0.7}
              >
                 {filter !== 'all' && (
                  <Ionicons 
                    name={filter === 'pending' ? 'ellipse' : 'checkmark-circle'} 
                    size={12} 
                    color={isActive ? colors.white : colors.textMuted} 
                    style={{ marginRight: 6 }}
                  />
                )}
                <Text
                  variant="xs"
                  weight={isActive ? 'bold' : 'medium'}
                  color={isActive ? colors.white : colors.textMuted}
                >
                  {filter === 'all' ? 'La ville' : filter === 'pending' ? 'À traiter' : 'Nettoyés'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Légende Intégrée ── */}
      {showLegend && (
        <View style={styles.legendPanel}>
          <Text variant="xs" weight="bold" color={colors.textDark} style={{ marginBottom: 12 }}>
            ANALYSE DES RISQUES
          </Text>
          <View style={styles.legendGrid}>
             {(Object.keys(gravityColors) as GravityLevel[]).map(level => (
               <View key={level} style={styles.legendItem}>
                 <View style={[styles.legendIndicator, { backgroundColor: gravityColors[level] }]} />
                 <Text variant="xs" color={colors.textMuted}>Niveau {gravityLabels[level]}</Text>
               </View>
             ))}
             <View style={styles.legendItem}>
                <View style={[styles.legendIndicator, { backgroundColor: '#1E293B' }]} />
                <Text variant="xs" color={colors.textMuted}>Bac HYSACAM</Text>
             </View>
          </View>
        </View>
      )}

      {/* ── Panel Détaillé ── */}
      {selected && (
        <View style={styles.detailPanel}>
          <View style={styles.detailHeader}>
             <View style={styles.badgeContainer}>
               <View style={[styles.gravityDot, { backgroundColor: gravityColors[selected.analysis.gravity] }]} />
               <Text variant="xs" weight="bold" color={gravityColors[selected.analysis.gravity]}>
                 URGENCE {gravityLabels[selected.analysis.gravity].toUpperCase()}
               </Text>
             </View>
             <TouchableOpacity onPress={() => setSelectedReport(null)} style={styles.closeBtn}>
               <Ionicons name="close" size={20} color={colors.textLight} />
             </TouchableOpacity>
          </View>

          <View style={styles.locationBlock}>
            <Text variant="l" weight="bold" color={colors.textDark} style={styles.titleLoc}>
              {selected.location.quarter || 'Yaoundé, Cameroun'}
            </Text>
            <Text variant="s" color={colors.textMuted} style={styles.subtitleLoc}>
              {selected.location.address}
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagScroll}>
            {selected.analysis.composition.map((comp, i) => (
              <View key={i} style={styles.aiTag}>
                <Text variant="xs" weight="medium" color={colors.textDark}>
                  {comp.type} • {comp.percentage}%
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}>
               <Text variant="xl" weight="bold" color={colors.textDark}>{selected.analysis.estimatedVolumeM3}</Text>
               <Text variant="xs" color={colors.textLight} style={{marginTop: 2}}>Mètres Cubes (m³)</Text>
            </View>
            <View style={[styles.metricBox, styles.metricBoxHighlight]}>
               <Text variant="xl" weight="bold" color={colors.primary}>+{selected.ecoPointsEarned}</Text>
               <Text variant="xs" color={colors.primary} style={{marginTop: 2}}>Impact Points</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.actionMainBtn} activeOpacity={0.9}>
            <Text variant="s" weight="bold" color={colors.white}>Organiser une collecte</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFCFC' },
  map: { flex: 1 },

  topHud: { position: 'absolute', top: 54, left: 0, right: 0, zIndex: 10 },
  headerPill: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.98)',
    marginHorizontal: 16, padding: 10, paddingRight: 14, borderRadius: 24,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)'
  },
  profileBadge: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.textDark,
    justifyContent: 'center', alignItems: 'center'
  },
  headerTextContainer: { flex: 1, marginLeft: 14 },
  actionBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center'
  },
  actionBtnActive: { backgroundColor: colors.textDark },

  filterScroll: { paddingHorizontal: 16, paddingTop: 16, gap: 8 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 99,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)'
  },
  filterChipActive: { backgroundColor: colors.textDark, borderColor: colors.textDark },

  legendPanel: {
    position: 'absolute', top: 190, left: 16, right: 16,
    backgroundColor: 'rgba(255,255,255,0.95)', padding: 18, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)', zIndex: 9
  },
  legendGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', width: '45%', gap: 8 },
  legendIndicator: { width: 8, height: 8, borderRadius: 4 },

  collectionPin: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#E2E8F0'
  },
  collectionDot: { width: 10, height: 10, borderRadius: 5 },
  markerContainer: { padding: 6, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.5)', borderWidth: 1, borderColor: 'transparent' },
  markerContainerActive: { borderColor: colors.textDark, backgroundColor: 'rgba(255,255,255,0.8)' },
  markerCore: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: colors.white },
  markerCoreActive: { width: 20, height: 20, borderRadius: 10 },

  detailPanel: {
    position: 'absolute', bottom: 90, left: 16, right: 16,
    backgroundColor: colors.white, borderRadius: 28, padding: 24,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)'
  },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  badgeContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAF8',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, gap: 6
  },
  gravityDot: { width: 6, height: 6, borderRadius: 3 },
  closeBtn: { width: 32, height: 32, backgroundColor: '#F1F5F9', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  locationBlock: { marginBottom: 20 },
  titleLoc: { fontSize: 22, lineHeight: 28, marginBottom: 4 },
  subtitleLoc: { fontSize: 14 },
  tagScroll: { gap: 8, paddingBottom: 20 },
  aiTag: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#F1F5F9', borderRadius: 8, marginRight: 8 },
  metricsGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  metricBox: { flex: 1, padding: 16, backgroundColor: '#F8FAFC', borderRadius: 16, alignItems: 'flex-start' },
  metricBoxHighlight: { backgroundColor: 'rgba(16, 185, 129, 0.08)' },
  actionMainBtn: { backgroundColor: colors.textDark, borderRadius: 16, height: 56, justifyContent: 'center', alignItems: 'center' }
});
;
fs.writeFileSync('src/screens/main/MapScreen.tsx', content);
