import { parse } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const authToken = cookies.authToken;

  if (!authToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.status(200).json({ message: 'Token is valid' });
}