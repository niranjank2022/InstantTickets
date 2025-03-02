import { Router } from "express";
import { getShowById } from "../controllers/shows.controller";

const router = Router();
router.get("/:showId", getShowById);

export default router;