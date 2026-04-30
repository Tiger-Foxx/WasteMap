import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Text, Card } from '../../components';
import { colors, spacing } from '../../theme';
import { useAppStore } from '../../hooks/useAppStore';
import { GravityLevel } from '../../models';

// Couleurs par gravité
const gravityColors: Record<GravityLevel, string> = {
  low: '#4CAF50',
  medium: '#FF9800',
  high: '#F44336',
  critical: '#9C27B0',
};

const gravityLabels: Record<GravityLevel, string> = {
  low: 'Faible',
  medium: 'Moyen',
  high: 'Élevé',
  critical: 'Critique',
};

// Centre de Yaoundé
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
      <StatusBar barStyle="dark-content" />

      {/* ── Header flottant ── */}
      <View style={styles.floatingHeader}>
        <View style={styles.headerContent}>
          <Text variant="l" weight="bold" color={colors.textDark}>
            Carte des signalements
          </Text>
          <Text variant="xs" color={colors.textMuted}>
            {filteredReports.length} signalements • Yaoundé
          </Text>
        </View>
        <TouchableOpacity
          style={styles.legendButton}
          onPress={() => setShowLegend(!showLegend)}
        >
          <Text style={{ fontSize: 18 }}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      {/* ── Filtres ── */}
      <View style={styles.filterBar}>
        {(['all', 'pending', 'cleaned'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              activeFilter === filter && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              variant="xs"
              weight={activeFilter === filter ? 'semiBold' : 'regular'}
              color={activeFilter === filter ? colors.white : colors.textMuted}
            >
              {filter === 'all' ? 'Tous' : filter === 'pending' ? '⏳ En attente' : '✅ Nettoyés'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Carte React Native Maps ── */}
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={YAOUNDE_REGION}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {/* Marqueurs des signalements */}
        {filteredReports.map((report) => (
          <Marker
            key={report.id}
            coordinate={{
              latitude: report.location.latitude,
              longitude: report.location.longitude,
            }}
            onPress={() => setSelectedReport(
              selectedReport === report.id ? null : report.id
            )}
          >
            <View
              style={[
                styles.marker,
                {
                  backgroundColor: gravityColors[report.analysis.gravity],
                  borderColor: selectedReport === report.id ? colors.white : 'transparent',
                  borderWidth: selectedReport === report.id ? 3 : 0,
                  transform: [{ scale: selectedReport === report.id ? 1.3 : 1 }],
                },
              ]}
            >
              <Text style={{ fontSize: 14, color: colors.white, fontWeight: '700' }}>
                {report.status === 'cleaned' ? '✓' :
                 report.analysis.gravity === 'critical' ? '!' : '•'}
              </Text>
            </View>
          </Marker>
        ))}

        {/* Marqueurs des points de ramassage */}
        {collectionPoints.filter(cp => cp.isActive).map((cp) => (
          <Marker
            key={cp.id}
            coordinate={{
              latitude: cp.location.latitude,
              longitude: cp.location.longitude,
            }}
            tracksViewChanges={false}
          >
            <View style={styles.collectionMarker}>
              <Text style={{ fontSize: 16 }}>
                {cp.type === 'hysacam' ? '🗑️' : '♻️'}
              </Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* ── Légende ── */}
      {showLegend && (
        <Card variant="glass" style={styles.legendCard}>
          <Text variant="s" weight="semiBold" color={colors.textDark} style={{ marginBottom: 8 }}>
            Légende
          </Text>
          {(Object.keys(gravityColors) as GravityLevel[]).map(level => (
            <View key={level} style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: gravityColors[level] }]} />
              <Text variant="xs" color={colors.textMuted}>
                Gravité {gravityLabels[level]}
              </Text>
            </View>
          ))}
          <View style={styles.legendRow}>
            <Text style={{ fontSize: 12 }}>🗑️</Text>
            <Text variant="xs" color={colors.textMuted}> Bac HYSACAM</Text>
          </View>
          <View style={styles.legendRow}>
            <Text style={{ fontSize: 12 }}>♻️</Text>
            <Text variant="xs" color={colors.textMuted}> Recycleur partenaire</Text>
          </View>
        </Card>
      )}

      {/* ── Fiche détail du signalement sélectionné ── */}
      {selected && (
        <Card variant="elevated" style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <View style={[
              styles.detailGravity,
              { backgroundColor: gravityColors[selected.analysis.gravity] }
            ]}>
              <Text variant="xs" weight="bold" color={colors.white}>
                {gravityLabels[selected.analysis.gravity].toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedReport(null)}>
              <Text variant="l" color={colors.textLight}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text variant="m" weight="semiBold" color={colors.textDark} style={{ marginTop: 8 }}>
            {selected.location.quarter || selected.location.address}
          </Text>
          <Text variant="xs" color={colors.textMuted} style={{ marginTop: 2 }}>
            {selected.location.address}
          </Text>

          {/* Composition IA */}
          <View style={styles.compositionRow}>
            {selected.analysis.composition.slice(0, 3).map((comp, i) => (
              <View key={i} style={styles.compChip}>
                <Text variant="xs" weight="medium" color={colors.primary}>
                  {comp.type === 'plastic' ? '🧴' :
                   comp.type === 'metal' ? '🥫' :
                   comp.type === 'organic' ? '🍂' :
                   comp.type === 'glass' ? '🍾' : '📦'}{' '}
                  {comp.percentage}%
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.detailStats}>
            <View style={styles.detailStat}>
              <Text variant="s" weight="bold" color={colors.textDark}>
                {selected.analysis.estimatedVolumeM3} m³
              </Text>
              <Text variant="xs" color={colors.textLight}>Volume</Text>
            </View>
            <View style={styles.detailStat}>
              <Text variant="s" weight="bold" color={colors.ecoPoint}>
                +{selected.ecoPointsEarned} EP
              </Text>
              <Text variant="xs" color={colors.textLight}>EcoPoints</Text>
            </View>
            <View style={styles.detailStat}>
              <Text variant="s" weight="bold" color={colors.textDark}>
                {selected.confirmationCount}
              </Text>
              <Text variant="xs" color={colors.textLight}>Confirmations</Text>
            </View>
          </View>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  map: { flex: 1 },

  // Header flottant
  floatingHeader: {
    position: 'absolute', top: 50, left: spacing.screenPadding,
    right: spacing.screenPadding, zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: spacing.borderRadius.medium,
    padding: 14, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
  },
  headerContent: {},
  legendButton: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.primaryLighter, justifyContent: 'center', alignItems: 'center',
  },

  // Filtres
  filterBar: {
    position: 'absolute', top: 115, left: spacing.screenPadding,
    right: spacing.screenPadding, zIndex: 10,
    flexDirection: 'row', gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: spacing.borderRadius.round,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },

  // Marqueurs
  marker: {
    width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
  },
  collectionMarker: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.border,
  },

  // Légende
  legendCard: {
    position: 'absolute', top: 160, right: spacing.screenPadding,
    zIndex: 10, padding: 14, width: 180,
  },
  legendRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4,
  },
  legendDot: { width: 10, height: 10, borderRadius: 5 },

  // Fiche détail
  detailCard: {
    position: 'absolute', bottom: 24, left: spacing.screenPadding,
    right: spacing.screenPadding, zIndex: 10, padding: 16,
  },
  detailHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  detailGravity: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: spacing.borderRadius.round,
  },
  compositionRow: {
    flexDirection: 'row', gap: 8, marginTop: 10,
  },
  compChip: {
    backgroundColor: colors.primaryLighter,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: spacing.borderRadius.round,
  },
  detailStats: {
    flexDirection: 'row', justifyContent: 'space-around',
    marginTop: 12, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  detailStat: { alignItems: 'center' },
});
