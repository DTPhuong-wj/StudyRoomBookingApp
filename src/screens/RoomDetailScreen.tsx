import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Room, TimeSlot, Reservation } from '../types';
import { SlotPicker } from '../components/SlotPicker';
import { QRTicketModal } from '../components/QRTicketModal';
import { useBookingStore } from '../store/useBookingStore';
import { useUserStore } from '../store/useUserStore';
import { ArrowLeft, Users, Monitor, ShieldCheck, MapPin, CheckCircle } from 'lucide-react-native';

interface RoomDetailScreenProps {
  room: Room;
  onBack: () => void;
  onBookingSuccess: () => void;
}

export const RoomDetailScreen: React.FC<RoomDetailScreenProps> = ({
  room,
  onBack,
  onBookingSuccess,
}) => {
  const { user } = useUserStore();
  const { addReservation, checkInReservation } = useBookingStore();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [groupName, setGroupName] = useState<string>(`${user.fullName}'s Study Group`);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // QR Pass Modal state
  const [passModalVisible, setPassModalVisible] = useState<boolean>(false);
  const [createdReservation, setCreatedReservation] = useState<Reservation | null>(null);

  const handleConfirmBooking = async () => {
    if (!selectedSlot) {
      Alert.alert('Missing Slot Selection', 'Please select an available 2-hour time slot before confirming!');
      return;
    }

    if (groupName.trim() === '') {
      Alert.alert('Missing Group Name', 'Please enter a name for your study group or project team.');
      return;
    }

    setIsSubmitting(true);

    const result = await addReservation({
      room,
      slot: selectedSlot,
      date: selectedDate,
      studentId: user.studentId,
      studentName: user.fullName,
      groupName: groupName.trim(),
    });

    setIsSubmitting(false);

    if (!result.success) {
      Alert.alert('Booking Conflict', result.message || 'Slot conflict detected!');
      return;
    }

    if (result.reservation) {
      setCreatedReservation(result.reservation);
      setPassModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setPassModalVisible(false);
    onBookingSuccess();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Navigation Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <ArrowLeft size={20} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          {room.name}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Photo Banner */}
        <View style={styles.photoWrapper}>
          <Image source={{ uri: room.photoUrl }} style={styles.photo} resizeMode="cover" />
          <View style={styles.locationPill}>
            <MapPin size={12} color="#3B82F6" />
            <Text style={styles.locationPillText}>VKU Building {room.building}, Floor {room.floor}</Text>
          </View>
        </View>

        {/* Room Headline Info */}
        <View style={styles.sectionCard}>
          <View style={styles.titleRow}>
            <Text style={styles.roomTitle}>{room.name}</Text>
            <View style={styles.capacityBadge}>
              <Users size={14} color="#3B82F6" />
              <Text style={styles.capacityBadgeText}>{room.capacity} Students</Text>
            </View>
          </View>

          <Text style={styles.descriptionText}>{room.description}</Text>

          {/* Equipment Grid */}
          <Text style={styles.subSectionTitle}>Included Room Amenities</Text>
          <View style={styles.equipmentGrid}>
            {room.equipment.map((eq) => (
              <View key={eq} style={styles.equipmentChip}>
                <Monitor size={12} color="#10B981" />
                <Text style={styles.equipmentChipText}>{eq}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 7-Day & 2-Hour Slot Picker Engine */}
        <View style={styles.sectionCard}>
          <SlotPicker
            roomId={room.id}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setSelectedSlot(null); // Reset slot when date changes
            }}
            onSelectSlot={setSelectedSlot}
          />
        </View>

        {/* Group Name & Booking Form */}
        <View style={styles.sectionCard}>
          <Text style={styles.subSectionTitle}>Reservation Metadata</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Study Group / Project Team Name</Text>
            <TextInput
              style={styles.textInput}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="e.g. Capstone AI Team 4"
              placeholderTextColor="#64748B"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Primary Reserved Student ID</Text>
            <View style={styles.readOnlyInput}>
              <ShieldCheck size={16} color="#3B82F6" />
              <Text style={styles.readOnlyText}>
                {user.fullName} ({user.studentId})
              </Text>
            </View>
          </View>
        </View>

        {/* Confirmation Summary & CTA */}
        {selectedSlot && (
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Selected Date & Slot:</Text>
              <Text style={styles.summaryValue}>
                {selectedDate} ({selectedSlot.label})
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Reminder Alert:</Text>
              <Text style={styles.summaryValueNotif}>15 Min Pre-Slot Alert Enabled</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.confirmBtn, (!selectedSlot || isSubmitting) && styles.confirmBtnDisabled]}
          onPress={handleConfirmBooking}
          disabled={!selectedSlot || isSubmitting}
          activeOpacity={0.8}
        >
          <CheckCircle size={18} color="#FFFFFF" />
          <Text style={styles.confirmBtnText}>
            {isSubmitting ? 'Verifying & Booking...' : 'Confirm Reservation & Get Pass'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Unique Booking Pass QR Modal */}
      <QRTicketModal
        visible={passModalVisible}
        reservation={createdReservation}
        onClose={handleCloseModal}
        onCheckIn={(id) => {
          checkInReservation(id);
          if (createdReservation) {
            setCreatedReservation({ ...createdReservation, status: 'checked-in' });
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
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    gap: 12,
  },
  backButton: {
    backgroundColor: '#1E293B',
    padding: 8,
    borderRadius: 12,
  },
  navTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  photoWrapper: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  locationPill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  locationPillText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roomTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
  },
  capacityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  capacityBadgeText: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '700',
  },
  descriptionText: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  subSectionTitle: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  equipmentChipText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    color: '#F8FAFC',
    fontSize: 14,
  },
  readOnlyInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  readOnlyText: {
    color: '#93C5FD',
    fontSize: 13,
    fontWeight: '600',
  },
  summaryBox: {
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
  },
  summaryLabel: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  summaryValueNotif: {
    color: '#6EE7B7',
    fontSize: 12,
    fontWeight: '700',
  },
  confirmBtn: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  confirmBtnDisabled: {
    backgroundColor: '#334155',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
});
