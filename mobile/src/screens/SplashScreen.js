import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, StatusBar,
} from 'react-native';
import { colors, fonts, radius } from '../theme';

const CYCLING_SECTORS = ['Health', 'Agriculture', 'Environment', 'Finance', 'Climate'];

const COMMUNITY_STATS = [
  { value: '8',     label: 'Communities'     },
  { value: '5',     label: 'Risk Sectors'    },
  { value: '24hrs', label: 'Score Updates'   },
];

export default function SplashScreen({ onEnter }) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(28)).current;
  const [activeSector, setActiveSector] = useState(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();

    const t = setInterval(() => {
      setActiveSector(i => (i + 1) % CYCLING_SECTORS.length);
    }, 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />

      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        {/* Logo mark */}
        <View style={styles.logoWrap}>
          <View style={styles.logoOuter}>
            <View style={styles.logoInner} />
          </View>
        </View>

        {/* Brand */}
        <Text style={styles.brand}>
          Prime<Text style={styles.brandAccent}>Link</Text>
        </Text>
        <Text style={styles.tagline}>COMMUNITY RISK INTELLIGENCE</Text>

        {/* Tagline description */}
        <Text style={styles.headline}>
          Know your community's risk score — before it becomes a crisis.
        </Text>

        {/* Sector cycling pill */}
        <View style={styles.sectorRow}>
          <Text style={styles.sectorPrefix}>Tracking</Text>
          <View style={styles.sectorPill}>
            <Text style={styles.sectorPillText}>{CYCLING_SECTORS[activeSector]}</Text>
          </View>
        </View>

        {/* What it covers */}
        <Text style={styles.description}>
          PrimeLink scores your community across health, agriculture, environment,
          finance, and climate — giving you one clear number that shows
          how safe and resilient your community is right now.
        </Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          {COMMUNITY_STATS.map(stat => (
            <View key={stat.label} style={styles.stat}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.cta} onPress={onEnter} activeOpacity={0.85}>
          <Text style={styles.ctaText}>Check My Community  →</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>PRIMERS CORPORATION · NIGERIA · 2026</Text>
      </Animated.View>

      {/* Status footer */}
      <View style={styles.statusBar}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>SYSTEM ONLINE</Text>
        <Text style={styles.statusSub}>  8 communities monitored · 5 sectors · live scoring</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },

  logoWrap: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: colors.green,
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 14,
  },
  logoOuter: {
    width: 32,
    height: 32,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
  },
  logoInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: 'white',
  },

  brand: {
    fontSize: 46,
    ...fonts.black,
    color: colors.textPrimary,
    letterSpacing: -1.5,
    marginBottom: 6,
  },
  brandAccent: { color: colors.green },
  tagline: {
    fontSize: 9,
    ...fonts.semibold,
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: 20,
  },

  headline: {
    fontSize: 16,
    ...fonts.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    maxWidth: 300,
  },

  sectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    height: 30,
  },
  sectorPrefix: { fontSize: 13, color: colors.textDim, ...fonts.medium },
  sectorPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(0,200,150,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,200,150,0.22)',
  },
  sectorPillText: { fontSize: 13, ...fonts.semibold, color: colors.green },

  description: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 32,
    maxWidth: 320,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 28,
    marginBottom: 36,
  },
  stat: { alignItems: 'center' },
  statValue: {
    fontSize: 26,
    ...fonts.black,
    color: colors.textPrimary,
    lineHeight: 30,
  },
  statLabel: {
    fontSize: 9,
    ...fonts.medium,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 3,
  },

  cta: {
    backgroundColor: colors.green,
    paddingHorizontal: 36,
    paddingVertical: 15,
    borderRadius: radius.md,
    shadowColor: colors.green,
    shadowOpacity: 0.32,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    marginBottom: 28,
  },
  ctaText: { fontSize: 15, ...fonts.semibold, color: 'white', letterSpacing: 0.2 },

  footer: {
    fontSize: 9,
    color: colors.textDim,
    letterSpacing: 1.2,
    ...fonts.medium,
  },

  statusBar: {
    position: 'absolute',
    bottom: 36,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: 'rgba(11,22,40,0.92)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: colors.green,
    marginRight: 8,
  },
  statusText: {
    fontSize: 10,
    ...fonts.semibold,
    color: colors.green,
    letterSpacing: 0.8,
  },
  statusSub: { fontSize: 10, color: colors.textDim },
});
