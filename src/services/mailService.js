const nodemailer = require('nodemailer');
require('dotenv').config();
const { EMAIL, EMAIL_PASS } = process.env;

const sendMail = async (email, otp, version) => {
  const verifyOTPMail = {
    from: EMAIL,
    to: email,
    text: `Please verify your email by given OTP in this mail.\n${otp}`,
    subject: 'Verify your MentorBridge account',
    html: `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
    
          header {
            background-color: #3b32a8;
            color: white;
            text-align: center;
            padding: 15px;
          }
    
          main {
            padding: 20px;
            background-color: #fff;
            margin: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
    
          h4 {
            color: #333;
          }
    
          h1 {
            color: #f4f4f4;
            font-size: 2.5em;
            margin: 10px 0;
          }
    
          p {
            color: #555;
            line-height: 1.6;
          }
    
          b {
            color: #3b32a8;
          }
    
          .otp {
            display: flex;
            justify-content: center;
            align-items: center;
          }
    
          .otp h1 {
            color: #38338A;
          }
    
          footer {
            background-color: #3b32a8;
            color: white;
            text-align: center;
            padding: 10px;
            position: fixed;
            bottom: 0;
            width: 100%;
          }
    
        </style>
      </head>
    
      <body>
    
        <header>
          <h1>MentorBridge</h1>
        </header>
    
        <main>
          <h4>Hi there!</h4>
          <p>We're excited to have you on MentorBridge. Please verify your email by using the OTP provided below:</p>
          <div class="otp">
            <h1>966045</h1>
          </div>
          <p>This OTP will be valid for 10 minutes only. If you didn't request this, you can safely ignore this email.</p>
          <p><b>Best regards,</b><br>MentorBridge Team</p>
        </main>
    
        <footer>
          &copy; 2024 MentorBridge. All rights reserved.
        </footer>
    
      </body>
    
    </html>`,
  };
  const OTPConfirmationMail = {
    from: EMAIL,
    to: email,
    text: `Hi,
    We are pleased to inform you that your email has been verified successfully.
    Thank you for joining MentorBridge!
    Best regards,
  MentorBridge Team`,
    subject: 'Email Verification Successful',
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification Successful</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0px;">
    
        <header style="background-color: #3b32a8; color: white; text-align: center; padding: 10px ;">
            <h1>Email Verification Successful</h1>
        </header>
    
        <main style="padding: 30px 20px;">
            <p>
                Hi,
    
                <br><br>
    
                We are pleased to inform you that your email has been verified successfully.
    
                <br><br>
    
                Thank you for joining MentorBridge!
    
                <br><br>
    
                Best regards,
    
                <br><br>
    
                MentorBridge Team
            </p>
        </main>
    
        <footer style="background-color: #3b32a8; color: white; text-align: center; padding: 10px; position: fixed; bottom: 0; width: 100%;">
            &copy; 2024 MentorBridge. All rights reserved.
        </footer>
    
    </body>
    </html>`,
  };
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL,
        pass: EMAIL_PASS,
      },
    });
    const mailOptions =
      version === 'verifyOTP' ? verifyOTPMail : OTPConfirmationMail;
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(`Email not sent: ${err}`);
        reject(err);
      } else {
        console.log(`Email sent: ${info.response.slice(0, 13)}`);
        resolve(true);
      }
    });
  });
};

module.exports = sendMail;
