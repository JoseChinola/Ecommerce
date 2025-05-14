/**
 * @swagger
 * tags:
 *   name: Categorías
 *   description: Endpoints relacionados con la gestión de categorías
 */

/**
 * @swagger
 * /api/category/add-category:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags: [Categorías]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la categoría
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /api/category/get:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags: [Categorías]
 *     responses:
 *       200:
 *         description: Lista de categorías obtenidas correctamente
 *       400:
 *         description: Error al obtener las categorías
 */

/**
 * @swagger
 * /api/category/update:
 *   put:
 *     summary: Actualizar una categoría existente
 *     tags: [Categorías]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID de la categoría a actualizar
 *               name:
 *                 type: string
 *                 description: Nombre de la categoría
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Categoría no encontrada
 */

/**
 * @swagger
 * /api/category/delete:
 *   delete:
 *     summary: Eliminar una categoría
 *     tags: [Categorías]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría a eliminar
 *     responses:
 *       200:
 *         description: Categoría eliminada correctamente
 *       400:
 *         description: Error al eliminar la categoría
 *       404:
 *         description: Categoría no encontrada
 */