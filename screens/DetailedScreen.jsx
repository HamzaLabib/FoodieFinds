import React from 'react';
import { View, Text, Image, Linking, ScrollView } from 'react-native';
import { getPhotoUrl } from '../scripts/apiHandling.js';

export default function DetailedScreen({ route }) {
  const { restaurant } = route.params;
  const photoRef = restaurant.photos?.[0]?.photo_reference;
  const imageUrl = photoRef ? getPhotoUrl(photoRef, 800) : null;

  const distanceKm =
    restaurant.distanceMeters != null
      ? (restaurant.distanceMeters / 1000).toFixed(1)
      : null;

  return (
    <ScrollView style={{ padding: 10 }}>
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={{ height: 200, borderRadius: 10 }} />
      )}
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 10 }}>
        {restaurant.name}
      </Text>
      <Text>{restaurant.vicinity}</Text>
      <Text>⭐ {restaurant.rating} stars</Text>
      {distanceKm && (
        <Text style={{ color: '#777' }}>{distanceKm} km away</Text>
      )}
      <Text>{restaurant.opening_hours?.open_now ? 'Open Now' : 'Closed'}</Text>
      {restaurant.website && (
        <Text
          style={{ color: 'blue' }}
          onPress={() => Linking.openURL(restaurant.website)}
        >
          Visit Website
        </Text>
      )}
    </ScrollView>
  );
}
