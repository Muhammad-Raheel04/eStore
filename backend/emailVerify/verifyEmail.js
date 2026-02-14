import nodemailer from 'nodemailer'

export const verifyEmail = async (token, email) => {
    try {
        const transporter = nodemailer.createTransport(
            {
                
                host:'smtp.gmail.com',
                port:587,
                secure:false,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS
                }
            }
        );
        const mailDetails = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Email Verification',
            html: `
                <p>Hi!</p>
                <p>You recently registered on our website.</p>
                <p>Click the link below to verify your email:</p>
                <a href="https://estore-production-b778.up.railway.app/api/v1/user/verify/${token}">Verify Email</a>
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




