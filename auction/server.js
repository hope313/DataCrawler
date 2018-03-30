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
const client = require('cheerio-httpcli');
const fs = require('fs');
let ct = require('./module/const');

app.use(express.static('public'));      // static directory

app.set('view engine', 'jade');         // view template
app.set('views', './views');
app.locals.pretty = true;

app.listen(3000, function() {
  console.log('Connected 3000 port');
});

var OrientDB = require('orientjs');

var server = OrientDB({
  host : 'localhost',
  port : 2424,
  username : 'root',
  password : 'hope313'
});

var db = server.use('auction_db');

app.get('/', function(req, res) {
  res.send(req.body);
  //res.render('index', function(err, html) {
  //  console.log(html);
  //});
});

//app.get('/list', function(req, res) {
//  res.render('mulgun_list', {time:Date(), _title:'Auction'});
//});

app.get(['/list', '/list/:sido/:gugun/:dong', '/list/:sido/:gugun/:dong/:pageNo'], function(req, res) {

  var sido = req.params.sido;
  var gugun = req.params.gugun;
  var dong = req.params.dong;
  var pageNo = req.params.pageNo;
  var listCount = 10;

  if(sido == undefined) sido = '서울';
  if(gugun == undefined) gugun = '마포구';
  if(dong == undefined) dong = '망원동';
  if(pageNo == undefined) pageNo = 1;

  var offset = (listCount * (pageNo -1));     // (pageNo > 1) ? (listCount * (pageNo -1)) : 0;

  var sql = "SELECT * FROM t_auction_mulgun_list ";
  var c_sql = "SELECT count(*) FROM t_auction_mulgun_list ";

  if(dong == '전체' || dong == '-' || dong == '') {
    sql += " WHERE sido = '" + sido + "' and gugun = '" + gugun + "' ";
    c_sql += " WHERE sido = '" + sido + "' and gugun = '" + gugun + "' ";
  } else {
    sql += " WHERE sido = '" + sido + "' and gugun = '" + gugun + "' and dong = '" + dong + "' ";
    c_sql += " WHERE sido = '" + sido + "' and gugun = '" + gugun + "' and dong = '" + dong + "' ";
  }

  sql += " ORDER BY maegak_date ASC ";

  // paging
  sql += " SKIP " + offset + " LIMIT " + listCount;
  //console.log(sql);

  //console.log('----------------------------------------------------------------------');

  db.query(sql).then(function(result) {
    //console.log(result);
    for(var i in result) {
      var item = result[i];

      // 매각 기일 포맷 수정
      var mDate = new Date(item.maegak_date);
      var year = mDate.getFullYear();
      var month = mDate.getMonth()+1;
      if(month < 10) month = '0' + month;
      var day = mDate.getDate();
      if(day < 10) day = '0' + day;
      //console.log(item.sagun_title, item.maegak_date, year + '-' + month + '-' + day);
      item.maegak_date = year + '-' + month + '-' + day;

      // 특수조건
      if(item.special_condition == '-') item.special_condition = '';

      // 감정가, 최저가 금액 포맷 변경
      item.min_rate = '(' + (item.min_price / item.eval_price * 100).toFixed(1) + '%)';
      item.cost_rate = '(' + (item.cost_price / item.eval_price * 100).toFixed(1) + '%)';
      item.eval_price = item.eval_price.numberFormat();
      item.min_price = item.min_price.numberFormat();
      item.cost_price = item.cost_price.numberFormat();
      if(item.cost_price == 0) {    // 매각가가 없으면 공백 처리
        item.cost_price = '';
        item.cost_rate = '';
      }
    }

    db.query(c_sql).then(function(cResult) {
      //console.log(cResult);
      var totalPage = Math.ceil(cResult[0].count / listCount);    // 총 페이지 수

      if(pageNo > 1) {      // 2페이지 이상인 경우 json type 으로 데이터 전송
        if(pageNo > totalPage) {
          res.json({result : 'nodata'});
        } else {
          res.json(result);
        }
      } else {        // 1페이지인 경우 페이지 렌더링
        res.render('mulgun_list', {listData: result, sidoList:ct.sidoList, gugunList:ct.gugunList, listConf : ct.result_list_conf, totalCount : cResult[0].count, totalPageCount : totalPage, sido:sido, gugun:gugun, dong:dong});
      }

    });
  });
});



app.get(['/view/', '/view/:cCode/:sTitle/'], function(req, res) {
  var court_code = req.params.cCode;
  var sagun_title = req.params.sTitle;

  if(!court_code || !sagun_title) {
    console.log('No data');
    res.render('mulgun_view', {msg:'wrong'})
  } else {
    console.log('==' + court_code + '___' + sagun_title + '==');

    var sql = "SELECT * FROM t_auction_mulgun_list where court_code = '" + court_code + "' and sagun_title = '" + sagun_title + "'";
    console.log(sql);

    db.query(sql).then(function(result) {
      //console.log(result);
      if(result < 1) {
        console.log('not exists!!');
        /*--------------------------------------------------------------------------*/
        client.fetch('http://www.speedauction.co.kr/v3/').then(function(result) {
          var form = result.$('form[name=login]');
          var formData = {    // form.field(
            id : 'hope313',
            pw : 'speedauction313'
          };
          //console.log(form[0].attribs.action);
          form.submit(formData, function(err, $, res, body) {
            //console.log($.html());
            //if(err !== undefined) {
            //console.log(searchList);
            for(var s=0; s<searchList.length; s++) {
              client.fetch('http://www.speedauction.co.kr/v3/M_view/pageview.php', {
                ismain : '1',
                courtNo : searchList[s][0],
                eventNo1 : searchList[s][1],
                eventNo2 : searchList[s][2],
                objNo : searchList[s][3]
              }, function(err, $, res, body) {
                var docInfo = $.documentInfo();
                var params = docInfo.url.split('?')[1];
                var parameters = params.split('&');
                //var ismain = '';
                var courtNo = '';
                var eventNo1 = '';
                var eventNo2 = '';
                var objNo = '';

                for(var param in parameters) {
                  //console.log(param + " : " + parameters[param]);
                  var pValues = parameters[param].split('=');
                  var pKey = pValues[0];
                  var pValue = pValues[1];
                  //if(pKey == 'ismain') ismain = decodeURI(pValue);
                  if(pKey == 'courtNo') courtNo = decodeURI(pValue);
                  if(pKey == 'eventNo1') eventNo1 = decodeURI(pValue);
                  if(pKey == 'eventNo2') eventNo2 = decodeURI(pValue);
                  if(pKey == 'objNo') objNo = decodeURI(pValue);
                }
                //console.log(courtNo + " : " + eventNo1 + " : " + eventNo2 + " : " + objNo);
                fs.writeFile('./speed_html/speed_' + courtNo + '_' + eventNo1 + '_' + eventNo2 + '_' + objNo + '.html', $.html(), function(){
                  console.log('speed_' + courtNo + '_' + eventNo1 + '_' + eventNo2 + '_' + objNo + '.html make!!');
                  res.render('mulgun_view', {msg:'ok'});
                });
              });
              //console.log(searchList[s][0]);
            }
            //} else {
            //  console.log(err);
            //}
          });
        });
        /*--------------------------------------------------------------------------*/
      } else {
        console.log('exists!!');
      }
    });

    //res.render('mulgun_view', {msg:'ok'})
  }
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

// 구/군 리스트 조회
app.get('/ajax/gugun/:sido', function(req, res) {
  var sido = req.params.sido;
  var sidoIndex = 0;

  for (var i=0; i<ct.sidoList.length; i++) {
    if(ct.sidoList[i] == sido) sidoIndex = i;
  }

  res.json(ct.gugunList[sidoIndex]);

});

// 동 리스트 조회
app.get('/ajax/dong/:sido/:gugun', function(req, res) {
  var sido = req.params.sido;
  var gugun = req.params.gugun;

  var sql = "SELECT distinct(dong) as dong_title FROM t_auction_mulgun_list WHERE sido = '" + sido + "' and gugun = '" + gugun + "' ORDER BY dong_title ASC";
  //console.log(sql);

  db.query(sql).then(function(result) {
    res.json(result);
  });

});

// 물건 리스트 페이지당 리스트 출력
//app.get('/ajax/list/:sido/:gugun/:dong/:pageNo', function(result) {
//  res.json(result);
//});

// 숫자 타입에서 쓸 수 있도록 numberFormat() 함수 추가
Number.prototype.numberFormat = function(){
    if(this==0) return 0;

    var reg = /(^[+-]?\d+)(\d{3})/;
    var n = (this + '');

    while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');

    return n;
};

// 문자열 타입에서 쓸 수 있도록 numberFormat() 함수 추가
String.prototype.numberFormat = function(){
    var num = parseFloat(this);
    if( isNaN(num) ) return "0";

    return num.numberFormat();
};
