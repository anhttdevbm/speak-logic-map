// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { CountryData, CountryGeoJsonData } from '../countries';
import stateContents from '@/data/states.json';


export default function handler (
  req: NextApiRequest,
  res: NextApiResponse<CountryData[]>
) {
  const { stateCode } = req.query;
  const stateData = stateContents as CountryGeoJsonData;
  
  let stateResponse: CountryData[] = [];

  stateData.features.forEach(state => {
    if (state.properties.CODE === stateCode) {
      let stateDataTemp: CountryData = {
        type: stateData.type,
        features: [state],
      }
      stateResponse = [stateDataTemp];
      return;
    }
  })
  res.status(200).json(stateResponse);
}
