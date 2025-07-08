import Gallery from "../models/gallery.model";


const createGalleryItem = async (req, res) => {
    try {
        const { title, description, imageUrl, artist } = req.body;
        const newGalleryItem = new Gallery({ title, description, imageUrl, artist });
        await newGalleryItem.save();
        res.status(201).json({ message: "Gallery item created successfully", galleryItem: newGalleryItem });
    } catch (error) {
        res.status(500).json({ message: "Error creating gallery item", error: error.message });
    }
}
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
const updateGalleryItem = async (req, res) => {
    try {
        const { title, description, imageUrl, artist } = req.body;
        const updatedGalleryItem = await Gallery.findByIdAndUpdate(
            req.params.id,
            { title, description, imageUrl, artist },
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
    createGalleryItem,
    getGalleryItems,
    getGalleryItemById,
    updateGalleryItem,
    deleteGalleryItem
};