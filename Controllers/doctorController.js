import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";
import mongoose from 'mongoose';

export const updateDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Successfully updated",
        data: updateDoctor,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "An error occured while updating, please try again!",
      });
  }
};
export const deleteDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Successfully deleted" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "An error occured while deleting, please try again!",
      });
  }
};
export const getSingleDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const doctor = await Doctor.findById(id).populate("reviews").select("-password");

    res
      .status(200)
      .json({ success: true, message: "Doctor found", data: doctor });
  } catch (error) {
    res.status(404).json({ success: false, message: "Doctor not found" });
  }
};
export const getAllDoctors = async (req, res) => {
  const id = req.params.id;

  try {
    const { query } = req.query;
    let doctors;

    if (query) {
      doctors = await Doctor.find({
        isApproved: "approved",
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } }
      ],
      }).select('-password');
    } else {
      doctors = await Doctor.find({isApproved: "approved"}).select("-password");
    }

    res
      .status(200)
      .json({ success: true, message: "Doctors found", data: doctors });
  } catch (error) {
    res.status(404).json({ success: false, message: "Doctors not found" });
  }
};

export const getDoctorProfile = async(req, res) => {
  const doctorId = req.userId;

  try {
    const doctor = await Doctor.findById(doctorId);

    if(!doctor) {
      return res.status(404).json({success:false, message: "Doctor not found"})
    }

    const {password, ...rest} = doctor._doc;

    const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

    const appointments = await Booking.find({doctor: doctorObjectId })

    res.status(200).json({ success:true, message: 'Gotten profile info', data: {...rest, appointments} })
  } catch(err) {
    return res.status(404).json({success:false, message: "Something went wrong in getting profile info"})
  }
}

export const getDoctorAppointments = async (req, res) => {
  try {
    // Retrieve appointments for a specific doctor
    const appointments = await Booking.find({ doctor: req.userId });

    // Extract user IDs from appointments
    const userIds = appointments.map(appointment => appointment.user);

    // Retrieve users using user IDs
    const users = await User.find({ _id: { $in: userIds } });

    res.status(200).json({ success: true, message: 'Gotten Appointments', data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Something went wrong in getting doctor appointments' });
  }
};

