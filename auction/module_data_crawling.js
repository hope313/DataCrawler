let ct = require('./module/const');
let db_orient = require('./module/db_orient');

console.log(ct.sidoGugunList);

var server = db_orient.dbconn();
var db = server.use('auction_db');

//console.log(db);
var sql = "SELECT * FROM t_auction_mulgun_list where sido = '서울' and gugun = '마포구' and dong = '망원동' ORDER BY maegak_date ASC";
//console.log(sql);

//console.log('----------------------------------------------------------------------');

db.query(sql).then(function(result) {
  console.log(result);
});
