import express from "express";
import controllers from "../controllers/members";

const router = express.Router();

router.get("/", controllers.GET);
router.patch("/", controllers.PATCH);

export default router;
