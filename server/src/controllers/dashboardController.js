
const prisma = require("../config/prisma");

const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalStores,
      totalRatings,
      totalStoreOwners,
      averageRating
    ] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
      prisma.user.count({
        where: { role: "STORE_OWNER" }
      }),
      prisma.rating.aggregate({
        _avg: { value: true }
      })
    ]);

    return res.status(200).json({
      success: true,
      dashboard: {
        totalUsers,
        totalStores,
        totalRatings,
        totalStoreOwners,
        overallAverageRating: averageRating._avg.value
          ? Number(averageRating._avg.value.toFixed(2))
          : 0
      }
    });

  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = { getAdminDashboard };
