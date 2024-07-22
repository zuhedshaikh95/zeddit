import { z } from 'zod';

export const subZedditPayloadValidator = z.object({
    name: z.string().min(3).max(21)
});

export const subZedditSubscriptionValidator = z.object({
    subZedditId: z.string()
});