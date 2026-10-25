// Small hand-rolled geo helper — just enough to draw patrol-sector and
// sensor-radius rings on the map without pulling in a geometry library
// for a handful of circles.

export function circleRingCoords(
  center: { lat: number; lng: number },
  radiusKm: number,
  points = 48
): [number, number][] {
  const coords: [number, number][] = [];
  const latR = 111.32; // km per degree latitude
  const lngR = 111.32 * Math.cos((center.lat * Math.PI) / 180);
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const dLat = (radiusKm * Math.sin(angle)) / latR;
    const dLng = (radiusKm * Math.cos(angle)) / lngR;
    coords.push([center.lng + dLng, center.lat + dLat]);
  }
  return coords;
}
