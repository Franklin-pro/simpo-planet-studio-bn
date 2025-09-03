import express from "express";
import {
  createGalleryItem,
  getGalleryItems,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem,
  likeGalleryItem,
  shareGallery
} from "../controllers/gallery.controller.js";

const router = express.Router();

router.post("/add-gallery", createGalleryItem);
router.get("/", getGalleryItems);
router.get("/:id", getGalleryItemById);
router.put("/:id", updateGalleryItem);
router.delete("/:id", deleteGalleryItem);
router.post("/:id/like", likeGalleryItem);
router.get("/:id/share", shareGallery);
export default router;


