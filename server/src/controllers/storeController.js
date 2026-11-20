
const prisma = require("../config/prisma");

// Create a store (ADMIN only)
const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof address !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !address.trim() ||
      ownerId === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email, address and ownerId are required"
      });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedAddress = address.trim();
    const parsedOwnerId = Number(ownerId);

    if (trimmedName.length > 60) {
      return res.status(400).json({
        success: false,
        message: "Store name cannot exceed 60 characters"
      });
    }

    if (trimmedAddress.length > 400) {
      return res.status(400).json({
        success: false,
        message: "Address cannot exceed 400 characters"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address"
      });
    }

    if (!Number.isInteger(parsedOwnerId) || parsedOwnerId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid ownerId"
      });
    }

    const owner = await prisma.user.findUnique({
      where: { id: parsedOwnerId },
      select: { id: true, role: true }
    });

    if (!owner || owner.role !== "STORE_OWNER") {
      return res.status(400).json({
        success: false,
        message: "A valid STORE_OWNER account is required"
      });
    }

    const store = await prisma.store.create({
      data: {
        name: trimmedName,
        email: trimmedEmail,
        address: trimmedAddress,
        ownerId: parsedOwnerId
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: "Store created successfully",
      store
    });

  } catch (error) {
    console.error("Create store error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get all stores with search, sorting, pagination and ratings
const getAllStores = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 10)
    );

    const search = (req.query.search || "").trim();

    const allowedSortFields = [
      "name",
      "email",
      "address",
      "createdAt"
    ];

    const sortBy = allowedSortFields.includes(req.query.sortBy)
      ? req.query.sortBy
      : "createdAt";

    const order = req.query.order === "asc" ? "asc" : "desc";

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { address: { contains: search } },
            { email: { contains: search } }
          ]
        }
      : {};

    const [stores, totalStores] = await Promise.all([
      prisma.store.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          ownerId: true,
          createdAt: true
        }
      }),
      prisma.store.count({ where })
    ]);

    const storeIds = stores.map(store => store.id);

    const [ratingGroups, userRatings] = storeIds.length
      ? await Promise.all([
          prisma.rating.groupBy({
            by: ["storeId"],
            where: { storeId: { in: storeIds } },
            _avg: { value: true },
            _count: { value: true }
          }),
          prisma.rating.findMany({
            where: {
              storeId: { in: storeIds },
              userId: req.user.id
            },
            select: {
              storeId: true,
              value: true
            }
          })
        ])
      : [[], []];

    const storesWithRatings = stores.map(store => {
      const rating = ratingGroups.find(
        item => item.storeId === store.id
      );

      const userRating = userRatings.find(
        item => item.storeId === store.id
      );

      return {
        ...store,
        averageRating: rating?._avg.value
          ? Number(rating._avg.value.toFixed(2))
          : 0,
        totalRatings: rating?._count.value || 0,
        userRating: userRating?.value || null
      };
    });

    return res.status(200).json({
      success: true,
      pagination: {
        currentPage: page,
        limit,
        totalStores,
        totalPages: Math.ceil(totalStores / limit)
      },
      stores: storesWithRatings
    });

  } catch (error) {
    console.error("Get stores error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get one store by ID
const getStoreById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid store ID"
      });
    }

    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found"
      });
    }

    const [rating, userRating] = await Promise.all([
      prisma.rating.aggregate({
        where: { storeId: id },
        _avg: { value: true },
        _count: { value: true }
      }),
      prisma.rating.findUnique({
        where: {
          userId_storeId: {
            userId: req.user.id,
            storeId: id
          }
        },
        select: { value: true }
      })
    ]);

    return res.status(200).json({
      success: true,
      store: {
        ...store,
        averageRating: rating._avg.value
          ? Number(rating._avg.value.toFixed(2))
          : 0,
        totalRatings: rating._count.value,
        userRating: userRating?.value || null
      }
    });

  } catch (error) {
    console.error("Get store error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  createStore,
  getAllStores,
  getStoreById
};
