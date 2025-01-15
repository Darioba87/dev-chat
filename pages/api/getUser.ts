import { PrismaClient } from '@prisma/client';
import { log } from 'console';
import { parse } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
        const authToken = cookies.authToken;

        if (!authToken) {
            return res.status(401).json({ error: 'Unauthorized. Cookie is missing.' });
        }

        try {
            const tokenParts = authToken.split('-');
            if (tokenParts.length < 3 || tokenParts[0] !== 'token') {
                return res.status(400).json({ error: 'Invalid token format.' });
            }

            const userId = tokenParts.slice(1, -1).join('-'); // UUID puede contener guiones
            log('userId:', userId);

            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
