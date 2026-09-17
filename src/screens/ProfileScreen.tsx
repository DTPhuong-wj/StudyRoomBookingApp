import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { useUserStore } from '../store/useUserStore';
import { useBookingStore } from '../store/useBookingStore';
import { requestNotificationPermissions, scheduleCheckInNotification } from '../utils/notifications';
import {
  ShieldCheck,
  User,
  Mail,
  GraduationCap,
  Building,
  Bell,
  RefreshCw,
  Award,
  Layers,
} from 'lucide-react-native';

export const ProfileScreen: React.FC = () => {
  const { user, switchDemoUser } = useUserStore();
  const { clearAllReservations } = useBookingStore();
  const [notifEnabled, setNotifEnabled] = useState<boolean>(true);

  const handleTestNotification = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Web Mode', 'Local push notifications are active on physical mobile devices (Android APK & iOS via Expo Go).');
      return;
    }
    const granted = await requestNotificationPermissions();
    if (granted) {
      await scheduleCheckInNotification('A1.101 Smart AI Lab', '2026-09-17', '09:30', 'Demo Group Alert');
      Alert.alert('Notification Triggered', 'A test check-in reminder notification will fire in 5 seconds!');
    } else {
      Alert.alert('Permission Required', 'Please enable notifications in your phone settings.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {/* Screen Header */}
        <Text style={styles.screenTitle}>Student Profile & Settings</Text>

        {/* VKU Student Card */}
        <View style={styles.studentCard}>
          <View style={styles.cardHeader}>
            <View style={styles.vkuLogoBox}>
              <Text style={styles.vkuLogoText}>VKU</Text>
            </View>
            <View>
              <Text style={styles.universityName}>VIETNAM - KOREA UNIVERSITY</Text>
              <Text style={styles.cardTypeTitle}>STUDENT IDENTIFICATION CARD</Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.avatarCircle}>
              <User size={32} color="#FFFFFF" />
            </View>

            <View style={styles.studentDetails}>
              <Text style={styles.studentName}>{user.fullName}</Text>
              <View style={styles.idRow}>
                <ShieldCheck size={14} color="#60A5FA" />
                <Text style={styles.studentIdText}>ID: {user.studentId}</Text>
              </View>

              <Text style={styles.majorText}>{user.major}</Text>
              <Text style={styles.deptText}>{user.department}</Text>
            </View>
          </View>
        </View>

        {/* Switch Student Profile (Demo Feature) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Switch Student Profile (Demo)</Text>
          <Text style={styles.sectionSub}>Test bookings with different VKU student accounts:</Text>

          <View style={styles.switchRow}>
            <TouchableOpacity style={styles.demoUserBtn} onPress={() => switchDemoUser(0)}>
              <Text style={styles.demoUserText}>Nguyen Van An (21IT)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.demoUserBtn} onPress={() => switchDemoUser(1)}>
              <Text style={styles.demoUserText}>Tran Thi Mai (22SE)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.demoUserBtn} onPress={() => switchDemoUser(2)}>
              <Text style={styles.demoUserText}>Le Hoang Nam (23KR)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Bell size={16} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Check-In Local Reminders</Text>
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={styles.toggleTitle}>15-Min Pre-Slot Reminder</Text>
              <Text style={styles.toggleSub}>Triggers local device alert 15 minutes before your slot starts.</Text>
            </View>
            <Switch
              value={notifEnabled}
              onValueChange={setNotifEnabled}
              trackColor={{ false: '#334155', true: '#2563EB' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity style={styles.testNotifBtn} onPress={handleTestNotification}>
            <Text style={styles.testNotifText}>⚡ Test 5-Sec Sample Notification</Text>
          </TouchableOpacity>
        </View>

        {/* Technical Specification Box */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Layers size={16} color="#10B981" />
            <Text style={styles.sectionTitle}>App Architecture Specs</Text>
          </View>

          <View style={styles.specItem}>
            <Text style={styles.specKey}>State Engine:</Text>
            <Text style={styles.specVal}>Zustand + AsyncStorage Persistence</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specKey}>List Optimization:</Text>
            <Text style={styles.specVal}>FlatList 60fps (removeClippedSubviews)</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specKey}>Conflict Prevention:</Text>
            <Text style={styles.specVal}>Real-time 2-Hour Slot Collision Engine</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specKey}>Booking Pass:</Text>
            <Text style={styles.specVal}>Interactive SVG QR Code Generator</Text>
          </View>
        </View>

        {/* Reset Store Action */}
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => {
            Alert.alert('Reset App Data', 'This will wipe all cached reservations.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Reset', style: 'destructive', onPress: clearAllReservations },
            ]);
          }}
        >
          <RefreshCw size={16} color="#F43F5E" />
          <Text style={styles.resetBtnText}>Reset All Local Storage Data</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  screenTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  studentCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3B82F6',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 12,
    marginBottom: 14,
  },
  vkuLogoBox: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  vkuLogoText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
  },
  universityName: {
    color: '#93C5FD',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  cardTypeTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginVertical: 2,
  },
  studentIdText: {
    color: '#60A5FA',
    fontSize: 13,
    fontWeight: '700',
  },
  majorText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '500',
  },
  deptText: {
    color: '#64748B',
    fontSize: 11,
  },
  sectionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionSub: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 10,
  },
  switchRow: {
    flexDirection: 'column',
    gap: 8,
  },
  demoUserBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  demoUserText: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleTextCol: {
    flex: 1,
    marginRight: 10,
  },
  toggleTitle: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
  toggleSub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  testNotifBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  testNotifText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '700',
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  specKey: {
    color: '#94A3B8',
    fontSize: 12,
  },
  specVal: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  resetBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F43F5E',
  },
  resetBtnText: {
    color: '#F43F5E',
    fontWeight: '700',
    fontSize: 13,
  },
});
