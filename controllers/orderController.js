import prisma from "../lib/prisma.js";

export const createOrder = async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Order items are required"
            });
        }

        const productIds = items.map((item) => Number(item.productId));

        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds
                },
                isAvailable: true
            }
        });

        if (products.length !== productIds.length) {
            return res.status(400).json({
                message: "One or more products are unavailable"
            });
        }

        let totalPrice = 0;

        const orderItems = items.map((item) => {
            const product = products.find(
                (product) =>
                    product.id === Number(item.productId)
            );

            const quantity = Number(item.quantity);

            if (!Number.isInteger(quantity) || quantity <= 0) {
                throw new Error("Invalid quantity");
            }

            const price = product.price;

            totalPrice += price * quantity;

            return {
                productId: product.id,
                quantity,
                price
            };
        });

        const order = await prisma.order.create({
            data: {
                userId: req.user.id,
                totalPrice,
                items: {
                    create: orderItems
                }
            },
            include: {
                items: true
            }
        });

        res.status(201).json(order);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create order"
        });
    }
};



export const getMyOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json(orders);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to load orders"
        });
    }
};


export const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json(orders);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to load orders"
        });
    }
};


export const updateOrderStatus = async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "preparing",
            "completed",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status"
            });
        }

        const order = await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                status
            }
        });

        res.json(order);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update order status"
        });
    }
};