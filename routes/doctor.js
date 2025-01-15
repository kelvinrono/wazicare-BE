import express from 'express';
import { updateDoctor, deleteDoctor, getAllDoctors, getSingleDoctor, getDoctorProfile, getDoctorAppointments } from '../controllers/doctorController.js';
import { authenticate, restrict } from '../auth/verifyToken.js';
import reviewRouter from './review.js';


const router = express.Router();

//nested route
router.use('/:doctorId/reviews', reviewRouter)

router.get('/', getAllDoctors);
router.get('/:id', getSingleDoctor);
router.put('/:id',authenticate, restrict(['doctor']), updateDoctor);
router.delete('/:id', authenticate, restrict(['doctor']), deleteDoctor);
router.get('/profile/me', authenticate, restrict(['doctor']), getDoctorProfile);
router.get('/appointments/my-appointments', authenticate, restrict(['doctor']), getDoctorAppointments);

export default router;