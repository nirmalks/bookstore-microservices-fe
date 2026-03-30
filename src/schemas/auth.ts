import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(3, 'Password must be at least 3 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const authResponseSchema = z.object({
    access_token: z.string(),
    userId: z.number(),
    username: z.string(),
    role: z.string(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
