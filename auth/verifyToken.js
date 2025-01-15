import jwt from 'jsonwebtoken';
import Doctor from '../models/DoctorSchema.js';
import User from '../models/UserSchema.js';

export const authenticate = async (req, res, next) => {

  // get token from headers
  const authToken = req.headers.authorization;

  //Check if token exists
  if(!authToken || !authToken.startsWith('Bearer ')) { 
    return res.status(401).json({success: false, message: 'No token, authorization denied'})
  }

  try {
    const token = authToken.split(' ')[1]

    // verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.userId = decoded.id;
    req.role = decoded.role;

    next() //must be called 
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({success: false, message: 'Token has expired'})
    } 
    return res.status(401).json({success: false, message:'Invalid Token'})
  }

};

export const restrict = roles => async(req,res,next) => {
  // const userId = req.userId;

  // let user;

  // const patient = await User.findById(userId);
  // const doctor = await Doctor.findById(userId);

  // if(patient) {
  //   user = patient;
  // }
  // if(doctor) {
  //   user = doctor;
  // }
  const userRole = req.role; 

  if(!roles.includes(userRole)) {
    return res.status(401).json({success: false, message: 'You are not authorized'})
  }
  next();
}