import { z } from 'zod';

export const RegisterValidator = z.object({
    name: z.string()
        .min(3, "name has to be at least 3 characters long")
        .max(20, "name has to be shorter than 20 characters"),
    lastname: z.string()
        .min(3, "lastname has to be at least 3 characters long")
        .max(20, "lastname has to be shorter than 20 characters"),
    email: z.string()
        .email("email is not valid")
        .min(1, "email has to be at least 1 character long")
        .max(100, "email is too long"),
    password: z.string()
        .min(8, "password has to be at least 8 characters long"),
    birthday: z.string().date()
});