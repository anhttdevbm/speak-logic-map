import { CountryData } from "@/pages/api/countries";
import * as turf from '@turf/turf';

// Get the main land polygon by seeking the most large polygon in multipolygon
export const getGeoMainLand = (geoJson: CountryData): turf.AllGeoJSON => {
  let bestIndex = 0;
  let count = 0;
  let mainLandGeoJson: CountryData = JSON.parse(JSON.stringify(geoJson));
  if (mainLandGeoJson.features[0].geometry.type === "MultiPolygon") {
    mainLandGeoJson.features[0].geometry.coordinates.forEach((coor: number[][] | number[][][], index: number) => {
      if (coor[0].length > count) {
        bestIndex = index;
        count = coor[0].length;
      }
    });
    mainLandGeoJson.features[0].geometry.coordinates = mainLandGeoJson.features[0].geometry.coordinates[bestIndex] as number[][][];
    mainLandGeoJson.features[0].geometry.type = 'Polygon';
  }
  return mainLandGeoJson as turf.AllGeoJSON;
}