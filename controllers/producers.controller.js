import Producer from "../models/producers.model.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";




const createProducer = async (req, res) => {
    try {
        const { name, bio, imageUrl, socialLinks } = req.body;

        let cloudinaryResult = null;
        if (imageUrl) {
            cloudinaryResult = await cloudinaryUpload(imageUrl, "producers");
        }

        const producer = new Producer({
            name,
            bio,
            imageUrl: cloudinaryResult?.secure_url || "",
            socialLinks
        });

        await producer.save();

        res.status(201).json({
            success: true,
            message: "Producer created successfully",
            data: producer
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating producer", error: error.message });
    }
}
const getProducers = async (req, res) => {
    try {
        const producers = await Producer.find();
        res.status(200).json({
            success: true,
            message: "Producers retrieved successfully",
            data: producers
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving producers", error: error.message });
    }
}
const getProducerById = async (req, res) => {
    try {
        const producer = await Producer.findById(req.params.id);
        if (!producer) {
            return res.status(404).json({ message: "Producer not found" });
        }
        res.status(200).json({
            success: true,
            message: "Producer retrieved successfully",
            data: producer
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving producer", error: error.message });
    }
}
const updateProducer = async (req, res) => {
    try {
        const { name, bio, imageUrl, socialLinks } = req.body;

        let cloudinaryResult = null;
        if (imageUrl) {
            cloudinaryResult = await cloudinaryUpload(imageUrl, "producers");
        }

        const producer = await Producer.findByIdAndUpdate(
            req.params.id,
            {
                name,
                bio,
                imageUrl: cloudinaryResult?.secure_url || "",
                socialLinks
            },
            { new: true }
        );

        if (!producer) {
            return res.status(404).json({ message: "Producer not found" });
        }

        res.status(200).json({
            success: true,
            message: "Producer updated successfully",
            data: producer
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating producer", error: error.message });
    }
}

const deleteProducer = async (req, res) => {
    try {
        const producer = await Producer.findByIdAndDelete(req.params.id);
        if (!producer) {
            return res.status(404).json({ message: "Producer not found" });
        }
        res.status(200).json({ message: "Producer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting producer", error: error.message });
    }
}

export {
    createProducer,
    getProducers,
    getProducerById,
    updateProducer,
    deleteProducer
};