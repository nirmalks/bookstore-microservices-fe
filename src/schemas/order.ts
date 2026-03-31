import z from "zod";

export const orderQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val) : 1)),
});

export type OrderQueryParams = z.infer<typeof orderQuerySchema>;
