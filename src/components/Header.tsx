import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useUserStore } from '../store/useUserStore';
import { ShieldCheck, Bell } from 'lucide-react-native';

interface HeaderProps {
  onPressProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onPressProfile }) => {
  const { user } = useUserStore();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>VKU</Text>
          </View>
          <View>
            <Text style={styles.appName}>StudyRoom Hub</Text>
            <Text style={styles.subTitle}>Vietnam-Korea University</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.userBadge} onPress={onPressProfile} activeOpacity={0.7}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user.fullName.charAt(0)}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user.fullName}
            </Text>
            <View style={styles.idBadge}>
              <ShieldCheck size={11} color="#3B82F6" />
              <Text style={styles.idText}>{user.studentId}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
  },
  appName: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 16,
  },
  subTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    maxWidth: 160,
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#F1F5F9',
    fontSize: 12,
    fontWeight: '600',
  },
  idBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  idText: {
    color: '#60A5FA',
    fontSize: 10,
    fontWeight: '600',
  },
});
