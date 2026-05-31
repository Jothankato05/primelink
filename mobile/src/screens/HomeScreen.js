// HomeScreen — citizen-facing community risk overview
// Shows: composite score, what it means, 5 sector bars with plain explanations
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, radius } from '../theme';
import {
  COMMUNITIES, SECTORS, getInitialScores, driftScores,
  compositeScore, scoreColor, scoreLabel, sectorMessage,
} from '../data/communities';

const BACKEND = 'http://10.116.65.43:4000';

export default function HomeScreen({ navigation }) {
  const [community,  setCommunity]  = useState(COMMUNITIES[0]);
  const [scores,     setScores]     = useState(getInitialScores(1));
  const [connected,  setConnected]  = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const composite = compositeScore(scores);
  const label     = scoreLabel(composite);
  const color     = scoreColor(composite);

  // What the score means in plain language
  const riskMessage = () => {
    if (composite >= 80) return `${community.name} is in excellent condition. All sectors are performing well.`;
    if (composite >= 65) return `${community.name} is stable. Most conditions are normal with minor areas to watch.`;
    if (composite >= 50) return `${community.name} has some concerns. A few sectors need attention.`;
    if (composite >= 35) return `${community.name} is under stress. Multiple sectors show elevated risk.`;
    return `${community.name} is in a critical state. Immediate attention is needed.`;
  };

  const fetchCommunity = async () => {
    try {
      const res  = await fetch(`${BACKEND}/api/communities/${community.id}`, { timeout: 4000 });
      const data = await res.json();
      if (data.success && data.data?.scores) {
        setScores(data.data.scores);
        setConnected(true);
        return;
      }
    } catch {}
    setConnected(false);
    // Offline: gentle drift toward baseline
    setScores(prev => driftScores(prev, community.id));
  };

  useEffect(() => {
    setScores(getInitialScores(community.id));
    fetchCommunity();
    const t = setInterval(fetchCommunity, 6000);
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
        <View>
          <Text style={styles.brand}>Prime<Text style={styles.brandAccent}>Link</Text></Text>
          <Text style={styles.headerSub}>Community Risk Network</Text>
        </View>
        <View style={[styles.livePill, connected ? styles.livePillOn : styles.livePillOff]}>
          <View style={[styles.liveDot, { backgroundColor: connected ? colors.green : colors.textMuted }]} />
          <Text style={[styles.liveText, { color: connected ? colors.green : colors.textMuted }]}>
            {connected ? 'LIVE' : 'OFFLINE'}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.green} />
        }
      >
        {/* Community picker */}
        <TouchableOpacity
          style={styles.picker}
          onPress={() => setPickerOpen(o => !o)}
          activeOpacity={0.75}
        >
          <View style={styles.pickerLeft}>
            <Text style={styles.pickerLabel}>YOUR COMMUNITY</Text>
            <Text style={styles.pickerName}>{community.name}</Text>
            <Text style={styles.pickerMeta}>{community.state} · {community.population.toLocaleString()} residents</Text>
          </View>
          <Text style={styles.pickerChevron}>{pickerOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {pickerOpen && (
          <View style={styles.pickerDropdown}>
            {COMMUNITIES.map(c => (
              <TouchableOpacity
                key={c.id}
                style={[styles.pickerOption, c.id === community.id && styles.pickerOptionActive]}
                onPress={() => { setCommunity(c); setPickerOpen(false); }}
              >
                <View>
                  <Text style={[styles.pickerOptionName, c.id === community.id && { color: colors.green }]}>
                    {c.name}
                  </Text>
                  <Text style={styles.pickerOptionMeta}>
                    {c.state} · {c.population.toLocaleString()} residents
                  </Text>
                </View>
                {c.id === community.id && (
                  <Text style={styles.pickerOptionCheck}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Hero risk score card */}
        <View style={[styles.heroCard, { borderColor: `${color}30` }]}>
          <Text style={styles.heroLabel}>COMMUNITY RISK SCORE</Text>

          <View style={styles.heroScoreRow}>
            <Text style={[styles.heroScore, { color }]}>{composite}</Text>
            <View style={styles.heroRight}>
              <View style={[styles.statusBadge, { backgroundColor: `${color}15`, borderColor: `${color}35` }]}>
                <Text style={[styles.statusBadgeText, { color }]}>{label}</Text>
              </View>
              <Text style={styles.heroScaleText}>out of 100</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.heroBar}>
            <View style={[styles.heroBarFill, { width: `${composite}%`, backgroundColor: color }]} />
          </View>

          {/* Plain-language message */}
          <Text style={styles.heroMessage}>{riskMessage()}</Text>

          {/* Community quick facts */}
          <View style={styles.factsRow}>
            <View style={styles.factItem}>
              <Text style={styles.factValue}>{community.population.toLocaleString()}</Text>
              <Text style={styles.factLabel}>Residents</Text>
            </View>
            <View style={styles.factDivider} />
            <View style={styles.factItem}>
              <Text style={styles.factValue}>{community.farms.toLocaleString()}</Text>
              <Text style={styles.factLabel}>Farms Tracked</Text>
            </View>
            <View style={styles.factDivider} />
            <View style={styles.factItem}>
              <Text style={styles.factValue}>{community.clinics}</Text>
              <Text style={styles.factLabel}>Health Clinics</Text>
            </View>
          </View>
        </View>

        {/* Risk level legend */}
        <View style={styles.legendRow}>
          {[
            { color: colors.green, label: 'Stable',   range: '65–100' },
            { color: colors.amber, label: 'Moderate', range: '40–64'  },
            { color: colors.red,   label: 'Critical', range: '0–39'   },
          ].map(item => (
            <View key={item.label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.label} ({item.range})</Text>
            </View>
          ))}
        </View>

        {/* Five sector breakdown */}
        <Text style={styles.sectionTitle}>Sector Breakdown</Text>
        <Text style={styles.sectionSubtitle}>
          Each sector is scored 0–100. Tap a sector to understand what the score means for you.
        </Text>

        {SECTORS.map(sector => {
          const val   = scores[sector.key] ?? 70;
          const col   = scoreColor(val);
          const lbl   = scoreLabel(val);
          const msg   = sectorMessage(sector.key, val);
          return (
            <View key={sector.key} style={[styles.sectorCard, { borderLeftColor: col }]}>
              <View style={styles.sectorTop}>
                <View style={styles.sectorLeft}>
                  <Text style={styles.sectorIcon}>{sector.icon}</Text>
                  <View>
                    <Text style={styles.sectorName}>{sector.label}</Text>
                    <Text style={styles.sectorUnit}>{sector.unit}</Text>
                  </View>
                </View>
                <View style={styles.sectorRight}>
                  <Text style={[styles.sectorScore, { color: col }]}>{val}</Text>
                  <View style={[styles.sectorBadge, { backgroundColor: `${col}14`, borderColor: `${col}28` }]}>
                    <Text style={[styles.sectorBadgeText, { color: col }]}>{lbl}</Text>
                  </View>
                </View>
              </View>

              {/* Sector progress bar */}
              <View style={styles.sectorBar}>
                <View style={[styles.sectorBarFill, { width: `${val}%`, backgroundColor: col }]} />
              </View>

              {/* Plain-language what this means */}
              <Text style={styles.sectorQuestion}>{sector.question}</Text>
              <Text style={[styles.sectorMessage, { color: val >= 65 ? colors.textSecondary : val >= 40 ? colors.amber : colors.red }]}>
                {msg}
              </Text>
            </View>
          );
        })}

        {/* See alerts CTA */}
        <TouchableOpacity
          style={styles.alertsCta}
          onPress={() => navigation.navigate('Alerts')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.alertsCtaTitle}>View Community Alerts</Text>
            <Text style={styles.alertsCtaBody}>See what's happening in your area right now</Text>
          </View>
          <Text style={styles.alertsCtaArrow}>›</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brand:     { fontSize: 20, ...fonts.black, color: colors.textPrimary, letterSpacing: -0.5 },
  brandAccent: { color: colors.green },
  headerSub: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
  livePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 99, borderWidth: 1,
  },
  livePillOn:  { backgroundColor: 'rgba(0,200,150,0.08)', borderColor: 'rgba(0,200,150,0.22)' },
  livePillOff: { backgroundColor: 'rgba(30,50,80,0.5)',   borderColor: colors.border },
  liveDot: { width: 5, height: 5, borderRadius: 3 },
  liveText: { fontSize: 9, ...fonts.semibold, letterSpacing: 0.5 },

  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 16 },

  // ── Community picker ──────────────────────────────────────────────────────
  picker: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
    padding: 14, marginBottom: 12,
  },
  pickerLeft: { flex: 1 },
  pickerLabel: {
    fontSize: 8, ...fonts.semibold, color: colors.green,
    letterSpacing: 1.2, marginBottom: 4,
  },
  pickerName: { fontSize: 15, ...fonts.bold, color: colors.textPrimary },
  pickerMeta: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  pickerChevron: { fontSize: 10, color: colors.textMuted, marginLeft: 8 },

  pickerDropdown: {
    backgroundColor: colors.card, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
    marginBottom: 12, overflow: 'hidden',
  },
  pickerOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  pickerOptionActive: { backgroundColor: 'rgba(0,200,150,0.06)' },
  pickerOptionName:   { fontSize: 13, ...fonts.medium, color: colors.textSecondary },
  pickerOptionMeta:   { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  pickerOptionCheck:  { fontSize: 14, color: colors.green },

  // ── Hero card ─────────────────────────────────────────────────────────────
  heroCard: {
    backgroundColor: colors.card, borderRadius: radius.lg,
    borderWidth: 1, padding: 18, marginBottom: 12,
  },
  heroLabel: {
    fontSize: 9, ...fonts.semibold, color: colors.textMuted,
    letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 10,
  },
  heroScoreRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 14, marginBottom: 14 },
  heroScore:    { fontSize: 72, ...fonts.black, lineHeight: 76 },
  heroRight:    { paddingBottom: 8, gap: 8 },
  statusBadge: {
    borderRadius: 5, borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start',
  },
  statusBadgeText: { fontSize: 11, ...fonts.bold, letterSpacing: 0.5 },
  heroScaleText:   { fontSize: 11, color: colors.textMuted },

  heroBar: {
    height: 4, backgroundColor: colors.border,
    borderRadius: 2, marginBottom: 14, overflow: 'hidden',
  },
  heroBarFill: { height: 4, borderRadius: 2 },

  heroMessage: {
    fontSize: 13, color: colors.textSecondary,
    lineHeight: 20, marginBottom: 16,
  },

  factsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#0D1828', borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.border, paddingVertical: 12,
  },
  factItem: { flex: 1, alignItems: 'center' },
  factValue: { fontSize: 15, ...fonts.bold, color: colors.textPrimary },
  factLabel: { fontSize: 9, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  factDivider: { width: 1, height: 28, backgroundColor: colors.border },

  // ── Legend ────────────────────────────────────────────────────────────────
  legendRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
    marginBottom: 20, paddingHorizontal: 2,
  },
  legendItem:  { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot:   { width: 7, height: 7, borderRadius: 4 },
  legendText:  { fontSize: 10, color: colors.textMuted },

  // ── Sections ──────────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: 16, ...fonts.bold, color: colors.textPrimary, marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12, color: colors.textMuted, lineHeight: 18, marginBottom: 14,
  },

  // ── Sector cards ──────────────────────────────────────────────────────────
  sectorCard: {
    backgroundColor: colors.card, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
    borderLeftWidth: 3, padding: 14, marginBottom: 10,
  },
  sectorTop: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: 12,
  },
  sectorLeft:  { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  sectorIcon:  { fontSize: 22 },
  sectorName:  { fontSize: 14, ...fonts.bold, color: colors.textPrimary },
  sectorUnit:  { fontSize: 10, color: colors.textMuted, marginTop: 1 },
  sectorRight: { alignItems: 'flex-end', gap: 5 },
  sectorScore: { fontSize: 30, ...fonts.black, lineHeight: 34 },
  sectorBadge: {
    borderRadius: 4, borderWidth: 1,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  sectorBadgeText: { fontSize: 9, ...fonts.bold, letterSpacing: 0.4 },

  sectorBar: {
    height: 3, backgroundColor: colors.border,
    borderRadius: 2, marginBottom: 12, overflow: 'hidden',
  },
  sectorBarFill: { height: 3, borderRadius: 2 },

  sectorQuestion: {
    fontSize: 11, ...fonts.semibold, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 5,
  },
  sectorMessage: { fontSize: 12, lineHeight: 19 },

  // ── Alerts CTA ────────────────────────────────────────────────────────────
  alertsCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.card, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.green + '30',
    paddingHorizontal: 16, paddingVertical: 16, marginTop: 8,
  },
  alertsCtaTitle: { fontSize: 14, ...fonts.semibold, color: colors.textPrimary, marginBottom: 2 },
  alertsCtaBody:  { fontSize: 11, color: colors.textMuted },
  alertsCtaArrow: { fontSize: 24, color: colors.green, lineHeight: 26 },
});
