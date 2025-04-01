import jwt from 'jsonwebtoken'
import { SECRETE_KEY_ACCESS_TOKEN } from '../config.js'

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.headers?.authorization?.split(" ")[1]

        if (!token) {
            return res.status(401).json({
                message: "You have not login",
                error: true,
                success: false
            })
        }

        const decode = await jwt.verify(token, SECRETE_KEY_ACCESS_TOKEN)

        if (!decode) {
            return res.status(401).json({
                message: "unauthorized access",
                error: true,
                success: false
            })
        }

        req.userId = decode.id

        next()

    } catch (error) {
        return res.status(500).json({
            message: "You have not login" || error,
            error: true,
            success: false
        })
    }
}

export default auth;