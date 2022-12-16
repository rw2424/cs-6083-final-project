import type { NextApiRequest, NextApiResponse } from 'next';

import EventService from '../../../services/event-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method == 'POST') {
      const { eName, eDesc, eDate, gName, gCreator, pictureUrls } = req.body;
      const event = await EventService.postEvent(
        eName,
        eDesc,
        eDate,
        gName,
        gCreator,
        pictureUrls
      );
      res.status(200).json(event);
    } else if (req.method == 'GET') {
      const { gName, gCreator } = req.query;
      const events = await EventService.getEvents(gName, gCreator);
      res.status(200).json(events);
    } else {
      res.status(405).json({});
    }
  } catch (error) {
    console.log(error);
    res.status((error as any).code).json(error);
  }
}
