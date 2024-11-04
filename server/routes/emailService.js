// import nodemailer from 'nodemailer';

// //use SMTP2GO for this shit
// const transporter = nodemailer.createTransport({
//     host: 'smtp.mailgun.org',
//     port: 587,
//     secure: false,
//     auth: {
//         user: 'postmaster@sandboxe1ec5ddd36bb40a99819225d5c43f8f4.mailgun.org',
//         pass: 'a7a63bb5cbf465212d6ae124a1ec2ef6-72e4a3d5-89507b6f'
//     }
// });

// const sendVerificationEmail = async (userEmail, token) => {

//     const verificationUrl = `http://your-domain.com/verify-email/${token}`; //change this url to match our domain url
//     const mailOptions = {
//         from: process.env.EMAIL,
//         to: userEmail,
//         subject: 'Verify Your Email Address',
//         html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`
//     };

//     try{
//         await transporter.sendMail(mailOptions);
//         console.log('Verification email sent');
//     }
//     catch(error){
//         console.error('Error sending email:', error);
//     }
// };

// export default sendVerificationEmail;
