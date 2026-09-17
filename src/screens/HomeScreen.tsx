import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Header } from '../components/Header';
import { FilterBar } from '../components/FilterBar';
import { RoomCard } from '../components/RoomCard';
import { useFilterStore } from '../store/useFilterStore';
import { useRoomsQuery } from '../hooks/useRoomsQuery';
import { Room } from '../types';
import { Sparkles, Layers, RefreshCw } from 'lucide-react-native';

interface HomeScreenProps {
  onSelectRoom: (room: Room) => void;
  onPressProfile: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectRoom,
  onPressProfile,
}) => {
  const filterState = useFilterStore();
  const { width } = useWindowDimensions();

  // Server state query via TanStack React Query
  const { data: rooms = [], isLoading, isRefetching, refetch } = useRoomsQuery(filterState);

  // Responsive columns calculation
  const numColumns = useMemo(() => {
    if (width >= 960) return 3;
    if (width >= 640) return 2;
    return 1;
  }, [width]);

  // Memoized Render Item for 60fps scrolling
  const renderRoomItem = useCallback(
    ({ item }: { item: Room }) => (
      <View style={numColumns > 1 ? styles.gridItemWrapper : styles.singleItemWrapper}>
        <RoomCard room={item} onPressSelect={onSelectRoom} />
      </View>
    ),
    [onSelectRoom, numColumns]
  );

  // Key extractor
  const keyExtractor = useCallback((item: Room) => item.id, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <Header onPressProfile={onPressProfile} />

      <View style={styles.container}>
        {/* Filter Bar with Search & Filter Dropdown */}
        <FilterBar />

        {/* Results & TanStack Query Status Bar */}
        <View style={styles.resultsHeader}>
          <View style={styles.resultsCountGroup}>
            <Layers size={14} color="#3B82F6" />
            <Text style={styles.resultsCountText}>
              Showing <Text style={styles.highlightCount}>{rooms.length}</Text> Study Rooms
            </Text>
          </View>

          <View style={styles.rightHeaderGroup}>
            <TouchableOpacity onPress={() => refetch()} style={styles.refreshBtn}>
              <RefreshCw size={12} color="#94A3B8" style={isRefetching ? styles.spinning : undefined} />
            </TouchableOpacity>

            <View style={styles.fpsBadge}>
              <Sparkles size={11} color="#10B981" />
              <Text style={styles.fpsBadgeText}>
                TanStack Query Cached
              </Text>
            </View>
          </View>
        </View>

        {/* Loading State */}
        {isLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>Fetching VKU campus study rooms...</Text>
          </View>
        ) : (
          /* Responsive 60fps FlatList Feed */
          <FlatList
            key={`grid-${numColumns}`}
            data={rooms}
            renderItem={renderRoomItem}
            keyExtractor={keyExtractor}
            numColumns={numColumns}
            initialNumToRender={6}
            maxToRenderPerBatch={6}
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
        )}
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
  rightHeaderGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refreshBtn: {
    padding: 4,
    backgroundColor: '#1E293B',
    borderRadius: 6,
  },
  spinning: {
    opacity: 0.6,
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
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 24,
  },
  singleItemWrapper: {
    width: '100%',
    paddingHorizontal: 6,
  },
  gridItemWrapper: {
    flex: 1,
    paddingHorizontal: 6,
  },
  loadingBox: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
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
