var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;
var crypto=require('crypto');
var bodyParser = require('body-parser');

var db_config = {
  host: 'db.imad.hasura-app.io',
  user: 'vidhiyakar',
  password: process.env.DB_PASSWORD,
  database: 'vidhiyakar',
  port: '5432'
};
var pool = new Pool(db_config);
var app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());

var updatePageVisit=function(count){
    count++;
    pool.query("update info set value='"+count.toString()+"' where field='visitcount'",function(err,result)
    {
       if(err){
           res.send("error");
       } 
    });
}
app.get('/pagevisited', function (req, res) {
    pool.query("SELECT value FROM info where field='visitcount'",function(err,result)
    {
    if(err)
    {
        res.status(500).send(err.toString());
    }
    else
    {
        var visitcount=result.rows[0].value;
        updatePageVisit(visitcount);
        res.send(visitcount);
    }
    });
});
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/bgp.jpg',function(req, res){
   res.sendFile(path.join(__dirname, 'ui', 'bgp.jpg')); 
});

app.get('/dp.png',function(req, res){
   res.sendFile(path.join(__dirname, 'ui', 'dp.png'));
});

app.get('/logo.png',function(req, res){
   res.sendFile(path.join(__dirname, 'ui', 'logo.png'));
});

function hash(input,salt){
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pkbdf2", "10000",salt, hashed.toString('hex')].join('$');
}
app.get('/hash/:input',function(req,res){
   var hashedString= hash(req.params.input,'senthil-vidhiyakar-is-my-name');
   res.send(hashedString);
});
app.get('/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/BluetoothChat.apk', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'BluetoothChat.apk'));
});

app.get('/BluetoothTransfer.apk', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'BluetoothTransfer.apk'));
});

app.get('/resume',function(req,res){
  res.sendFile(path.join(__dirname,'ui','resume.html'))  
});

app.post('/createuser',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var hashedPwd = hash(password,salt);
    pool.query("insert into users (username,password) values($1,$2)",[username,hashedPwd],function(err,result){
       if(err){
           res.status(500).send(err.toString());
       } else{
           res.send("User creation successfull:"+username);
       }
    });
});
app.get('/main.js', function(req,res){
   res.sendFile(path.join(__dirname,'ui','main.js'));
});

app.get('/logincheck/:input',function(req,res){
    var input=req.params.input.split('$');
    res.send(input);
    var username=input[0];
    var password = input[1];
    console.log('login endoint called');
    pool.query("select * from users where username=$1",[username],function(err,result){
       if(err){
           res.status(500).send(err.toString());
       } else{
           if(result.rows.length === 0){
             console.log('user not found');
             res.send("user not found");
           }else{
             var dbString = result.rows[0].password;
             var salt = dbString.split('$')[2];
             var hashedPwd = hash(password,salt);
             if(dbString === hashedPwd){
               console.log('login success');
               res.send("Success");
             }else{
               console.log('wrong password');
               res.send(403).send("Wrong password");
             }
           }
       }
    });
});
var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
