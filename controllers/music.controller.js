import Music from "../models/music.model.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";

const createMusic = async (req, res) => {
    try {
        const { title, artist, album, genre, releaseDate, duration, coverImageUrl, youtubeLink, audioUrl } = req.body;
        
        // Validate required fields
        if (!title || !artist || !duration || !audioUrl) {
            return res.status(400).json({ 
                success: false,
                message: "Title, artist, duration and audio URL are required" 
            });
        }

        // Upload cover image to Cloudinary if provided
        let cloudinaryCoverResult = null;
        if (coverImageUrl) {
            cloudinaryCoverResult = await cloudinaryUpload(coverImageUrl, "music-covers");
        }

        // Upload audio file to Cloudinary
        let cloudinaryAudioResult = null;
        try {
            cloudinaryAudioResult = await cloudinaryUpload(audioUrl, "music-audio", {
                resource_type: "video", // Use "video" for audio files in Cloudinary
                format: "mp3" // You can specify the format or let Cloudinary auto-detect
            });
        } catch (uploadError) {
            console.error("Error uploading audio to Cloudinary:", uploadError);
            return res.status(500).json({
                success: false,
                message: "Error uploading audio file",
                error: uploadError.message
            });
        }

        // Create new music
        const music = new Music({
            title,
            artist,
            album: album || "Single",
            genre: genre || "Hip Hop",
            releaseDate: releaseDate || new Date(),
            duration: parseInt(duration),
            coverImageUrl: cloudinaryCoverResult?.secure_url || coverImageUrl || "",
            youtubeLink,
            audioUrl: cloudinaryAudioResult?.secure_url || audioUrl // Use Cloudinary URL
        });
        
        await music.save();
        
        res.status(201).json({
            success: true,
            message: "Music created successfully",
            data: music
        });
    } catch (error) {
        console.error("Error creating music:", error);
        res.status(500).json({ 
            success: false,
            message: "Error creating music", 
            error: error.message 
        });
    }
};

const getMusic = async (req, res) => {
    try {
        const { sort = '-createdAt', limit = 20, page = 1, genre, search } = req.query;
        
        // Start with empty filter
        const filter = {};
        
        // Only add isActive if you want to filter by it
        // filter.isActive = true;
        
        if (genre) {
            filter.genre = { $regex: genre, $options: 'i' }; // Case-insensitive match
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { artist: { $regex: search, $options: 'i' } },
                { album: { $regex: search, $options: 'i' } }
            ];
        }

        const options = {
            sort: sort.toString(),
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true,
            allowDiskUse: true // For large datasets
        };
        const result = await Music.paginate(filter, options);

        
        res.status(200).json({
            success: true,
            data: {
                docs: result.docs,
                total: result.totalDocs,
                limit: result.limit,
                page: result.page,
                pages: result.totalPages,
                hasNext: result.hasNextPage,
                hasPrev: result.hasPrevPage
            }
        });
    } catch (error) {
        console.error("Error fetching music:", error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching music", 
            error: error.message 
        });
    }
};

const getMusicById = async (req, res) => {
    try {
        const music = await Music.findById(req.params.id);
        
        if (!music || !music.isActive) {
            return res.status(404).json({ 
                success: false,
                message: "Music not found" 
            });
        }
        
        res.status(200).json({
            success: true,
            data: music
        });
    } catch (error) {
        console.error("Error fetching music:", error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching music", 
            error: error.message 
        });
    }
};

const updateMusic = async (req, res) => {
    try {
        const { title, artist, album, genre, releaseDate, duration, coverImageUrl, youtubeLink, audioUrl } = req.body;
        
        const updateData = {
            title,
            artist,
            album,
            genre,
            releaseDate,
            duration,
            youtubeLink
        };

        // Upload new cover image if provided
        if (coverImageUrl && coverImageUrl.startsWith('data:')) {
            const cloudinaryCoverResult = await cloudinaryUpload(coverImageUrl, "music-covers");
            updateData.coverImageUrl = cloudinaryCoverResult?.secure_url || "";
        } else if (coverImageUrl) {
            updateData.coverImageUrl = coverImageUrl;
        }

        // Upload new audio file if provided
        if (audioUrl) {
            // Check if it's a new file (base64 or file upload) or existing URL
            if (audioUrl.startsWith('data:') || audioUrl instanceof File) {
                try {
                    const cloudinaryAudioResult = await cloudinaryUpload(audioUrl, "music-audio", {
                        resource_type: "video",
                        format: "mp3"
                    });
                    updateData.audioUrl = cloudinaryAudioResult?.secure_url || "";
                } catch (uploadError) {
                    console.error("Error uploading audio to Cloudinary:", uploadError);
                    return res.status(500).json({
                        success: false,
                        message: "Error uploading audio file",
                        error: uploadError.message
                    });
                }
            } else {
                updateData.audioUrl = audioUrl; // Use existing URL
            }
        }

        const updatedMusic = await Music.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!updatedMusic) {
            return res.status(404).json({ 
                success: false,
                message: "Music not found" 
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Music updated successfully",
            data: updatedMusic
        });
    } catch (error) {
        console.error("Error updating music:", error);
        res.status(500).json({ 
            success: false,
            message: "Error updating music", 
            error: error.message 
        });
    }
};

const deleteMusic = async (req, res) => {
    try {
        const music = await Music.findById(req.params.id);

        if (!music) {
            return res.status(404).json({
                success: false,
                message: "Music not found"
            });
        }

        // Delete from Cloudinary if public IDs exist
        if (music.coverPublicId) {
            await cloudinary.uploader.destroy(music.coverPublicId);
        }

        if (music.audioPublicId) {
            await cloudinary.uploader.destroy(music.audioPublicId, {
                resource_type: "video" // necessary for audio files
            });
        }

        // Soft delete in DB
        await Music.findByIdAndUpdate(req.params.id, { isActive: false });

        res.status(200).json({
            success: true,
            message: "Music deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting music:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting music",
            error: error.message
        });
    }
};

const incrementPlayCount = async (req, res) => {
    try {
        const music = await Music.findByIdAndUpdate(
            req.params.id,
            { 
                $inc: { playCount: 1 },
                lastPlayed: new Date()
            },
            { new: true }
        );
        
        if (!music) {
            return res.status(404).json({ 
                success: false,
                message: "Music not found" 
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Play count updated",
            playCount: music.playCount
        });
    } catch (error) {
        console.error("Error updating play count:", error);
        res.status(500).json({ 
            success: false,
            message: "Error updating play count", 
            error: error.message 
        });
    }
};

const getTopMusic = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        
        const topMusic = await Music.find({ isActive: true })
            .sort({ playCount: -1 })
            .limit(parseInt(limit))
            .lean();
        
        res.status(200).json({
            success: true,
            data: topMusic
        });
    } catch (error) {
        console.error("Error fetching top music:", error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching top music", 
            error: error.message 
        });
    }
};

export {
    createMusic,
    getMusic,
    getMusicById,
    updateMusic,
    deleteMusic,
    incrementPlayCount,
    getTopMusic
};