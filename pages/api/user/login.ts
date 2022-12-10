import type { NextApiRequest, NextApiResponse } from 'next';

import UserService from '../../../services/user-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userName, password } = req.body;
    const user = await UserService.login(userName, password);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status((error as any).code).json(error);
  }
}
