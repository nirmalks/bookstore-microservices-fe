import { z } from "zod";

export const userSchema = z.object({
    userId: z.number(),
    username: z.string(),
    email: z.string().optional(),
    token: z.string(),
})

export type User = z.infer<typeof userSchema>;

export const themeSchema = z.enum(['light', 'dark']);
export type Theme = z.infer<typeof themeSchema>;


export const userStateSchema = z.object({
    user: userSchema.nullable(),
    theme: themeSchema,
})

export type UserState = z.infer<typeof userStateSchema>;