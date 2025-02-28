import mongoose, { Schema } from "mongoose";

const customerSchema = new Schema(
    {
        customerName: {
            type: String,
            lowercase: true,
            trim: true,
            index: true
        },
        mobile: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        shopName: {
            type: String,
            required: true
        },
        totalOrder: {
            type: Number,
            default: 0
        },
    },
    {
        timestamps: true
    }
);

export const Customer = mongoose.model("Customer", customerSchema)