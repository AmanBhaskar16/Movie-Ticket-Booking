import express from 'express';
import { adminAccess } from '../middleware/auth.js';
import { getAllBookings, getAllShows, getDashboardData, isAdmin } from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.get('/is-admin',adminAccess,isAdmin);
adminRouter.get('/dashboard',adminAccess,getDashboardData);
adminRouter.get('/all-shows',adminAccess,getAllShows);
adminRouter.get('/is-admin',adminAccess,getAllBookings);

export default adminRouter;