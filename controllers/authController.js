import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Registration failed"
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Login failed"
        });
    }
};