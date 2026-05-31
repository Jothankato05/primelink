// AlertsScreen — citizen-facing alert feed
// Plain language, no IoT references, actionable messages
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, StatusBar, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, radius } from '../theme';
import { INITIAL_ALERTS } from '../data/communities';

const BACKEND = 'http://10.116.65.43:4000';

const TYPE_CONFIG = {
  red:   { label: 'CRITICAL', color: colors.red,   bg: 'rgba(255,58,92,0.07)',  border: 'rgba(255,58,92,0.20)'  },
  amber: { label: 'WARNING',  color: colors.amber,  bg: 'rgba(245,166,35,0.07)', border: 'rgba(245,166,35,0.20)' },
  green: { label: 'GOOD NEWS',color: colors.green,  bg: 'rgba(0,200,150,0.07)',  border: 'rgba(0,200,150,0.20)'  },
  info:  { label: 'INFO',     color: '#60A5FA',     bg: 'rgba(59,130,246,0.07)', border: 'rgba(59,130,246,0.18)' },
};

// Citizen-friendly sector labels — no IoT
const SECTOR_LABELS = {
  health:      '🏥 Health',
  agriculture: '🌾 Agriculture',
  environment: '🌿 Environment',
  finance:     '📈 Finance',
  climate:     '☁️ Climate',
};

const FILTER_TABS = [
  { key: 'ALL',      label: 'All' },
  { key: 'CRITICAL', label: 'Critical' },
  { key: 'WARNING',  label: 'Warnings' },
  { key: 'GOOD NEWS',label: 'Good News' },
  { key: 'INFO',     label: 'Info' },
];

export default function AlertsScreen() {
  const [alerts,     setAlerts]     = useState(INITIAL_ALERTS);
  const [connected,  setConnected]  = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter,     setFilter]     = useState('ALL');

  const fetchAlerts = async () => {
    try {
      const res  = await fetch(`${BACKEND}/api/alerts?limit=50`);
      const data = await res.json();
      if (data.success && data.data?.length > 0) {
        setAlerts(data.data);
        setConnected(true);
        return;
      }
    } catch {}
    setConnected(false);
  };

  useEffect(() => {
    fetchAlerts();
    const t = setInterval(fetchAlerts, 8000);
    return () => clearInterval(t);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  };

  const filtered = filter === 'ALL'
    ? alerts
    : alerts.filter(a => TYPE_CONFIG[a.type]?.label === filter);

  const counts = Object.fromEntries(
    Object.entries(TYPE_CONFIG).map(([key, cfg]) => [
      cfg.label,
      alerts.filter(a => a.type === key).length,
    ])
  );

  const renderAlert = ({ item }) => {
    const cfg    = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.info;
    const sector = item.sector ? (SECTOR_LABELS[item.sector] ?? item.sector) : null;

    return (
      <View style={[styles.alertCard, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
        {/* Type badge + sector + time */}
        <View style={styles.alertMeta}>
          <View style={[styles.typePill, { backgroundColor: `${cfg.color}18`, borderColor: `${cfg.color}35` }]}>
            <View style={[styles.typeDot, { backgroundColor: cfg.color }]} />
            <Text style={[styles.typeLabel, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
          {sector && (
            <Text style={styles.sectorTag}>{sector}</Text>
          )}
          <Text style={styles.alertTime}>{item.time}</Text>
        </View>

        {/* Alert text */}
        <Text style={styles.alertText}>{item.text}</Text>
      </View>
    );
  };

  const renderHeader = () => (
    <>
      {/* Page header */}
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageTitle}>Community Alerts</Text>
          <Text style={styles.pageSubtitle}>
            What's happening in your communities right now
          </Text>
        </View>
        {connected && (
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </View>

      {/* Summary counts */}
      <View style={styles.summaryRow}>
        {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
          <View key={key} style={styles.summaryItem}>
            <Text style={[styles.summaryCount, { color: cfg.color }]}>
              {counts[cfg.label] ?? 0}
            </Text>
            <Text style={styles.summaryLabel}>{cfg.label}</Text>
          </View>
        ))}
      </View>

      {/* Filter tabs */}
      <ScrollRow filter={filter} setFilter={setFilter} counts={counts} />

      {filtered.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>✓</Text>
          <Text style={styles.emptyTitle}>No alerts in this category</Text>
          <Text style={styles.emptyBody}>All clear for "{filter.toLowerCase()}" alerts right now.</Text>
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <FlatList
        data={filtered}
        keyExtractor={(item, idx) => `${item.id ?? idx}`}
        renderItem={renderAlert}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.green} />
        }
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListFooterComponent={<View style={{ height: 32 }} />}
      />
    </SafeAreaView>
  );
}

function ScrollRow({ filter, setFilter, counts }) {
  return (
    <View style={styles.filterRow}>
      {FILTER_TABS.map(tab => {
        const count  = tab.key === 'ALL' ? null : counts[tab.key] ?? 0;
        const active = filter === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.filterTab, active && styles.filterTabActive]}
            onPress={() => setFilter(tab.key)}
          >
            <Text style={[styles.filterTabText, active && styles.filterTabTextActive]}>
              {tab.label}
            </Text>
            {count !== null && count > 0 && (
              <View style={[styles.filterBadge, active && styles.filterBadgeActive]}>
                <Text style={[styles.filterBadgeText, active && styles.filterBadgeTextActive]}>
                  {count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  listContent: { paddingHorizontal: 16, paddingTop: 16 },

  // ── Page header ───────────────────────────────────────────────────────────
  pageHeader: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: 16,
  },
  pageTitle:   { fontSize: 22, ...fonts.black, color: colors.textPrimary, letterSpacing: -0.5 },
  pageSubtitle:{ fontSize: 12, color: colors.textMuted, marginTop: 3, lineHeight: 18 },
  livePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 99, borderWidth: 1,
    backgroundColor: 'rgba(0,200,150,0.08)',
    borderColor: 'rgba(0,200,150,0.22)',
  },
  liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.green },
  liveText: { fontSize: 9, ...fonts.semibold, color: colors.green, letterSpacing: 0.5 },

  // ── Summary ───────────────────────────────────────────────────────────────
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    paddingVertical: 12,
  },
  summaryItem: {
    flex: 1, alignItems: 'center',
    borderRightWidth: 1, borderRightColor: colors.border,
  },
  summaryCount: { fontSize: 22, ...fonts.black },
  summaryLabel: {
    fontSize: 7, ...fonts.semibold, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2,
  },

  // ── Filter tabs ───────────────────────────────────────────────────────────
  filterRow: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 6, marginBottom: 16,
  },
  filterTab: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 11, paddingVertical: 6,
    borderRadius: 99, borderWidth: 1,
    borderColor: colors.border, backgroundColor: colors.card,
  },
  filterTabActive: {
    borderColor: colors.green,
    backgroundColor: 'rgba(0,200,150,0.09)',
  },
  filterTabText: { fontSize: 10, ...fonts.medium, color: colors.textMuted },
  filterTabTextActive: { color: colors.green, ...fonts.semibold },
  filterBadge: {
    minWidth: 16, height: 16, borderRadius: 8,
    backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeActive:     { backgroundColor: 'rgba(0,200,150,0.2)' },
  filterBadgeText:       { fontSize: 9, ...fonts.bold, color: colors.textMuted },
  filterBadgeTextActive: { color: colors.green },

  // ── Alert cards ───────────────────────────────────────────────────────────
  alertCard: {
    borderRadius: radius.md, borderWidth: 1,
    padding: 14,
  },
  alertMeta: {
    flexDirection: 'row', alignItems: 'center',
    gap: 6, marginBottom: 8, flexWrap: 'wrap',
  },
  typePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 99, borderWidth: 1,
  },
  typeDot:    { width: 5, height: 5, borderRadius: 3 },
  typeLabel:  { fontSize: 9, ...fonts.bold, letterSpacing: 0.4 },
  sectorTag: {
    fontSize: 10, ...fonts.medium, color: colors.textMuted,
    backgroundColor: 'rgba(26,46,74,0.9)',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
  },
  alertTime: { fontSize: 9, color: colors.textMuted, marginLeft: 'auto' },
  alertText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyState: { alignItems: 'center', paddingVertical: 52 },
  emptyIcon:  { fontSize: 32, marginBottom: 12 },
  emptyTitle: { fontSize: 15, ...fonts.semibold, color: colors.textSecondary, marginBottom: 6 },
  emptyBody:  { fontSize: 12, color: colors.textMuted, textAlign: 'center' },
});
