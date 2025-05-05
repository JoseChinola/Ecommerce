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

export const deleteFolderCloudinary = async (folderName) => {
    try {
        let nextCursor = null;

        do {
            const resources = await cloudinary.api.resources({
                type: 'upload',
                prefix: folderName + '/',
                max_results: 500,
                next_cursor: nextCursor,
            });

            const publicIds = resources.resources.map(file => file.public_id);

            if (publicIds.length > 0) {
                await cloudinary.api.delete_resources(publicIds);
                console.log(`Se eliminaron ${publicIds.length} recursos de la carpeta ${folderName}.`);
            }

            nextCursor = resources.next_cursor;
        } while (nextCursor); // Sigue eliminando mientras haya más recursos

        // Cuando ya no quedan recursos, intenta borrar la carpeta
        await cloudinary.api.delete_folder(folderName);
        console.log(`La carpeta "${folderName}" ha sido eliminada.`);

    } catch (error) {
        console.error('Error eliminando carpeta:', error);
    }
};


export default uploadImageClodinary;