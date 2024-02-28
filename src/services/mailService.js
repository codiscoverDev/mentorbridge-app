const nodemailer = require('nodemailer');
require('dotenv').config();

const sendMail = async (email, otp) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      text: `Please verify your email by given OTP in this mail.\n${otp}`,
      subject: 'Verify your MentorBridge account',
      html: `<h4>Hi,</h4>
             <p>Please verify your email by given OTP in this mail.</p>
             <br>
             <h1>${otp}</h1>
             <br>
             <p>This OTP will be valid for 10 minutes only.</p>
             <p><b>MentorBridge Team</b></p>
             `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(`Email not sent: ${err}`);
        reject(err); // Reject the Promise if there's an error
      } else {
        console.log(`Email sent: ${info.response}`);
        resolve(true); // Resolve the Promise if the email is sent successfully
      }
    });
  });
};

module.exports = sendMail;
