import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, StatusBar, Dimensions,
} from 'react-native';
import { colors, fonts, radius } from '../theme';

const { width } = Dimensions.get('window');

const SECTORS = ['Health', 'Agriculture', 'Environment', 'Finance', 'IoT'];

export default function SplashScreen({ onEnter }) {
  const fadeAnim    = useRef(new Animated.Value(0)).current;
  const slideAnim   = useRef(new Animated.Value(24)).current;
  const sectorIndex = useRef(new Animated.Value(0)).current;
  const [activeSector, setActiveSector] = React.useState(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();

    const t = setInterval(() => {
      setActiveSector(i => (i + 1) % SECTORS.length);
    }, 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

        {/* Logo mark */}
        <View style={styles.logoMark}>
          <View style={styles.hexOuter}>
            <View style={styles.hexInner} />
          </View>
        </View>

        {/* Brand */}
        <Text style={styles.brand}>
          Prime<Text style={styles.brandAccent}>Link</Text>
        </Text>
        <Text style={styles.tagline}>COMMUNITY RISK INTELLIGENCE NETWORK</Text>

        {/* Sector cycling */}
        <View style={styles.sectorRow}>
          <Text style={styles.sectorPrefix}>Monitoring</Text>
          <View style={styles.sectorBadge}>
            <Text style={styles.sectorText}>{SECTORS[activeSector]}</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          Real-time intelligence across five sectors — enabling proactive intervention before community crises escalate.
        </Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { value: '8',   label: 'Communities' },
            { value: '127', label: 'IoT Sensors'  },
            { value: '5',   label: 'Risk Sectors' },
          ].map(stat => (
            <View key={stat.label} style={styles.stat}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.cta} onPress={onEnter} activeOpacity={0.85}>
          <Text style={styles.ctaText}>Open Dashboard</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>PRIMERS CORPORATION — NIGERIA — 2026</Text>
      </Animated.View>

      {/* Status bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>SYSTEM ONLINE</Text>
        <Text style={styles.statusSub}>  127 sensors active</Text>
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
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: colors.green,
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  hexOuter: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
  },
  hexInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  brand: {
    fontSize: 48,
    ...fonts.black,
    color: colors.textPrimary,
    letterSpacing: -1.5,
    marginBottom: 8,
  },
  brandAccent: {
    color: colors.green,
  },
  tagline: {
    fontSize: 9,
    ...fonts.semibold,
    color: colors.textMuted,
    letterSpacing: 1.8,
    marginBottom: 28,
  },
  sectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    height: 28,
  },
  sectorPrefix: {
    fontSize: 12,
    color: colors.textDim,
    ...fonts.medium,
  },
  sectorBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(0,200,150,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0,200,150,0.2)',
  },
  sectorText: {
    fontSize: 12,
    ...fonts.semibold,
    color: colors.green,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 36,
    maxWidth: 320,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 40,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    ...fonts.black,
    color: colors.textPrimary,
    lineHeight: 32,
  },
  statLabel: {
    fontSize: 10,
    ...fonts.medium,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  cta: {
    backgroundColor: colors.green,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: radius.md,
    shadowColor: colors.green,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    marginBottom: 28,
  },
  ctaText: {
    fontSize: 14,
    ...fonts.semibold,
    color: 'white',
    letterSpacing: 0.2,
  },
  footer: {
    fontSize: 9,
    color: colors.textDim,
    letterSpacing: 1.2,
    ...fonts.medium,
  },
  statusBar: {
    position: 'absolute',
    bottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: 'rgba(11,22,40,0.9)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.green,
    marginRight: 8,
  },
  statusText: {
    fontSize: 10,
    ...fonts.semibold,
    color: colors.green,
    letterSpacing: 0.8,
  },
  statusSub: {
    fontSize: 10,
    color: colors.textDim,
  },
});
