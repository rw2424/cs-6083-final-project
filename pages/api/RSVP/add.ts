import type { NextApiRequest, NextApiResponse } from 'next';
import RSVPService from '../../../services/rsvp-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method == 'POST') {
      const { userName, eID, response, gName, gCreator } = req.body;
      const rsvp = await RSVPService.addRSVP(
        userName,
        eID,
        response,
        gName,
        gCreator
      );
      res.status(200).json(rsvp);
    } else if (req.method == 'GET') {
      const rsvps = await RSVPService.getRSVP();
      res.status(200).json(rsvps);
    } else {
      res.status(405).json({});
    }
  } catch (error) {
    console.log(error);
    res.status((error as any).code).json(error);
  }
}
