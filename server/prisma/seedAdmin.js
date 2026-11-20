
require("dotenv").config();

const bcrypt = require("bcryptjs");
const prisma = require("../src/config/prisma");

const createAdmin = async () => {
  try {
    const name = process.env.ADMIN_NAME?.trim();
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    const address = process.env.ADMIN_ADDRESS?.trim();

    if (!name || !email || !password || !address) {
      throw new Error("Please provide all ADMIN details in .env");
    }

    if (name.length < 20 || name.length > 60) {
      throw new Error("Admin name must be 20–60 characters");
    }

    if (address.length > 400) {
      throw new Error("Admin address cannot exceed 400 characters");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid admin email");
    }

    if (!/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(password)) {
      throw new Error(
        "Password must be 8–16 characters with an uppercase letter and special character"
      );
    }

    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      if (existingAdmin.role === "ADMIN") {
        console.log("Administrator already exists.");
        return;
      }

      throw new Error(
        "This email already belongs to a non-admin user. Choose another email."
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role: "ADMIN",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    console.log("Administrator created successfully!");
    console.log(admin);
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};

createAdmin();
