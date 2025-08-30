import express from "express";
import {
    createFilmmaker,
    getFilmmakers,
    getFilmmakerById,
    updateFilmmaker,
    deleteFilmmaker
} from "../controllers/filmmaker.controller.js";

const router = express.Router();

router.post("/create", createFilmmaker);
router.get("/", getFilmmakers);
router.get("/:id", getFilmmakerById);
router.put("/:id", updateFilmmaker);
router.delete("/:id", deleteFilmmaker);

export default router;