import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import AnimatedSpatialBackground from '../../components/AnimatedSpatialBackground';
import GlassCard from '../../components/GlassCard';
import NeonButton from '../../components/NeonButton';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../context/BookingContext';
import { useResponsive } from '../../hooks/useResponsive';
import { triggerHaptic } from '../../utils/haptics';

export const ProfileScreen = ({ navigation }) => {
  const { user, logoutUser } = useAuth();
  const { bookings } = useBookings();
  const { isMobile, isTablet, isDesktop, maxContentWidth, gutter } = useResponsive();

  const completedCount = bookings.filter((b) => b.status === 'trip_completed').length;
  const ratingsCount = bookings.filter((b) => b.reviewSubmitted).length;

  const handleLogout = () => {
    triggerHaptic('impactMedium');
    Alert.alert('Disconnect Terminal', 'Are you sure you want to sign out from DriveNearby AI?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logoutUser();
          navigation.replace('Login');
        },
      },
    ]);
  };

  const isWideLayout = isDesktop || isTablet;

  return (
    <AnimatedSpatialBackground>
      <SafeAreaView style={styles.safeArea}>
        {/* Responsive Shell */}
        <View style={[styles.responsiveShell, { maxWidth: maxContentWidth, paddingHorizontal: isMobile ? 12 : gutter }]}>
          {/* App Bar */}
          <View style={styles.appBar}>
            <Text style={styles.appBarTitle}>IDENTITY & ACCESS</Text>
            <View style={styles.securityTag}>
              <Ionicons name="shield-checkmark" size={12} color={COLORS.cyan} />
              <Text style={styles.securityText}>ENCRYPTED ID</Text>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={[styles.scrollContent, { paddingBottom: isMobile ? 80 : 100 }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Automatic Multi-Column Split on Desktop/Tablet vs Single-Column on Mobile */}
            <View style={isWideLayout ? styles.wideRow : styles.mobileCol}>
              {/* Left Column: User Hero Card */}
              <View style={isWideLayout ? styles.wideLeftCol : styles.fullWidth}>
                <GlassCard style={styles.userCard} glowColor={COLORS.cyan}>
                  <View style={styles.avatarHalo}>
                    <Image
                      source={{
                        uri:
                          user?.avatar ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
                      }}
                      style={styles.avatar}
                    />
                    <View style={styles.statusDot} />
                  </View>

                  <Text style={styles.name}>{user?.name || 'Sai Dinesh'}</Text>
                  <Text style={styles.roleTag}>AI MOBILITY CITIZEN • BENGALURU SECTOR</Text>

                  <View style={styles.contactWrap}>
                    <View style={styles.contactRow}>
                      <Ionicons name="mail-outline" size={13} color={COLORS.cyan} />
                      <Text style={styles.contactText}>{user?.email || 'dinesh@drivenearby.ai'}</Text>
                    </View>
                    <View style={styles.contactRow}>
                      <Ionicons name="call-outline" size={13} color={COLORS.cyan} />
                      <Text style={styles.contactText}>{user?.phone || '+91 98765 43210'}</Text>
                    </View>
                  </View>

                  {/* Quick Stats Grid */}
                  <View style={styles.statsRow}>
                    <View style={styles.statCol}>
                      <Text style={styles.statNum}>{bookings.length}</Text>
                      <Text style={styles.statLabel}>MISSIONS</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statCol}>
                      <Text style={[styles.statNum, { color: COLORS.cyan }]}>{completedCount}</Text>
                      <Text style={styles.statLabel}>COMPLETED</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statCol}>
                      <Text style={[styles.statNum, { color: COLORS.neonGold }]}>{ratingsCount}</Text>
                      <Text style={styles.statLabel}>RATINGS GIVEN</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statCol}>
                      <Text style={[styles.statNum, { color: COLORS.electricViolet }]}>2024</Text>
                      <Text style={styles.statLabel}>MEMBER</Text>
                    </View>
                  </View>
                </GlassCard>
              </View>

              {/* Right Column: Settings, Waypoints & Security */}
              <View style={isWideLayout ? styles.wideRightCol : styles.fullWidth}>
                {/* Saved Geofences / Locations */}
                <GlassCard style={styles.sectionCard} glowColor={COLORS.electricViolet}>
                  <View style={styles.sectionHeaderRow}>
                    <View style={styles.secTitleRow}>
                      <Ionicons name="location-outline" size={16} color={COLORS.cyan} />
                      <Text style={styles.sectionTitle}>SAVED WAYPOINTS</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        triggerHaptic('impactLight');
                        Alert.alert('Register Waypoint', 'GPS waypoint coordinate capture active.');
                      }}
                    >
                      <Text style={styles.sectionAction}>+ ADD NEW</Text>
                    </TouchableOpacity>
                  </View>

                  {(user?.savedLocations || [
                    { id: 'loc-1', label: 'Primary Terminal (Home)', address: 'Indiranagar 100ft Rd, Bengaluru', icon: 'home' },
                    { id: 'loc-2', label: 'Workspace Hub (Office)', address: 'RMZ Infinity, Old Madras Rd', icon: 'briefcase' },
                  ]).map((loc) => (
                    <View key={loc.id || loc.label} style={styles.locItem}>
                      <View style={styles.locIconCircle}>
                        <Ionicons name={loc.icon || 'location'} size={15} color={COLORS.cyan} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.locLabel}>{loc.label}</Text>
                        <Text style={styles.locAddress} numberOfLines={1}>{loc.address}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
                    </View>
                  ))}
                </GlassCard>

                {/* AI Settings & Preference Protocol */}
                <GlassCard style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>AI PARAMETERS & SAFETY</Text>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('BookingsTab')}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuIconWrap}>
                      <Ionicons name="receipt-outline" size={16} color={COLORS.cyan} />
                    </View>
                    <Text style={styles.menuLabel}>Mission Archives & Invoices</Text>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => Alert.alert('AI Trust Algorithm', 'DriveNearby AI Trust score engine calculates multi-dimensional real-time telemetry.')}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.menuIconWrap, { backgroundColor: 'rgba(129, 140, 248, 0.15)' }]}>
                      <Ionicons name="sparkles" size={16} color={COLORS.electricViolet} />
                    </View>
                    <Text style={styles.menuLabel}>Neural Trust Ranking Engine</Text>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => Alert.alert('Biometric & SOS Security', '24/7 autonomous safety surveillance and live telemetry.')}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.menuIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                      <Ionicons name="shield-checkmark" size={16} color={COLORS.neonGreen} />
                    </View>
                    <Text style={styles.menuLabel}>Autonomous Safety & SOS Protocol</Text>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </GlassCard>

                {/* Sign Out CTA */}
                <View style={styles.logoutWrap}>
                  <NeonButton
                    title="DISCONNECT TERMINAL (SIGN OUT)"
                    icon="log-out-outline"
                    variant="outline"
                    onPress={handleLogout}
                  />
                </View>
              </View>
            </View>

            <Text style={styles.versionText}>DRIVENEARBY AI • OS BUILD 2.4.0 (EXPO + SPATIAL 3D UI)</Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    </AnimatedSpatialBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  responsiveShell: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  appBarTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 1.2,
  },
  securityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 242, 254, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
    gap: 4,
  },
  securityText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  wideRow: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'flex-start',
  },
  mobileCol: {
    flexDirection: 'column',
  },
  wideLeftCol: {
    width: 380,
    maxWidth: 400,
  },
  wideRightCol: {
    flex: 1,
  },
  fullWidth: {
    width: '100%',
  },
  userCard: {
    padding: 22,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarHalo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    padding: 3,
    borderWidth: 2,
    borderColor: COLORS.cyan,
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 44,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#050814',
  },
  name: {
    fontSize: 19,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  roleTag: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.cyan,
    letterSpacing: 1,
    marginTop: 4,
    marginBottom: 12,
  },
  contactWrap: {
    gap: 6,
    marginBottom: 16,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 10,
    padding: 10,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  statCol: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginTop: 3,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  sectionCard: {
    padding: 16,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  secTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  sectionAction: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 0.8,
  },
  locItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  locIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  locAddress: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 242, 254, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  logoutWrap: {
    marginVertical: 12,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 8.5,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.25)',
    letterSpacing: 1,
    marginTop: 8,
  },
});

export default ProfileScreen;
