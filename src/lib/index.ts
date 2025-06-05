
//for validation of signup and login form

import { z } from "zod"

export const SignUpValidation = z.object({
    name : z.string().min(3 , {message : 'Name must be at least 3 characters.' ,}),
    username: z.string().min(3, {
      message: "Username must be at least 3 characters.",
    } ),
    email: z.string().email(),
    password: z.string().min(3, {
      message: "Password must be at least 3 characters.",
    }),
})

export const SignInValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});


export const PostValidation = z.object({
    caption: z.string().min(2, {
        message: "Caption must be at least 2 characters.",
    }).max(2200, {
        message: "Caption must be less than 2200 characters.",
    }),

    file : z.custom<File[]>().optional().nullable(),
    location : z.string().min(2).max(100),
    tags : z.string(),
})