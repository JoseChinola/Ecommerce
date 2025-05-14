/**
 * @swagger
 * tags:
 *   name: Carrito de Compras
 *   description: Endpoints relacionados con el carrito de compras
 */

/**
 * @swagger
 * /api/cart/create:
 *   post:
 *     summary: Añadir un artículo al carrito
 *     tags: [Carrito de Compras]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID del producto
 *               quantity:
 *                 type: integer
 *                 description: Cantidad del producto a añadir
 *     responses:
 *       201:
 *         description: Artículo añadido al carrito exitosamente
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /api/cart/get:
 *   get:
 *     summary: Obtener los artículos del carrito
 *     tags: [Carrito de Compras]
 *     responses:
 *       200:
 *         description: Lista de artículos del carrito
 *       400:
 *         description: Error al obtener los artículos del carrito
 */

/**
 * @swagger
 * /api/cart/update-qty:
 *   put:
 *     summary: Actualizar la cantidad de un artículo en el carrito
 *     tags: [Carrito de Compras]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cartItemId
 *               - quantity
 *             properties:
 *               cartItemId:
 *                 type: string
 *                 description: ID del artículo en el carrito
 *               quantity:
 *                 type: integer
 *                 description: Nueva cantidad del artículo
 *     responses:
 *       200:
 *         description: Cantidad del artículo actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Artículo no encontrado
 */

/**
 * @swagger
 * /api/cart/delete-cart-item:
 *   delete:
 *     summary: Eliminar un artículo del carrito
 *     tags: [Carrito de Compras]
 *     parameters:
 *       - in: query
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del artículo a eliminar
 *     responses:
 *       200:
 *         description: Artículo eliminado del carrito
 *       400:
 *         description: Error al eliminar el artículo
 *       404:
 *         description: Artículo no encontrado
 */

/**
 * @swagger
 * /api/cart/delete-cart-items:
 *   delete:
 *     summary: Eliminar todos los artículos del carrito
 *     tags: [Carrito de Compras]
 *     responses:
 *       200:
 *         description: Todos los artículos fueron eliminados del carrito
 *       400:
 *         description: Error al eliminar los artículos del carrito
 */