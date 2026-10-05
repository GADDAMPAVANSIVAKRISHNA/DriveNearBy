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

export const RegisterScreen = ({ navigation }) => {
  const { registerUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    triggerHaptic('impactMedium');
    if (!name || !email || !password) {
      Alert.alert('Required Parameters', 'Please fill name, email and password');
      return;
    }

    setLoading(true);
    const res = await registerUser(name, email, phone || '+91 98765 43210', password);
    setLoading(false);

    if (res.success) {
      Alert.alert('Registration Successful', 'Welcome to the DriveNearby AI mobility grid.');
      navigation.replace('MainTabs');
    } else {
      navigation.replace('MainTabs');
    }
  };

  return (
    <AnimatedSpatialBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.headerWrap}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.superTitle}>MOBILITY CITIZEN ONBOARDING</Text>
            <Text style={styles.title}>Create Grid Account</Text>
            <Text style={styles.subtitle}>Join DriveNearby AI Autonomous Mobility Network</Text>
          </View>

          <GlassCard style={styles.formCard} glowColor={COLORS.cyan}>
            <Text style={styles.label}>OPERATOR NAME</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={18} color={COLORS.cyan} style={styles.inputIcon} />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Sai Dinesh"
                placeholderTextColor={COLORS.textMuted}
                style={styles.input}
              />
            </View>

            <Text style={styles.label}>COMMUNICATIONS EMAIL</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={18} color={COLORS.cyan} style={styles.inputIcon} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="name@example.com"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <Text style={styles.label}>TELEMETRY PHONE</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={18} color={COLORS.cyan} style={styles.inputIcon} />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+91 98765 43210"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>

            <Text style={styles.label}>SECURITY PASSCODE</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={18} color={COLORS.cyan} style={styles.inputIcon} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="At least 6 characters"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry
                style={styles.input}
              />
            </View>

            <NeonButton
              title="INITIALIZE ACCOUNT"
              icon="sparkles"
              variant="ai"
              loading={loading}
              onPress={handleRegister}
              style={{ marginTop: 14 }}
            />

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already registered? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Authenticate here</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </AnimatedSpatialBackground>
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
    paddingVertical: 36,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  headerWrap: {
    marginBottom: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  superTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
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
    marginBottom: 8,
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
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
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

export default RegisterScreen;
