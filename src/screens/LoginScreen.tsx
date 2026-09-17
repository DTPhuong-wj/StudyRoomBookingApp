import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { ShieldCheck, AlertCircle, LogIn, CheckCircle2, Lock } from 'lucide-react-native';

export const LoginScreen: React.FC = () => {
  const { loginWithGoogleEmail, loginError, clearError } = useAuthStore();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  const [inputEmail, setInputEmail] = useState<string>('');
  const [inputName, setInputName] = useState<string>('');

  const handleGoogleSignIn = (emailToUse?: string, nameToUse?: string) => {
    const email = emailToUse || inputEmail;
    if (!email || email.trim() === '') {
      Alert.alert('Email Required', 'Please enter or select your VKU Google account email.');
      return;
    }

    const result = loginWithGoogleEmail(email, nameToUse || inputName);
    if (!result.success) {
      // Error message modal popup
      Alert.alert(
        '⛔ Access Denied (Non-VKU Email)',
        result.message || 'Only @vku.udn.vn email accounts are permitted.',
        [{ text: 'Try Again', onPress: clearError }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, isDesktop && styles.containerDesktop]}>
        <View style={[styles.card, isDesktop && styles.cardDesktop]}>
          {/* VKU Brand Logo Header */}
          <View style={styles.headerBox}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>VKU</Text>
            </View>
            <Text style={styles.universityName}>VIETNAM - KOREA UNIVERSITY</Text>
            <Text style={styles.appName}>Campus Study Room Portal</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Domain Security Banner */}
            <View style={styles.domainSecurityBox}>
              <Lock size={16} color="#3B82F6" />
              <View style={styles.domainTextCol}>
                <Text style={styles.domainSecurityTitle}>Authorized Access Only</Text>
                <Text style={styles.domainSecuritySub}>
                  Requires official Google SSO account ending in <Text style={styles.vkuHighlight}>@vku.udn.vn</Text>
                </Text>
              </View>
            </View>

            {/* Login Error Banner */}
            {loginError && (
              <View style={styles.errorBox}>
                <AlertCircle size={18} color="#F43F5E" />
                <Text style={styles.errorText}>{loginError}</Text>
              </View>
            )}

            {/* Google Sign-In Primary Action */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Enter VKU Student / Faculty Email</Text>
              <TextInput
                style={styles.input}
                placeholder="username@vku.udn.vn"
                placeholderTextColor="#64748B"
                value={inputEmail}
                onChangeText={(text) => {
                  setInputEmail(text);
                  if (loginError) clearError();
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={styles.googleBtn}
                onPress={() => handleGoogleSignIn()}
                activeOpacity={0.85}
              >
                <LogIn size={20} color="#FFFFFF" />
                <Text style={styles.googleBtnText}>Sign In with Google SSO</Text>
              </TouchableOpacity>
            </View>

            {/* Demo Quick Selector (For Immediate Review & Domain Testing) */}
            <View style={styles.demoBox}>
              <Text style={styles.demoTitle}>Quick SSO Test Profiles:</Text>

              {/* Valid Student Email */}
              <TouchableOpacity
                style={styles.demoBtnValid}
                onPress={() => handleGoogleSignIn('student.21it@vku.udn.vn', 'Nguyen Van An')}
              >
                <CheckCircle2 size={16} color="#10B981" />
                <View style={styles.demoTextCol}>
                  <Text style={styles.demoBtnTitle}>Valid Student Account</Text>
                  <Text style={styles.demoBtnSub}>student.21it@vku.udn.vn</Text>
                </View>
              </TouchableOpacity>

              {/* Valid Faculty Email */}
              <TouchableOpacity
                style={styles.demoBtnValid}
                onPress={() => handleGoogleSignIn('teacher.cs@vku.udn.vn', 'Dr. Tran Van B')}
              >
                <CheckCircle2 size={16} color="#10B981" />
                <View style={styles.demoTextCol}>
                  <Text style={styles.demoBtnTitle}>Valid Faculty Account</Text>
                  <Text style={styles.demoBtnSub}>teacher.cs@vku.udn.vn</Text>
                </View>
              </TouchableOpacity>

              {/* Rejection Test: Non-VKU Gmail Account */}
              <TouchableOpacity
                style={styles.demoBtnInvalid}
                onPress={() => handleGoogleSignIn('student@gmail.com', 'Unauthorized User')}
              >
                <AlertCircle size={16} color="#F43F5E" />
                <View style={styles.demoTextCol}>
                  <Text style={styles.demoBtnTitleInvalid}>Test Domain Block Rule (@gmail.com)</Text>
                  <Text style={styles.demoBtnSubInvalid}>student@gmail.com (Will be rejected)</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  containerDesktop: {
    padding: 32,
  },
  card: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardDesktop: {
    maxWidth: 480,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 10,
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 20,
    letterSpacing: 2,
  },
  universityName: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  domainSecurityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  domainTextCol: {
    flex: 1,
  },
  domainSecurityTitle: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },
  domainSecuritySub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 1,
  },
  vkuHighlight: {
    color: '#60A5FA',
    fontWeight: '800',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.4)',
  },
  errorText: {
    color: '#F43F5E',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 12,
  },
  googleBtn: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  googleBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  demoBox: {
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 16,
    gap: 8,
  },
  demoTitle: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  demoBtnValid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1E293B',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  demoBtnInvalid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1E293B',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.3)',
  },
  demoTextCol: {
    flex: 1,
  },
  demoBtnTitle: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },
  demoBtnSub: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '500',
  },
  demoBtnTitleInvalid: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },
  demoBtnSubInvalid: {
    color: '#F43F5E',
    fontSize: 11,
    fontWeight: '500',
  },
});
