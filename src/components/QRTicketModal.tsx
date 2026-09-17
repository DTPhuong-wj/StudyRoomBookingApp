import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Reservation } from '../types';
import { X, CheckCircle2, ShieldCheck, MapPin, Clock, Users, Calendar } from 'lucide-react-native';

interface QRTicketModalProps {
  visible: boolean;
  reservation: Reservation | null;
  onClose: () => void;
  onCheckIn?: (id: string) => void;
}

export const QRTicketModal: React.FC<QRTicketModalProps> = ({
  visible,
  reservation,
  onClose,
  onCheckIn,
}) => {
  if (!reservation) return null;

  const isCheckedIn = reservation.status === 'checked-in';

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.brandGroup}>
              <Text style={styles.vkuTag}>VKU PASS</Text>
              <Text style={styles.modalTitle}>Room Booking Pass</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* QR Code Card */}
            <View style={styles.qrContainer}>
              <QRCode
                value={reservation.qrHash || reservation.id}
                size={180}
                color="#0F172A"
                backgroundColor="#FFFFFF"
              />
              <Text style={styles.refCodeText}>Ref: #{reservation.id.toUpperCase()}</Text>
              
              <View
                style={[
                  styles.statusPill,
                  isCheckedIn ? styles.statusCheckedIn : styles.statusActive,
                ]}
              >
                <CheckCircle2 size={14} color={isCheckedIn ? '#10B981' : '#3B82F6'} />
                <Text
                  style={[
                    styles.statusPillText,
                    { color: isCheckedIn ? '#10B981' : '#60A5FA' },
                  ]}
                >
                  {isCheckedIn ? 'CHECKED-IN VALIDATED' : 'ACTIVE • SCAN AT DOOR'}
                </Text>
              </View>
            </View>

            {/* Pass Details List */}
            <View style={styles.detailsBox}>
              <View style={styles.detailRow}>
                <MapPin size={16} color="#3B82F6" />
                <View style={styles.detailTextCol}>
                  <Text style={styles.detailLabel}>Room / Location</Text>
                  <Text style={styles.detailValue}>{reservation.roomName}</Text>
                  <Text style={styles.detailSub}>Building {reservation.building}, Floor {reservation.floor}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <Calendar size={16} color="#3B82F6" />
                <View style={styles.detailTextCol}>
                  <Text style={styles.detailLabel}>Date & Time Slot</Text>
                  <Text style={styles.detailValue}>{reservation.date}</Text>
                  <Text style={styles.detailSub}>{reservation.slotLabel}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <Users size={16} color="#3B82F6" />
                <View style={styles.detailTextCol}>
                  <Text style={styles.detailLabel}>Reserved By Group</Text>
                  <Text style={styles.detailValue}>{reservation.groupName}</Text>
                  <Text style={styles.detailSub}>
                    {reservation.studentName} ({reservation.studentId})
                  </Text>
                </View>
              </View>
            </View>

            {/* Simulated Door Scan Action */}
            {!isCheckedIn && onCheckIn && (
              <TouchableOpacity
                style={styles.checkInBtn}
                onPress={() => onCheckIn(reservation.id)}
                activeOpacity={0.8}
              >
                <ShieldCheck size={18} color="#FFFFFF" />
                <Text style={styles.checkInBtnText}>Simulate Room Door Scan / Check-In</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandGroup: {
    flexDirection: 'column',
  },
  vkuTag: {
    color: '#3B82F6',
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 1.5,
  },
  modalTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    backgroundColor: '#1E293B',
    padding: 8,
    borderRadius: 20,
  },
  scrollBody: {
    paddingBottom: 20,
  },
  qrContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  refCodeText: {
    color: '#94A3B8',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 12,
    fontWeight: '600',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  statusCheckedIn: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  detailsBox: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailTextCol: {
    flex: 1,
  },
  detailLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  detailValue: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  detailSub: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 12,
  },
  checkInBtn: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  checkInBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
