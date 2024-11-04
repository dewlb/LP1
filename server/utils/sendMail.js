import Mailjet from 'node-mailjet';
import dotenv from 'dotenv';
dotenv.config();


const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY
});

const sendMail = async (to, subject, text) => {
    try {
      const result = await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email: 'snarsolutions@gmail.com',
              Name: 'Large Project Application'
            },
            To: [
              {
                Email: to
              }
            ],
            Subject: subject,
            TextPart: text
          }
        ]
      });

      console.log('Success sending email');
      return { success: true, data: result.body };
    } catch (error) {
      console.error('Email sending failed:', error.message);
      throw new Error('Failed to send email');
    }
};

export default sendMail;