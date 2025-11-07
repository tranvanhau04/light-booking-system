import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getBestCities, BestCity } from '../services/destinationService';

const { width } = Dimensions.get('window');

// === 1. ĐỊNH NGHĨA DATA ẢNH CỨNG ===
// (Ghép tên Sân bay từ API với ảnh local)
const cityImageMap: { [key: string]: any } = {
  'John F Kennedy': require('../../assets/img/hongkong.jpg'),
  'New York': require('../../assets/img/sanatonio.jpg'),
  'Los Angeles': require('../../assets/img/pari.jpg'),
  'default': require('../../assets/img/explore.jpg') // Ảnh dự phòng
};

const HomeDestinationListingScreen = ({ navigation }: any) => {
  // === 2. THÊM STATE MỚI CHO API ===
  const [bestCities, setBestCities] = useState<BestCity[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // === 3. GỌI API KHI TẢI MÀN HÌNH ===
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingCities(true);
        const data = await getBestCities(); // Gọi API
        setBestCities(data);
      } catch (err) {
        setError('Không thể tải dữ liệu.');
        console.error(err);
      } finally {
        setLoadingCities(false);
      }
    };
    loadData();
  }, []); // Chỉ chạy 1 lần

  const handleSearchPress = () => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' },
    });
    navigation.navigate('FlightSearch');
  };

  React.useEffect(() => {
    // Show tab bar when returning to Home
     const unsubscribe = navigation.addListener('focus', () => {
       navigation.getParent()?.setOptions({
         tabBarStyle: {
           display: 'flex',
           borderTopWidth: 1,
           borderTopColor: '#f0f0f0',
           paddingBottom: 20,
           paddingTop: 10,
         }
       });
     });
     return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Header (Giữ nguyên) */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.appIcon}>
            <Ionicons name="airplane" size={28} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Explore flight</Text>
            <Text style={styles.headerSubtitle}>Welcome to flight booking</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-circle" size={40} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar (Giữ nguyên) */}
        <TouchableOpacity
          style={styles.searchContainer}
          onPress={handleSearchPress}
          activeOpacity={0.7}
        >
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Find a flight</Text>
        </TouchableOpacity>

        {/* The Best Cities Section (ĐÃ SỬA) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>The best cities for you</Text>
          
          {/* === 4. XỬ LÝ LOADING VÀ LỖI === */}
          {loadingCities ? (
            <ActivityIndicator size="large" color="#00BCD4" style={{height: 180}} />
          ) : error ? (
            <Text style={{textAlign: 'center', color: 'red', height: 180}}>{error}</Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.citiesScroll}
            >
              {bestCities.map((city) => (
                <TouchableOpacity
                  key={city.destinationId} // <-- Dùng ID từ API
                  style={styles.cityCard}
                  activeOpacity={0.8}
                  onPress={handleSearchPress}
                >
                  <View style={styles.cityImageContainer}>
                    {/* === 5. LOAD ẢNH CỨNG (Yêu cầu 3) === */}
                    <Image
                      // Lấy ảnh từ map, nếu không thấy thì dùng ảnh 'default'
                      source={cityImageMap[city.name] || cityImageMap['default']} 
                      style={styles.cityImage}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.cityInfo}>
                    <Text style={styles.cityName}>{city.name}</Text>
                    <Text style={styles.cityPrice}>
                      from ${city.priceFrom.toFixed(2)} to ${city.priceTo.toFixed(2)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Explore Destinations Section (Giữ nguyên) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore Destinations</Text>
          <TouchableOpacity
            style={styles.exploreCard}
            activeOpacity={0.9}
            onPress={handleSearchPress}
          >
            <View style={styles.exploreImageContainer}>
               <Image 
                  source={require('../../assets/img/explore.jpg')}
                  style={styles.exploreImage}
                  resizeMode="cover"
               />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  profileButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#999',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  citiesScroll: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  cityCard: {
    width: 240,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cityImageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  cityImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
  },
  cityEmoji: {
    fontSize: 80,
  },
  cityInfo: {
    padding: 12,
  },
  cityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cityPrice: {
    fontSize: 14,
    color: '#666',
  },
  exploreCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  exploreImageContainer: {
    width: '100%',
    height: 220,
  },
  exploreImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exploreOverlayText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 12,
    textAlign: 'center',
  },
  cityImage: {
  width: '100%',
  height: '100%',
},
exploreImage: {
  width: '100%',
  height: '100%',
},
});

export default HomeDestinationListingScreen;