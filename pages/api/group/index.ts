import type { NextApiRequest, NextApiResponse } from 'next';

import GroupService from '../../../services/group-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method == 'GET') {
      const groups = await GroupService.getGroups();
      res.status(200).json(groups);
    } else {
      res.status(405).json({});
    }
  } catch (error) {
    console.log(error);
    res.status((error as any).code).json(error);
  }
}
