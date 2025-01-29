import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import { Customer } from "../models/customer.model.js";
import { User } from "../models/user.model.js"

const createOrder = asyncHandler(async (req, res) => {
    try {
        const { user, customer, products, totalAmount, status } = req.body;

        if (!user && !customer && !products && !totalAmount) {
            throw new ApiError(400, "All fields are required!");
        }

        if (!Array.isArray(products) || products.length === 0) {
            throw new ApiError(400, "Add atleast one product!")
        }

        // checking for existing pending and same user order
        // const existingOrder =  await Order.findOne({
        //     customer,
        //     user,
        //     status: "pending"
        // })
        // console.log(existingOrder, "existing order")

        // if(existingOrder) {
        //     return new ApiError(400, "This customer has already a pending order with you. You can modify the order!")
        // }

        // calculating total amount dynamically
        let total = 0;

        for (const item of products) {
            const product = await Product.findById(item.product)
            // console.log(product)
            if (!product) {
                throw new ApiError(404, `Product with id ${item.product} not found.`)
            }

            total += product.price * item.quantity
        }

        // check if the total amount is positive number or not
        if (isNaN(total) || total <= 0) {
            throw new ApiError(400, "Total amount must be a positive number.");
        }

        const order = await Order.create({
            user,
            customer,
            products,
            totalAmount: total,
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
        const orders = await Order.find().sort({ createdAt: -1 });

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
        const { userId } = req.params;
        const { customerId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId)

        if (!order) {
            throw new ApiError(404, "Order not found")
        }

        // check if the status is changing to 'delivered'
        if (status === 'delivered') {
            const totalAmount = order.totalAmount

            for (let i = 0; i < order.products.length; i++) {
                const product = order.products[i].product;
                const quantityToReduce = order.products[i].quantity;

                // Decrease the product's quantity in the database
                await Product.findByIdAndUpdate(
                    product._id,
                    // Decrease the quantity by the order's quantity
                    { $inc: { quantity: -quantityToReduce } }
                );

            }
            // Add total amount in employee database
            await User.findByIdAndUpdate(
                userId,
                { $inc: { totalSale: totalAmount } }
            )

            // Add total amount in customer DB
            await Customer.findByIdAndUpdate(
                customerId,
                { $inc: { totalOrder: totalAmount } }
            )
        }

        const UpdatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!UpdatedOrder) {
            throw new ApiError(404, "Order not found");
        }

        return res.status(200).json(new ApiResponse(200, order, "Order status updated successfully"));

    }

    catch (error) {
        throw new ApiError(500, "Something went wrong while updating order status");
    }
});

const updateOrder = asyncHandler(async (req, res) => {
    try {
        const { orderId } = req.params;
        const { products } = req.body;

        const order = await Order.findByIdAndUpdate(orderId, { products }, { new: true });

        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        return res.status(200).json(new ApiResponse(200, order, "Order updated successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while updating order");
    }
});

const dashboardStats = asyncHandler(async (req, res) => {
    try {
        let today = new Date()
        const startOfDay = new Date(today.setHours(0, 0, 0, 0))
        const endOfDay = new Date(today.setHours(23, 59, 59, 999))
    
        const stats = await Order.aggregate([
            {
                $match: {
                    createdAt: {$gte: startOfDay, $lte: endOfDay}
                }
            },
            {
                $project: {
                    totalAmount: 1, // Include totalAmount to calculate sales
                    products: 1 // Include only the products array
                }
            },
            
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalAmount" },
                    totalOrders: { $sum: 1 },
                    productSold:  { $sum: { $size: "$products" } } // Count each product object 
                }
            }
        ])
        const result = stats.length > 0 ? stats : { totalSales: 0, totalOrders: 0, productSold: 0 };
        return res.status(200).json(new ApiResponse(200, result))
    } catch (error) {
        throw new ApiError(500, "Something went wrong while calculating total");
    }
})

export {
    createOrder,
    getAllOrders,
    getOrderByOrderId,
    updateOrderStatus,
    deleteOrder,
    updateOrder,
    dashboardStats
}