import z from "zod";

export const orderQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val) : 1)),
});

export type OrderQueryParams = z.infer<typeof orderQuerySchema>;

export const orderItemSchema = z.object({
  id: z.coerce.number(),
  name: z.string().optional().nullable(),
  quantity: z.number(),
  price: z.number(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderAddressSchema = z.object({
  address: z.string().optional().nullable().transform((val) => val ?? ''),
}).passthrough();

export type OrderAddress = z.infer<typeof orderAddressSchema>;

export const orderSchema = z.object({
  id: z.coerce.string(),
  address: orderAddressSchema,
  items: z.array(orderItemSchema),
  totalCost: z.number(),
  placedDate: z.string(),
});

export type Order = z.infer<typeof orderSchema>;

export const orderListSchema = z.array(orderSchema);

export type OrderList = z.infer<typeof orderListSchema>;

export const ordersListDataSchema = z.object({
  orders: orderListSchema,
  pagination: z.object({
    page: z.number(),
    totalPages: z.number(),
    totalOrders: z.number(),
  }),
});

export type OrdersListData = z.infer<typeof ordersListDataSchema>;
