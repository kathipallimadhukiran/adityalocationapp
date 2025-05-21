const nodemailer = require('nodemailer');
const { saveOtp, verifyOtp } = require('../../../otpStore'); // your new OTP service file

// Initialize transporter here at the top (before any exports)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kathipallimadhu@gmail.com',
    pass: 'ifrw xtlx nboz zpuf',
  },
});

// Then your functions
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await transporter.sendMail({
      from: 'kathipallimadhu@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });

    await saveOtp(email, otp);
    res.json({ success: true, message: 'OTP sent to email.' });
  } catch (error) {
    console.error('OTP email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP required' });

  try {
    const isValid = await verifyOtp(email, otp);
    if (isValid) {
      res.json({ success: true, message: 'OTP verified' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'Error verifying OTP' });
  }
};
