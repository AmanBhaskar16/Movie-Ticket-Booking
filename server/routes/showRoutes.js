import express from "express";
import { addShow, getCurrentPlayingMovie, getShow, getShows } from "../controllers/showController.js";
import { adminAccess } from "../middleware/auth.js";

const showRouter = express.Router();

showRouter.get('/now-playing',adminAccess,getCurrentPlayingMovie);
showRouter.post('/add',adminAccess,addShow);
showRouter.get('/all',getShows);
showRouter.get('/:movieId',getShow);
export default showRouter;