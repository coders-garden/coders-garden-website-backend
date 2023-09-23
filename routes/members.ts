import express from "express";
import controllers from "../controllers/members";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/", controllers.GET);
router.patch("/", auth, controllers.PATCH);

export default router;
