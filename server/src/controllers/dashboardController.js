
const prisma = require("../config/prisma");

const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalStores,
      totalRatings,
      totalStoreOwners,
      averageRating,
      usersByRole,
      ratingsByValue,
      storesWithRatings
    ] = await Promise.all([
      prisma.user.count(),

      prisma.store.count(),

      prisma.rating.count(),

      prisma.user.count({
        where: { role: "STORE_OWNER" }
      }),

      prisma.rating.aggregate({
        _avg: { value: true }
      }),

      // User role distribution
      prisma.user.groupBy({
        by: ["role"],
        _count: { _all: true }
      }),

      // Rating distribution (1 to 5 stars)
      prisma.rating.groupBy({
        by: ["value"],
        _count: { _all: true },
        orderBy: { value: "asc" }
      }),

      // Store rating overview
      prisma.store.findMany({
        select: {
          id: true,
          ratings: {
            select: {
              value: true
            }
          }
        }
      })
    ]);

    // Prepare user role chart data
    const roleDistribution = ["ADMIN", "USER", "STORE_OWNER"].map(
      (role) => ({
        name:
          role === "ADMIN"
            ? "Administrators"
            : role === "USER"
              ? "Normal Users"
              : "Store Owners",
        value:
          usersByRole.find((item) => item.role === role)?._count._all || 0
      })
    );

    // Prepare rating chart data
    const ratingDistribution = [1, 2, 3, 4, 5].map((star) => ({
      name: `${star} Star`,
      count:
        ratingsByValue.find((item) => item.value === star)?._count._all || 0
    }));

    // Prepare store rating overview
    const storeRatingDistribution = [
      { name: "Not Rated", value: 0 },
      { name: "1 - Below 2", value: 0 },
      { name: "2 - Below 3", value: 0 },
      { name: "3 - Below 4", value: 0 },
      { name: "4 - 5", value: 0 }
    ];

    storesWithRatings.forEach((store) => {
      if (store.ratings.length === 0) {
        storeRatingDistribution[0].value++;
        return;
      }

      const average =
        store.ratings.reduce((sum, rating) => sum + rating.value, 0) /
        store.ratings.length;

      if (average < 2) {
        storeRatingDistribution[1].value++;
      } else if (average < 3) {
        storeRatingDistribution[2].value++;
      } else if (average < 4) {
        storeRatingDistribution[3].value++;
      } else {
        storeRatingDistribution[4].value++;
      }
    });

    return res.status(200).json({
      success: true,
      dashboard: {
        // Existing statistics
        totalUsers,
        totalStores,
        totalRatings,
        totalStoreOwners,

        overallAverageRating: averageRating._avg.value
          ? Number(averageRating._avg.value.toFixed(2))
          : 0,

        // New chart data
        roleDistribution,
        ratingDistribution,
        storeRatingDistribution
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
