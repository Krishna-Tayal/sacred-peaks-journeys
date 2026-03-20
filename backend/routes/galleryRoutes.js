import express from "express";
import upload from "../middleware/upload.js";
import { uploadImage, getAllImages, deleteImage } from "../controllers/galleryController.js";

const router = express.Router();

router.post("/", upload.single("image"), uploadImage);
router.get("/", getAllImages);
router.delete("/:id", deleteImage);

export default router;
