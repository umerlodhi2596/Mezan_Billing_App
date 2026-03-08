import mongoose from "mongoose";

const {Schema} = mongoose;


const invoiceItemSchema = new Schema({
    productDetail: {type: String, required: true},
    qtyDetail: {type: String, required: true},
    qty: {type: Number, required: true},
    tp: { type: Number, required: true },
})

const invoiceSchema = new Schema({
    invoiceNumber: {type: String, required: true},
    billTo: {type: String, required: true},
    date: {type: Date, required: true},
    items: [invoiceItemSchema],
    totalAmount: {type: Number, required: true},
    status: {type: String, enum: ["paid", "unpaid"], default: "unpaid"}
}, {timestamps: true})

const Invoice = mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);

export default Invoice;