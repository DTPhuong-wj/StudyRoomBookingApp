import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomeScreen } from './src/screens/HomeScreen';
import { RoomDetailScreen } from './src/screens/RoomDetailScreen';
import { MyBookingsScreen } from './src/screens/MyBookingsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { useAuthStore } from './src/store/useAuthStore';
import { Room } from './src/types';
import { Search, CalendarCheck, User } from 'lucide-react-native';

// Instantiate TanStack QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainAppShell />
    </QueryClientProvider>
  );
}

function MainAppShell() {
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'EXPLORE' | 'BOOKINGS' | 'PROFILE'>('EXPLORE');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;

  // STRICT GOOGLE AUTH VKU DOMAIN GATE (@vku.udn.vn)
  if (!isAuthenticated || !user) {
    return <LoginScreen />;
  }

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleBackFromDetail = () => {
    setSelectedRoom(null);
  };

  const handleBookingSuccess = () => {
    setSelectedRoom(null);
    setActiveTab('BOOKINGS');
  };

  return (
    <View style={styles.outerBackground}>
      <StatusBar style="light" />

      {/* Responsive Centered App Shell */}
      <View style={[styles.container, isDesktop && styles.desktopContainer]}>
        {/* Screen Stack Content */}
        <View style={styles.screenContainer}>
          {selectedRoom ? (
            <RoomDetailScreen
              room={selectedRoom}
              onBack={handleBackFromDetail}
              onBookingSuccess={handleBookingSuccess}
            />
          ) : activeTab === 'EXPLORE' ? (
            <HomeScreen
              onSelectRoom={handleSelectRoom}
              onPressProfile={() => setActiveTab('PROFILE')}
            />
          ) : activeTab === 'BOOKINGS' ? (
            <MyBookingsScreen
              onPressProfile={() => setActiveTab('PROFILE')}
            />
          ) : (
            <ProfileScreen />
          )}
        </View>

        {/* React Navigation 7 Bottom Tabs: Browse Rooms | My Bookings | Profile */}
        {!selectedRoom && (
          <SafeAreaView style={styles.bottomNavContainer}>
            <View style={styles.bottomNav}>
              <TouchableOpacity
                style={[styles.navTab, activeTab === 'EXPLORE' && styles.navTabActive]}
                onPress={() => setActiveTab('EXPLORE')}
                activeOpacity={0.7}
              >
                <Search size={isDesktop ? 22 : 20} color={activeTab === 'EXPLORE' ? '#2563EB' : '#94A3B8'} />
                <Text style={[styles.navText, activeTab === 'EXPLORE' && styles.navTextActive]}>
                  Browse Rooms
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.navTab, activeTab === 'BOOKINGS' && styles.navTabActive]}
                onPress={() => setActiveTab('BOOKINGS')}
                activeOpacity={0.7}
              >
                <CalendarCheck size={isDesktop ? 22 : 20} color={activeTab === 'BOOKINGS' ? '#2563EB' : '#94A3B8'} />
                <Text style={[styles.navText, activeTab === 'BOOKINGS' && styles.navTextActive]}>
                  My Bookings
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.navTab, activeTab === 'PROFILE' && styles.navTabActive]}
                onPress={() => setActiveTab('PROFILE')}
                activeOpacity={0.7}
              >
                <User size={isDesktop ? 22 : 20} color={activeTab === 'PROFILE' ? '#2563EB' : '#94A3B8'} />
                <Text style={[styles.navText, activeTab === 'PROFILE' && styles.navTextActive]}>
                  Profile
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerBackground: {
    flex: 1,
    backgroundColor: '#090D16',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0F172A',
  },
  desktopContainer: {
    maxWidth: 1024,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#1E293B',
  },
  screenContainer: {
    flex: 1,
  },
  bottomNavContainer: {
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  bottomNav: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  navTab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
  },
  navTabActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  navText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  navTextActive: {
    color: '#3B82F6',
    fontWeight: '800',
  },
});
