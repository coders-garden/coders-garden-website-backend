import express from "express";
import controllers from "../controllers/member";
import auth from "../middleware/auth";
import errorHandler from "../components/errorHandler";

const router = express.Router();

router.get("/:username", errorHandler(controllers.GET));
router.patch("/:username", auth, errorHandler(controllers.PATCH));

export default router;
