/**
 * @swagger
 * tags:
 *   name: Direcciones
 *   description: Endpoints relacionados con la gestión de direcciones
 */

/**
 * @swagger
 * /api/address/create:
 *   post:
 *     summary: Crear una nueva dirección
 *     tags: [Direcciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - street
 *               - city
 *               - postalCode
 *               - country
 *             properties:
 *               street:
 *                 type: string
 *                 description: Calle de la dirección
 *               city:
 *                 type: string
 *                 description: Ciudad de la dirección
 *               postalCode:
 *                 type: string
 *                 description: Código postal
 *               country:
 *                 type: string
 *                 description: País
 *     responses:
 *       201:
 *         description: Dirección creada exitosamente
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /api/address/get:
 *   get:
 *     summary: Obtener las direcciones del usuario
 *     tags: [Direcciones]
 *     responses:
 *       200:
 *         description: Lista de direcciones obtenidas correctamente
 *       400:
 *         description: Error al obtener las direcciones
 */

/**
 * @swagger
 * /api/address/update:
 *   put:
 *     summary: Actualizar una dirección existente
 *     tags: [Direcciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addressId
 *               - street
 *               - city
 *               - postalCode
 *               - country
 *             properties:
 *               addressId:
 *                 type: string
 *                 description: ID de la dirección a actualizar
 *               street:
 *                 type: string
 *                 description: Calle de la dirección
 *               city:
 *                 type: string
 *                 description: Ciudad de la dirección
 *               postalCode:
 *                 type: string
 *                 description: Código postal
 *               country:
 *                 type: string
 *                 description: País
 *     responses:
 *       200:
 *         description: Dirección actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Dirección no encontrada
 */

/**
 * @swagger
 * /api/address/disable:
 *   delete:
 *     summary: Eliminar o desactivar una dirección
 *     tags: [Direcciones]
 *     parameters:
 *       - in: query
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la dirección a desactivar
 *     responses:
 *       200:
 *         description: Dirección desactivada correctamente
 *       400:
 *         description: Error al desactivar la dirección
 *       404:
 *         description: Dirección no encontrada
 */
