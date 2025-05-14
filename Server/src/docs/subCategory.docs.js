/**
 * @swagger
 * tags:
 *   name: Subcategorías
 *   description: Endpoints relacionados con las subcategorías
 */

/**
 * @swagger
 * /api/subcategory/create:
 *   post:
 *     summary: Crear una nueva subcategoría
 *     tags: [Subcategorías]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - categoriaId
 *             properties:
 *               nombre:
 *                 type: string
 *               categoriaId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subcategoría creada exitosamente
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /api/subcategory/get:
 *   get:
 *     summary: Obtener todas las subcategorías
 *     tags: [Subcategorías]
 *     responses:
 *       200:
 *         description: Lista de subcategorías
 */

/**
 * @swagger
 * /api/subcategory/update:
 *   put:
 *     summary: Actualizar una subcategoría existente
 *     tags: [Subcategorías]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subCategoriaId
 *               - nombre
 *             properties:
 *               subCategoriaId:
 *                 type: string
 *               nombre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subcategoría actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Subcategoría no encontrada
 */

/**
 * @swagger
 * /api/subcategory/delete:
 *   delete:
 *     summary: Eliminar una subcategoría
 *     tags: [Subcategorías]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subCategoriaId
 *             properties:
 *               subCategoriaId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subcategoría eliminada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Subcategoría no encontrada
 */
