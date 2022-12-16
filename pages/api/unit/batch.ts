import type { NextApiRequest, NextApiResponse } from 'next';

import UnitService from '../../../services/unit-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method == 'POST') {
      const payloads = req.body;
      const dstAmounts = await UnitService.convertUnits(payloads);
      res.status(200).json(dstAmounts);
    } else {
      res.status(405).json({});
    }
  } catch (error) {
    console.log(error);
    res.status((error as any).code).json(error);
  }
}
