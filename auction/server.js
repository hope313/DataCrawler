//const http = require('http');

/*
const hostname = '127.0.0.1';
const port = '3000';

var server = http.createServer(function(rep, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  //res.end('http server~!!');
});

server.listen(port, hostname, function() {
  console.log('http://${hostname}:${port}');
});
*/

const express = require('express');
const app = express();

app.use(express.static('public'));      // static directory

app.set('view engine', 'jade');         // view template
app.set('views', './views');
app.locals.pretty = true;

app.listen(3000, function() {
  console.log('Connected 3000 port');
});

app.get('/', function(req, res) {
  res.send(req.body);
  //res.render('index', function(err, html) {
  //  console.log(html);
  //});
});

app.get('/list', function(req, res) {
  res.render('mulgun_list', {time:Date(), _title:'Auction'});
});

app.get('/list/:sido/:gugun/:dong/', function(req, res) {
  var OrientDB = require('orientjs');

  var server = OrientDB({
    host : 'localhost',
    port : 2424,
    username : 'root',
    password : 'hope313'
  });

  var db = server.use('auction_db');

  var sido = req.params.sido;
  var gugun = req.params.gugun;
  var dong = req.params.dong;

  var sql = "SELECT * FROM t_auction_mulgun_list where sido = '" + sido + "' and gugun = '" + gugun + "' and dong = '" + dong + "'";
  //console.log(sql);

  //console.log('----------------------------------------------------------------------');

  db.query(sql).then(function(result) {
    //console.log(result);
    res.render('mulgun_list', {listData: result});    //{time:Date(), _title:'Auction'});
  });
});

/*
app.get('/ab+cd', function(req, res) {
  res.send('ab+cd');
});
*/
/*
app.get('/mulgun_list', function(req, res) {
  res.send('index!!~~');
});
*/
