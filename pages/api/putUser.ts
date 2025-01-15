import { PrismaClient } from '@prisma/client';
import { parse } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
        const authToken = cookies.authToken;

        if (!authToken) {
            return res.status(401).json({ error: 'Unauthorized. Cookie is missing.' });
        }

        try {
            const tokenParts = authToken.split('-');
            const userId = tokenParts.slice(1, -1).join('-');

            const { name, nickname, image, password } = req.body;

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    name,
                    nickname,
                    image,
                    password,
                },
            });

            res.status(200).json({ message: 'User updated successfully', user: updatedUser });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
