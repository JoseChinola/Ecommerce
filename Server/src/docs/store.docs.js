/**
 * @swagger
 * tags:
 *   name: Almacenes
 *   description: Endpoints relacionados con los almacenes
 */

/**
 * @swagger
 * /api/store/create:
 *   post:
 *     summary: Crear un nuevo almacén
 *     tags: [Almacenes]

 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - direccion
 *               - telefono
 *             properties:
 *               nombre:
 *                 type: string
 *               direccion:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       201:
 *         description: Almacén creado exitosamente
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /api/store/get:
 *   get:
 *     summary: Obtener todos los almacenes
 *     tags: [Almacenes]

 *     responses:
 *       200:
 *         description: Lista de almacenes
 *       403:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/store/update:
 *   put:
 *     summary: Actualizar un almacén existente
 *     tags: [Almacenes]

 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - storeId
 *               - nombre
 *               - direccion
 *               - telefono
 *             properties:
 *               storeId:
 *                 type: string
 *               nombre:
 *                 type: string
 *               direccion:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       200:
 *         description: Almacén actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Almacén no encontrado
 */

/**
 * @swagger
 * /api/store/delete:
 *   put:
 *     summary: Eliminar un almacén
 *     tags: [Almacenes]

 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - storeId
 *             properties:
 *               storeId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Almacén eliminado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Almacén no encontrado
 */
