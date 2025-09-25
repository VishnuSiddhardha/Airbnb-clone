const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
    .then(() => {
        console.log("Connected to db");
    })
    .catch((err) => {
        console.log(err);
    });

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "68d37b363589cd454eb0759f"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();