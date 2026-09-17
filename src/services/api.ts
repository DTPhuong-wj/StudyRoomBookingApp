import { MOCK_ROOMS } from '../data/mockRooms';
import { Room, FilterState } from '../types';

/**
 * Simulated async API service call for fetching campus rooms.
 * Demonstrates server state fetching with TanStack React Query.
 */
export async function fetchCampusRooms(filters?: Partial<FilterState>): Promise<Room[]> {
  // Simulate network latency (300ms)
  await new Promise((resolve) => setTimeout(resolve, 300));

  let results = [...MOCK_ROOMS];

  if (!filters) return results;

  // Apply filters on server state response
  if (filters.searchQuery && filters.searchQuery.trim() !== '') {
    const q = filters.searchQuery.toLowerCase();
    results = results.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.equipment.some((e) => e.toLowerCase().includes(q))
    );
  }

  if (filters.selectedBuilding && filters.selectedBuilding !== 'ALL') {
    results = results.filter((r) => r.building === filters.selectedBuilding);
  }

  if (filters.capacityRange === 'SMALL') {
    results = results.filter((r) => r.capacity >= 2 && r.capacity <= 4);
  } else if (filters.capacityRange === 'MEDIUM') {
    results = results.filter((r) => r.capacity >= 5 && r.capacity <= 10);
  } else if (filters.capacityRange === 'LARGE') {
    results = results.filter((r) => r.capacity > 10);
  }

  if (filters.selectedEquipment && filters.selectedEquipment.length > 0) {
    results = results.filter((r) =>
      filters.selectedEquipment!.every((eq) => r.equipment.includes(eq))
    );
  }

  return results;
}
