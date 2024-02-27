const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();
const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const sendMail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: oAuth2Client.getAccessToken(),
    },
  });
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    text: `Please verify your email by given OTP in this mail.\n${otp}`,
    subject: 'Welcome to Edu eGurukul',
    html: `<h4>Hi,</h4>
                 <p>Please verify your email by given OTP in this mail.</p>
                 <h1>${otp}</h1>
                 <br><br>
                 <p>This OTP will be valid for 10 minutes only.</p>
                 <br><br>
                 <p><b>MentorBridge Team</b></p>
                 `,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(`Email not sent: ${err}`);
      return false;
    } else {
      console.log(`Email sent: ${info.response}`);
      return true;
    }
  });
};

module.exports = sendMail;
