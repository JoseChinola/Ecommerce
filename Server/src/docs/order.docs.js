/**
 * @swagger
 * tags:
 *   name: Ordenes
 *   description: Endpoints relacionados con las órdenes
 */

/**
 * @swagger
 * /api/order/cash-on-delivery:
 *   post:
 *     summary: Realizar un pedido con pago contra reembolso
 *     tags: [Ordenes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - total
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *               total:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Pedido realizado exitosamente con pago contra reembolso
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /api/order/checkout:
 *   post:
 *     summary: Realizar un pago para completar el pedido
 *     tags: [Ordenes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - paymentMethod
 *             properties:
 *               orderId:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [stripe, paypal]
 *               total:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Pedido procesado con éxito
 *       400:
 *         description: Datos inválidos o error al procesar el pago
 */

/**
 * @swagger
 * /api/order/webhook:
 *   post:
 *     summary: Webhook para recibir notificaciones de Stripe
 *     tags: [Ordenes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *                 description: El evento recibido desde Stripe
 *               data:
 *                 type: object
 *                 description: Información detallada sobre el evento
 *     responses:
 *       200:
 *         description: Notificación recibida y procesada correctamente
 *       400:
 *         description: Error al procesar la notificación
 */

/**
 * @swagger
 * /api/order/order-list:
 *   get:
 *     summary: Obtener una lista de órdenes
 *     tags: [Ordenes]
 *     responses:
 *       200:
 *         description: Lista de órdenes
 *       400:
 *         description: Error al obtener las órdenes
 */