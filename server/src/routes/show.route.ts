import { Router } from "express";
import { getShowById } from "../controllers/show.controller";

const router = Router();
router.get("/:showId/", getShowById);

export default router;
