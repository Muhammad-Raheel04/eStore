

export const isAuthenticated = async (req,res,next)=>{
    try{
        const authHeader=req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(400).json({
                success:false,
                message:"Authorization token is missing or invalid"
            })
        }
    }catch(error){
        return res.status(500).json({
            success:true,
            message:error.message
        })
    }
}