
const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");

// CREATE USER
const createUser = async (req, res) => {
    try {
        const { name, email, address, password, role } = req.body;

        if (!name || !email || !address || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 60) {
            return res.status(400).json({
                success: false,
                message: "Name must be between 2 and 60 characters"
            });
        }

        if (typeof email !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        if (typeof address !== "string" || address.trim().length > 400) {
            return res.status(400).json({
                success: false,
                message: "Invalid address"
            });
        }

        if (typeof password !== "string" || password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters"
            });
        }

        const userRole = role || "USER";

        if (!["USER", "STORE_OWNER"].includes(userRole)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: normalizedEmail,
                address: address.trim(),
                password: hashedPassword,
                role: userRole
            },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true,
                createdAt: true
            }
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user
        });

    } catch (error) {
        console.error("Create User Error:", error);

        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// GET ALL USERS
const getAllUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search || "";
        const role = req.query.role;

        const allowedSortFields = [
            "name",
            "email",
            "role",
            "createdAt"
        ];

        const sortBy = allowedSortFields.includes(req.query.sortBy)
            ? req.query.sortBy
            : "createdAt";

        const order = req.query.order === "asc" ? "asc" : "desc";

        if (!Number.isInteger(page) || !Number.isInteger(limit) ||
            page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({
                success: false,
                message: "Invalid pagination values"
            });
        }

        if (role && !["ADMIN", "USER", "STORE_OWNER"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        if (typeof search !== "string" || search.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Invalid search value"
            });
        }

        const where = {
            ...(role && { role }),
            ...(search.trim() && {
                OR: [
                    { name: { contains: search.trim() } },
                    { email: { contains: search.trim() } },
                    { address: { contains: search.trim() } }
                ]
            })
        };

        const [users, totalUsers] = await Promise.all([
            prisma.user.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    [sortBy]: order
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    address: true,
                    role: true,
                    createdAt: true
                }
            }),
            prisma.user.count({ where })
        ]);

        return res.status(200).json({
            success: true,
            pagination: {
                totalUsers,
                currentPage: page,
                totalPages: Math.ceil(totalUsers / limit),
                limit
            },
            users
        });

    } catch (error) {
        console.error("Get Users Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// GET USER BY ID
// GET USER BY ID
const getUserById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                ownedStores: {
                    select: {
                        id: true,
                        name: true,
                        ratings: {
                            select: {
                                value: true
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const userDetails = {
            ...user,
            ownedStores: user.ownedStores.map((store) => {
                const totalRatings = store.ratings.length;

                const averageRating = totalRatings
                    ? store.ratings.reduce(
                        (sum, rating) => sum + rating.value,
                        0
                    ) / totalRatings
                    : 0;

                return {
                    id: store.id,
                    name: store.name,
                    totalRatings,
                    averageRating: Number(averageRating.toFixed(2))
                };
            })
        };

        return res.status(200).json({
            success: true,
            user: userDetails
        });

    } catch (error) {
        console.error("Get User Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = {
    createUser,
    getAllUsers,
    getUserById
};
