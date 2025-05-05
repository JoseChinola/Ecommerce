import { v2 as cloudinary } from 'cloudinary';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

// Configuración
cloudinary.config({
    cloud_name: 'dg0wzl8i2',
    api_key: '739648333859378',
    api_secret: 'JqKlEnVIMwInMheDjGGpGfWErsE',
});

// Función para eliminar en lotes de 100
async function deleteImagesInBatches(publicIds) {
    const batchSize = 100;

    for (let i = 0; i < publicIds.length; i += batchSize) {
        const batch = publicIds.slice(i, i + batchSize);

        try {
            const result = await cloudinary.api.delete_resources(batch);
            console.log(`Batch ${i / batchSize + 1} eliminado:`, result);
        } catch (error) {
            console.error(`Error eliminando batch ${i / batchSize + 1}:`, error);
        }
    }
}

// Primero listar recursos
cloudinary.api.resources({
    type: 'upload',
    prefix: 'ShopMix/', // Buscar solo dentro de esa "carpeta"
    max_results: 500,   // Ajusta el número máximo de resultados
}, async (error, result) => {
    if (error) {
        console.error('Error listando imágenes:', error);
        return;
    }

    const publicIds = result.resources.map((resource) => resource.public_id);

    if (publicIds.length === 0) {
        console.log('No hay imágenes para eliminar.');
        return;
    }

    // Luego borrarlos en lotes
    await deleteImagesInBatches(publicIds);
});