import express from "express";
import controllers from "../controllers/members";
import auth from "../middleware/auth";
import errorHandler from "../components/errorHandler";

const router = express.Router();

router.get("/", errorHandler(controllers.GET));
router.patch("/", auth, errorHandler(controllers.PATCH));

export default router;
