const express = require('express');
const jwt = require("jsonwebtoken");
const users = require("./users");
const argon2 = require("argon2");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use("/api", verifyToken);

app.get('/hello', (req, res) => {
    res.json({
        "message": "Hello"
    })
});

app.get('/api/secure/msg', (req, res)=>{
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            console.log(err);
            res.sendStatus(403);
        }
        else{
            const {password, ...withoutPassword} = authData
            res.json({
                message: "protected Message",
                user: withoutPassword
            })
        }
    });

});

app.post('/login', async(req, res) => {
    console.log("Login for: ", req.body);
    const {email, password} = req.body;
    if( email && password){
        const user = findOne(email);
        const verifyPassword = await argon2.verify(user.password, password);
        if(verifyPassword){
            jwt.sign({user:user}, 'secretkey', {"expiresIn": "60s"}, (err, token) => {
                if(err){res.status(500).end()};
                res.json({
                    token,
                })
            });
        }
        else{
            res.status(401).end();
        }
    }
    else {
        res.status(400).end();
    }   
});

app.post("/register", async(req, res) => {
    const {email, username, password} = req.body;
    const hash = await argon2.hash(password);
    console.log("hash: ", hash);
    users.push({email,username,password: hash});
    console.log()
    res.status(201).end();

});

function findOne(user){
    return users.find((u)=> u.email == user);
}
function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization']
    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    }
    else{
        res.sendStatus(401);
    }

}

const PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
    console.log("Server starts", PORT);
})

