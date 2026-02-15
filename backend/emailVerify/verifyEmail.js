import nodemailer from 'nodemailer'

export const verifyEmail = async (token, email) => {
    try {
        const transporter = nodemailer.createTransport(
            {
                host: 'smtp-relay.brevo.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.BREVO_USER,
                    pass: process.env.BREVO_PASS
                }
            }
        );
        await transporter.verify();
        console.log("SMTP connection successful");
        const mailDetails = {
            from:process.env.EMAIL_FROM,
            to: email,
            subject: 'Email Verification',
            html: `
                <p>Hi!</p>
                <p>You recently registered on our website.</p>
                <p>Click the link below to verify your email:</p>
                <a target="_self" href="${process.env.FRONTEND_URL}/verify/${token}">Verify Email</a>
                <p>Thanks!</p>
            `
        };
        const info = await transporter.sendMail(mailDetails);
        console.log("Email sent successfully");
        return true;
    } catch (error) {
        console.log("Error sending email", error);
    }
}




