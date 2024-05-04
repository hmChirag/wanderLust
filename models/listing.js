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
        default: "https://nt.global.ssl.fastly.net/binaries/content/gallery/website/national/library/our-cause/on-the-shore-borrowdale-and-derwent-water-1518851.jpg?auto=webp&width=767&crop=16:9&dpr=2%202x",
        set: function(v) {
            return v && typeof v === "object" ? v.url : v || "https://nt.global.ssl.fastly.net/binaries/content/gallery/website/national/library/our-cause/on-the-shore-borrowdale-and-derwent-water-1518851.jpg?auto=webp&width=767&crop=16:9&dpr=2%202x";
        }
    },
    price: Number,
    location: String,
    country: String,
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;

