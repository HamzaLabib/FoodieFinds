import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Alert,
  TextInput,
  useColorScheme,
} from 'react-native';
import * as Location from 'expo-location';
import { fetchNearbyRestaurants } from '../scripts/apiHandling.js';
import RestoCard from '../components/RestoCard.jsx';
import { getDistance } from 'geolib';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location is required to find nearby restaurants.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });

      try {
        const { results, nextPageToken } = await fetchNearbyRestaurants(latitude, longitude);
        const enriched = enrichWithDistance(results, latitude, longitude);
        setRestaurants(enriched);
        setNextPageToken(nextPageToken);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch nearby restaurants.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const enrichWithDistance = (results, lat1, lon1) => {
    return results
      .map((restaurant) => {
        const { lat, lng } = restaurant.geometry.location;
        const distanceMeters = getDistance(
          { latitude: lat1, longitude: lon1 },
          { latitude: lat, longitude: lng }
        );
        return {
          ...restaurant,
          distanceMeters,
        };
      })
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  };

  const loadMoreRestaurants = async () => {
    if (!nextPageToken || isFetchingMore || !userLocation) return;

    setIsFetchingMore(true);

    try {
      await new Promise((res) => setTimeout(res, 1500));

      const { results, nextPageToken: newToken } = await fetchNearbyRestaurants(
        userLocation.latitude,
        userLocation.longitude,
        nextPageToken
      );

      const enriched = enrichWithDistance(results, userLocation.latitude, userLocation.longitude);

      setRestaurants((prev) => [...prev, ...enriched]);
      setNextPageToken(newToken);
    } catch (error) {
      console.error('Failed to load more restaurants:', error.message);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
      }}
    >
      <View style={{ paddingHorizontal: 16, paddingTop: 0, paddingBottom: 4 }}>
        <TextInput
          placeholder="Search restaurants..."
          placeholderTextColor="#555"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            backgroundColor: '#D3D3D3',
            padding: 10,
            borderRadius: 10,
            fontSize: 16,
            color: '#000', 
          }}
        />
      </View>

      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <RestoCard
            restaurant={item}
            distanceMeters={item.distanceMeters}
            openNow={item.opening_hours?.open_now}
            onPress={() => navigation.navigate('Restaurant Details', { restaurant: item })}
          />
        )}
        onEndReached={loadMoreRestaurants}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingMore ? (
            <ActivityIndicator style={{ marginVertical: 16 }} />
          ) : null
        }
        ListEmptyComponent={
          <Text style={{ padding: 20, textAlign: 'center' }}>
            No restaurants found.
          </Text>
        }
      />
    </SafeAreaView>
  );
}
