const forgotPasswordTemplate = ({ name, otp }) => {
    return `
    <div
        style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6; max-width: 900px; width: 100%;">
        <p>Dear <span style="font-size: 17px; color: black; font-style: italic; font-weight: 700;">${name}</span>,</p>

        <p>We received a request to change your password at <strong style="font-weight: 700; font-size: 17px;">ShopMix</strong>. Please
            use the OTP (One-Time
            Password) below to proceed with resetting your password:</p>
        <p
            style="margin-top: 20px; text-align: center; background-color: yellow; color: black; padding: 20px; line-height: 1.8; border-radius: 7px; font-size: 25px; font-weight: 700;">
            ${otp}
        </p>
        <p><strong>This OTP is valid for approximately one hour.</strong> If you do not use it within this time, you
            will need to request a new one.</p>
        <p>If you didn't request a password change, please ignore this email. Your password will not be changed.</p>
        <p>Thanks, Best regards,</p>
        <p><strong>The ShopMix Team</strong></p>
    </div>
    `;
}

export default forgotPasswordTemplate;
