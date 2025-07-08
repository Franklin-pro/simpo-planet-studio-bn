import Music from "../models/music.model.js";


const createMusic = async (req, res) => {
    try {
        const { title, artist, album, genre, releaseDate, duration, coverImageUrl, audioFileUrl, lyrics } = req.body;
        const newMusic = new Music({ title, artist, album, genre, releaseDate, duration, coverImageUrl, audioFileUrl, lyrics });
        await newMusic.save();
        res.status(201).json({ message: "Music created successfully", music: newMusic });
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
        const { title, artist, album, genre, releaseDate, duration, coverImageUrl, audioFileUrl, lyrics } = req.body;
        const updatedMusic = await Music.findByIdAndUpdate(
            req.params.id,
            { title, artist, album, genre, releaseDate, duration, coverImageUrl, audioFileUrl, lyrics },
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