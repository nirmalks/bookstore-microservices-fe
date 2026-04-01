import z from "zod";
import { bookListSchema, bookSchema } from "./book";

export const cartStateSchema = z.object({
  cartItems: bookListSchema,
  numItemsInCart: z.number(),
  cartTotal: z.number(),
  shipping: z.number(),
  tax: z.number(),
  orderTotal: z.number(),
});

export type CartState = z.infer<typeof cartStateSchema>;

export const addItemPayloadSchema = z.object({
  book: bookSchema,
});

export type AddItemPayload = z.infer<typeof addItemPayloadSchema>;

export const removeItemPayloadSchema = z.object({
  id: z.number(),
});

export type RemoveItemPayload = z.infer<typeof removeItemPayloadSchema>;

export const editItemPayloadSchema = z.object({
  id: z.number(),
  quantity: z.number(),
});

export type EditItemPayload = z.infer<typeof editItemPayloadSchema>;
