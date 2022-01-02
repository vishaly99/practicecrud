const mongoose=require("mongoose");
const EmployeeSchema=mongoose.Schema({
    Name:{
        type:String,
        require:true
    },
    Email:{
        type:String,
        require:true
    },
    Contactno:{
        type:Number,
        require:true
    },
    Gender:{
        type:String,
        require:true
    },
    City:{
        type:String,
        require:true
    },
    pic:{
        type:String,
        require:true
    }
});
const Employee=new mongoose.model("employee",EmployeeSchema);
module.exports=Employee;