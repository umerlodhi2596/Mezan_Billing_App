import mongoose from "mongoose";

const {Schema} = mongoose;

const customerSchema = new Schema({
    customerName: {type: String, required: true},
    location: {type: String, required: true},
    status: {type: String, enum: ["Active", "Inactive"], required: true},
}, {timestamps: true});

const Customer = mongoose.models.customer || mongoose.model("customer", customerSchema);

export default Customer;