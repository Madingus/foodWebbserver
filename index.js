const mongo = require("mongodb")
const express = require("express")

const connectionString = "mongodb+srv://Alexander:SecurePassword123@cluster0-qcvvp.mongodb.net/test?retryWrites=true&w=majority"
const app = express()
app.listen(4800,()=>console.log("4800"))


makeConnection()









 async function makeConnection(){
    const con = await mongo.connect(connectionString,{useNewUrlParser: true, useUnifiedTopology: true})


    const db = await con.db("Food-Ab")

    app.food = await db.collection("food")

   /*  const obj = {id:123, name :"Alexander"}


    obj.food = "Lasagne";

    app.food.insertOne(obj) */




    app.get("/",(req,res)=>{
    
        res.send("hello")
            
        })
        
        app.get("/food",async (req,res)=>{
            
        
            let food = await app.food.find().toArray()
            res.send(food)
                
        })
        
        app.get("/food/create/:name/:instructions/:img",(req,res)=>{
            
           app.food.insertOne(req.params)
           res.redirect("/food")
                    
         })



 }






