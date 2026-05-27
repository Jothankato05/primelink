import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, radius } from '../theme';
import {
  COMMUNITIES, SECTORS, getInitialScores,
  compositeScore, scoreColor, scoreLabel,
} from '../data/communities';

const BACKEND = 'http://localhost:4000';

export default function DashboardScreen({ navigation }) {
  const [community,   setCommunity]   = useState(COMMUNITIES[0]);
  const [scores,      setScores]      = useState(getInitialScores());
  const [connected,   setConnected]   = useState(false);
  const [refreshing,  setRefreshing]  = useState(false);
  const [pickerOpen,  setPickerOpen]  = useState(false);

  const composite = compositeScore(scores);
  const label     = scoreLabel(composite);
  const color     = scoreColor(composite);

  const fetchCommunity = async () => {
    try {
      const res  = await fetch(`${BACKEND}/api/communities/${community.id}`);
      const data = await res.json();
      if (data.success) {
        setScores(data.data.scores);
        setConnected(true);
      }
    } catch {
      setConnected(false);
    }
  };

  useEffect(() => {
    fetchCommunity();
    const t = setInterval(fetchCommunity, 5000);
    return () => clearInterval(t);
  }, [community.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCommunity();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.brandRow} onPress={() => navigation.openDrawer?.()}>
          <View style={styles.logoMark} />
          <Text style={styles.brand}>Prime<Text style={styles.brandAccent}>Link</Text></Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <View style={[styles.badge, connected ? styles.badgeLive : styles.badgeSim]}>
            <View style={[styles.badgeDot, { backgroundColor: connected ? colors.green : colors.textMuted }]} />
            <Text style={[styles.badgeText, { color: connected ? colors.green : colors.textMuted }]}>
              {connected ? 'LIVE' : 'SIM'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.green} />}
      >
        {/* Community picker */}
        <TouchableOpacity
          style={styles.communityPicker}
          onPress={() => setPickerOpen(o => !o)}
          activeOpacity={0.8}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.communityName}>{community.name}</Text>
            <Text style={styles.communityMeta}>{community.state} · {community.population.toLocaleString()} residents</Text>
          </View>
          <Text style={[styles.pickerChevron, pickerOpen && { transform: [{ rotate: '180deg' }] }]}>
            ›
          </Text>
        </TouchableOpacity>

        {pickerOpen && (
          <View style={styles.pickerList}>
            {COMMUNITIES.map(c => (
              <TouchableOpacity
                key={c.id}
                style={[styles.pickerItem, c.id === community.id && styles.pickerItemActive]}
                onPress={() => { setCommunity(c); setPickerOpen(false); }}
              >
                <Text style={[styles.pickerItemName, c.id === community.id && { color: colors.green }]}>
                  {c.name}
                </Text>
                <Text style={styles.pickerItemState}>{c.state}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Community Risk Index */}
        <View style={[styles.card, styles.heroCard, { borderColor: `${color}22` }]}>
          <Text style={styles.heroLabel}>COMMUNITY RISK INDEX</Text>
          <View style={styles.heroScoreRow}>
            <Text style={[styles.heroScore, { color }]}>{composite}</Text>
            <View style={styles.heroMeta}>
              <View style={[styles.statusBadge, { backgroundColor: `${color}18`, borderColor: `${color}30` }]}>
                <Text style={[styles.statusBadgeText, { color }]}>{label}</Text>
              </View>
              <Text style={styles.heroSubLabel}>Out of 100</Text>
            </View>
          </View>

          {/* Quick stats */}
          <View style={styles.quickStats}>
            {[
              { label: 'Population',  value: community.population.toLocaleString() },
              { label: 'Sensors',     value: `${scores.iot > 70 ? 127 : 89} online` },
              { label: 'Clinics',     value: '8 connected' },
            ].map(s => (
              <View key={s.label} style={styles.quickStat}>
                <Text style={styles.quickStatValue}>{s.value}</Text>
                <Text style={styles.quickStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Sector scores */}
        <Text style={styles.sectionTitle}>Sector Scores</Text>
        <View style={styles.sectorGrid}>
          {SECTORS.map(sector => {
            const val   = scores[sector.key] ?? 70;
            const col   = scoreColor(val);
            const lbl   = scoreLabel(val);
            const pct   = `${val}%`;
            return (
              <View key={sector.key} style={[styles.sectorCard, { borderColor: `${col}20` }]}>
                <Text style={[styles.sectorScore, { color: col }]}>{val}</Text>
                <View style={styles.sectorBar}>
                  <View style={[styles.sectorBarFill, { width: pct, backgroundColor: col }]} />
                </View>
                <Text style={styles.sectorName}>{sector.label}</Text>
                <Text style={styles.sectorUnit}>{sector.unit}</Text>
                <View style={[styles.sectorBadge, { backgroundColor: `${col}12`, borderColor: `${col}25` }]}>
                  <Text style={[styles.sectorBadgeText, { color: col }]}>{lbl}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* CTA to Alerts */}
        <TouchableOpacity
          style={styles.alertsCta}
          onPress={() => navigation.navigate('Alerts')}
          activeOpacity={0.85}
        >
          <Text style={styles.alertsCtaText}>View Alert Feed</Text>
          <Text style={styles.alertsCtaArrow}>›</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoMark: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: colors.green,
  },
  brand: { fontSize: 18, ...fonts.black, color: colors.textPrimary, letterSpacing: -0.5 },
  brandAccent: { color: colors.green },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    borderWidth: 1,
  },
  badgeLive: { backgroundColor: 'rgba(0,200,150,0.08)', borderColor: 'rgba(0,200,150,0.2)' },
  badgeSim:  { backgroundColor: 'rgba(30,50,80,0.6)',   borderColor: colors.border },
  badgeDot:  { width: 5, height: 5, borderRadius: 3 },
  badgeText: { fontSize: 10, ...fonts.semibold, letterSpacing: 0.5 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },

  communityPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  communityName: { fontSize: 14, ...fonts.semibold, color: colors.textPrimary },
  communityMeta: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  pickerChevron: { fontSize: 22, color: colors.textMuted, lineHeight: 24 },
  pickerList: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    overflow: 'hidden',
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerItemActive: { backgroundColor: 'rgba(0,200,150,0.06)' },
  pickerItemName: { fontSize: 13, ...fonts.medium, color: colors.textSecondary },
  pickerItemState: { fontSize: 11, color: colors.textMuted },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  heroCard: { marginBottom: 20 },
  heroLabel: {
    fontSize: 9,
    ...fonts.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  heroScoreRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginBottom: 16 },
  heroScore: { fontSize: 64, ...fonts.black, lineHeight: 68 },
  heroMeta: { paddingBottom: 8, gap: 6 },
  statusBadge: {
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  statusBadgeText: { fontSize: 10, ...fonts.bold, letterSpacing: 0.5 },
  heroSubLabel: { fontSize: 11, color: colors.textMuted },
  quickStats: { flexDirection: 'row', gap: 0 },
  quickStat: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    backgroundColor: '#0D1E35',
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickStatValue: { fontSize: 12, ...fonts.bold, color: colors.textPrimary },
  quickStatLabel: { fontSize: 9, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },

  sectionTitle: {
    fontSize: 12,
    ...fonts.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  sectorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  sectorCard: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 14,
  },
  sectorScore: { fontSize: 28, ...fonts.black, lineHeight: 32, marginBottom: 8 },
  sectorBar: {
    height: 3,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: 10,
    overflow: 'hidden',
  },
  sectorBarFill: { height: 3, borderRadius: 2 },
  sectorName: { fontSize: 12, ...fonts.semibold, color: colors.textPrimary, marginBottom: 2 },
  sectorUnit: { fontSize: 10, color: colors.textMuted, marginBottom: 8 },
  sectorBadge: {
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  sectorBadgeText: { fontSize: 9, ...fonts.bold, letterSpacing: 0.4 },

  alertsCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  alertsCtaText: { fontSize: 13, ...fonts.semibold, color: colors.textPrimary },
  alertsCtaArrow: { fontSize: 20, color: colors.textMuted, lineHeight: 22 },
});
