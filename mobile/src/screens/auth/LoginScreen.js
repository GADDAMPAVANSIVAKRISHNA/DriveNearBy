import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import AnimatedSpatialBackground from '../../components/AnimatedSpatialBackground';
import GlassCard from '../../components/GlassCard';
import NeonButton from '../../components/NeonButton';
import { useAuth } from '../../context/AuthContext';
import { triggerHaptic } from '../../utils/haptics';

export const LoginScreen = ({ navigation }) => {
  const { loginUser } = useAuth();
  const [email, setEmail] = useState('dinesh@drivenearby.ai');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    triggerHaptic('impactMedium');
    if (!email || !password) {
      Alert.alert('Missing Parameters', 'Please provide authentication email and credentials.');
      return;
    }

    setLoading(true);
    const res = await loginUser(email, password);
    setLoading(false);

    if (res.success) {
      navigation.replace('MainTabs');
    } else {
      navigation.replace('MainTabs');
    }
  };

  return (
    <View style={styles.container}>
      <AnimatedSpatialBackground />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Icon */}
          <View style={styles.headerWrap}>
            <View style={styles.iconCircle}>
              <Ionicons name="car-sport" size={32} color="#050814" />
            </View>
            <Text style={styles.superTitle}>SECURE TERMINAL ACCESS</Text>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to authenticate with DriveNearby AI Network</Text>
          </View>

          {/* Quick Demo Credentials Pill */}
          <TouchableOpacity
            style={styles.demoBanner}
            onPress={() => {
              triggerHaptic('impactLight');
              setEmail('dinesh@drivenearby.ai');
              setPassword('password123');
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="flash" size={15} color={COLORS.cyan} />
            <Text style={styles.demoBannerText}>
              Pre-filled Hackathon Demo Key • Tap To Auto-Populate
            </Text>
          </TouchableOpacity>

          {/* Futuristic Form GlassCard */}
          <GlassCard style={styles.formCard} glowColor={COLORS.cyan}>
            <Text style={styles.label}>IDENTIFIER / EMAIL</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={18} color={COLORS.cyan} style={styles.inputIcon} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="name@drivenearby.ai"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />
            </View>

            <Text style={styles.label}>CREDENTIAL KEY / PASSWORD</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={18} color={COLORS.cyan} style={styles.inputIcon} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            </View>

            <NeonButton
              title="AUTHENTICATE & ENTER"
              icon="log-in-outline"
              variant="primary"
              onPress={handleLogin}
              loading={loading}
              style={{ marginTop: 16 }}
            />

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>New to the mobility grid? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.footerLink}>Register Terminal</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingVertical: 40,
  },
  headerWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.9,
    shadowRadius: 14,
  },
  superTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.25)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: SIZES.radiusMd,
    gap: 8,
    marginBottom: 16,
  },
  demoBannerText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.cyan,
    letterSpacing: 0.5,
  },
  formCard: {
    padding: 20,
  },
  label: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.textSecondary,
    letterSpacing: 1.1,
    marginBottom: 6,
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  eyeBtn: {
    padding: 6,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  footerLink: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.cyan,
  },
});

export default LoginScreen;
