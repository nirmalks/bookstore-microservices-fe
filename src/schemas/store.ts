import { cartStateSchema } from "./cart"
import { userStateSchema } from "./user"
import { z } from "zod"

export const appStateSchema = z.object({
    cartState: cartStateSchema,
    userState: userStateSchema
})
export type AppState = z.infer<typeof appStateSchema>