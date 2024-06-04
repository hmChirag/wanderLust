const mongoose= require("mongoose");
const express=require("express");
const app=express();
const listings = require("./models/listing.js")
const path=require("path");
const { encode } = require("punycode");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const Mongo_URL="mongodb://127.0.0.1:27017/makeMyTrip";
const wrapAsync =require("./utils/wrapAsycn.js");
const ExpressError =require("./utils/ExpressError.js");
const { nextTick } = require("process");
const Review = require("./models/review.js");
const listing = require("./models/listing.js");



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

app.listen(8080,()=>{
    console.log("port is listning to 8080");
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



app.get("/",(req,res)=>{
    res.send("working");
});
// index route
app.get("/listings",async(req,res)=>{
    const allListings = await listings.find({});
    res.render("listings/index.ejs",{allListings});
});


//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});


// show route
app.get("/listings/:id",async (req,res) => {
    let{id}=req.params;
    const listing=await listings.findById(id);
    res.render("listings/show.ejs",{listing});
});

// craete route
app.post("/listings",async (req,res)=>{
    const newlisting = new listings(req.body.listing);
    console.log(newlisting);
    await newlisting.save();
    res.redirect("/listings"); 
})


//edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let{id}=req.params;
    const listing=await listings.findById(id);
    res.render("listings/edit.ejs",{listing});
}); 


//update route
app.put("/listings/:id",async(req,res)=>{
    let{id}=req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
});


//Delete route
app.delete("/listings/:id",async (req,res)=>{
    let{id}=req.params;
    let deletedListeing= await listings.findByIdAndDelete(id);
    console.log(deletedListeing);
    res.redirect("/listings");
});
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"404 error ! Page not found!"))
})

app.use((err,req,res,next)=>{
    let {statusCode,message}=err;
    res.render("errors.ejs",{message});
});

//reviews  
//post route
app.post("/listings/:id/reviews",async(req,res)=>{
    let listing = await listings.findById(req.params.id);
    let newReview = new Review(req.body.Review);

    listing.Review.push(newReview);

    await newReview.save();
    await listing.save();
    res.send("new review saved");
    res.redirect(`/listings/${listing.id}`);  
});


// app.get("/testlisting",async (req,res)=>{
//     let sampleListing = new listing({
//         title:"My new villa",
//         description:"by the villa",
//         price:1200,
//         location:"Calangune, Goa",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });
