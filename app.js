const express=require("express");
const app=express();
const Employee=require("./model/employee");
const Admin = require('./model/admin');
const db=require("./db/conn");
const session = require('express-session');
//setting the port
const port=process.env.PORT||8000;
//requiring the view template engine handle bar 
const hbs=require("hbs");
//multer for file upload
const multer=require("multer");
//converting the post data to json format
const bodyparser=require("body-parser");
const async = require("hbs/lib/async");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended:true
}));
app.use(session({
    secret:'alksncoasnocvnsmdaocn',
    resave:false,
    saveUninitialized:false
}))
app.use(express.static("public"));
//view
//app.use(express.urlencoded({extended:true}))
//api
//app.use(express.json())
app.set("view engine","hbs");
const fileStorageEngine=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/images')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'--'+file.originalname)
    }
});

const upload = multer({
    storage:fileStorageEngine
}).single('pic')


app.get("/login",(req,res) => {
    res.render("login");
})

app.post('/login',(req,res) => {
    
    Admin.findOne({
        "email" : req.body.email,
        "password" : req.body.password
    }, (err,data) => {
        if(data){   
            req.session.loggedin = true;
            req.session.email = data.email;
            res.redirect('/');
        }
        else{
            //res.render('login',{err:true,msg:"imvalid credentials"})
            console.log("invalid");
        }
    })
})


app.get('/logout',(req,res) => {
    if(req.session.loggedin){
        req.session.destroy((err) => {
            if(err) return cronsole.log(err);
            res.clearCookie('connect.sid');
            res.redirect('/login');
        })
    }else{
        console.log("logged in");
    }
})


// app.get("/",(req,res)=>{
//     res.send("Hello");
// })
//open list page with data
app.get("/",(req,res)=>{
    if(req.session.loggedin){
        try {
            Employee.find((err,docs)=>{
                if(!err)
                {
                    console.log(docs);
                    res.render("list",{
                        list:docs,
                        viewTitle:"Employee List",
                        email:req.session.email
                    });
                }   
                else
                {
                    console.log("error in retriveing employee list"+err);
                }
            });
        } catch (error) {
            res.status(401).send(error);
        }
    }else{
        res.redirect('/login');
    }
});
//open Employee form
app.get("/student",(req,res)=>{
    try {
            res.render("create",{
                viewTitle:"Add Employee"
            });
    } catch (error) {
        console.log(`erro in opening the page ${error}`);
    }
});
//add employee data
app.post("/student/add",upload,(req,res)=>{
    try {
            var empdata=new Employee();
            empdata.Name=req.body.Name;
            empdata.Email=req.body.Email;
            empdata.Gender=req.body.Gender;
            empdata.Contactno=req.body.Contactno;
            empdata.City=req.body.City;
            empdata.pic = req.file.filename;
            empdata.save((err,docs)=>{
                if(!err)
                {
                    res.redirect("/");
                }
                else
                {
                    console.log(`erro in adding the data ${err}`);
                }
            })
    } catch (error) {
        console.log(`erro in adding the data ${error}`);
    }
});
//delete employee data
app.get("/student/delete/:id",(req,res)=>{
    try {
        const id=req.params.id;
        Employee.findByIdAndRemove(id,(err,doc)=>{
            if(!err)
            {
                console.log("Deleted");
                res.redirect('/');
            }
            else
            {
                console.log("Error in deleteing record:"+err)
            }
        });
    } catch (error) {
        console.log(`data is not delete${error}`);
    }
});
//get data on update
app.get("/student/edit/:id",(req,res)=>{
    try {
        Employee.findById(req.params.id,(err,doc)=>{
            if(!err)
            {
                res.render("edit",{
                    student:doc,
                    viewTitle:"Update Employee"
                });
            }
            else
            {
                console.log("Error in reterving data"+err);
            }
        })
    } catch (error) {
        console.log(`error on getting data by id${error}`);
    }
})
//update data employee
app.post("/student/edit/:id",(req,res)=>{
    try {
        console.log(req.params.id);
        Employee.findByIdAndUpdate({_id:req.params.id},req.body,{new:true},(err,doc)=>{
            if(!err)
            {
                res.redirect('/');
            }
            else
            {
                console.log("Error during record update"+err);
            }
        })
    } catch (error) {
        console.log(`error on updateing data by id${error}`);
    }
})

app.listen(port,()=>{
    console.log(`running on the port no ${port}`);
})