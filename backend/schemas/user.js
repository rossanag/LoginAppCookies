import {z} from 'zod';

const userSchema = z.object({
    name: z.string().trim().min(8,{message:"Name must be at least 8 characters long"}).max(30),
    email: z.string().email({ message: "Invalid email address" }),  
    picture: z.string(),
    authmode: z.string().not.empty(),
    refreshToken: z.string()
})

function validateUser(user) {
    return userSchema.safeParse(user)
}

export default userSchema;
