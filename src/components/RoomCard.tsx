import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Room } from '../types';
import { Users, Monitor, CheckCircle, Clock } from 'lucide-react-native';

interface RoomCardProps {
  room: Room;
  onPressSelect: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = React.memo(
  ({ room, onPressSelect }) => {
    return (
      <View style={styles.card}>
        {/* Room Photo & Badges Container */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: room.photoUrl }} style={styles.photo} resizeMode="cover" />
          
          {/* Building & Floor Badge */}
          <View style={styles.buildingBadge}>
            <Text style={styles.buildingBadgeText}>
              Bldg {room.building} • Flr {room.floor}
            </Text>
          </View>

          {/* Realtime Status Badge */}
          <View
            style={[
              styles.statusBadge,
              room.isAvailableNow ? styles.statusAvailable : styles.statusOccupied,
            ]}
          >
            {room.isAvailableNow ? (
              <CheckCircle size={12} color="#10B981" />
            ) : (
              <Clock size={12} color="#F43F5E" />
            )}
            <Text
              style={[
                styles.statusBadgeText,
                { color: room.isAvailableNow ? '#10B981' : '#F43F5E' },
              ]}
            >
              {room.isAvailableNow ? 'Available Now' : 'Occupied'}
            </Text>
          </View>
        </View>

        {/* Room Information */}
        <View style={styles.contentContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.roomName} numberOfLines={1}>
              {room.name}
            </Text>
            <View style={styles.capacityBadge}>
              <Users size={12} color="#3B82F6" />
              <Text style={styles.capacityText}>{room.capacity} seats</Text>
            </View>
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {room.description}
          </Text>

          {/* Equipment Pills */}
          <View style={styles.equipmentRow}>
            {room.equipment.slice(0, 4).map((eq) => (
              <View key={eq} style={styles.equipmentPill}>
                <Monitor size={10} color="#94A3B8" />
                <Text style={styles.equipmentText}>{eq}</Text>
              </View>
            ))}
            {room.equipment.length > 4 && (
              <Text style={styles.moreEquipmentText}>
                +{room.equipment.length - 4} more
              </Text>
            )}
          </View>

          {/* Reserve CTA */}
          <TouchableOpacity
            style={styles.reserveButton}
            onPress={() => onPressSelect(room)}
            activeOpacity={0.8}
          >
            <Text style={styles.reserveButtonText}>View & Reserve Slots</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Memo comparison optimization for 60fps FlatList
    return (
      prevProps.room.id === nextProps.room.id &&
      prevProps.room.isAvailableNow === nextProps.room.isAvailableNow
    );
  }
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  imageContainer: {
    height: 150,
    width: '100%',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  buildingBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  buildingBadgeText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusAvailable: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
  },
  statusOccupied: {
    borderColor: 'rgba(244, 63, 94, 0.3)',
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  contentContainer: {
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  roomName: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  capacityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  capacityText: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: '600',
  },
  description: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  equipmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  equipmentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0F172A',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  equipmentText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '500',
  },
  moreEquipmentText: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
  },
  reserveButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
