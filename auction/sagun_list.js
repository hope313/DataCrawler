var client = require('cheerio-httpcli');
var OrientDB = require('orientjs');

var server = OrientDB({
  host : 'localhost',
  port : 2424,
  username : 'root',
  password : 'hope313'
})

var db = server.use('auction_db');

/*
var sql = "SELECT * FROM t_auction_mulgun_list WHERE sido= '대전' AND gugun = '유성구' ORDER BY maegak_date ASC";

db.query(sql).then(function(result) {
  console.log(result);
  //process.exit(-1);
});
*/

var sql = 'SELECT * FROM t_auction_mulgun_list WHERE @rid=:rid';
var param = {
  params: {rid:'#20:303'}
}
db.query(sql, param).then(function(result) {
  console.log(result);
});
