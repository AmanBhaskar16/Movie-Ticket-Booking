import express from "express";
import { addShow, getCurrentPlayingMovie } from "../controllers/showController.js";

const showRouter = express.Router();

showRouter.get('/now-playing',getCurrentPlayingMovie);
showRouter.post('/add',addShow);

export default showRouter;