import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import { useFilterStore } from '../store/useFilterStore';
import { Building, Equipment } from '../types';
import { Search, X, ChevronDown, Filter, Check, RotateCcw } from 'lucide-react-native';

const BUILDINGS: { key: Building | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'All Buildings' },
  { key: 'A', label: 'Building A (IT Center)' },
  { key: 'B', label: 'Building B (Main Library)' },
  { key: 'C', label: 'Building C (Languages)' },
  { key: 'V', label: 'Building V (Innovation)' },
];

const CAPACITIES: { key: 'ALL' | 'SMALL' | 'MEDIUM' | 'LARGE'; label: string }[] = [
  { key: 'ALL', label: 'Any Capacity' },
  { key: 'SMALL', label: '2–4 Seats' },
  { key: 'MEDIUM', label: '5–10 Seats' },
  { key: 'LARGE', label: '10+ Seats' },
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

  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);

  const activeFilterCount =
    (selectedBuilding !== 'ALL' ? 1 : 0) +
    (capacityRange !== 'ALL' ? 1 : 0) +
    selectedEquipment.length;

  return (
    <View style={styles.container}>
      {/* Target Wireframe Top Row: [Search rooms...] and [Filter ▼] */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <Search size={18} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search rooms..."
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

        {/* Filter ▼ Dropdown Button */}
        <TouchableOpacity
          style={[styles.filterDropdownBtn, activeFilterCount > 0 && styles.filterDropdownBtnActive]}
          onPress={() => setFilterModalVisible(true)}
          activeOpacity={0.7}
        >
          <Filter size={14} color={activeFilterCount > 0 ? '#FFFFFF' : '#94A3B8'} />
          <Text style={[styles.filterDropdownText, activeFilterCount > 0 && styles.filterDropdownTextActive]}>
            Filter {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
          </Text>
          <ChevronDown size={14} color={activeFilterCount > 0 ? '#FFFFFF' : '#94A3B8'} />
        </TouchableOpacity>
      </View>

      {/* Quick Building Filter Chips */}
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

      {/* Filter Modal Dialog [Filter ▼] */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Filter size={18} color="#3B82F6" />
                <Text style={styles.modalTitle}>Filter Parameters</Text>
              </View>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <X size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
              {/* Building Selector */}
              <Text style={styles.sectionLabel}>Campus Building</Text>
              <View style={styles.gridOptions}>
                {BUILDINGS.map((b) => {
                  const isSelected = selectedBuilding === b.key;
                  return (
                    <TouchableOpacity
                      key={b.key}
                      style={[styles.optionChip, isSelected && styles.optionChipActive]}
                      onPress={() => setSelectedBuilding(b.key)}
                    >
                      <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>
                        {b.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Capacity Selector */}
              <Text style={styles.sectionLabel}>Seat Capacity</Text>
              <View style={styles.gridOptions}>
                {CAPACITIES.map((c) => {
                  const isSelected = capacityRange === c.key;
                  return (
                    <TouchableOpacity
                      key={c.key}
                      style={[styles.optionChip, isSelected && styles.optionChipActive]}
                      onPress={() => setCapacityRange(c.key)}
                    >
                      <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>
                        {c.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Equipment Selector */}
              <Text style={styles.sectionLabel}>Equipment & Facilities</Text>
              <View style={styles.gridOptions}>
                {EQUIPMENT_OPTIONS.map((eq) => {
                  const isSelected = selectedEquipment.includes(eq);
                  return (
                    <TouchableOpacity
                      key={eq}
                      style={[styles.optionChip, isSelected && styles.optionChipActiveEquipment]}
                      onPress={() => toggleEquipment(eq)}
                    >
                      <Text style={[styles.optionText, isSelected && styles.optionTextActiveEquipment]}>
                        {isSelected ? '✓ ' : ''}{eq}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.resetModalBtn} onPress={resetFilters}>
                <RotateCcw size={14} color="#94A3B8" />
                <Text style={styles.resetModalText}>Reset All</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.applyModalBtn}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={styles.applyModalText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  filterDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterDropdownBtnActive: {
    backgroundColor: '#2563EB',
    borderColor: '#3B82F6',
  },
  filterDropdownText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  filterDropdownTextActive: {
    color: '#FFFFFF',
  },
  chipScroll: {
    paddingHorizontal: 16,
    gap: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  modalScroll: {
    marginBottom: 16,
  },
  sectionLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 10,
    marginBottom: 8,
  },
  gridOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  optionChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#3B82F6',
  },
  optionChipActiveEquipment: {
    backgroundColor: '#065F46',
    borderColor: '#10B981',
  },
  optionText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
  optionTextActiveEquipment: {
    color: '#A7F3D0',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 12,
  },
  resetModalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  resetModalText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  applyModalBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  applyModalText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
