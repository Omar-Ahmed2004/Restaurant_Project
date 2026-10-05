import express from "express";

import {
    getProducts,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js";

import upload from "../middleware/upload.js";

import {
    authenticateToken,
    requireAdmin
} from "../middleware/authMiddleware.js";




const router = express.Router();



// ====================
// Customer routes
// ====================

router.get("/", getProducts);

router.get(
    "/admin/all",
    authenticateToken,
    requireAdmin,
    getAllProducts
);

router.get("/:id", getProductById);


// ====================
// Admin routes
// ====================

router.get(
    "/admin/all",
    authenticateToken,
    requireAdmin,
    getAllProducts
);

router.post(
    "/",
    authenticateToken,
    requireAdmin,
    upload.single("image"),
    createProduct
);

router.put(
    "/:id",
    authenticateToken,
    requireAdmin,
    upload.single("image"),
    updateProduct
);

router.delete(
    "/:id",
    authenticateToken,
    requireAdmin,
    deleteProduct
);

export default router;