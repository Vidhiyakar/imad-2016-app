var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var visitcount=0;
app.get('/pagevisited', function (req, res) {
    visitcount++;
  res.send(visitcount.toString());
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

app.get('/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
