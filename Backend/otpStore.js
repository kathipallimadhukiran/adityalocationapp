const Otp = require('./models/user');

module.exports = {
  saveOtp: async (email, otp) => {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    await Otp.findOneAndUpdate(
      { email: email.toLowerCase() },
      { otp, expiresAt },
      { upsert: true, new: true }
    );
    console.log(`Saved OTP for ${email}`);
  },

  verifyOtp: async (email, otp) => {
    const record = await Otp.findOne({ email: email.toLowerCase(), otp });
    if (!record) {
      console.log(`OTP not found or mismatch for ${email}`);
      return false;
    }
    if (record.expiresAt < new Date()) {
      console.log(`OTP expired for ${email}`);
      return false;
    }
    await Otp.deleteOne({ _id: record._id }); // OTP is one-time use
    console.log(`OTP verified and deleted for ${email}`);
    return true;
  }
};
