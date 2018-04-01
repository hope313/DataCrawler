const client = require('cheerio-httpcli');
const fs = require('fs');
const cheerio = require('cheerio');

let ct = require('./module/const');

let db_orient = require('./module/db_orient');

//console.log(ct.sidoGugunList);

var server = db_orient.dbconn();
var db = server.use('auction_db');

// http://www.speedauction.co.kr/v3/M_view/pageview.php?is_leftlist=&ismain=1&isnpl=&courtNo=A01&courtNo2=&eventNo1=2017&eventNo2=7881&objNo=1&partner=&teamgubun=&multiobj=&multi_no=&view=&page_mode=

  // 데이터 수집 후 html 생성(로그인 처리)
var searchGugunList = new Array();

//searchList[0] = ['D02', '2017', '9530', '1'];
//searchList[1] = ['A03', '2017', '53346', '1'];
//searchList[2] = ['A01', '2017', '7881', '1'];
searchGugunList = ['유성구'];

client.fetch('http://www.speedauction.co.kr/v3/').then(function(result) {
  var form = result.$('form[name=login]');
  var formData = {    // form.field(
    id : 'hope313',
    pw : 'speedauction313'
  };
  //console.log(form[0].attribs.action);
  form.submit(formData, function(err, $, res, body) {

    for(var s=0; s<ct.sidoGugunList.length; s++) {

      for(var g=0; g<ct.sidoGugunList[s][2].length; g++) {

        var sido = ct.sidoGugunList[s][1];
        var gugun = ct.sidoGugunList[s][2][g];

        if(sido == '대전' && in_array(gugun, searchGugunList)) {

          var sql = "SELECT * FROM t_auction_mulgun_list where sido = '" + sido + "' and gugun = '" + gugun + "' and dong = '상대동'";    // @rid.asString()
          //console.log(sql);

          db.query(sql).then(function(result) {
            //console.log(result);

            if(result.length > 0) {   // 기존 데이터가 존재하면 업데이트

              for(var item in result) {
                console.log(result[item]);

                var sagun_info = result[item].sagun_title.split('-');

                client.fetch('http://www.speedauction.co.kr/v3/M_view/pageview.php', {
                  is_leftlist : '',
                  ismain : '1',
                  isnpl : '',
                  courtNo : result[item].court_code,
                  eventNo1 : sagun_info[0],
                  eventNo2 : sagun_info[1],
                  objNo : result[item].mulbun,
                  partner : '',
                  teamgubun : '',
                  multiobj : '',
                  multi_no : '',
                  view : '',
                  page_mode : ''
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
                    console.log('speed_' + courtNo + '_' + eventNo1 + '_' + eventNo2 + '_' + objNo + '.html make!!')
                  });
                });

              }
            }
          });

          //console.log('----------------------------------------------------------------------');

        }

      }

    }

  });
});









/*
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
        is_leftlist : '',
        ismain : '1',
        isnpl : '',
        courtNo : searchList[s][0],
        eventNo1 : searchList[s][1],
        eventNo2 : searchList[s][2],
        objNo : searchList[s][3],
        partner : '',
        teamgubun : '',
        multiobj : '',
        multi_no : '',
        view : '',
        page_mode : ''
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
          console.log('speed_' + courtNo + '_' + eventNo1 + '_' + eventNo2 + '_' + objNo + '.html make!!')
        });
      });
      //console.log(searchList[s][0]);
    }
    //} else {
    //  console.log(err);
    //}
  });
});
*/

/*  // 분기 처리 페이지 접근 테스트(실패)
client.fetch('http://www.speedauction.co.kr/v3/M_view/info_result_switch.php', {
  courtNo : 'D02',
  eventNo1 : 2017,
  eventNo2 : 9530,
  objNo : 1,
  auth_key : 'c8587fefba556efae8ae81fbb878e6cd'//md5('D02201795301')
}, function(err, $, res, body) {
  console.log($.html());
  var form = $('form[name=swichF]');
  form[0].attribs.action = 'pageview.php';
  var formData = {    // form.field(
    ismain : '1'
  };
  console.log(form[0].attribs.action);
  form.submit(formData, function(err, $, res, body) {
    console.log($.html());
    //fs.writeFile('speed.html', $.html(), function(){});
  });
});
*/


/* // 단일 파일 읽기
fs.readFile('./speed.html', function(err, data){
  const $ = cheerio.load(data);

  $('b').each(function(idx) {
    //if(idx == 0) {
      console.log(idx, $(this).text()); //$(this)[0].children[0].children[0].children[0].data);
    //}
  });
  console.log('=============================');
  $('font').each(function(idx) {
    //if(idx == 0) {
      console.log(idx, $(this).text()); //$(this)[0].children[0].children[0].children[0].data);
    //}
  });

});
*/

/*  // html 이 저장되어 있는 디렉토리를 대상으로 파일 읽은 후 파싱
fs.readdir('./speed_html/', function(err, filename) {
  for(var f=0; f<filename.length; f++) {
    fs.readFile('./speed_html/' + filename[f], function(err, data){
      const $ = cheerio.load(data);

      $('b').each(function(idx) {
        //if(idx == 0) {
          console.log(idx, $(this).text()); //$(this)[0].children[0].children[0].children[0].data);
        //}
      });

    });
  }
});
*/

/*
const client = require('cheerio-httpcli');
const fs = require('fs');

var targetPage = 'http://www.speedauction.co.kr/v3/M01/info3.htm';//'./search_source.html';

client.fetch(targetPage, function(err, $, res, body){
  //console.log($('a'));
  var rText = '';
  //var rText = 'var courtNoList = new Array();\n';
  //var rText += 'var courtInfoList = new Array();\n';
  $('a').each(function(idx) {
    var href = $(this).attr('href');
    if(href.indexOf('info-list.htm') > -1) {
      //console.log(href);
      var url_info = href.split('&');
      var court_no = url_info[url_info.length-1].split('=');
      var courtNo = court_no[1];
      //console.log(courtNo, $(this)[0].children[0].children[0].data, $(this)[0].children[1].data);
      rText += courtNo + '\t' + myTrim($(this)[0].children[0].children[0].data) + '\t' + myTrim($(this)[0].children[1].data) + '\n';
    }

    //console.log(rText);
    fs.writeFile('court_list.txt', rText, function() {});
  });
});

function myTrim(x) {
  return x.replace(/^\s+|\s+$/gm,'');
}
*/

function in_array(tVal, ownArray) {
  if (typeof ownArray !== 'object') return false;
  for(var i=0; i<ownArray.length; i++) {
    if(tVal == ownArray[i]) {
      return true;
    }
  }
  return false;
}
