var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;
var crypto=require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

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
app.use(session({
    secret : 'someRandomSecretValue',
    cookie : {
        maxAge : 1000*60*60*24*30
    }
}));

var updatePageVisit=function(count){
    count++;
    pool.query("update info set value='"+count.toString()+"' where field='visitcount'",function(err,result)
    {
       if(err){
           res.send("error");
       } 
    });
}

app.get('/blogit/:title/:content/:datestring',function(req,res){
    var author_id=req.session.auth.userId.toString();
    var title=req.params.title.toString();
    var content = req.params.content.toString();
    var dateString = req.params.datestring.toString();
    pool.query("insert into articles(author_id,title,content,date) values($1,$2,$3,$4)",[author_id,title,content,dateString],function(err,result){
       if(err){
           res.status(500).send(err.toString());
       }else{
           res.send('Post successful');
       } 
    });
}); 

app.get('/getcomments',function(req,res){
    pool.query("select * from comment",function(err,result){
       if(err){
           
       }else{
           var count=result.rows.length;
           var commentTable="<table style='text-align:left; margin:0px' class='content' width='100%'><tr><td width='30%'></td><td></td></tr>";
           for(var i=0;i<count;i++){
               commentTable+="<tr style='margin-bottom:10px'><td>"+result.rows[i].username+"</td><td><span style='display:block;word-wrap:break-word;'>"+result.rows[i].comment+"</span></td></tr>";
           }
           commentTable+="</table>";
           res.send(""+commentTable);
       }
       
    });
});

app.get('/getarticles',function(req,res){
    pool.query("select article_id,author_id,username,title,comment,date from articles a, users u where a.author_id=u.id",function(err,result){
       if(err){
           res.send("error");
       }else{
           var count=result.rows.length;
           var timelineTable=""
           for(var i=0;i<count;i++){
               timelineTable+=""+result.row[i].article_id+","+result.row[i].author_id+","+result.row[i].username+","+result.row[i].title+","+result.row[i].content+","+result.row[i].date+"<br/>";
           }
           res.send(""+timelineTable);
       }
       
    });
});

app.get('/addcomments/:input', function (req, res) {
    var commentText=req.params.input.toString();
    var username=req.session.auth.name.toString();
    pool.query("insert into comment(username,comment) values($1,$2)",[username,commentText],function(err,result)
    {
    if(err)
    {
        res.status(500).send(err.toString());
    }
    else
    {
        res.send('Comment Added');
    }
    });
});

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

function hash(input,salt){
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pkbdf2", "10000",salt, hashed.toString('hex')].join('$');
}

app.get('/hash/:input',function(req,res){
   var hashedString= hash(req.params.input,'senthil-vidhiyakar-is-my-name');
   res.send(hashedString);
});

app.get('/addarticles', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'addarticles.html'));
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

app.get('/signupuser/:input',function(req,res){
  var input=req.params.input.split('$');
    var username = input[0].toString();
    var password = input[1].toString();
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

app.get('/comment',function(req,res){
    res.sendFile(path.join(__dirname,'ui','comment.html'));
});

app.get('/login/:input',function(req,res){
    var input=req.params.input.split('$');
    var username=input[0];
    var password = input[1];
    console.log('login endoint called');
    pool.query("select * from users where username=$1",[username],function(err,result){
       if(err){
           res.status(500).send(err.toString());
       } else{
           if(result.rows.length === 0){
             res.status(403).send("No user found");
           }else{
             var dbString = result.rows[0].password;
             var salt = dbString.split('$')[2];
             var hashedPwd = hash(password,salt);
             if(dbString === hashedPwd){
                 req.session.auth={userId : result.rows[0].id, name : username};
               res.send("Logged in as "+username);
             }else{
               res.status(403).send("Wrong password");
             }
           }
       }
    });
});

app.get('/checklogin',function(req,res){
    if(req.session && req.session.auth && req.session.auth.userId){
        res.send('Logged in as '+req.session.auth.name.toString()+" ");
    }else{
        res.status(403).send('You are not logged in');
    }
});

app.get('/logout',function(req,res){
   delete req.session.auth;
   res.send('You are logged out');
});

app.get('/:input', function(req,res){
   res.sendFile(path.join(__dirname,'ui',req.params.input));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
