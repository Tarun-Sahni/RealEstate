import jwt from "jsonwebtoken";

export const createToken = (userId: string, rememberme: boolean = false) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET!,
        { expiresIn: rememberme ? "7d" : "1d" }
    )
}

export const verifyToken = (token: string)=>{
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET!)
        if (decoded){
            return decoded
        }else{
            return null;
        }
    } catch (error) {
        return null;
    }
}
