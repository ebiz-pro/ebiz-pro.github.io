var _domainPath = "";
var _host = "";

/**
 * SSO 함수 호출 전 초기화 처리
 * 
 * @date 2017.01.04
 * @author bklee
 * @example gfnSsoInit()
 */
function gfnSsoInit(){
	
	var getRequestURL = location.href ;
	_host = location.host;
	_domainPath = getRequestURL.substring(0, getRequestURL.indexOf(_host))+_host ;

	// console.log('_host = ' + _host + ', _domainPath = ' + _domainPath);
	if(_host.indexOf('local') > -1){
		_host = 'pcw-dev.eqlstore.com';
		_domainPath = 'http://pcw-dev.eqlstore.com';
		// console.log('로컬테스트 : 강제로 바꿔줌 : _host = ' + _host + ', _domainPath = ' + _domainPath);
	}
}

//토큰 발급 요청 : mcustNo(통합고객번호), ssoAuthCd(권한코드)
function gfnReqSSoToknIssuAjax(mcustNo, ssoAuthCd)
{
	//console.log("test : "+mcustNo + ' , ' + ssoAuthCd + ' , ' + _domainPath + ' , ' + _host);
	gfnSsoInit();
	var httpUrl = hpoint_sso_url + "/co/setSsoToknIssuJSONP.hd";
	 $.ajax({
			url: httpUrl,
			type: "POST",
			contenType: "application/json",
			data: {"mcustNo":mcustNo, "ssoAuthCd":ssoAuthCd , "domainPath":_domainPath, "dmnAdr":_host},
			dataType: "jsonp",
			async:true,
			xhrFields: {
				withCredentials : true
			}, 
			success : function (data, data2, data3) {
				//console.log("test : "+data);
				//console.log("test : "+data2);
				//console.log("test : "+data3.responseText);
				//fnSsoToknIssuCallback2(data.succYn);
				},
			error : function (data,data2, data3) {
			}
		});
}

//SSO 요청후 sso 인증 성공시 고객번호 리턴
function gfnSsoReqAjax(callback)
{
	gfnSsoInit();
	var httpUrl = hpoint_sso_url + "/co/setSsoReqJSONP.hd";
	 $.ajax({
		url: httpUrl, 
		type: "POST",
		contenType: "application/json",
		data: {"domainPath":_domainPath, "dmnAdr":_host},
		dataType: "jsonp",
		async:true,
		xhrFields: {
			withCredentials : true
		},
		success : function (data, data2, data3) {
			// console.log('암호화된 통합고객번호 : '+data.mcustNo);
			if(callback && typeof callback == "function"){
				callback(data);
			}
		},
		error : function (data,data2, data3) {
			// console.log('통신 error : ' + data);
			if(callback && typeof callback == "function"){
				callback(data);
			}
		}
	});
}

// SSO 토큰 만료처리
function gfnSsoDscdToknReqAjax(callback)
{
	gfnSsoInit();
	$.support.cors = true;
	var httpUrl = hpoint_sso_url + "/co/setDscdToknJSONP.hd";
	$.ajax({
		url: httpUrl,
		type: "POST",
		contenType: "application/json",
		data: {"domainPath":_domainPath, "dmnAdr":_host, "callback":callback.name},
		async:true,
		crossDomain:true,
		cache:false,
		dataType: "jsonp",
		jsonp: callback.name,
		xhrFields: {
			withCredentials : true
		},
		success : function (data) {
			if(typeof callback == "function"){
				showAlert2("회원탈퇴가 완료되었습니다. 이용해주셔서 감사합니다.","알림",function() {callback(data);});
				
			}
		},
		error : function (data) {
			// console.log('통신 error : ' + data);
			if(typeof callback == "function"){
				callback(data);
			}
		}
	});
}