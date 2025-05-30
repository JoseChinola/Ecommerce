import sendEmail from "../config/sendEmail.js";
import userSchema from "../models/user.model.js";
import bcrypt from "bcryptjs";
import verifyEmailTemplate from "../templates/verifyEmailTemplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import uploadImageClodinary from "../utils/uploadImageClodinary.js";
import generatedOtp from "../utils/generatedOtp.js";
import forgotPasswordTemplate from "../templates/forgotPasswordTemplate.js";
import jwt from 'jsonwebtoken'
import notificationSchema from "../models/notifications.model.js";


export async function registerUserController(req, res) {
    try {
        const { name, lastName, email, password } = req.body;


        // Validar que todos los campos estén presentes
        if (!name || !email || !password || !lastName) {
            return res.status(400).json({
                message: "Provide name, email, lastName, and password",
                error: true,
                success: false
            });
        }

        // Verificar si el usuario ya está registrado
        const existingUser = await userSchema.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({
                message: "El correo electrónico ya está registrado.",
                error: true,
                success: false
            });
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Crear nuevo usuario
        const newUser = await userSchema.create({
            name,
            lastName,
            email,
            password: hashPassword,
            verifyEmail: false
        });



        // URL de verificación de email
        const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${newUser._id}`;

        try {
            // Enviar email de verificación
            await sendEmail({
                sendTo: email,
                subject: "Verify your email - D’RAF SERVICES",
                html: verifyEmailTemplate({
                    name,
                    url: verifyEmailUrl
                })
            });
        } catch (emailError) {
            console.error("Error sending verification email:", emailError);
            return res.status(500).json({
                message: "Usuario registrado, pero la verificación de correo electrónico falló",
                error: true,
                success: false
            });
        }


        return res.status(201).json({
            message: "Usuario registrado correctamente. verificar su correo.",
            error: false,
            success: true,
            data: newUser
        });

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

export async function verifyEmailController(req, res) {
    try {
        const { code } = req.body

        // Verificar si se envió el código
        if (!code) {
            return res.status(400).json({
                message: "Se requiere código de verificación",
                error: true,
                success: false
            });
        }

        // Buscar usuario por código
        const user = await userSchema.findOne({ where: { _id: code } });

        if (!user) {
            return res.status(400).json({
                message: "Código de verificación no válido",
                error: true,
                success: false
            });
        }

        if (user.verify_email === true) {
            return res.status(400).json({
                message: "Correo verificado",
                error: true,
                success: false
            });
        }

        // Actualizar el estado de verificación del email
        await userSchema.update({ verify_email: true }, { where: { _id: code } });

        return res.json({
            message: "Correo verificado exitosamente",
            success: true,
            error: false
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

export async function resendVerificationEmail(req, res) {
    const { email } = req.body

    if (!email) {
        return res.status(400).json({
            message: "El email es obligatorio.",
            error: true
        })
    }

    try {
        const user = await userSchema.findOne({ where: { email } })

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado.",
                error: true
            })
        }

        if (user.verify_email === true) {
            return res.status(400).json({
                message: "Este correo ya está verificado.",
                error: true,
                success: false
            });
        }

        const verifyEmailUrl = `${process.env.FRONTEND_URL}`

        await sendEmail({
            sendTo: user.email,
            subject: "Verifica tu correo - D’RAF SERVICES",
            html: verifyEmailTemplate({
                name: user.name,
                url: verifyEmailUrl
            })
        })

        res.json({
            message: "Correo de verificación reenviado correctamente.",
            success: true,
            error: false
        })
    } catch (err) {
        console.error("Error reenviando correo:", err)
        res.status(500).json({
            message: "Error interno al reenviar el correo.",
            success: false,
            error: true
        })
    }
}

//Login controller 
export async function loginController(req, res) {
    try {
        const { email, password } = req.body;

        // Verificar si se envió email y password
        if (!email || !password) {
            return res.status(400).json({
                message: "El correo y la contraseña son obligatorios.",
                error: true,
                success: false
            });
        }


        // Buscar usuario en la base de datos
        const user = await userSchema.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({
                message: "Usuario no registrado.",
                error: true,
                success: false
            });
        }

        // Verificar si el usuario está activo
        if (user.status !== "Active") {
            return res.status(403).json({
                message: "Tu cuenta está inactiva. Contacta al administrador.",
                error: true,
                success: false
            });
        }

        if (user.verify_email !== true) {
            return res.status(400).json({
                message: "Email no verificado",
                error: true,
                success: false
            });
        }

        // Comparar contraseña
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(400).json({
                message: "Contraseña incorrecta.",
                error: true,
                success: false
            });
        }

        // Generar tokens
        const accessToken = await generateAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id);

        await userSchema.update(
            { last_login_date: new Date() },
            { where: { _id: user._id } }
        );


        // Configuración de cookies
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        res.cookie("accessToken", accessToken, cookiesOption);
        res.cookie("refreshToken", refreshToken, cookiesOption);

        const fullName = `${user.name} ${user.lastName || ""}`.trim();

        return res.json({
            message: `¡Bienvenido/a, ${fullName} ! Nos alegra contar contigo nuevamente!`,
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken
            }
        });
    } catch (error) {

        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

//logout controller
export async function logoutController(req, res) {
    try {
        const userid = req.userId //middleware 


        // Configuración de cookies
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        res.clearCookie("accessToken", cookiesOption)
        res.clearCookie("refreshToken", cookiesOption)

        await userSchema.update({ refresh_token: "" }, { where: { _id: userid } })


        return res.json({
            message: "Sesión cerrada correctamente. ¡Te esperamos pronto!",
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }
}

//Upload user avatar 
export async function uploadAvatar(req, res) {
    try {
        const userId = req.userId
        const image = req.file;

        if (!image) {
            return res.status(400).json({
                message: "No image file provided.",
                error: true,
                success: false
            });
        }

        const upload = await uploadImageClodinary(image);

        await userSchema.update({ avatar: upload.url }, { where: { _id: userId } })

        return res.json({
            message: "upload profile",
            success: true,
            error: false,
            data: {
                _id: userId,
                avatar: upload.url
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }
}

// udate user details 
export async function updateUserDetails(req, res) {
    try {
        const userId = req.userId // auth middleware

        const { name, lastName, email, mobile, password } = req.body

        let hashPassword = "";

        if (password) {
            // Hashear la contraseña
            const salt = await bcrypt.genSalt(10);
            hashPassword = await bcrypt.hash(password, salt);
        }
        await userSchema.update(
            {
                ...(name && { name: name }),
                ...(email && { email: email }),
                ...(mobile && { mobile: mobile }),
                ...(lastName && { lastName: lastName }),
                ...(password && { password: hashPassword })

            },
            { where: { _id: userId } })

        // Después de la actualización, obtenemos los datos actualizados
        const updatedUser = await userSchema.findOne({ where: { _id: userId } });

        return res.json({
            message: "Usuario Actualizado",
            error: false,
            success: true,
            data: updatedUser
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }
}

// update user details Admin
export async function updateAdminUserDetails(req, res) {
    try {
        const userId = req.userId // auth middleware

        const { _id, name, email, role, status } = req.body

        console.log('req-body', req.body)

        await userSchema.update(
            {
                ...(name && { name: name }),
                ...(email && { email: email }),
                ...(status && { status: status }),
                ...(role && { role: role })

            },
            { where: { _id: _id } })

        // Después de la actualización, obtenemos los datos actualizados
        const updatedUser = await userSchema.findOne({ where: { _id: _id } });

        return res.json({
            message: "Usuario Actualizado",
            error: false,
            success: true,
            data: updatedUser
        })


    } catch (error) {
        console.log('error users update ', error)
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }
}

//delete users admin 
export async function deleteAdminUsers(req, res) {
    try {
        const userId = req.userId // auth middleware
        const { _id } = req.body

        const user = await userSchema.findOne({ where: { _id: _id } })
        if (!user) {
            return res.status(401).json({
                message: "Usuario no encontrado",
                error: true,
                success: false,
            });
        }
        const userDelete = await userSchema.destroy({ where: { _id } })
        res.json({
            message: "Usuario eliminado",
            data: userDelete,
            error: false,
            success: true
        })

    } catch (error) {
        console.log('error users delete ', error)
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }

}

//forgot password not login
export async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body


        const user = await userSchema.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({
                message: "Email not available",
                error: true,
                success: false,
            });
        }



        const otp = generatedOtp()
        const expireTime = new Date(Date.now() + 60 * 60 * 1000).toISOString()

        const updated = await userSchema.update(
            {
                forgot_password_otp: otp,
                forgot_password_expiry: expireTime
            },
            { where: { _id: user._id } })



        const emailll = await sendEmail({
            sendTo: email,
            subject: "Forgot password from ShopMix",
            html: forgotPasswordTemplate({
                name: user.name,
                otp: otp
            })
        })

        if (!emailll) {
            return res.status(400).json({
                message: "Unsent mail",
                error: true,
                success: false,
            });
        }

        return res.json({
            message: "Check your email",
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }
}

//forgot password not login
export async function verifyForgotPasswordOtp(req, res) {
    try {
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.status(400).json({
                message: "Provide required field email, otp.",
                error: true,
                success: false,
            });
        }

        const user = await userSchema.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({
                message: "Email not available",
                error: true,
                success: false,
            });
        }

        const expireTime = new Date(Date.now() + 60 * 60 * 1000).toISOString()

        const updated = await userSchema.update(
            {
                forgot_password_otp: otp,
                forgot_password_expiry: expireTime
            },
            {
                where: { _id: user._id }
            })


        const currentTime = new Date()

        if (user.forgot_password_expiry < currentTime) {
            return res.status(400).json({
                message: "Otp is expired",
                error: true,
                success: false
            })
        }

        if (otp !== user.forgot_password_otp) {
            return res.status(400).json({
                message: "Invalid otp",
                error: true,
                success: false
            })
        }

        const updateUser = await userSchema.update(
            {
                forgot_password_otp: "",
                forgot_password_expiry: ""
            },
            {
                where: { _id: user?._id }
            })

        return res.json({
            message: "verify otp successfully",
            error: false,
            success: true,
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }
}

// reset the password
export async function resetPassord(req, res) {
    try {
        const { email, newPassword, confirmPassword } = req.body

        if (!email || !newPassword || !confirmPassword) {
            return res.status(500).json({
                message: "Proporcione los campos requeridos: correo electrónico, nueva contraseña, confirmar contraseña",
                error: true,
                success: false,
            });
        }

        const user = await userSchema.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({
                message: "Correo electrónico no disponible",
                error: true,
                success: false,
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "La contraseña y la contraseña de confirmación deben ser las mismas",
                error: true,
                success: false
            })
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);


        const update = await userSchema.update(
            {
                password: hashPassword
            },
            { where: { _id: user._id } })

        return res.json({
            message: "Contraseña Actualizada",
            error: false,
            success: true
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }
}

// refresh token controller 
export async function refreshTokenController(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken || req.headers?.authorization?.split(" ")[1]

        if (!refreshToken) {
            return res.status(401).json({
                message: "Invalid token",
                error: true,
                success: false,
            });
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRETE_KEY_REFRESH_TOKEN);



        if (!verifyToken) {
            return res.status(401).json({
                message: "Token is expired",
                error: true,
                success: false,
            });
        }

        const userId = verifyToken?._id
        const newAccessToken = await generateAccessToken(userId)

        // Configuración de cookies
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        res.cookie('accessToken', newAccessToken, cookiesOption)


        return res.json({
            message: "New Access token generated",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }
}

// get login user details 
export async function userDetailsController(req, res) {
    try {
        const userId = req.userId

        const user = await userSchema.findOne(
            {
                where: { _id: userId },
                attributes: { exclude: ['password', 'refresh_token'] }
            });

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado",
                error: true,
                success: false
            });
        }

        // Crear fullName combinando name + lastName
        const fullName = `${user.name} ${user.lastName || ''}`.trim();

        return res.json({
            message: "Detalles del usuario obtenidos correctamente.",
            data: {
                ...user.toJSON(),
                fullName
            },
            error: false,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }
}

export async function getsUsersController(req, res) {
    try {

        const user = await userSchema.findAll({
            attributes: ['_id', 'name', 'lastName', 'email', 'role', 'mobile', 'verify_email', 'status', 'createdAt']
        })


        return res.json({
            message: "Usuarios ",
            data: user,
            error: false,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }

}

// get User Notifications 
export const getUserNotifications = async (req, res) => {
    const userId = req.userId;

    try {
        const notifications = await notificationSchema.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']]
        });

        return res.json({
            data: notifications,
            error: false,
            success: true
        })
    } catch (error) {
        console.log('error get Notification ', error.message)
        return res.status(500).json({ error: "Error obteniendo notificaciones" });
    }
};

export const markAsRead = async (req, res) => {
    const userId = req.userId;
    const { _id } = req.body;

    try {
        const notification = await notificationSchema.findOne({ where: { _id } });

        if (!notification) {
            return res.status(404).json({ error: "No encontrada" });
        }

        notification.read = true;
        await notification.save();

       
        const userRole = await userSchema.findOne({ where: { _id: userId } })

        if (userRole.role === 'ADMIN') {
            return res.json({
                message: '',
                error: false,
                success: true
            });
        } else {
            return res.json({
                message: "Has marcado la notificación como leída. ¡Gracias!",
                error: false,
                success: true
            });
        }

    } catch (error) {
        console.error("Error marcando notificación como leída:", error);
        return res.status(500).json({ error: "Error actualizando notificación" });
    }
};

export const deleteNotification = async (req, res) => {
    const { _id } = req.body;

    try {
        const notification = await notificationSchema.findOne({ where: { _id } });

        if (!notification) {
            return res.status(404).json({ error: "No encontrada" });
        }

        const notifYDelete = await notification.destroy({ where: { _id } })

        res.json({
            message: "Noficacion eliminada",
            data: notifYDelete,
            error: false,
            success: true
        })


    } catch (error) {
        console.error("Error eleminando notificación como leída:", error);
        return res.status(500).json({ error: "Error eliminando notificación" });
    }
}