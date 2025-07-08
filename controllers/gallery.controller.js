import Gallery from "../models/gallery.model.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";


export const createGalleryItem = async (req, res) => {
    try {
        const { title, image,video, description} = req.body;

        let cloudinaryResult = null;
        if (image) {
            cloudinaryResult = await cloudinaryUpload(image, "gallerys");
        }

        const gallery = new Gallery({
            title,
            image: cloudinaryResult?.secure_url || "",
            description,
            video: video || "",
        });

        await gallery.save();

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getGalleryItems = async (req, res) => {
    try {
        const galleryItems = await Gallery.find().populate('artist');
        res.status(200).json(galleryItems);
    } catch (error) {
        res.status(500).json({ message: "Error fetching gallery items", error: error.message });
    }
}
const getGalleryItemById = async (req, res) => {
    try {
        const galleryItem = await Gallery.findById(req.params.id).populate('artist');
        if (!galleryItem) {
            return res.status(404).json({ message: "Gallery item not found" });
        }
        res.status(200).json(galleryItem);
    } catch (error) {
        res.status(500).json({ message: "Error fetching gallery item", error: error.message });
    }
}
const likeGalleryItem = async (req, res) => {
    try {
        const galleryItem = await Gallery.findById(req.params.id);
        if (!galleryItem) {
            return res.status(404).json({ message: "Gallery item not found" });
        }
        galleryItem.likeCount += 1;
        await galleryItem.save();
        res.status(200).json({ message: "Gallery item liked successfully", galleryItem });
    } catch (error) {
        res.status(500).json({ message: "Error liking gallery item", error: error.message });
    }
}
const updateGalleryItem = async (req, res) => {
    try {
        const { title, description, imageUrl} = req.body;
        const updatedGalleryItem = await Gallery.findByIdAndUpdate(
            req.params.id,
            { title, description, imageUrl },
            { new: true }
        );
        if (!updatedGalleryItem) {
            return res.status(404).json({ message: "Gallery item not found" });
        }
        res.status(200).json({ message: "Gallery item updated successfully", galleryItem: updatedGalleryItem });
    } catch (error) {
        res.status(500).json({ message: "Error updating gallery item", error: error.message });
    }
}
const deleteGalleryItem = async (req, res) => {
    try {
        const deletedGalleryItem = await Gallery.findByIdAndDelete(req.params.id);
        if (!deletedGalleryItem) {
            return res.status(404).json({ message: "Gallery item not found" });
        }
        res.status(200).json({ message: "Gallery item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting gallery item", error: error.message });
    }
}
export {
    getGalleryItems,
    getGalleryItemById,
    updateGalleryItem,
    deleteGalleryItem,
    likeGalleryItem,
};