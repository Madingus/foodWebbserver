const mongo = require("mongodb")
const express = require("express")
const bcrypt = require("bcryptjs")  
const cookieParser = require("cookie-parser")
const secret = require("./secret")
const jwt = require("jsonwebtoken")
const auth = require("./auth")



const connectionString = "mongodb+srv://Alexander:SecurePassword123@cluster0-qcvvp.mongodb.net/test?retryWrites=true&w=majority"
const app = express()
app.listen(4800,()=>console.log("4800"))
app.use(express.urlencoded({extended:false}));
app.use(cookieParser())

makeConnection()


 async function makeConnection(){
    const con = await mongo.connect(connectionString,{useNewUrlParser: true, useUnifiedTopology: true})


    const db = await con.db("Food-Ab")

    app.food = await db.collection("food")

   /*  const obj = {id:123, name :"Alexander"}


    obj.food = "Lasagne";

    app.food.insertOne(obj) */


    app.get("/showfood",(req,res)=>{
        let food = "all food"
        res.send(food)


    })

    app.get("/",(req,res)=>{
    
        res.send("hello")
            
        })
        
        app.get("/food",auth ,async (req,res)=>{
            
        
            let food = await app.food.find().toArray()
            res.send(food)
                
        })
        
        app.get("/food/create/:name/:instructions/:img",(req,res)=>{
            
           app.food.insertOne(req.params)
           res.redirect("/food")
                    
         })


app.get("/login",function(req,res){
    res.sendFile(__dirname+"/loginForm.html");
});

app.post("/login",function(req,res){


    //hitta användare

    const users = require("./users")

    const user = users.filter(function(u){

        if(req.body.email === u.email){

            return true
        }
    })

// om vi har exakt en användare med rätt email
   if(user.length === 1){

    //kolla lösenord

    bcrypt.compare(req.body.password, users[0].password, function(err,success){


        if(success){

           //ger token till personen om hannes skriver in rätt kredentialer

           
           const token = jwt.sign({email:user[0].email}, secret, {expiresIn:60})
            res.cookie("token",token,{httpOnly:true, sameSite:"strict"} )
            res.send("login success!")

        }
        else{
            res.send("wrong password")
        }


    })

   }
   else {
       res.send("no such user")
   }
    
  




    /**
     * 1. hämta data som klienten skickat ( Repetition )
     * 2. Leta efter användare i databas/fil/minne
     * 3. Om användare ej finns skicka respons till klient med error
     * 4. Om användare finns gå vidare med att kolla lösenord
     * 5. Om löserord ej är korrekt skicka respons till klient med error
     * 6. Om lösenord är korrekt - Skicka respons/redirect 
     * 7. Nu när användaren är inloggad måste hen förbli så ett ta
     *    Detta löser vi med JWT.
     *    Skapa JWT och lagra i cookie innan din respons/redirect
     * 8. Skapa middleware för att skydda vissa routes.
     *    Här skall vi nu använda våra JWT för att hålla en användare inloggad. 
     * 9. Småfix för att förbättra säkerhet och fixa utloggning. 
     */

    /* res.send(`Route för att hantera själva inloggningen.<br>
    En del av detta kommer att ske i middleware`); */

});

 }






