import { useQuery } from '@tanstack/react-query';
import { fetchCampusRooms } from '../services/api';
import { FilterState } from '../types';

export function useRoomsQuery(filters: FilterState) {
  return useQuery({
    queryKey: [
      'rooms',
      filters.searchQuery,
      filters.selectedBuilding,
      filters.capacityRange,
      filters.selectedEquipment,
    ],
    queryFn: () => fetchCampusRooms(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}
