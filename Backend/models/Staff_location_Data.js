const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String },
  staffId: { type: String, unique: true, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    altitude: { type: Number, default: 0 },
    updatedAt: { type: String },       // Local IST timestamp
    updatedAtUTC: { type: Date }       // UTC timestamp
  }
});

staffSchema.index({ staffId: 1 });

module.exports = mongoose.model('Staff_location', staffSchema);
