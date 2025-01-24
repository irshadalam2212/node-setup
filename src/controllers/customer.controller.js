import { Customer } from "../models/customer.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createCustomer = asyncHandler (async(req, res) => {
    try {
        const { customerName, mobile, address, shopName } = req.body;
    
        if (!mobile && !address && !shopName) {
            throw new ApiError(400, "All fields are required!");
        }
    
        const customer = await Customer.create({
            customerName,
            mobile,
            address,
            shopName
        });
    
        if (!customer) {
            throw new ApiError(500, "Something went wrong while creating customer");
        }
    
        return res.status(201).json(new ApiResponse(201, customer, "Customer created successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while creating customer");
        
    }
})

const getAllCustomers = asyncHandler(async (req, res) => {
    
    try {
        const customers = await Customer.find();
    
        if(!customers) {
            throw new ApiError(404, "No customer found");
        }
    
        return res.status(200).json(new ApiResponse(200, customers, "Customers fetched successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching customers");
        
    }

})

const getCustomerByCustomerId = asyncHandler(async (req, res) => {
    try {
        const {customerId} = req.params;

        const customer = await Customer.findById(customerId);
        
        if(!customer) {
            throw new ApiError(404, "No customer found");
        }

        return res.status(200).json(new ApiResponse(200, customer, "Customer fetched successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching customer");
    }
})

const updateCustomer = asyncHandler( async (req, res) => {
    try {
        const {customerId} = req.params;

        const {customerName, mobile, address, shopName} = req.body;
        if(!customerName && !mobile && !address && !shopName) {
            throw new ApiError(400, "All fields are required!");
        }

        const customer = await Customer.findByIdAndUpdate(customerId, {
            $set: {
                customerName,
                mobile,
                address,
                shopName
            }
        }, {new: true});

        if(!customer) {
            throw new ApiError(404, "Customer not found");
        }
        return res.status(200).json(new ApiResponse(200, customer, "Customer updated successfully"));

    } catch (error) {
        throw new ApiError(500, "Something went wrong while updating customer");
    }

})

const deleteCustomer = asyncHandler(async (req, res) => {
    try {
        const {customerId} = req.params;

        const customer = await Customer.findByIdAndDelete(customerId);

        if(!customer) {
            throw new ApiError(404, "Customer not found");
        }
        
        res.status(200).json(new ApiResponse(200, {}, "Customer deleted successfully"));  
    } catch (error) {
        throw new ApiError(500, "Something went wrong while deleting customer");
    }
})

export { 
    createCustomer,
    getAllCustomers,
    getCustomerByCustomerId,
    updateCustomer,
    deleteCustomer
 }