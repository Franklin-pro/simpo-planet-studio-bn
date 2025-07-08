import Music from "../models/music.model.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";

const createMusic = async (req, res) => {
    try {
        const { title, artist, album, genre, releaseDate, duration, coverImageUrl, audioFileUrl, youtubeLink } = req.body;

        let cloudinaryCoverResult = null;
        if (coverImageUrl) {
            cloudinaryCoverResult = await cloudinaryUpload(coverImageUrl, "music/covers");
        }

        let cloudinaryAudioResult = null;
        if (audioFileUrl) {
            cloudinaryAudioResult = await cloudinaryUpload(audioFileUrl, "music/audios");
        }

        const music = new Music({
            title,
            artist,
            album,
            genre,
            releaseDate,
            duration,
            coverImageUrl: cloudinaryCoverResult?.secure_url || "",
            audioFileUrl: cloudinaryAudioResult?.secure_url || "",
            youtubeLink
        });

        await music.save();

        res.status(201).json({
            success: true,
            message: "Music created successfully",
            data: music
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating music", error: error.message });
    }
}
const getMusic = async (req, res) => {
    try {
        const music = await Music.find().populate('artist');
        res.status(200).json(music);
    } catch (error) {
        res.status(500).json({ message: "Error fetching music", error: error.message });
    }
}
const getMusicById = async (req, res) => {
    try {
        const music = await Music.findById(req.params.id).populate('artist');
        if (!music) {
            return res.status(404).json({ message: "Music not found" });
        }
        res.status(200).json(music);
    } catch (error) {
        res.status(500).json({ message: "Error fetching music", error: error.message });
    }
}
const updateMusic = async (req, res) => {
    try {
        const { title, artist, album, genre, releaseDate, duration, coverImageUrl, audioFileUrl, youtubeLink } = req.body;
        const updatedMusic = await Music.findByIdAndUpdate(
            req.params.id,
            { title, artist, album, genre, releaseDate, duration, coverImageUrl, audioFileUrl, youtubeLink },
            { new: true }
        );
        if (!updatedMusic) {
            return res.status(404).json({ message: "Music not found" });
        }
        res.status(200).json({ message: "Music updated successfully", music: updatedMusic });
    } catch (error) {
        res.status(500).json({ message: "Error updating music", error: error.message });
    }
}
const deleteMusic = async (req, res) => {
    try {
        const deletedMusic = await Music.findByIdAndDelete(req.params.id);
        if (!deletedMusic) {
            return res.status(404).json({ message: "Music not found" });
        }
        res.status(200).json({ message: "Music deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting music", error: error.message });
    }
}
export {
    createMusic,
    getMusic,
    getMusicById,
    updateMusic,
    deleteMusic
};