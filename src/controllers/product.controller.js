
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../models/product.model.js";

const createProduct = asyncHandler(async (req, res) => {

    try {
        const { productName, price, sellingPrice, quantity, category } = req.body
    
        if (
            !productName && !price && !sellingPrice && !quantity && !category
        ) {
            throw new ApiError(400, "All fields are required!")
        }
    
        const product = await Product.create({
            productName,
            price,
            sellingPrice,
            quantity,
            category: category.toLowerCase()
        })
    
        if (!product) {
            throw new ApiError(500, "Something went wrong while creating product")
        }
    
        return res.status(201).json(
            new ApiResponse(201, product, "Product created successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Something went wrong while creating product")
        
    }
})

const updateProduct = asyncHandler(async (req, res) => {
   try {
     const { productId } = req.params;
     const { productName, price, sellingPrice, quantity, category } = req.body;
 
     if (!productName && !price && !sellingPrice && !quantity && !category) {
         throw new ApiError(400, "All fields are required!");
     }
 
     let updatedCategory = category ? category.toLowerCase() : "";
 
     const product = await Product.findByIdAndUpdate(productId, {
         $set: {
             productName,
             price,
             sellingPrice,
             quantity,
             category: updatedCategory
         }
     }, { new: true });
 
     if (!product) {
         throw new ApiError(404, "Product not found");
     }
 
     return res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
   } catch (error) {
     throw new ApiError(500, "Something went wrong while updating product");
    
   }
});

const deleteProduct = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.params;
    
        const product = await Product.findByIdAndDelete(productId);
    
        if (!product) {
            throw new ApiError(404, "Product not found");
        }
    
        return res.status(200).json( new ApiResponse(200, product, "Product deleted successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while deleting product");
        
    }
})

const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find().sort({createdAt: 1});
    
        if (!products) {
            throw new ApiError(404, "No products found");
        }
    
        return res.status(200).json(new ApiResponse(200, products, "Products retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching products");  
    }
});

const getProductByProductId = asyncHandler(async (req, res) => {
   try {
     const { productId } = req.params;
     const product = await Product.findById(productId);
 
     if (!product) {
         throw new ApiError(404, "Product not found");
     }
 
     return res.status(200).json( new ApiResponse(200, product, "Product retrieved successfully"));
 
   } catch (error) {
     throw new ApiError(500, "Something went wrong while fetching product");
    
   }
});

export {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductByProductId
}