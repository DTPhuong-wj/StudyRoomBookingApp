import { create } from 'zustand';
import { Building, Equipment, FilterState } from '../types';

interface FilterStoreState extends FilterState {
  setSearchQuery: (query: string) => void;
  setSelectedBuilding: (building: Building | 'ALL') => void;
  setCapacityRange: (range: FilterState['capacityRange']) => void;
  toggleEquipment: (equipment: Equipment) => void;
  resetFilters: () => void;
}

const initialFilters: FilterState = {
  searchQuery: '',
  selectedBuilding: 'ALL',
  capacityRange: 'ALL',
  selectedEquipment: [],
};

export const useFilterStore = create<FilterStoreState>((set) => ({
  ...initialFilters,
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedBuilding: (selectedBuilding) => set({ selectedBuilding }),
  setCapacityRange: (capacityRange) => set({ capacityRange }),
  toggleEquipment: (equipment) =>
    set((state) => {
      const exists = state.selectedEquipment.includes(equipment);
      const updated = exists
        ? state.selectedEquipment.filter((e) => e !== equipment)
        : [...state.selectedEquipment, equipment];
      return { selectedEquipment: updated };
    }),
  resetFilters: () => set(initialFilters),
}));
