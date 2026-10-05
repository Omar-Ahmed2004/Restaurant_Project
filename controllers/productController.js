import prisma from "../lib/prisma.js";
import { validateProduct } from "../validators/productValidator.js";





export const getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                isAvailable: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json(products);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch products"
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;

        const image = req.file;

        const validationError = validateProduct({
            name,
            description,
            price,
            image
        });

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: Number(price),
                image: `/images/${image.filename}`
            }
        });

        res.status(201).json(product);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create product"
        });
    }
};


export const getProductById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const product = await prisma.product.findUnique({
            where: {
                id: id
            }
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch product"
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const { name, description, price, isAvailable } = req.body;

        const validationError = validateProduct({
            name,
            description,
            price,
            image: req.file || true
        });

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const data = {
            name,
            description,
            price: Number(price),
            isAvailable: isAvailable === "true" || isAvailable === true
        };

        if (req.file) {
            data.image = `/images/${req.file.filename}`;
        }

        const product = await prisma.product.update({
            where: {
                id: id
            },
            data
        });

        res.json(product);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update product"
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);

        await prisma.product.delete({
            where: {
                id: id
            }
        });

        res.json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete product"
        });
    }
};



export const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json(products);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch products"
        });
    }
};