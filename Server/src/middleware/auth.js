import jwt from 'jsonwebtoken'

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.headers?.authorization?.split(" ")[1]

        if (!token) {
            return res.status(401).json({
                message: "No access token provided. Please log in.",
                error: true,
                success: false
            })
        }

        const decode = await jwt.verify(token, process.env.SECRETE_KEY_ACCESS_TOKEN)

        if (!decode) {
            return res.status(401).json({
                message: "Invalid or expired token. Unauthorized access.",
                error: true,
                success: false
            })
        }

        req.userId = decode.id

        next()

    } catch (error) {
        return res.status(500).json({
            message: "Inicia Session" || error,
            error: true,
            success: false
        })
    }
}

export default auth;