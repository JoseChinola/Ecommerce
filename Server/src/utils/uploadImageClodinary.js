// Desactivar temporalmente la verificación de certificados SSL
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

import { v2 as cloudinary } from 'cloudinary';
import { CLODINARY_API_KEY, CLODINARY_API_SECRET_KEY, CLODINARY_CLOUD_NAME } from '../config.js';

cloudinary.config({
    cloud_name: CLODINARY_CLOUD_NAME,
    api_key: CLODINARY_API_KEY,
    api_secret: CLODINARY_API_SECRET_KEY
})

const uploadImageClodinary = async (image) => {
    const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());

    const uploadImage = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: "ShopMix" }, (error, uploadResult) => {
            return resolve(uploadResult)
        }).end(buffer)
    })

    return uploadImage
}

export default uploadImageClodinary;