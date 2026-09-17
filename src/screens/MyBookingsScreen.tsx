import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useBookingStore } from '../store/useBookingStore';
import { Reservation } from '../types';
import { QRTicketModal } from '../components/QRTicketModal';
import { Header } from '../components/Header';
import {
  QrCode,
  Calendar,
  Clock,
  MapPin,
  Users,
  XCircle,
  CheckCircle2,
  Trash2,
} from 'lucide-react-native';

interface MyBookingsScreenProps {
  onPressProfile?: () => void;
}

export const MyBookingsScreen: React.FC<MyBookingsScreenProps> = ({ onPressProfile }) => {
  const { reservations, cancelReservation, checkInReservation, clearAllReservations } =
    useBookingStore();

  const [filterTab, setFilterTab] = useState<'ALL' | 'ACTIVE' | 'HISTORY'>('ACTIVE');

  // Modal QR State
  const [selectedPass, setSelectedPass] = useState<Reservation | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const filteredReservations = reservations.filter((r) => {
    if (filterTab === 'ACTIVE') return r.status === 'active';
    if (filterTab === 'HISTORY') return r.status === 'checked-in' || r.status === 'cancelled';
    return true;
  });

  const handleOpenQR = (res: Reservation) => {
    setSelectedPass(res);
    setModalVisible(true);
  };

  const handleCancel = (id: string, roomName: string) => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel your reservation for ${roomName}?`,
      [
        { text: 'No, Keep It', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => cancelReservation(id),
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Reservation }) => {
    const isActive = item.status === 'active';
    const isCheckedIn = item.status === 'checked-in';
    const isCancelled = item.status === 'cancelled';

    return (
      <View style={styles.card}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.buildingBadge}>
            <MapPin size={12} color="#3B82F6" />
            <Text style={styles.buildingText}>Bldg {item.building}, Flr {item.floor}</Text>
          </View>

          <View
            style={[
              styles.statusPill,
              isActive && styles.statusActive,
              isCheckedIn && styles.statusCheckedIn,
              isCancelled && styles.statusCancelled,
            ]}
          >
            {isActive && <Clock size={11} color="#3B82F6" />}
            {isCheckedIn && <CheckCircle2 size={11} color="#10B981" />}
            {isCancelled && <XCircle size={11} color="#F43F5E" />}
            <Text
              style={[
                styles.statusPillText,
                isActive && { color: '#60A5FA' },
                isCheckedIn && { color: '#10B981' },
                isCancelled && { color: '#F43F5E' },
              ]}
            >
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Room Title */}
        <Text style={styles.roomName}>{item.roomName}</Text>

        {/* Info Grid */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Calendar size={13} color="#94A3B8" />
            <Text style={styles.infoText}>{item.date}</Text>
          </View>
          <View style={styles.infoItem}>
            <Clock size={13} color="#94A3B8" />
            <Text style={styles.infoText}>{item.slotLabel}</Text>
          </View>
          <View style={styles.infoItem}>
            <Users size={13} color="#94A3B8" />
            <Text style={styles.infoText} numberOfLines={1}>{item.groupName}</Text>
          </View>
        </View>

        {/* Card Actions */}
        <View style={styles.actionsRow}>
          {!isCancelled && (
            <TouchableOpacity
              style={styles.qrButton}
              onPress={() => handleOpenQR(item)}
              activeOpacity={0.8}
            >
              <QrCode size={16} color="#FFFFFF" />
              <Text style={styles.qrButtonText}>View QR Pass</Text>
            </TouchableOpacity>
          )}

          {isActive && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancel(item.id, item.roomName)}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header onPressProfile={onPressProfile} />

      <View style={styles.container}>
        {/* Title Bar */}
        <View style={styles.titleBar}>
          <Text style={styles.screenTitle}>My Reservations</Text>

          {reservations.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Clear History',
                  'Are you sure you want to clear all reservation history?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Clear All', style: 'destructive', onPress: clearAllReservations },
                  ]
                );
              }}
              style={styles.clearAllBtn}
            >
              <Trash2 size={14} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, filterTab === 'ACTIVE' && styles.tabActive]}
            onPress={() => setFilterTab('ACTIVE')}
          >
            <Text style={[styles.tabText, filterTab === 'ACTIVE' && styles.tabTextActive]}>
              Upcoming ({reservations.filter((r) => r.status === 'active').length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, filterTab === 'HISTORY' && styles.tabActive]}
            onPress={() => setFilterTab('HISTORY')}
          >
            <Text style={[styles.tabText, filterTab === 'HISTORY' && styles.tabTextActive]}>
              History / Past
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, filterTab === 'ALL' && styles.tabActive]}
            onPress={() => setFilterTab('ALL')}
          >
            <Text style={[styles.tabText, filterTab === 'ALL' && styles.tabTextActive]}>
              All ({reservations.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reservations List */}
        <FlatList
          data={filteredReservations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>No reservations found</Text>
              <Text style={styles.emptySub}>
                {filterTab === 'ACTIVE'
                  ? 'You currently have no active upcoming room bookings.'
                  : 'Your booking history will appear here.'}
              </Text>
            </View>
          }
        />
      </View>

      {/* QR Ticket Modal */}
      <QRTicketModal
        visible={modalVisible}
        reservation={selectedPass}
        onClose={() => setModalVisible(false)}
        onCheckIn={(id) => {
          checkInReservation(id);
          if (selectedPass) {
            setSelectedPass({ ...selectedPass, status: 'checked-in' });
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
  },
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  screenTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
  },
  clearAllBtn: {
    padding: 6,
    backgroundColor: '#1E293B',
    borderRadius: 8,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContainer: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  buildingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  buildingText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
  },
  statusCheckedIn: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusCancelled: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  roomName: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  qrButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  qrButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#334155',
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  cancelButtonText: {
    color: '#F43F5E',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyBox: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySub: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
  },
});
