import Admin from "../models/admin.model.js";
import Gallery from "../models/gallery.model.js";
import Artist from "../models/artist.model.js";
import Music from "../models/music.model.js";
import Producer from "../models/producers.model.js";
import Filmmaker from "../models/filmmaker.model.js";
import Contact from "../models/contact.model.js";

export const getMonthlyData = async (req, res) => {
    try {
        const { range } = req.query;
        const months = range === '12months' ? 12 : 6;
        
        const monthsAgo = new Date();
        monthsAgo.setMonth(monthsAgo.getMonth() - months);

        // Get monthly artists data
        const monthlyArtists = await Artist.aggregate([
            { $match: { createdAt: { $gte: monthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    artists: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Get monthly music data
        const monthlyMusic = await Music.aggregate([
            { $match: { createdAt: { $gte: monthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    musics: { $sum: 1 },
                    listens: { $sum: "$playCount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Combine data by month
        const monthMap = new Map();
        
        monthlyArtists.forEach(item => {
            const key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
            monthMap.set(key, { month: key, artists: item.artists, musics: 0, listens: 0 });
        });
        
        monthlyMusic.forEach(item => {
            const key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
            const existing = monthMap.get(key) || { month: key, artists: 0, musics: 0, listens: 0 };
            existing.musics = item.musics;
            existing.listens = item.listens;
            monthMap.set(key, existing);
        });

        const formattedData = Array.from(monthMap.values()).sort((a, b) => a.month.localeCompare(b.month));

        res.status(200).json({
            success: true,
            data: formattedData
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching monthly data", 
            error: error.message 
        });
    }
};

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

        // Monthly growth data (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyGrowth = await Admin.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    users: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Content creation trends
        const contentTrends = await Gallery.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    gallery: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Music genre distribution
        const genreStats = await Music.aggregate([
            {
                $group: {
                    _id: "$genre",
                    count: { $sum: 1 },
                    totalPlays: { $sum: "$playCount" }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Daily activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailyActivity = await Contact.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" }
                    },
                    contacts: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        // Engagement metrics by content type
        const engagementByType = {
            gallery: {
                totalItems: totalGalleryItems,
                totalLikes: galleryStats[0]?.totalLikes || 0,
                avgEngagement: totalGalleryItems > 0 ? Math.round((galleryStats[0]?.totalLikes || 0) / totalGalleryItems) : 0
            },
            music: {
                totalItems: totalMusic,
                totalPlays: musicStats[0]?.totalPlays || 0,
                avgEngagement: totalMusic > 0 ? Math.round((musicStats[0]?.totalPlays || 0) / totalMusic) : 0
            }
        };

        // Top performing content
        const topPerformers = {
            mostLikedGallery: await Gallery.findOne().sort({ likeCount: -1 }).select('title likeCount'),
            mostPlayedMusic: await Music.findOne().sort({ playCount: -1 }).select('title artist playCount')
        };

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
                charts: {
                    monthlyGrowth: monthlyGrowth.map(item => ({
                        month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
                        users: item.users
                    })),
                    contentTrends: contentTrends.map(item => ({
                        month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
                        gallery: item.gallery
                    })),
                    genreDistribution: genreStats,
                    dailyContacts: dailyActivity.map(item => ({
                        date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
                        contacts: item.contacts
                    })),
                    engagementByType,
                    topPerformers
                },
                summary: {
                    totalContent: totalGalleryItems + totalMusic + totalArtists + totalProducers + totalFilmmakers,
                    totalEngagement: (galleryStats[0]?.totalLikes || 0) + (musicStats[0]?.totalPlays || 0),
                    activeUsers: totalUsers,
                    growthRate: monthlyGrowth.length > 1 ? 
                        Math.round(((monthlyGrowth[monthlyGrowth.length - 1]?.users || 0) - (monthlyGrowth[0]?.users || 0)) / (monthlyGrowth[0]?.users || 1) * 100) : 0
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