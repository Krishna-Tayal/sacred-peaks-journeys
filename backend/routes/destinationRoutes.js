import express from "express";
import upload from "../middleware/upload.js";
import {
  createDestination,
  getAllDestinations,
  getDestinationBySlug,
  updateDestination,
  deleteDestination,
} from "../controllers/destinationController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "thumbnailImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  createDestination
);
router.get("/", getAllDestinations);
router.get("/:slug", getDestinationBySlug);
router.put(
  "/:id",
  upload.fields([
    { name: "thumbnailImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  updateDestination
);
router.delete("/:id", deleteDestination);

export default router;
