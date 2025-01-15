import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // Elimina la cookie estableciendo maxAge en 0
        res.setHeader(
            'Set-Cookie',
            serialize('authToken', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 0,
            })
        );

        res.status(200).json({ message: 'Logout successful' });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
