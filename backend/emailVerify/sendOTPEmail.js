import nodemailer from 'nodemailer'

export const sendOTPEmail =async (otp, email) => {
    const transporter = nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        }
    );
    const mailDetails = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        html:`<p>Your OTP for password reset is :<b>${otp}</b></p>`
    };
    transporter.sendMail(mailDetails,
        function (err, data) {
            if (err) {
                console.log('Error Occurs');
            } else {
                console.log('OTP sent successfully');
            }
    });


}




