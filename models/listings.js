const mongoose = require("mongoose");
const review = require("./review");
const { ref } = require("joi");
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
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});


// middleware when Listings deleted
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;