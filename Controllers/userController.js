import User from '../models/UserSchema.js';
import Booking from '../models/BookingSchema.js';
import Doctor from '../models/DoctorSchema.js';

export const updateUser = async(req,res) => {
  const id = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(id,{$set:req.body}, {new:true});

    res.status(200).json({success:true, message: "Successfully updated", data: updateUser})

  } catch (error) {
    res.status(500).json({success:false, message: "An error occured while updating, please try again!"})
  }
} 
export const deleteUser = async(req,res) => {
  const id = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    res.status(200).json({success:true, message: "Successfully deleted"})

  } catch (error) {
    res.status(500).json({success:false, message: "An error occured while deleting, please try again!"})
  }
} 
export const getSingleUser = async(req,res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).select("-password");

    res.status(200).json({success:true, message: "User found", data: user})

  } catch (error) {
    res.status(404).json({success:false, message: "User not found"})
  }
} 
export const getAllUsers = async(req,res) => {
  const id = req.params.id;

  try {
    const users = await User.find({}).select("-password");

    res.status(200).json({success:true, message: "Users found", data: users})

  } catch (error) {
    res.status(404).json({success:false, message: "Users not found"})
  }
} 

export const getUserProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if(!user) {
      return res.status(404).json({success:false, message: "User not found"})
    }

    const {password, ...rest} = user._doc

    res.status(200).json({ success:true, message: 'Gotten profile info', data: {...rest} })
  } catch(err) {
    return res.status(404).json({success:false, message: "Something went wrong in getting profile info"})
  }
}

export const getMyAppointments = async (req, res) => {
  try {
  //  Retrive appointments for a specific user
  const bookings = await Booking.find({user: req.userId});

  //  Extract doctor's id from appointments 
  const doctorIds = bookings.map(el => el.doctor.id)

  //retrieve doctors using doctor ids

  const doctors = await Doctor.find({_id: {$in:doctorIds}}).select('-password');

  res.status(200).json({success: true, message: 'Gotten Appointments', data: doctors})
  } catch (error) {
    return res.status(500).json({success:false, message: "Something went wrong in getting profile info"})
    
  }
}