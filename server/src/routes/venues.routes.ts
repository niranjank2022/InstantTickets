import { Router } from "express";
import { getSectionsByVenue } from "../controllers/venues.controller";

const router = Router();
router.get("/:venueId/sections", getSectionsByVenue);

export default router;
