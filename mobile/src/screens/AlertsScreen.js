import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, StatusBar, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, radius } from '../theme';
import { INITIAL_ALERTS } from '../data/communities';

const BACKEND = 'http://localhost:4000';

const TYPE_CONFIG = {
  red:   { label: 'CRITICAL', dot: colors.red,   bg: 'rgba(255,58,92,0.06)',   border: 'rgba(255,58,92,0.18)'   },
  amber: { label: 'WARNING',  dot: colors.amber,  bg: 'rgba(245,166,35,0.06)',  border: 'rgba(245,166,35,0.18)'  },
  green: { label: 'RESOLVED', dot: colors.green,  bg: 'rgba(0,200,150,0.06)',   border: 'rgba(0,200,150,0.18)'   },
  info:  { label: 'INFO',     dot: colors.blue,   bg: 'rgba(59,130,246,0.06)',  border: 'rgba(59,130,246,0.18)'  },
};

const SECTOR_LABELS = {
  environment: 'Environment',
  agriculture: 'Agriculture',
  health:      'Health',
  finance:     'Finance',
  iot:         'IoT Network',
};

const FILTER_OPTIONS = ['ALL', 'CRITICAL', 'WARNING', 'INFO', 'RESOLVED'];

export default function AlertsScreen() {
  const [alerts,     setAlerts]     = useState(INITIAL_ALERTS);
  const [connected,  setConnected]  = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter,     setFilter]     = useState('ALL');

  const fetchAlerts = async () => {
    try {
      const res  = await fetch(`${BACKEND}/api/alerts?limit=50`);
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setAlerts(data.data);
        setConnected(true);
      }
    } catch {
      setConnected(false);
    }
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
    : alerts.filter(a => {
        const cfg = TYPE_CONFIG[a.type];
        return cfg && cfg.label === filter;
      });

  const renderAlert = ({ item }) => {
    const cfg     = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.info;
    const sector  = SECTOR_LABELS[item.sector] ?? item.sector;
    return (
      <View style={[styles.alertRow, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
        <View style={styles.alertLeft}>
          <View style={[styles.alertDot, { backgroundColor: cfg.dot }]} />
        </View>
        <View style={styles.alertBody}>
          <View style={styles.alertMeta}>
            <Text style={[styles.alertType, { color: cfg.dot }]}>{cfg.label}</Text>
            {sector ? <Text style={styles.alertSector}>{sector}</Text> : null}
            <Text style={styles.alertTime}>{item.time}</Text>
          </View>
          <Text style={styles.alertText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Alert Feed</Text>
          <Text style={styles.pageSubtitle}>
            {connected ? 'Live · updates every 8s' : 'Simulation · no backend'}
          </Text>
        </View>
        <View style={[styles.badge, connected ? styles.badgeLive : styles.badgeSim]}>
          <View style={[styles.badgeDot, { backgroundColor: connected ? colors.green : colors.textMuted }]} />
          <Text style={[styles.badgeText, { color: connected ? colors.green : colors.textMuted }]}>
            {connected ? 'LIVE' : 'SIM'}
          </Text>
        </View>
      </View>

      {/* Summary strip */}
      <View style={styles.summaryStrip}>
        {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
          const count = alerts.filter(a => a.type === key).length;
          return (
            <View key={key} style={styles.summaryStat}>
              <Text style={[styles.summaryCount, { color: cfg.dot }]}>{count}</Text>
              <Text style={styles.summaryLabel}>{cfg.label}</Text>
            </View>
          );
        })}
      </View>

      {/* Filter bar */}
      <View style={styles.filterBar}>
        {FILTER_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt}
            style={[styles.filterChip, filter === opt && styles.filterChipActive]}
            onPress={() => setFilter(opt)}
          >
            <Text style={[styles.filterChipText, filter === opt && styles.filterChipTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No alerts match this filter</Text>
          <Text style={styles.emptyBody}>Adjust the filter above to view alert history.</Text>
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
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={<View style={{ height: 32 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  listContent: { paddingHorizontal: 16, paddingTop: 16 },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pageTitle: { fontSize: 22, ...fonts.black, color: colors.textPrimary, letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
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

  summaryStrip: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    paddingVertical: 12,
  },
  summaryStat: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  summaryCount: { fontSize: 20, ...fonts.black },
  summaryLabel: {
    fontSize: 8,
    ...fonts.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 2,
  },

  filterBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  filterChipActive: {
    borderColor: colors.green,
    backgroundColor: 'rgba(0,200,150,0.08)',
  },
  filterChipText: {
    fontSize: 9,
    ...fonts.semibold,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  filterChipTextActive: { color: colors.green },

  alertRow: {
    flexDirection: 'row',
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 12,
    gap: 10,
  },
  alertLeft: { paddingTop: 4 },
  alertDot: { width: 6, height: 6, borderRadius: 3 },
  alertBody: { flex: 1 },
  alertMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  alertType: { fontSize: 9, ...fonts.bold, letterSpacing: 0.5 },
  alertSector: {
    fontSize: 9,
    ...fonts.medium,
    color: colors.textMuted,
    backgroundColor: 'rgba(26,46,74,0.8)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  alertTime: { fontSize: 9, color: colors.textMuted, marginLeft: 'auto' },
  alertText: { fontSize: 12, color: colors.textSecondary, lineHeight: 18 },

  separator: { height: 6 },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: { fontSize: 14, ...fonts.semibold, color: colors.textSecondary, marginBottom: 6 },
  emptyBody:  { fontSize: 12, color: colors.textMuted, textAlign: 'center' },
});
