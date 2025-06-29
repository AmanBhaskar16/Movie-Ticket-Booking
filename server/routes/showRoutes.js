import express from "express";
import { getCurrentPlayingMovie } from "../controllers/showController.js";

const showRouter = express.Router();

showRouter.get('/now-playing',getCurrentPlayingMovie);

export default showRouter;