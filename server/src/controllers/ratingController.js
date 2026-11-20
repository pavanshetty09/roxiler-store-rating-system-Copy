
const prisma = require("../config/prisma");

// Submit or update a store rating
const submitRating = async (req, res) => {
  try {
    const { storeId, value } = req.body;

    const parsedStoreId = Number(storeId);

    if (
      !Number.isInteger(parsedStoreId) ||
      parsedStoreId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid storeId"
      });
    }

    if (
      !Number.isInteger(value) ||
      value < 1 ||
      value > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5"
      });
    }

    const store = await prisma.store.findUnique({
      where: { id: parsedStoreId }
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found"
      });
    }

    const rating = await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId: req.user.id,
          storeId: parsedStoreId
        }
      },
      update: {
        value
      },
      create: {
        userId: req.user.id,
        storeId: parsedStoreId,
        value
      }
    });

    return res.status(200).json({
      success: true,
      message: "Rating submitted successfully",
      rating
    });

  } catch (error) {
    console.error("Submit rating error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get ratings submitted by the logged-in user
const getMyRatings = async (req, res) => {
  try {
    const ratings = await prisma.rating.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      },
      orderBy: {
        updatedAt: "desc"
      }
    });

    return res.status(200).json({
      success: true,
      totalRatings: ratings.length,
      ratings
    });

  } catch (error) {
    console.error("Get my ratings error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Store Owner dashboard
const getOwnerDashboard = async (req, res) => {
  try {
    const stores = await prisma.store.findMany({
      where: {
        ownerId: req.user.id
      },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            updatedAt: "desc"
          }
        }
      }
    });

    const dashboard = stores.map(store => {
      const totalRatings = store.ratings.length;

      const totalScore = store.ratings.reduce(
        (sum, rating) => sum + rating.value,
        0
      );

      const averageRating = totalRatings
        ? Number((totalScore / totalRatings).toFixed(2))
        : 0;

      return {
        storeId: store.id,
        storeName: store.name,
        storeAddress: store.address,
        averageRating,
        totalRatings,
        ratings: store.ratings.map(rating => ({
          ratingId: rating.id,
          value: rating.value,
          updatedAt: rating.updatedAt,
          user: rating.user
        }))
      };
    });

    return res.status(200).json({
      success: true,
      totalStores: dashboard.length,
      stores: dashboard
    });

  } catch (error) {
    console.error("Owner dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  submitRating,
  getMyRatings,
  getOwnerDashboard
};
