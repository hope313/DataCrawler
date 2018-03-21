var client = require('cheerio-httpcli');
var fs = require('fs');
var OrientDB = require('orientjs');

var server = OrientDB({
  host : 'localhost',
  port : 2424,
  username : 'root',
  password : 'hope313'
});

var db = server.use('auction_db');

var targetURL = "http://landfuture.co.kr/workdir/upcate/kyg/rf_kyg_srch.php";
var savePath = "landfuture_search_data_daejeon.html";       // 저장 파일 명
//var savePath = "landfuture_search_data_sql.sql";       // 저장 파일 명

/*var sidoList = ['서울'];
var gugunList = ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구',
                  '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구',
                  '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'];*/
var sidoList = ['대전'];
var gugunList = new Array();
gugunList[0] = ['대덕구', '동구', '서구', '유성구', '중구'];
/*
var sidoList = ['서울', '경기', '인천', '강원', '충북', '충남', '대전', '세종',
          '전북', '전남', '광주', '경북', '경남', '대구', '울산', '부산', '제주'];

var gugunList = new Array();
gugunList[0] = ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구',
          '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'];
gugunList[1] = ['가평군', '고양시', '과천시', '광명시', '광주시', '구리시', '군포시', '김포시', '남양주시', '동두천시', '부천시', '성남시',
          '수원시', '시흥시', '안산시', '안성시', '안양시', '양주시', '양평군', '여주군', '여주시', '연천군', '오산시', '용인시', '의왕시',
          '의정부시', '이천시', '파주시', '평택시', '포천시', '하남시', '화성시'];
gugunList[2] = ['강화군', '계양구', '남구', '남동구', '동구', '부평구', '서구', '연수구', '옹진군', '중구'];
gugunList[3] = ['강릉시', '고성군', '동해시', '삼척시', '속초시', '양구군', '양양군', '영월군', '원주시', '인제군', '정선군', '철원군',
          '춘천시', '태백시', '평창군', '홍천군', '화천군', '횡성군'];
gugunList[4] = ['괴산군', '단양군', '보은군', '영동군', '옥천군', '음성군', '제천시', '증평군', '진천군', '청원군', '청주시', '충주시'];
gugunList[5] = ['계룡시', '공주시', '금산군', '논산시', '당진군', '당진시', '보령시', '부여군', '서산시', '서천군', '아산시', '연기군',
          '예산군', '천안시', '청양군', '태안군', '홍성군'];
gugunList[6] = ['대덕구', '동구', '서구', '유성구', '중구'];
gugunList[7] = ['세종'];
gugunList[8] = ['고창군', '군산시', '김제시', '남원시', '무주군', '부안군', '순창군', '완주군', '익산시', '임실군', '장수군', '전주시',
          '정읍시', '진안군'];
gugunList[9] = ['강진군', '고흥군', '곡성군', '광양시', '구례군', '나주시', '담양군', '목포시', '무안군', '보성군', '순천시', '신안군',
          '여수시', '영광군', '영암군', '완도군', '장성군', '장흥군', '진도군', '함평군', '해남군', '화순군'];
gugunList[10] = ['광산구', '남구', '동구', '북구', '서구'];
gugunList[11] = ['경산시', '경주시', '고령군', '구미시', '군위군', '김천시', '문경시', '봉화군', '상주시', '성주군', '안동시', '영덕군',
          '영양군', '영주시', '영천시', '예천군', '울릉군', '울진군', '의성군', '청도군', '청송군', '칠곡군', '포항시'];
gugunList[12] = ['거제시', '거창군', '고성군', '김해시', '남해군', '마산시', '밀양시', '사천시', '산청군', '양산시', '의령군', '진주시',
          '진해시', '창녕군', '창원시', '통영시', '하동군', '함안군', '함양군', '합천군'];
gugunList[13] = ['남구', '달서구', '달성군', '동구', '북구', '서구', '수성구', '중구'];
gugunList[14] = ['남구', '동구', '북구', '울주군', '중구'];
gugunList[15] = ['강서구', '금정구', '기장군', '남구', '동구', '동래구', '부산진구', '북구', '사상구', '사하구', '서구', '수영구', '연제구',
          '영도구', '중구', '해운대구'];
gugunList[16] = ['서귀포시', '제주시'];
*/

var sidoGugunList = [
	['A01', '서울', ['강남구', '관악구', '동작구', '서초구', '종로구', '중구']],
	['A02', '서울', ['강동구', '광진구', '성동구', '송파구']],
	['A03', '서울', ['마포구', '서대문구', '용산구', '은평구']],
	['A04', '서울', ['강서구', '구로구', '금천구', '양천구', '영등포구']]
/*	['A05', '서울', ['성북구', '강북구', '노원구', '도봉구', '동대문구', '중랑구']],
	['D01', '경기', ['가평군', '구리시', '남양주시', '동두천시', '양주시', '연천군', '의정부시', '포천시']],
	['D01', '강원', ['철원군']],
	['D02', '경기', ['고양시', '파주시']],
	['E01', '경기', ['수원시', '오산시', '용인시', '화성시']],
	['E02', '경기', ['광주시', '성남시', '하남시']],
	['E03', '경기', ['양평군', '여주군', '이천시', '여주시']],
	['E04', '경기', ['안성시', '평택시']],
	['E05', '경기', ['광명시', '시흥시', '안산시']],
	['E06', '경기', ['과천시', '군포시', '안양시', '의왕시']],
	['C02', '경기', ['김포시', '부천시']],
	['C01', '인천', ['강화군', '계양구', '남구', '남동구', '동구', '부평구', '서구', '연수구', '옹진군', '중구']],
	['F01', '강원', ['양구군', '인제군', '춘천시', '홍천군', '화천군']],
	['F02', '강원', ['강릉시', '동해시', '삼척시']],
	['F03', '강원', ['고성군', '속초시', '양양군']],
	['F04', '강원', ['원주시', '횡성군']],
	['F05', '강원', ['영월군', '정선군', '태백시', '평창군']],
	['G01', '충북', ['괴산군', '보은군', '증평군', '진천군', '청원군', '청주시']],
	['G02', '충북', ['음성군', '충주시']],
	['G03', '충북', ['단양군', '제천시']],
	['G04', '충북', ['영동군', '옥천군']],
	['H01', '대전', ['대덕구', '동구', '서구', '유성구', '중구']],
	['H01', '충남', ['금산군', '연기군']],
	['H02', '충남', ['천안시', '아산시']],
	['H03', '충남', ['공주시', '청양군']],
	['H04', '충남', ['당진군', '서산시', '태안군', '당진시']],
	['H05', '충남', ['보령시', '서천군', '예산군', '홍성군']],
	['H06', '충남', ['계룡시', '논산시', '부여군']],
  ['H01', '세종', ['세종']],
	['L01', '전남', ['나주시', '화순군', '장성군', '담양군', '곡성군', '영광군']],
	['L01', '광주', ['광산구', '남구', '동구', '북구', '서구']],
	['L02', '전남', ['고흥군', '광양시', '구례군', '보성군', '순천시', '여수시']],
	['L03', '전남', ['목포시', '무안군', '신안군', '영암군', '함평군']],
  ['L02', '전남', ['여수시']],
	['L04', '전남', ['강진군', '장흥군']],
	['L05', '전남', ['완도군', '진도군', '해남군']],
	['K01', '전북', ['김제시', '무주군', '완주군', '임실군', '전주시', '진안군']],
	['K02', '전북', ['군산시', '익산시']],
	['K03', '전북', ['남원시', '순창군', '장수군']],
	['K04', '전북', ['고창군', '부안군', '정읍시']],
	['I01', '경북', ['경산시', '영천시', '청도군', '칠곡군']],
	['I02', '경북', ['경주시', '', '']],
	['I03', '경북', ['구미시', '김천시', '']],
	['I04', '경북', ['문경시', '상주시', '예천군']],
	['I05', '경북', ['봉화군', '안동시', '영주시']],
	['I06', '경북', ['영덕군', '영양군', '울진군']],
	['I07', '경북', ['군위군', '의성군', '청송군']],
	['I08', '경북', ['울릉군', '포항시']],
	['I09', '경북', ['고령군', '성주군']],
	['J01', '경남', ['김해시', '의령군', '진해시', '창원시', '함안군']],
	['J02', '경남', ['거창군', '함양군', '합천군']],
	['J03', '경남', ['밀양시', '창녕군']],
	['J04', '경남', ['남해군', '사천시', '산청군', '진주시', '하동군']],
	['J05', '경남', ['거제시', '고성군', '통영시']],
	['J06', '경남', ['마산시']],
	['N01', '경남', ['양산시']],
	['I01', '대구', ['동구', '남구', '북구', '중구', '수성구']],
	['I09', '대구', ['서구', '달서구', '달성군']],
	['N01', '울산', ['남구', '동구', '북구', '울주군', '중구']],
	['B01', '부산', ['금정구', '동구', '동래구', '부산진구', '연제구', '영도구', '중구']],
	['B02', '부산', ['기장군', '남구', '수영구', '해운대구']],
	['B03', '부산', [('강서구', '북구', '사상구', '사하구', '서구']],
	['M01', '제주', ['서귀포시', '제주시']]*/
];

// 해당 지역 조회
for(var s=0; s<sidoGugunList.length; s++) {

  for(var g=0; g<sidoGugunList[s][2].length; g++) {

    var p = client.fetch(targetURL, {
      tt1 : '1',
      sub_menu_name : '종합검색',
      search_type : 'detail',
      FIELD_CATE : '경매',
      fcate : 'kyg',
      SW_KYUNG_ING : '1',
      //form_name : 'kyg_srch_frm',
      SAVE_SRCH_OPT : 'Y',
      pg : '1',
      s_year : '전체',
      sido : sidoGugunList[s][1],
      gugun : sidoGugunList[s][2][g],
      dong : '',
      s_date_from : '2018.02.26',
      s_date_to : '2018.05.13',
      MAIN_CATE : 'web',
      SUB_CATE : 'kyg_all_srch',
      //appt_status9 : '매각',//['신건', '유찰'],      // 입찰결과(신건, 유찰, 진행, 재진행, 매각, 대납, 취하, 변경, 정지, 항고, 기각, 종결, 각하, 기타)
      list_limit : '100'
    });

    var processCount = 0;   // 실제 처리 수
    var resultCount = 0;    // 검색 결과 수
    //var gugun = gugunList[g];   // 구/군 이름

    p.then(function(result){
      //console.log(result.$.html('tr.kyg_list_style'));
      //fs.writeFileSync(savePath, result.$.html());
      //return false;
      // 시/도, 구/군 명 검색
      var docInfo = result.$.documentInfo();
      var params = docInfo.url.split('?')[1];
      var parameters = params.split('&');
      var sidoTitle = '';
      var gugunTitle = '';

      for(var param in parameters) {
        //console.log(param + " : " + parameters[param]);
        var pValues = parameters[param].split('=');
        var pKey = pValues[0];
        var pValue = pValues[1];
        if(pKey == 'sido') sidoTitle = decodeURI(pValue);
        if(pKey == 'gugun') gugunTitle = decodeURI(pValue);
      }
      console.log(sidoTitle + " : " + gugunTitle);

      var court_code = '';

      for(var i=0; i<sidoGugunList.length; i++) {
      	var sido = sidoGugunList[i][1];
      	if(sido == sidoTitle) {
      		var gugunList = sidoGugunList[i][2];
          if(in_array(gugunTitle, gugunList)) {
            court_code = sidoGugunList[i][0];
            console.log('@@@@@@@@@@@@@@@@@@@@@', court_code);
          }
      	}
      }

      //var sido_name = decodeURI(docInfo.url.split('?')[1].split('&')[0].split('=')[1]);
      //var gugun_name = decodeURI(docInfo.url.split('?')[1].split('&')[2].split('=')[1]);

      //console.log(sido_name + " : " + gugun_name);

      var searchResultList = result.$('tr.kyg_list_style');

      console.log('searchResultList count : ', searchResultList.length);
      resultCount += searchResultList.length;
      //return false;

      if(searchResultList.length > 0) {

        //var request_sql = '';

        //var db = server.use('auction_db');

        var searchResultImgList = result.$('div.img_hidden > img');   // 이미지 정보 리스트
        var searchResultAddressList = result.$('span.address');       // 주소 정보 리스트
        //var searchResultSpecialConditionList = result.$('span.special_condition');       // 특수조건 정보 리스트
        var searchResultAreaList = result.$('span.area_txt');       // 건물/토지 면적 정보 리스트

        //var searchResultEvaPriceList = result.$('span.eva');        // 감정가 정보 리스트
        //var searchResultMinPriceList = result.$('span.min');        // 최저가 정보 리스트
        //var searchResultCostPriceList = result.$('span.cost');      // 매각가 정보 리스트

        /*------------------------------------------------------------------*/

        // 사건번호 정보 리스트
        // 용도 정보 리스트
        // 진행 여부 정보 리스트
        // 매각 기일 정보 리스트
        for(var i=0; i<searchResultList.length; i++) {

          var img_url = myTrim(searchResultImgList[i].attribs.src);
          var address = myTrim(searchResultAddressList[i].children[0].data);
          var address_info = address.split(' ');
          if(address_info.length < 3) {
            var dongTitle = '-';
          } else {
            var dongTitle = myTrim(address.split(' ')[2]);
          }
          //if(searchResultSpecialConditionList[i] !== undefined) {
          //  var special_condition = myTrim(searchResultSpecialConditionList[i].children[0].data);
          //} else {
          //  var special_condition = '-';
          //}
          if(myTrim(searchResultAreaList[i].children[0].data) !== "") {
            var area = myTrim(searchResultAreaList[i].children[0].data);
          } else {
            var area = '-';
          }
          /*
          var eval_price = myTrim(searchResultEvaPriceList[i].children[0].data).replace(/,/gi, '');
          if(searchResultMinPriceList[i].children[0].tagName == 'span') {     // 정지 상태인 경우 span 태그(<span style="color:#f44469;">정지</span>)로 구성되 있음
            var min_price = 0;    // myTrim(searchResultMinPriceList[i].children[0].children[0].data).replace(/,/gi, '');
          } else {
            var min_price = myTrim(searchResultMinPriceList[i].children[0].data).replace(/,/gi, '');
          }
          if(searchResultCostPriceList[i] != undefined) {
            var cost_price = myTrim(searchResultCostPriceList[i].children[0].data).replace(/,/gi, '');
          } else {
            var cost_price = 0;
          }
          */

          console.log("img_url : ", img_url);
          console.log("address : ", address);
          //console.log("special_condition : ", special_condition);
          console.log("area : ", area);
          //console.log("eval_price : ", eval_price);
          //console.log("min_price : ", min_price);
          //console.log("cost_price : ", cost_price);
          console.log("gugun : ", gugunTitle);
          console.log("dong : ", dongTitle);


          var dataList = searchResultList[i].children;

          // td tag list extract
          for(var j=0; j<dataList.length; j++) {
            var item = dataList[j];
            if(item.type == 'tag' && item.name == 'td') {
              // 사건번호, 물건번호
              if(j==7) {
                var sagun1 = myTrim(item.children[5].children[0].data);
                var sagun2 = myTrim(item.children[5].children[3].children[0].data);
                if(item.children[5].children[7] !== undefined) {
                  var mulbun = myTrim(item.children[5].children[7].children[0].data);
                } else {
                  var mulbun = '[1]';
                }
                console.log("court_title sagun_title : ", sagun1 + ' ' + sagun2 + ' 물번 ' + mulbun);
                //console.log('----------------------------------------------------');
              }

              // 특수 조건
              if(j==11) {
                if(item.children[1].children[27].name == 'span' && item.children[1].children[27].attribs.class == 'special_condition') {
                  var special_condition = myTrim(item.children[1].children[27].children[0].data);
                } else {
                  var special_condition = '-';
                }
                console.log('special_condition : ', special_condition);
              }

              // 용도
              if(j==15) {
                var usage = myTrim(item.children[0].data);
                if(usage == '') usage = '-';
                console.log("usage : ", usage);
                //console.log('----------------------------------------------------');
              }

              // 감정가, 입찰가, 낙찰가
              if(j==19) {
                var eval_price = myTrim(item.children[1].children[0].data).replace(/,/gi, '');  // 감정가

                if(item.children[4].children[0].name == 'span') {     // 정지 상태인 경우 span 태그(<span style="color:#f44469;">정지</span>)로 구성되 있음
                  var min_price = 0;    // myTrim(searchResultMinPriceList[i].children[0].children[0].data).replace(/,/gi, '');
                } else {
                  var min_price = myTrim(item.children[4].children[0].data).replace(/,/gi, '');   // 입찰가
                }

                if(item.children[7].name == 'span' && item.children[7].attribs.class == 'cost') {     // 낙찰가가 존재하는 경우
                  //console.log('+++cost price exists : ',  item.children[7].name + ' ' + item.children[7].attribs.class);
                  var cost_price = myTrim(item.children[7].children[0].data).replace(/,/gi, '');
                } else {
                  var cost_price = 0;
                }

                console.log('eval price :', eval_price);   // 감정가
                console.log('min price :', min_price);    // 입찰가
                console.log('cost price :', cost_price);    // 낙찰가
              }

              // 진행 여부, 유찰 회수
              if(j==23) {
                var yuchal = myTrim(item.children[2].data);     // 유찰 정보
                if(item.children[1].children[0] !== undefined) {
                  var status = myTrim(item.children[1].children[0].data);     // 상태 정보
                } else {       // 진행여부 정보가 없는 경우
                  var status = (cost_price == 0) ? '유찰' : '매각';
                }

                if(yuchal == '') yuchal = '(0)';

                // 상태 정보
                if(item.children[1].children[0] == undefined) {   // 상태 정보가 없는 경우
                  if(status == '' && yuchal == '(0)') {
                    status = '신건';
                  } else {
                    if(cost_price > 0) {
                      status = '매각';
                    } else {
                      status = '유찰';
                    }
                  }
                }
                console.log("status yuchal : ", status + ' ' + yuchal);
                //console.log('----------------------------------------------------');
              }

              // 매각 기일
              if(j==27) {
                var maegak_date = myTrim(item.children[1].children[0].data).replace(/\./gi, '-');;
                console.log("megak_date : ", maegak_date);
                //console.log('----------------------------------------------------');

                // 매각 기일이 설정된 처음 순간에만 데이터 세팅
                data_access(sagun1, sagun2, mulbun, usage, status, yuchal, maegak_date, img_url, address, special_condition, area, eval_price, min_price, cost_price, sidoTitle, gugunTitle, dongTitle, court_code);
              }
              //console.log(j, item);

            }

          }

        }
        //fs.writeFileSync(savePath, request_sql);
      }

    });

  }

}

var request_sql = '';

// DB 데이터 처리
function data_access(sagun1, sagun2, mulbun, usage, status, yuchal, maegak_date, img_url, address, special_condition, area, eval_price, min_price, cost_price, sido, gugun, dong, court_code) {
  //console.log("dataInfors", dataInfors);

  var sql = "SELECT * FROM t_auction_mulgun_list where court_title = '" + sagun1 + "' and sagun_title = '" + sagun2 + "' and mulbun = '" + mulbun + "'";    // @rid.asString()
  console.log(sql);

  console.log('----------------------------------------------------------------------');


  db.query(sql).then(function(result) {
    //console.log(result);

    if(result.length > 0) {   // 기존 데이터가 존재하면 업데이트
      var sql = "UPDATE t_auction_mulgun_list SET status= '" + status + "', yuchal = '" + yuchal + "', special_condition = '" + special_condition + "', ";
      sql += "img_url = '" + img_url + "', maegak_date = '" + maegak_date + "', min_price = '" + min_price + "', cost_price = '" + cost_price + "', ";
      sql += "sido = '" + sido + "', gugun = '" + gugun + "', dong = '" + dong + "', reg_date = SYSDATE('yyyy-MM-dd HH:mm:ss'), court_code = '" + court_code + "' ";
      sql += "WHERE court_title = '" + sagun1 + "' and sagun_title = '" + sagun2 + "' and mulbun = '" + mulbun + "'";
      console.log(sql);

      //db.query(sql).then(function(result){
      //  console.log(result);
      //});
    } else {      // 기존 데이터가 없으면 추가
      var sql = "INSERT INTO t_auction_mulgun_list(court_title, sagun_title, mulbun, usage, area, address, special_condition, status, yuchal, img_url, eval_price, min_price, cost_price, maegak_date, reg_date, sido, gugun, dong, court_code) ";
      //sql += "VALUES(:court_title, :sagun_title, :mulbun, :usage, :area, :address, :special_condition, :status, :yuchal, :img_url, :eval_price, :min_price, :maegak_date, SYSDATE('yyyy-MM-dd HH:mm:ss'))";
      sql += "VALUES ('" + sagun1 + "', '" + sagun2 + "', '" + mulbun + "', '" + usage + "', '" + area + "', '" + address + "', ";
      sql += "'" + special_condition + "', '" + status + "', '" + yuchal + "', '" + img_url + "', '" + eval_price + "', '" + min_price + "', '" + cost_price + "', '" + maegak_date + "', SYSDATE('yyyy-MM-dd HH:mm:ss'), '" + sido + "', '" + gugun + "', '" + dong + "', '" + court_code + "')";
      console.log(sql);

      /*
      var param = {
        params:{
          court_title:sagun1,
          sagun_title:sagun2,
          mulbun:mulbun,
          usage:usage,
          area:area,
          address:address,
          special_condition:special_condition,
          status:status,
          yuchal:yuchal,
          img_url:img_url,
          eval_price:eval_price,
          min_price:min_price,
          maegak_date:maegak_date
        }
      }
      */
      //db.query(sql, param).then(function(result){}
    }

    db.query(sql).then(function(result){
      processCount++;
      console.log(result + '___' + processCount + ' / ' + resultCount);
      if(processCount == resultCount) {
        process.exit(-1);
      }
    });

    request_sql += sql + '\n';

    console.log('*********************************************************************************');

    //fs.writeFileSync(savePath, request_sql);
    //return true;

  });

}

function myTrim(x) {
  return x.replace(/^\s+|\s+$/gm,'');
}
