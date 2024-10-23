import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        //user: process.env.EMAIL,
        //pass: process.env.PASSWORD
        user: 'tournament4331@gmail.com',
        pass: 'COP4331!'
    }
});

const sendVerificationEmail = async (userEmail, token) => {

    const verificationUrl = `http://your-domain.com/verify-email/${token}`; //change this url to match our domain url
    const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: 'Verify Your Email Address',
        html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`
    };

    try{
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent');
    }
    catch(error){
        console.error('Error sending email:', error);
    }
};

export default sendVerificationEmail;
