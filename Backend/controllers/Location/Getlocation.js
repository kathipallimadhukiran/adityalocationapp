const Staff = require('../../models/Staff_location_Data');



const getISTTimestamp = () => {
    const now = new Date();
  
    // Convert to IST (+5:30)
    const istOffset = 330 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset);
  
    // Format only time as hh:mm:ss
    const hh = String(istTime.getHours()).padStart(2, '0');
    const min = String(istTime.getMinutes()).padStart(2, '0');
    const ss = String(istTime.getSeconds()).padStart(2, '0');
  
    return `${hh}:${min}:${ss}`; 
};


exports.getLocation = async (req, res) => {
  const staffId = req.params.id;

  try {
    const staff = await Staff.findOne({ staffId });

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    // Ensure UTC time is returned in a format suitable for the frontend
    const updatedAtISO = new Date(staff.location.updatedAtUTC).toISOString(); 

    return res.status(200).json({
      staffId: staff.staffId,
      location: {
        latitude: staff.location.latitude,
        longitude: staff.location.longitude,
        altitude: staff.location.altitude,
        updatedAt: staff.location.updatedAt,          // Local time as string
        updatedAtUTC: updatedAtISO                    // UTC time as ISO string
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};


exports.updateLocation = async (req, res) => {
  const staffId = req.params.id;
  const { latitude, longitude, altitude } = req.body;

  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    (altitude !== undefined && typeof altitude !== 'number')
  ) {
    return res.status(400).json({ message: 'Invalid location data' });
  }

  try {
    const updatedData = {
      location: {
        latitude,
        longitude,
        altitude: altitude || 0,
        updatedAt: getISTTimestamp(),        // Local time string (HH:mm:ss)
        updatedAtUTC: new Date()             // UTC time
      }
    };

    const staff = await Staff.findOneAndUpdate(
      { staffId },
      { $set: updatedData },
      { new: true, upsert: true }
    );

    return res.status(200).json({ message: 'Location updated', staff });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating location', error });
  }
};


exports.getAllStaffIds = async (req, res) => {
    try {
      const staffList = await Staff.find({}, { staffId: 1, _id: 0 }); // Only return staffId
      const staffIds = staffList.map(staff => staff.staffId);
  
      return res.status(200).json({ staffIds });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching staff IDs', error });
    }
  };
  