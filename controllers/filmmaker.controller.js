import Filmmaker from "../models/filmmaker.model.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";

export const createFilmmaker = async (req, res) => {
    try {
        const { name, bio, image, specialization, experience, portfolio, contact } = req.body;

        let cloudinaryResult = null;
        if (image) {
            cloudinaryResult = await cloudinaryUpload(image, "filmmakers");
        }

        const filmmaker = new Filmmaker({
            name,
            bio,
            image: cloudinaryResult?.secure_url || "",
            specialization,
            experience,
            portfolio,
            contact
        });

        await filmmaker.save();

        res.status(201).json({
            success: true,
            message: "Filmmaker created successfully",
            data: filmmaker
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFilmmakers = async (req, res) => {
    try {
        const { specialization, isActive } = req.query;
        const filter = {};
        
        if (specialization) filter.specialization = specialization;
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const filmmakers = await Filmmaker.find(filter);
        res.status(200).json(filmmakers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching filmmakers", error: error.message });
    }
};

export const getFilmmakerById = async (req, res) => {
    try {
        const filmmaker = await Filmmaker.findById(req.params.id);
        if (!filmmaker) {
            return res.status(404).json({ message: "Filmmaker not found" });
        }
        res.status(200).json(filmmaker);
    } catch (error) {
        res.status(500).json({ message: "Error fetching filmmaker", error: error.message });
    }
};

export const updateFilmmaker = async (req, res) => {
    try {
        const { name, bio, specialization, experience, portfolio, contact, isActive } = req.body;
        
        const updatedFilmmaker = await Filmmaker.findByIdAndUpdate(
            req.params.id,
            { name, bio, specialization, experience, portfolio, contact, isActive },
            { new: true }
        );
        
        if (!updatedFilmmaker) {
            return res.status(404).json({ message: "Filmmaker not found" });
        }
        
        res.status(200).json({ 
            message: "Filmmaker updated successfully", 
            filmmaker: updatedFilmmaker 
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating filmmaker", error: error.message });
    }
};

export const deleteFilmmaker = async (req, res) => {
    try {
        const deletedFilmmaker = await Filmmaker.findByIdAndDelete(req.params.id);
        if (!deletedFilmmaker) {
            return res.status(404).json({ message: "Filmmaker not found" });
        }
        res.status(200).json({ message: "Filmmaker deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting filmmaker", error: error.message });
    }
};