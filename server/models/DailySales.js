const mongoose = require("mongoose");

const dailySalesSchema = new mongoose.Schema({
date: {
    type: String,
    required: true,
    unique: true,
    index: true,
},
revenue:{
type: Number,
default: 0,
},
orderCount:{
    type: Number,
    default: 0,
},
itemsSold: {
    type:Number,
    default: 0,
},
},
{timestamps: true}
);
const DailySales = mongoose.model("DailySales", dailySalesSchema);
module.exports = DailySales;