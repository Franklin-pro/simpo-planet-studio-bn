import Admin from "../models/admin.model.js";
import Gallery from "../models/gallery.model.js";
import Artist from "../models/artist.model.js";
import Music from "../models/music.model.js";
import Producer from "../models/producers.model.js";
import Filmmaker from "../models/filmmaker.model.js";
import Contact from "../models/contact.model.js";

export const getDashboardAnalytics = async (req, res) => {
    try {
        // Get counts
        const totalUsers = await Admin.countDocuments();
        const totalAdmins = await Admin.countDocuments({ userType: 'admin' });
        const totalRegularUsers = await Admin.countDocuments({ userType: 'user' });
        const totalGalleryItems = await Gallery.countDocuments();
        const totalArtists = await Artist.countDocuments();
        const totalMusic = await Music.countDocuments();
        const totalProducers = await Producer.countDocuments();
        const totalFilmmakers = await Filmmaker.countDocuments();
        const totalContacts = await Contact.countDocuments();

        // Get total likes across all gallery items
        const galleryStats = await Gallery.aggregate([
            {
                $group: {
                    _id: null,
                    totalLikes: { $sum: "$likeCount" },
                    avgLikes: { $avg: "$likeCount" }
                }
            }
        ]);

        // Get music views/plays statistics
        const musicStats = await Music.aggregate([
            {
                $group: {
                    _id: null,
                    totalPlays: { $sum: "$playCount" },
                    avgPlays: { $avg: "$playCount" }
                }
            }
        ]);

        // Recent activity (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentUsers = await Admin.countDocuments({ 
            createdAt: { $gte: sevenDaysAgo } 
        });
        const recentGallery = await Gallery.countDocuments({ 
            createdAt: { $gte: sevenDaysAgo } 
        });

        // Most liked gallery items (top 5)
        const topGalleryItems = await Gallery.find()
            .sort({ likeCount: -1 })
            .limit(5)
            .select('title likeCount image');

        // Most played music (top 5)
        const topMusicTracks = await Music.find()
            .sort({ playCount: -1 })
            .limit(5)
            .select('title artist playCount coverImageUrl');

        // User type distribution
        const userTypeStats = await Admin.aggregate([
            {
                $group: {
                    _id: "$userType",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    totalAdmins,
                    totalRegularUsers,
                    totalGalleryItems,
                    totalArtists,
                    totalMusic,
                    totalProducers,
                    totalFilmmakers,
                    totalContacts
                },
                engagement: {
                    totalLikes: galleryStats[0]?.totalLikes || 0,
                    averageLikes: Math.round(galleryStats[0]?.avgLikes || 0),
                    topGalleryItems,
                    totalMusicPlays: musicStats[0]?.totalPlays || 0,
                    averageMusicPlays: Math.round(musicStats[0]?.avgPlays || 0),
                    topMusicTracks
                },
                recentActivity: {
                    newUsersLast7Days: recentUsers,
                    newGalleryLast7Days: recentGallery
                },
                userDistribution: userTypeStats,
                summary: {
                    totalContent: totalGalleryItems + totalMusic + totalArtists + totalProducers + totalFilmmakers,
                    totalEngagement: galleryStats[0]?.totalLikes || 0,
                    activeUsers: totalUsers
                }
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching dashboard analytics", 
            error: error.message 
        });
    }
};