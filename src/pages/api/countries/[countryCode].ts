// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { CountryData, CountryGeoJsonData } from '.';
import countryContents from '@/data/countries.json';

export default function handler (
  req: NextApiRequest,
  res: NextApiResponse<CountryData[]>
) {
  const { countryCode } = req.query;
  // const countryContents = fs.readFileSync('public/countries.json', 'utf-8');
  const countryData = countryContents as CountryGeoJsonData;
  
  let countryResponse: CountryData[] = [];

  countryData.features.forEach(country => {
    if (country.properties.CODE === countryCode) {
      let countryDataTemp: CountryData = {
        type: countryData.type,
        features: [country],
      }
      countryResponse = [countryDataTemp];
      return;
    }
  })
  res.status(200).json(countryResponse);
}
