import express from "express";
import {
  createGalleryItem,
  getGalleryItems,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem,
  likeGalleryItem
} from "../controllers/gallery.controller.js";

const router = express.Router();

router.post("/", createGalleryItem);
router.get("/", getGalleryItems);
router.get("/:id", getGalleryItemById);
router.put("/:id", updateGalleryItem);
router.delete("/:id", deleteGalleryItem);
router.post("/:id/like", likeGalleryItem);
export default router;


