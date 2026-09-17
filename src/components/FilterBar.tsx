import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useFilterStore } from '../store/useFilterStore';
import { Building, Equipment } from '../types';
import { Search, X, SlidersHorizontal } from 'lucide-react-native';

const BUILDINGS: { key: Building | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'All Buildings' },
  { key: 'A', label: 'Bldg A (IT)' },
  { key: 'B', label: 'Bldg B (Library)' },
  { key: 'C', label: 'Bldg C (Languages)' },
  { key: 'V', label: 'Bldg V (Innovation)' },
];

const CAPACITIES: { key: 'ALL' | 'SMALL' | 'MEDIUM' | 'LARGE'; label: string }[] = [
  { key: 'ALL', label: 'Any Capacity' },
  { key: 'SMALL', label: '2–4 Students' },
  { key: 'MEDIUM', label: '5–10 Students' },
  { key: 'LARGE', label: '10+ Students' },
];

const EQUIPMENT_OPTIONS: Equipment[] = [
  'High-spec PC',
  'Projector',
  'Whiteboard',
  'AC',
  'Smart Screen',
  'Sound System',
];

export const FilterBar: React.FC = () => {
  const {
    searchQuery,
    selectedBuilding,
    capacityRange,
    selectedEquipment,
    setSearchQuery,
    setSelectedBuilding,
    setCapacityRange,
    toggleEquipment,
    resetFilters,
  } = useFilterStore();

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedBuilding !== 'ALL' ||
    capacityRange !== 'ALL' ||
    selectedEquipment.length > 0;

  return (
    <View style={styles.container}>
      {/* Search Input Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <Search size={18} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search room name, lab type, GPU..."
            placeholderTextColor="#64748B"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {hasActiveFilters && (
          <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Building Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipScroll}
      >
        {BUILDINGS.map((b) => {
          const isSelected = selectedBuilding === b.key;
          return (
            <TouchableOpacity
              key={b.key}
              style={[styles.chip, isSelected && styles.chipActive]}
              onPress={() => setSelectedBuilding(b.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                {b.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Capacity & Equipment Sub-Filter Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipScrollSecondary}
      >
        {/* Capacity Selector */}
        {CAPACITIES.map((c) => {
          const isSelected = capacityRange === c.key;
          return (
            <TouchableOpacity
              key={c.key}
              style={[styles.subChip, isSelected && styles.subChipActive]}
              onPress={() => setCapacityRange(c.key)}
            >
              <Text style={[styles.subChipText, isSelected && styles.subChipTextActive]}>
                👥 {c.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Equipment Selector Pills */}
        {EQUIPMENT_OPTIONS.map((eq) => {
          const isSelected = selectedEquipment.includes(eq);
          return (
            <TouchableOpacity
              key={eq}
              style={[styles.subChip, isSelected && styles.subChipActiveEquipment]}
              onPress={() => toggleEquipment(eq)}
            >
              <Text
                style={[
                  styles.subChipText,
                  isSelected && styles.subChipTextActiveEquipment,
                ]}
              >
                ⚡ {eq}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F172A',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 10,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 13,
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#334155',
    borderRadius: 10,
  },
  resetText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  chipScroll: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#3B82F6',
  },
  chipText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  chipScrollSecondary: {
    paddingHorizontal: 16,
    gap: 6,
  },
  subChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  subChipActive: {
    backgroundColor: '#1E3A8A',
    borderColor: '#3B82F6',
  },
  subChipActiveEquipment: {
    backgroundColor: '#065F46',
    borderColor: '#10B981',
  },
  subChipText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '500',
  },
  subChipTextActive: {
    color: '#93C5FD',
    fontWeight: '700',
  },
  subChipTextActiveEquipment: {
    color: '#A7F3D0',
    fontWeight: '700',
  },
});
