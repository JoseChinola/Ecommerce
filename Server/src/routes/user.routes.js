import { Router } from "express";
import {
    forgotPasswordController, getsUsersController, loginController,
    logoutController, refreshTokenController, registerUserController,
    resendVerificationEmail,
    resetPassord,
    updateAdminUserDetails,
    updateUserDetails, uploadAvatar, userDetailsController, verifyEmailController,
    verifyForgotPasswordOtp
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
import { admin } from '../middleware/Admin.js'
import upload from "../middleware/multer.js";

const userRouter = Router()

userRouter.post('/register', registerUserController)
userRouter.post('/verify-email', verifyEmailController)
userRouter.post('/resend-verification-email', resendVerificationEmail)
userRouter.post('/login', loginController)
userRouter.get('/logout', auth, logoutController)
userRouter.put('/upload-avatar', auth, upload.single('avatar'), uploadAvatar)
userRouter.put('/update-user', auth, updateUserDetails)
userRouter.put('/forgot-password', forgotPasswordController)
userRouter.put('/verify-forgot-password-otp', verifyForgotPasswordOtp)
userRouter.put('/reset-password', resetPassord)
userRouter.post('/refresh-token', refreshTokenController)
userRouter.get('/user-details', auth, userDetailsController)
userRouter.get('/users-get', auth, getsUsersController)
userRouter.put('/update-user-admin', auth, admin, updateAdminUserDetails)






export default userRouter;