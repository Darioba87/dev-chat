import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password, name } = req.body;
        try {
            const user = await prisma.user.create({
                data: { email, name, password },
            });
            res.status(200).json(user);
        } catch (error: unknown) {
            console.error(error);
            res.status(400).json({ error: 'User already exists' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}