import User from '../models/UserSchema.js'
import Doctor from '../models/DoctorSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'


const generateToken = user => {
  return jwt.sign({id:user._id, role:user.role}, process.env.JWT_SECRET, {
    expiresIn:'2d'
  })
}
export const register = async(req,res) => {

  const {email, name, password, role, photo, gender} = req.body;
  try {
    let user = null;
    // if therapist or patient
    if(role === 'patient') {
      user = await User.findOne({email});
    } else if (role === 'therapist') {
      user = await Doctor.findOne({email});
    }else{
      return res.status(400).json({ message: 'Invalid role', status: false});}

    // Check if the email is already registered
    if (user) {
      return res.status(400).json({ message: 'Email is already registered, please login', status: false});

    }

    //hash password
  
  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  if(role === 'patient') {
    user = new User({
      name,
      email,
      password:hashedPassword,
      photo,
      role,
      gender,
    })
  }
  if(role === 'doctor') {
    user = new Doctor({
      name,
      email,
      password:hashedPassword,
      photo,
      role,
      gender,
    })
  }

  await user.save();

    res.status(201).json({ message: 'User successfully created', status: true});
    
  } catch (error) {
    console.log("Error", error)
    res.status(400).json({ sucess:false, message: 'Registration failed, Please try again' });
  }
}
export const login = async(req,res) => {

  const {email, password} = req.body;
  try {
    let user = null;

    const patient = await User.findOne({email});
    const therapist = await Doctor.findOne({email});

    if(patient) {
      user = patient;
    }
    if(therapist) {
      user = therapist;
    }

    // Check if user exists
    if(!user) {
      return res.status(404).json({ success:false, message: 'User not found'})
    }

    // compare passwords
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ success:false, message: 'Invalid credentials'})

    }


    // generate token
    const token = generateToken(user);

    const {password,role,appointments,...rest} = user._doc;

  res.status(200).json({ success:true, message: 'Login Successful!', token, data:{...rest}, role})
  

  } catch (error) {
    return res.status(400).json({ success:false, message: 'Failed to login'})
    
  }
}