import { PrismaClient } from '@prisma/client';
import { parse } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const authToken = cookies.authToken;

    if (!authToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const userId = authToken.split('-')[1];

        if (req.method === 'GET') {
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json({
                name: user.name,
                nickname: user.nickname,
                image: user.image,
            });
        } else if (req.method === 'PUT') {
            const { name, nickname, image, password } = req.body;

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    ...(name && { name }),
                    ...(nickname && { nickname }),
                    ...(image && { image }),
                    ...(password && { password }),
                },
            });

            res.status(200).json(updatedUser);
        } else {
            res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error handling user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
