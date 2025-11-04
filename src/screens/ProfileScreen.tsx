import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }: any) => {
  const user = {
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '+84 987 654 321',
    memberLevel: 'Gold Member',
    points: 5420,
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: 'account-edit', label: 'Edit Profile', action: 'EditProfile' },
        { icon: 'shield-check', label: 'Security', action: 'Security' },
        { icon: 'bell-outline', label: 'Notifications', action: 'Notifications' },
      ],
    },
    {
      title: 'Bookings',
      items: [
        { icon: 'ticket-confirmation', label: 'My Bookings', action: 'MyBookings' },
        { icon: 'history', label: 'Booking History', action: 'BookingHistory' },
        { icon: 'star', label: 'Saved Flights', action: 'SavedFlights' },
      ],
    },
    {
      title: 'Payment',
      items: [
        { icon: 'credit-card', label: 'Payment Methods', action: 'PaymentMethods' },
        { icon: 'wallet', label: 'Wallet', action: 'Wallet' },
        { icon: 'receipt', label: 'Transactions', action: 'Transactions' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle', label: 'Help Center', action: 'HelpCenter' },
        { icon: 'information', label: 'About Us', action: 'AboutUs' },
        { icon: 'shield-account', label: 'Privacy Policy', action: 'PrivacyPolicy' },
      ],
    },
  ];

  const handleMenuPress = (action: string) => {
    // Tạm thời hiển thị alert, sau này sẽ navigate đến screen tương ứng
    Alert.alert(
      'Coming Soon',
      `${action} feature will be available soon!`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <MaterialCommunityIcons name="account-circle" size={80} color="#00BCD4" />
            </View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            
            <View style={styles.memberBadge}>
              <MaterialCommunityIcons name="crown" size={16} color="#FFD700" />
              <Text style={styles.memberText}>{user.memberLevel}</Text>
            </View>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="airplane" size={24} color="#00BCD4" />
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Flights</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
              <Text style={styles.statValue}>{user.points}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="ticket" size={24} color="#FF9800" />
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Upcoming</Text>
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.menuContainer}>
          {menuSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.menuSection}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.menuCard}>
                {section.items.map((item, itemIndex) => (
                  <React.Fragment key={itemIndex}>
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => handleMenuPress(item.action)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.menuItemLeft}>
                        <View style={styles.iconContainer}>
                          <MaterialCommunityIcons
                            name={item.icon as any}
                            size={22}
                            color="#00BCD4"
                          />
                        </View>
                        <Text style={styles.menuItemText}>{item.label}</Text>
                      </View>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={20}
                        color="#999"
                      />
                    </TouchableOpacity>
                    {itemIndex < section.items.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </React.Fragment>
                ))}
              </View>
            </View>
          ))}

          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutButton} 
            activeOpacity={0.8}
            onPress={() => {
              Alert.alert(
                'Logout',
                'Are you sure you want to logout?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Logout', style: 'destructive', onPress: () => {} }
                ]
              );
            }}
          >
            <MaterialCommunityIcons name="logout" size={20} color="#F44336" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          {/* Version */}
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  memberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F57C00',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  menuContainer: {
    padding: 20,
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 64,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
    marginLeft: 8,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 24,
  },
});

export default ProfileScreen;