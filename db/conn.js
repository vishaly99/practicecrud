const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/internalpractice",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connection successful");
}).catch((e)=>
{
    console.log(`no connection ${e}`);
})
