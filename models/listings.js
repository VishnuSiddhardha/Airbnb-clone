const { Template } = require("ejs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String, 
    image: {
        type: String,
        default: "https://png.pngtree.com/png-clipart/20190924/original/pngtree-empty-box-icon-for-your-project-png-image_4814103.jpg", 
        set: (v) => v === "" ? "https://png.pngtree.com/png-clipart/20190924/original/pngtree-empty-box-icon-for-your-project-png-image_4814103.jpg" : v,
    },
    price: Number,
    location: String,
    country: String
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;