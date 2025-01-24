import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
    {
        productName: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true
        },
        price: {
            type: Number,
            required: true,
        },
        sellingPrice: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true
        },
        category: {
            type: String,
            lowercase: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
)

export const Product = mongoose.model("Product", productSchema)