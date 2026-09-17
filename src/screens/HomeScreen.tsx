import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Header } from '../components/Header';
import { FilterBar } from '../components/FilterBar';
import { RoomCard } from '../components/RoomCard';
import { MOCK_ROOMS } from '../data/mockRooms';
import { useFilterStore } from '../store/useFilterStore';
import { Room } from '../types';
import { Sparkles, Layers } from 'lucide-react-native';

interface HomeScreenProps {
  onSelectRoom: (room: Room) => void;
  onPressProfile: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectRoom,
  onPressProfile,
}) => {
  const { searchQuery, selectedBuilding, capacityRange, selectedEquipment } =
    useFilterStore();

  // Filter computation
  const filteredRooms = useMemo(() => {
    return MOCK_ROOMS.filter((room) => {
      // Search Query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = room.name.toLowerCase().includes(query);
        const matchesDesc = room.description.toLowerCase().includes(query);
        const matchesEquip = room.equipment.some((e) =>
          e.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesDesc && !matchesEquip) return false;
      }

      // Building Filter
      if (selectedBuilding !== 'ALL' && room.building !== selectedBuilding) {
        return false;
      }

      // Capacity Range Filter
      if (capacityRange === 'SMALL' && (room.capacity < 2 || room.capacity > 4)) {
        return false;
      }
      if (capacityRange === 'MEDIUM' && (room.capacity < 5 || room.capacity > 10)) {
        return false;
      }
      if (capacityRange === 'LARGE' && room.capacity < 11) {
        return false;
      }

      // Equipment Filter
      if (selectedEquipment.length > 0) {
        const hasAllEquipment = selectedEquipment.every((eq) =>
          room.equipment.includes(eq)
        );
        if (!hasAllEquipment) return false;
      }

      return true;
    });
  }, [searchQuery, selectedBuilding, capacityRange, selectedEquipment]);

  // Memoized Render Item for 60fps scrolling
  const renderRoomItem = useCallback(
    ({ item }: { item: Room }) => (
      <RoomCard room={item} onPressSelect={onSelectRoom} />
    ),
    [onSelectRoom]
  );

  // Key extractor
  const keyExtractor = useCallback((item: Room) => item.id, []);

  // Fixed layout height estimation for FlatList optimization
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 290, // Card approx height + margin
      offset: 290 * index,
      index,
    }),
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <Header onPressProfile={onPressProfile} />

      <View style={styles.container}>
        {/* Filter Bar */}
        <FilterBar />

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <View style={styles.resultsCountGroup}>
            <Layers size={14} color="#3B82F6" />
            <Text style={styles.resultsCountText}>
              Showing <Text style={styles.highlightCount}>{filteredRooms.length}</Text> Study Rooms
            </Text>
          </View>
          <View style={styles.fpsBadge}>
            <Sparkles size={11} color="#10B981" />
            <Text style={styles.fpsBadgeText}>60 FPS FlatList</Text>
          </View>
        </View>

        {/* 60fps FlatList Feed */}
        <FlatList
          data={filteredRooms}
          renderItem={renderRoomItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No matching study rooms found</Text>
              <Text style={styles.emptySub}>
                Try loosening your building, capacity, or equipment filters.
              </Text>
            </View>
          }
        />
      </View>
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
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0F172A',
  },
  resultsCountGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resultsCountText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
  },
  highlightCount: {
    color: '#F8FAFC',
    fontWeight: '800',
  },
  fpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  fpsBadgeText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 24,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySub: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
  },
});
