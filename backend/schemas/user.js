import {z} from 'zod';

export const userSchema = z.object({
    name: z.string().trim().min(8,{message:"Name must be at least 8 characters long"}).max(30),
    email: z.string().email({ message: "Invalid email address" }),  
    picture: z.string.url()({
        invalid_type_error: "Invalid picture URL",        
    }),
    authmode: z.string({}),    
})


export function validateUserInfo(user) {
    return userSchema.safeParse(user)
}


