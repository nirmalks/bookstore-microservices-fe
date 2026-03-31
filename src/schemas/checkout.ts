import z from "zod";

export const checkoutFormDataSchema = z.object({
    address: z.string().min(3, 'Address must be at least 3 characters'),
    city: z.string().min(3, 'City must be at least 3 characters'),
    state: z.string().min(3, 'State must be at least 3 characters'),
    country: z.string().min(3, 'Country must be at least 3 characters'),
    pinCode: z.string().min(3, 'Pin code must be at least 3 characters'),
});

export type CheckoutFormData = z.infer<typeof checkoutFormDataSchema>;