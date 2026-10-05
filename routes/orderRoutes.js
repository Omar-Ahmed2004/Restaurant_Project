import express from "express";

import {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} from "../controllers/orderController.js";

import {
    authenticateToken,
    requireCustomer,
    requireAdmin
} from "../middleware/authMiddleware.js";

const router = express.Router();


router.post(
    "/",
    authenticateToken,
    requireCustomer,
    createOrder
);


router.get(
    "/my-orders",
    authenticateToken,
    requireCustomer,
    getMyOrders
);


router.get(
    "/admin",
    authenticateToken,
    requireAdmin,
    getAllOrders
);


router.patch(
    "/admin/:id/status",
    authenticateToken,
    requireAdmin,
    updateOrderStatus
);


export default router;