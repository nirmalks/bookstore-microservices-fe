import { z } from 'zod';

export const metaSchema = z.object({
    number: z.number(),
    size: z.number(),
    totalElements: z.number(),
    last: z.boolean(),
    totalPages: z.number(),
    sort: z.object({
        empty: z.boolean(),
        unsorted: z.boolean(),
        sorted: z.boolean(),
    }),
    first: z.boolean(),
    numberOfElements: z.number(),
    empty: z.boolean(),
})

export type Meta = z.infer<typeof metaSchema>;

export const apiErrorSchema = z.object({
    message: z.string(),
    status: z.number(),
    errors: z.array(z.string()),
})

export type ApiError = z.infer<typeof apiErrorSchema>;

const singleIdParamSchema = z.object({
    id: z.string(),
})

export type SingleIdParams = z.infer<typeof singleIdParamSchema>;

const queryParamsSchema = z.record(z.string(), z.string());

export type QueryParams = z.infer<typeof queryParamsSchema>;

const paramsWithIdSchema = z.object({
    params: z.object({
        id: z.string().optional(),
    })
});

export type ParamsWithId = z.infer<typeof paramsWithIdSchema>;