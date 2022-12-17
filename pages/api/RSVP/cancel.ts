import type { NextApiRequest, NextApiResponse } from 'next';
import RSVPService from '../../../services/rsvp-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method == 'POST') {
      const { userName, eID } = req.body;
      const rsvp = await RSVPService.cancelRSVP(userName, eID);
      res.status(200).json(rsvp);
    } else {
      res.status(405).json({});
    }
  } catch (error) {
    console.log(error);
    res.status((error as any).code).json(error);
  }
}
