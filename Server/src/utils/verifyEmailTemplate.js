const verifyEmailTemplate = ({ name, url }) => {
    return `
  <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6; max-width: 900px; width: 100%;">
        <p>Dear <span style="font-size: 18px; color: black; font-style: italic; font-weight: 700;">${name}</span>,</p>
        <p>Thank you for registering at <strong>ShopMix</strong>! Please confirm your email by clicking the button below:</p>
        <p style="margin-top: 20px;">
            <a href="${url}" 
                style="display: block; width: 100%; padding: 14px 0; text-align: center; font-size: 18px; color: white; 
                background: #071263; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Verify Email jodido pato 
            </a>
        </p>
        <p>If you didn't sign up for ShopMix, please ignore this email.</p>
        <p>Best regards,</p>
        <p><strong>The ShopMix Team</strong></p>
    </div>

    `
}

export default verifyEmailTemplate;