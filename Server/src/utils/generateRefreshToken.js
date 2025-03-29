import jwt from 'jsonwebtoken'
import userSchema from '../models/user.model.js'
import { SECRETE_KEY_REFRESH_TOKEN } from '../config.js'

const generateRefreshToken = async (userId) => {

    const token = await jwt.sign(
        { id: userId },
        SECRETE_KEY_REFRESH_TOKEN,
        { expiresIn: '7d' }
    )

    const updateRefreshTokenUser = await userSchema.update(
        { refresh_token: token }, // Campos a actualizar
        { where: { _id: userId } } // Condición de búsqueda
    );

    return token

}

export default generateRefreshToken