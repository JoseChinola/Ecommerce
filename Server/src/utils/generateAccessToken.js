import jwt from 'jsonwebtoken'
import { SECRETE_KEY_ACCESS_TOKEN } from '../config.js';

const generateAccessToken = async (userId) => {
    const token = await jwt.sign(
        { id: userId },
        SECRETE_KEY_ACCESS_TOKEN,
        { expiresIn: '5h' }
    )

    return token
}

export default generateAccessToken;