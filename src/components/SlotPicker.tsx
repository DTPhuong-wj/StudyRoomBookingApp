import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { TimeSlot } from '../types';
import { TIME_SLOTS } from '../data/mockRooms';
import { useBookingStore } from '../store/useBookingStore';
import { Calendar, Clock, AlertTriangle } from 'lucide-react-native';

interface SlotPickerProps {
  roomId: string;
  selectedDate: string; // YYYY-MM-DD
  selectedSlot: TimeSlot | null;
  onSelectDate: (dateStr: string) => void;
  onSelectSlot: (slot: TimeSlot) => void;
}

// Generate next 7 days list
function getNext7Days() {
  const days = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const dayName = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = `${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'short' })}`;

    days.push({
      dateStr,
      dayName,
      formattedDate,
    });
  }
  return days;
}

export const SlotPicker: React.FC<SlotPickerProps> = ({
  roomId,
  selectedDate,
  selectedSlot,
  onSelectDate,
  onSelectSlot,
}) => {
  const dates = getNext7Days();
  const { isSlotBooked } = useBookingStore();

  return (
    <View style={styles.container}>
      {/* Date Strip Title */}
      <View style={styles.sectionHeader}>
        <Calendar size={16} color="#3B82F6" />
        <Text style={styles.sectionTitle}>Select Date (7-Day Horizon)</Text>
      </View>

      {/* 7-Day Date Selector Strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateStrip}
      >
        {dates.map((item) => {
          const isSelected = selectedDate === item.dateStr;
          return (
            <TouchableOpacity
              key={item.dateStr}
              style={[styles.dateCard, isSelected && styles.dateCardActive]}
              onPress={() => onSelectDate(item.dateStr)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.dayNameText, isSelected && styles.dayNameTextActive]}
              >
                {item.dayName}
              </Text>
              <Text
                style={[
                  styles.formattedDateText,
                  isSelected && styles.formattedDateTextActive,
                ]}
              >
                {item.formattedDate}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Time Slot Grid Title */}
      <View style={[styles.sectionHeader, { marginTop: 16 }]}>
        <Clock size={16} color="#3B82F6" />
        <Text style={styles.sectionTitle}>2-Hour Discrete Slots ({selectedDate})</Text>
      </View>

      {/* Time Slot Grid */}
      <View style={styles.gridContainer}>
        {TIME_SLOTS.map((slot) => {
          const booked = isSlotBooked(roomId, selectedDate, slot.id);
          const isSelected = selectedSlot?.id === slot.id;

          return (
            <TouchableOpacity
              key={slot.id}
              disabled={booked}
              style={[
                styles.slotCard,
                isSelected && styles.slotSelected,
                booked && styles.slotDisabled,
              ]}
              onPress={() => onSelectSlot(slot)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.slotLabel,
                  isSelected && styles.slotLabelSelected,
                  booked && styles.slotLabelDisabled,
                ]}
              >
                {slot.label}
              </Text>

              <View style={styles.statusRow}>
                {booked ? (
                  <View style={styles.occupiedBadge}>
                    <AlertTriangle size={10} color="#F43F5E" />
                    <Text style={styles.occupiedText}>OCCUPIED</Text>
                  </View>
                ) : isSelected ? (
                  <Text style={styles.selectedBadgeText}>SELECTED</Text>
                ) : (
                  <Text style={styles.availableBadgeText}>AVAILABLE</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  sectionHeader: {
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
  dateStrip: {
    gap: 8,
    paddingBottom: 4,
  },
  dateCard: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    minWidth: 78,
  },
  dateCardActive: {
    backgroundColor: '#2563EB',
    borderColor: '#3B82F6',
  },
  dayNameText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  dayNameTextActive: {
    color: '#FFFFFF',
  },
  formattedDateText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  formattedDateTextActive: {
    color: '#FFFFFF',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotCard: {
    width: '48%',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'space-between',
    minHeight: 64,
  },
  slotSelected: {
    backgroundColor: '#1E3A8A',
    borderColor: '#3B82F6',
    borderWidth: 2,
  },
  slotDisabled: {
    backgroundColor: 'rgba(244, 63, 94, 0.08)',
    borderColor: 'rgba(244, 63, 94, 0.3)',
  },
  slotLabel: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  slotLabelSelected: {
    color: '#93C5FD',
  },
  slotLabelDisabled: {
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  occupiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(244, 63, 94, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  occupiedText: {
    color: '#F43F5E',
    fontSize: 10,
    fontWeight: '800',
  },
  selectedBadgeText: {
    color: '#60A5FA',
    fontSize: 10,
    fontWeight: '800',
  },
  availableBadgeText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
  },
});
