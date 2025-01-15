import { PrismaClient } from '@prisma/client';
import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        try {
            // Busca al usuario en la base de datos
            const user = await prisma.user.findUnique({
                where: { email },
            });

            // Verifica si el usuario existe
            if (!user || user.password !== password) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Genera un token (puede ser un JWT o cualquier otro tipo de token)
            const token = `token-${user.id}-${Date.now()}`;

            // Establece la cookie
            res.setHeader(
                'Set-Cookie',
                serialize('authToken', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                    maxAge: 60 * 60 * 24, // 1 día
                })
            );

            // Devuelve el éxito
            res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
        } catch (error: unknown) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
