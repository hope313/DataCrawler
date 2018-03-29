const OrientDB = require('orientjs');

// orientDB Connection info
const db_info = {
  host : 'localhost',
  port : 2424,
  username : 'root',
  password : 'hope313'
};

function dbconn(host, port, id, pwd) {
  if(host == undefined) host = db_info.host;
  if(port == undefined) port = db_info.port;
  if(id == undefined) id = db_info.username;
  if(pwd == undefined) pwd = db_info.password;

  return OrientDB({
    host : host,
    port : port,
    username : id,
    password : pwd
  });
}
/*
async function execute(db, sql) {
  if(sql == undefined || sql == '') {
    return '00000000';//false;
  } else {
    db.query(sql).then(function(result) {
      //console.log(result);
      return '111111';// + result;
    });
  }
}
*/
module.exports.dbconn = dbconn;
//module.exports.execute = execute;
