import express from "express";
import {
  createArtist,
  getArtists,
  getArtistById,
  updateArtist,
  deleteArtist,
} from "../controllers/artist.controller.js";
const router = express.Router();

router.post("/", createArtist);
router.get("/", getArtists);
router.get("/:id", getArtistById);
router.put("/:id", updateArtist);
router.delete("/:id", deleteArtist);
export default router;

