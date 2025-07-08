import Artist from "../models/artist.model.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";


const createArtist = async (req, res) => {
    try {
        const { name, bio, imageUrl, socialLinks } = req.body;

        let cloudinaryResult = null;
        if (imageUrl) {
            cloudinaryResult = await cloudinaryUpload(imageUrl, "artists");
        }

        const artist = new Artist({
            name,
            bio,
            imageUrl: cloudinaryResult?.secure_url || "",
            socialLinks
        });

        await artist.save();

        res.status(201).json({
            success: true,
            message: "Artist created successfully",
            data: artist
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating artist", error: error.message });
    }
}
const getArtists = async (req, res) => {
    try {
        const artists = await Artist.find();
        res.status(200).json(artists);
    } catch (error) {
        res.status(500).json({ message: "Error fetching artists", error: error.message });
    }
}
const getArtistById = async (req, res) => {
    try {
        const artist = await Artist.findById(req.params.id);
        if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }
        res.status(200).json(artist);
    } catch (error) {
        res.status(500).json({ message: "Error fetching artist", error: error.message });
    }
}
const updateArtist = async (req, res) => {
    try {
        const { name, bio, imageUrl, socialLinks } = req.body;
        const updatedArtist = await Artist.findByIdAndUpdate(
            req.params.id,
            { name, bio, imageUrl, socialLinks },
            { new: true }
        );
        if (!updatedArtist) {
            return res.status(404).json({ message: "Artist not found" });
        }
        res.status(200).json({ message: "Artist updated successfully", artist: updatedArtist });
    } catch (error) {
        res.status(500).json({ message: "Error updating artist", error: error.message });
    }
}
const deleteArtist = async (req, res) => {
    try {
        const deletedArtist = await Artist.findByIdAndDelete(req.params.id);
        if (!deletedArtist) {
            return res.status(404).json({ message: "Artist not found" });
        }
        res.status(200).json({ message: "Artist deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting artist", error: error.message });
    }
}
export {
    createArtist,
    getArtists,
    getArtistById,
    updateArtist,
    deleteArtist
};