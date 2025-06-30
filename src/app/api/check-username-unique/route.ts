import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";



const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request:Request){
     
    await dbConnect()
    
    try {
        // localhost:3000/api/check-username-unique?username=ayush?phone=android ==> is type se url rhega jisse username ko fetch krenge
        // URL se query parameter extract krenge username ko check krne ke liye
        const {searchParams} = new URL(request.url)
        const queryParams = {
            username: searchParams.get('username')
        }
        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParams) // to check 
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: usernameErrors?.length>0? usernameErrors.join(', ')
                    : 'Invalid query parameter'
                },
                {
                    status: 400
                }
            )
        }

        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})

            if(existingVerifiedUser){
                return Response.json(
                {
                    success: false,
                    message: "Username is already taken"
                },
                {
                    status: 400
                }
            )
            }

            return Response.json(
                {
                    success: true,
                    message: "Username is unique"
                },
                {
                    status: 200
                }
            )

    } catch (error) {
        console.error("Error checking username", error)
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {
                status:500
            }
        )
    }
}