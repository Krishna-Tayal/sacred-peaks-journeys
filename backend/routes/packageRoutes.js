import express from "express";
import upload from "../middleware/upload.js";
import {
  createPackage,
  getAllPackages,
  updatePackage,
  deletePackage,
} from "../controllers/packageController.js";

const router = express.Router();

router.post("/", upload.single("thumbnailImage"), createPackage);
router.get("/", getAllPackages);
router.put("/:id", upload.single("thumbnailImage"), updatePackage);
router.delete("/:id", deletePackage);

export default router;
