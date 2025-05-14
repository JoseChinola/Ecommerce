/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints relacionados con usuarios
 */

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 */

/**
 * @swagger
 * /api/user/verify-email:
 *   post:
 *     summary: Verificar email del usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verificado
 */

/**
 * @swagger
 * /api/user/resend-verification-email:
 *   post:
 *     summary: Reenviar correo de verificación
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verificación reenviada
 */

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 */

/**
 * @swagger
 * /api/user/logout:
 *   get:
 *     summary: Cerrar sesión del usuario
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Sesión cerrada
 */

/**
 * @swagger
 * /api/user/upload-avatar:
 *   put:
 *     summary: Subir avatar de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar subido
 */

/**
 * @swagger
 * /api/user/update-user:
 *   put:
 *     summary: Actualizar datos del usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       200:
 *         description: Datos actualizados
 */

/**
 * @swagger
 * /api/user/forgot-password:
 *   put:
 *     summary: Iniciar proceso de recuperación de contraseña
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Código enviado
 */

/**
 * @swagger
 * /api/user/verify-forgot-password-otp:
 *   put:
 *     summary: Verificar OTP de recuperación de contraseña
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verificado
 */

/**
 * @swagger
 * /api/user/reset-password:
 *   put:
 *     summary: Resetear contraseña
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               nuevaPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 */

/**
 * @swagger
 * /api/user/refresh-token:
 *   post:
 *     summary: Refrescar token JWT
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Token actualizado
 */

/**
 * @swagger
 * /api/user/user-details:
 *   get:
 *     summary: Obtener detalles del usuario
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Detalles del usuario
 */

/**
 * @swagger
 * /api/user/users-get:
 *   get:
 *     summary: Obtener todos los usuarios (admin)
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */

/**
 * @swagger
 * /api/user/update-user-admin:
 *   put:
 *     summary: Actualizar detalles de usuario como admin
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               isAdmin:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuario actualizado por admin
 */
