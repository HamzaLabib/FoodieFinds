import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { getPhotoUrl } from '../scripts/apiHandling.js';
const priceLevelSymbols = ['$', '$$', '$$$', '$$$$'];

export default function RestoCard({ restaurant, onPress, distanceMeters, openNow }) {
  const photoRef = restaurant.photos?.[0]?.photo_reference;
  const imageUrl = photoRef ? getPhotoUrl(photoRef) : null;
  const distanceKm = distanceMeters ? (distanceMeters / 1000).toFixed(1) : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        margin: 10,
        backgroundColor: '#D3D3D3',
        borderRadius: 10,
        shadowColor: '#000080',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 4,
      }}
    >
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={{ height: 150, width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
      )}
      <View style={{ padding: 10 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{restaurant.name}</Text>
        <Text style={{ color: '#555' }}>{restaurant.vicinity}</Text>
        {restaurant.price_level !== undefined && restaurant.price_level >= 0 && restaurant.price_level <= 3 && (
          <Text style={{ fontWeight: 'bold', color: '#333' }}>
            {priceLevelSymbols[restaurant.price_level] || 'No Price Info'}
          </Text>
        )}
        <Text>⭐ {restaurant.rating}</Text>
        {distanceKm && (
          <Text style={{ color: '#777', marginTop: 4 }}>{distanceKm} km away</Text>
        )}
        {openNow !== undefined && (
          <Text
            style={{
              marginTop: 6,
              fontWeight: 'bold',
              color: openNow ? 'green' : 'red',
            }}
          >
            {openNow ? 'Open Now' : 'Closed' }
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
