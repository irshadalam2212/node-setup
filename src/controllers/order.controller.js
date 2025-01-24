import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createOrder = asyncHandler(async (req, res) => {
    try {
        const { user, customer, products, totalAmount, status } = req.body;

        if (!user && !customer && !products && !totalAmount) {
            throw new ApiError(400, "All fields are required!");
        }

        const order = await Order.create({
            user,
            customer,
            products,
            totalAmount,
            status
        });

        if (!order) {
            throw new ApiError(500, "Something went wrong while creating order");
        }

        return res.status(201).json(new ApiResponse(201, order, "Order created successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while creating order");

    }
})

const getAllOrders = asyncHandler(async (req, res) => {

    try {
        const orders = await Order.find();

        if (!orders) {
            throw new ApiError(404, "No order found");
        }

        return res.status(200).json(new ApiResponse(200, orders, "Orders fetched successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching orders");
    }
})

const getOrderByOrderId = asyncHandler(async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) {
            throw new ApiError(404, "No order found");
        }

        return res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));

    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching order");
    }
});

const deleteOrder = asyncHandler(async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findByIdAndDelete(orderId);

        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        return res.status(200).json(new ApiResponse(200, {}, "Order deleted successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while deleting order");
    }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(orderId, {status}, {new: true});

        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        return res.status(200).json(new ApiResponse(200, order, "Order status updated successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while updating order status");
    }
});

const updateOrder = asyncHandler(async (req, res) => {
    try {
        const { orderId } = req.params;
        const { products } = req.body;

        const order = await Order.findByIdAndUpdate(orderId, {products}, {new: true});

        if (!order) {
            throw new ApiError(404, "Order not found");
        }
        
        return res.status(200).json(new ApiResponse(200, order, "Order updated successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while updating order");
    }
});

export {
    createOrder,
    getAllOrders,
    getOrderByOrderId,
    updateOrderStatus,
    deleteOrder,
    updateOrder
}