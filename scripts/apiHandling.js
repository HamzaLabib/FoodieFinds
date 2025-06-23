import { GOOGLE_API_KEY } from '@env';

export const fetchNearbyRestaurants = async (latitude, longitude, pageToken = null) => {
  const radius = 10000;
  const type = 'restaurant';

  let url;

  if (pageToken) {
    url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${pageToken}&key=${GOOGLE_API_KEY}`;
  } else {
    url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${GOOGLE_API_KEY}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log('Google Places API response:', JSON.stringify(data, null, 2));

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    return {
      results: data.results || [],
      nextPageToken: data.next_page_token || null,
    };
  } catch (error) {
    console.error('Error fetching restaurants:', error.message);
    throw error;
  }
};

export const getPhotoUrl = (photoReference, maxwidth = 400) =>
  `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
