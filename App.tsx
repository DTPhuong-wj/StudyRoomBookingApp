import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen } from './src/screens/HomeScreen';
import { RoomDetailScreen } from './src/screens/RoomDetailScreen';
import { MyBookingsScreen } from './src/screens/MyBookingsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { Room } from './src/types';
import { Search, CalendarCheck, User } from 'lucide-react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState<'EXPLORE' | 'BOOKINGS' | 'PROFILE'>('EXPLORE');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

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
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#0F172A" />

      {/* Screen Container */}
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

      {/* Bottom Navigation Bar */}
      {!selectedRoom && (
        <SafeAreaView style={styles.bottomNavContainer}>
          <View style={styles.bottomNav}>
            <TouchableOpacity
              style={[styles.navTab, activeTab === 'EXPLORE' && styles.navTabActive]}
              onPress={() => setActiveTab('EXPLORE')}
              activeOpacity={0.7}
            >
              <Search size={20} color={activeTab === 'EXPLORE' ? '#2563EB' : '#94A3B8'} />
              <Text style={[styles.navText, activeTab === 'EXPLORE' && styles.navTextActive]}>
                Explore
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navTab, activeTab === 'BOOKINGS' && styles.navTabActive]}
              onPress={() => setActiveTab('BOOKINGS')}
              activeOpacity={0.7}
            >
              <CalendarCheck size={20} color={activeTab === 'BOOKINGS' ? '#2563EB' : '#94A3B8'} />
              <Text style={[styles.navText, activeTab === 'BOOKINGS' && styles.navTextActive]}>
                My Bookings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navTab, activeTab === 'PROFILE' && styles.navTabActive]}
              onPress={() => setActiveTab('PROFILE')}
              activeOpacity={0.7}
            >
              <User size={20} color={activeTab === 'PROFILE' ? '#2563EB' : '#94A3B8'} />
              <Text style={[styles.navText, activeTab === 'PROFILE' && styles.navTextActive]}>
                Profile
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
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
    height: 60,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navTab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 6,
  },
  navTabActive: {
    // Optional active glow
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
