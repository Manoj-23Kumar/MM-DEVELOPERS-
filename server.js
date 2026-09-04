const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const path=require("path");
const app=express();
app.use(cors());
app.use(express.json());

const PORT=process.env.PORT||5000;
const MONGODB_URI=process.env.MONGODB_URI;
if(!MONGODB_URI){console.warn("MONGODB_URI is not set");}

const leadSchema=new mongoose.Schema({name:{type:String,required:true},phone:String,property:String,status:{type:String,default:"New"}},{timestamps:true});
const followSchema=new mongoose.Schema({leadName:String,date:Date,note:String},{timestamps:true});
const visitSchema=new mongoose.Schema({leadName:String,date:Date,property:String,status:{type:String,default:"Scheduled"}},{timestamps:true});
const Lead=mongoose.model("Lead",leadSchema);
const Followup=mongoose.model("Followup",followSchema);
const SiteVisit=mongoose.model("SiteVisit",visitSchema);

app.get("/api/health",(req,res)=>res.json({ok:true,service:"MM DEVELOPERS"}));
app.get("/api/leads",async(req,res)=>{try{res.json(await Lead.find().sort({createdAt:-1}))}catch(e){res.status(500).json({error:e.message})}});
app.post("/api/leads",async(req,res)=>{try{res.status(201).json(await Lead.create(req.body))}catch(e){res.status(400).json({error:e.message})}});
app.get("/api/followups",async(req,res)=>{try{res.json(await Followup.find().sort({date:1}))}catch(e){res.status(500).json({error:e.message})}});
app.post("/api/followups",async(req,res)=>{try{res.status(201).json(await Followup.create(req.body))}catch(e){res.status(400).json({error:e.message})}});
app.get("/api/site-visits",async(req,res)=>{try{res.json(await SiteVisit.find().sort({date:1}))}catch(e){res.status(500).json({error:e.message})}});
app.post("/api/site-visits",async(req,res)=>{try{res.status(201).json(await SiteVisit.create(req.body))}catch(e){res.status(400).json({error:e.message})}});
app.get("/api/dashboard",async(req,res)=>{try{const [leads,followups,visits]=await Promise.all([Lead.countDocuments(),Followup.countDocuments(),SiteVisit.countDocuments()]);const converted=await Lead.countDocuments({status:"Converted"});res.json({leads,followups,visits,conversionRate:leads?Math.round(converted/leads*100):0})}catch(e){res.status(500).json({error:e.message})}});
app.post("/api/ai/chat",async(req,res)=>{const m=String(req.body.message||"").toLowerCase();let reply="Thanks for contacting MM DEVELOPERS. Our sales team will help you with project details, pricing and site visits.";if(m.includes("price")||m.includes("cost"))reply="Please share the project name or budget. Our team can provide the latest available pricing.";if(m.includes("visit"))reply="Sure. We can schedule a site visit. Please share your preferred date and time.";res.json({reply})});

app.use(express.static(__dirname));
app.get("/",(req,res)=>res.sendFile(path.join(__dirname,"index.html")));
app.listen(PORT, () => {
  console.log(`MM DEVELOPERS running on ${PORT}`);
});

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((e) => {
    console.error("MongoDB connection failed:", e.message);
  });
