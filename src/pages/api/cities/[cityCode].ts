// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { CountryData, CountryGeoJsonData } from '../countries';
import cityContents from '@/data/cities.json';

export default function handler (
  req: NextApiRequest,
  res: NextApiResponse<CountryData[]>
) {
  const { cityCode } = req.query;
  const cityData = cityContents as CountryGeoJsonData;
  
  let cityResponse: CountryData[] = [];

  cityData.features.forEach(city => {
    if (city.properties.NAME === cityCode) {
      let cityDataTemp: CountryData = {
        type: cityData.type,
        features: [city],
      }
      cityResponse = [...cityResponse, cityDataTemp];
    }
  })

  if (cityResponse.length > 0) {
    let configResponse: CountryData[] = [];
    let fixedCoordinates: any[] = [];
    cityResponse.forEach(city => {
      fixedCoordinates = [...fixedCoordinates, city.features[0].geometry.coordinates];
    })
    configResponse = [{
      type: cityResponse[0].type,
      features: [{
        type: cityResponse[0].features[0].type,
        properties: cityResponse[0].features[0].properties,
        geometry: {
          type: 'MultiPolygon',
          coordinates: fixedCoordinates,
        }
      }]
    }];

    cityResponse = configResponse;
  }
  res.status(200).json(cityResponse);
}
