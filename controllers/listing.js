const Listing = require("../models/listings");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const axios = require("axios");



module.exports.index = async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings });
};

// New controller for AJAX search
module.exports.searchApi = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";
    let listings = [];
    if (searchQuery.trim() !== "") {
      listings = await Listing.find({
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
          { location: { $regex: searchQuery, $options: "i" } }
        ]
      })
    //   }).limit(20); // safety limit
    }
    else {
        listings = await Listing.find({});
    }

    res.json(listings);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let fileName = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.image = { url, fileName };
    newListing.owner = req.user._id;
    const locationName = newListing.location;

    const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
            q: locationName,
            format: "json",
            limit: 1
        },
        headers: {
            "User-Agent": "wanderlust-app" // Required by Nominatim
        }
    });

    if (geoRes.data && geoRes.data.length > 0) {
        const lat = parseFloat(geoRes.data[0].lat);
        const lon = parseFloat(geoRes.data[0].lon);
        // Save as GeoJSON Point
        newListing.geometry = {
            type: "Point",
            coordinates: [lon, lat] // GeoJSON expects [longitude, latitude]
        };
    } else {
        // fallback if no geocode found
        newListing.geometry = {
            type: "Point",
            coordinates: [0, 0]
        }
    };
    // console.log(newListing.geometry);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: 'author' } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/,w250")
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let fileName = req.file.filename;
        listing.image = { url, fileName };
        await listing.save();
    }
    req.flash("success", "Listing updated"); 1
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};