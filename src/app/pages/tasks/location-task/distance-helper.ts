export type LatLng = {
  lat: number;
  lng: number;
};

const EARTH_RADIUS = 6371000; // meters

const toRad = (deg: number) => deg * Math.PI / 180;

export function fastDistanceMeters(a: LatLng, b: LatLng): number {
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const lon1 = toRad(a.lng);
  const lon2 = toRad(b.lng);

  const x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
  const y = lat2 - lat1;

  return Math.sqrt(x * x + y * y) * EARTH_RADIUS;
}
