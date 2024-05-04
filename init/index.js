const mongoose=require("mongoose");
const listing = require("../models/listing.js");
const initdata= require("./data.js");

const Mongo_URL="mongodb://127.0.0.1:27017/makeMyTrip";

main()
    .then(()=>{
        console.log("connected");
    })
    .catch((err)=>{
        console.log(err);
    }); 
async function main(){
    await mongoose.connect(Mongo_URL);
}   

const initdb = async () => {
    await listing.deleteMany({});
    await listing.insertMany(initdata.data);
    console.log("data was initialsed");
}

initdb();
