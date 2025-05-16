
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'
dotenv.config()

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

cloudinary.config({
    cloud_name: process.env.CLODINARY_CLOUD_NAME,
    api_key: process.env.CLODINARY_API_KEY,
    api_secret: process.env.CLODINARY_API_SECRET_KEY
})

const uploadImageClodinary = async (image) => {
    try {
        const buffer = image?.buffer || Buffer.from(await image.arrayBuffer?.());

        return await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'ShopMix' },
                (error, result) => {
                    if (error) {
                        console.error('Error en upload_stream:', error);
                        return reject(error);
                    }
                    resolve(result);
                }
            );

            uploadStream.end(buffer);
        });
    } catch (err) {
        console.error('Error en uploadImageClodinary:', err);
        throw err;
    }
};



export default uploadImageClodinary;