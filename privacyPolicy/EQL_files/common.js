//////////////// 개발 코드 //////////////////////////

//////////////////팝업 //////////////////////////////
/**
 * 팝업호출 
 */ 
function openCommonPopup(actionUrl, params, pWidth, pHeight, winNm) {
    if ( actionUrl != undefined ) {
        var winName = "Pop";
        if ( winNm != undefined ) {
            winName = winNm;
        }
        if ( pWidth == undefined ) {
            pWidth = 680;
        }
        if ( pHeight == undefined ) {
            pHeight = 660;
        }
        openPopup(actionUrl, params, winName, pHeight, pWidth);
    }
}

/**
 * 팝업호출
 * @param url, params, windowName, iHeight, iWidth
 * @returns
 */
function openPopup(url, params, windowName, iHeight, iWidth) {
	try {
		var winl   = (screen.width - iWidth) / 2;
	    var wint   = (screen.height - iHeight) / 2 - 50;
	    var option = 'location=0,status=0,toolbar=0,statusbar=0,scrollbars=yes,resizable=no,left='+winl+',top='+wint+',width='+iWidth+',height='+iHeight;
	    var form   = createForm(params);
	    var newWin = window.open('', windowName, option);

	    submitPopup(form, url, windowName);
	    discardForm(form);

	    newWin.opener = this;
	    return newWin;
	} catch(e){}
}

function submitPopup(formObj, url, targetName, postGet) {
    formObj.action = url;
    formObj.method = "POST";
    if (typeof(postGet) != "undefined") {
        formObj.method = postGet;
    }
    formObj.target = targetName;
    formObj.submit();
}

/**
 * form 생성
 * @param params
 * @returns {___anonymous1576_1576}
 */
function createForm(params) {
    var f = document.createElement("FORM");
    f.method = "POST";
    document.body.appendChild(f);

    if (typeof(params) != "undefined") {
        for (key in params) {
            var value = params[key];

            addHidden(f, key, value);
        }
    }

    var csrfToken = $("meta[name='_csrf']").attr("content");
    var csrfName = $("meta[name='_csrf.parameter']").attr("content");

    addHidden(f, csrfName, csrfToken);

    return f;
}

/**
 * FORM 에 HIDDEN 값 삽입
 * @param f
 * @param key
 * @param value
 */
function addHidden(f, key, value) {
    var el = document.createElement("INPUT");
    el.type = "hidden";
    el.name = key;
    el.value = value;

    f.appendChild(el);
}

/**
 * FORM 삭제
 * @param formObj
 */
function discardForm(formObj) {
    document.body.removeChild(formObj);
}

/**
 * trim
 * @param str
 * @returns
 */
function trim(str){
	var strTrim = str.replace(/\s+$/, "");
	return strTrim;
}

/**
 * @param {Object} url		- url
 * @param {Object} params	- 파라미터
 */
function jsLinkUrlPost(url, params) {
    method = "post";
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", url);
    for(var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);
        form.appendChild(hiddenField);
    }
    document.body.appendChild(form);
    form.submit();
}

/**
 * 팝업호출
 *
 * @param url
 * @param params
 * @param windowName
 * @param iHeight
 * @param iWidth
 */
function openPopupGet(url, params, windowName, iHeight, iWidth){
    var popupX  = (screen.availWidth - iWidth)/2 ;
    var popupY  = (screen.availHeight - iHeight)/2 ;
    var popupSet  = "top=" + popupY + ",left=" + popupX + ",width=" + iWidth + ",height=" + iHeight + ",history=no,toolbar=no,menubar=no,resizable=no,status=no,scrollbars=yes" ;
    var param = "?";
    for(var key in params){
        var val = params[key];
//		param += key + "=" + URLEncode(val) + "&";
        param += (key + "=" + urlEncodeIfNecessary(val) + "&");
    }
    param = param.substring(0, param.length - 1);
    window.open(url + param, windowName, popupSet);
}

function urlEncodeIfNecessary(s) {
    var regex = /[\\\"<>\.;]/;
    var hasBadChars = regex.exec(s) != null;
    return hasBadChars && typeof encodeURIComponent != 'undefined' ? encodeURIComponent(s) : s;
}

function zipcodePop(zipcodeId, baseAddrId){
    var params = new Object();
    params.zipcodeId = zipcodeId;
    params.baseAddrId = baseAddrId;
    openCommonPopup('/public/member/searchZipcode.popup', params, 840, 720, 'zipcode');
}

function zipcodePopWithQuickDlv(zipcodId, baseAddrId){

    var params = new Object();
    params.zipcodeId = zipcodId;
    params.baseAddrId = baseAddrId;

    // 퀵배송 여부
    params.qdlvYn = "Y";

    openCommonPopup('/public/member/searchZipcode.popup', params, 840, 720, 'zipcode');

}

/**
 * 우편번호 화면에서 선택한 주소를 전달할 Target Index 를 지정한다.
 * @param zipcodeId
 * @param baseAddrId
 * @param targetSeq
 */
function zipcodePopWithCallback(targetSeq){
    var params = new Object();
    params.targetSeq = targetSeq;
    openCommonPopup('/public/member/searchZipcode.popup', params, 840, 720, 'zipcode');
}

//글로벌 로딩 레이어
function onLoadingLayer(){
    $('.fullLayerLoadWrap').css('display','block');
    scrFix(true);
}
function offLoadingLayer(){
    $('.fullLayerLoadWrap').css('display','none');
    scrFix(false);
}
//팝업이나 로딩바 나올때 스크롤 제어, vsb:true -> 스크롤 없앰, vsb:false -> 스크롤 생김
function scrFix(vsb){
/*    var scrW=0, scrH=0, scrT=$(window).scrollTop(), scrL=$(window).scrollLeft(), rValue=[];
    if(vsb){
        $('html').css('overflow-y','scroll');
        scrW=$('body').width();
        scrH=$('body').height();
        $('.fixed').each(function(i){
            rValue[i]=$('body').width()-($(this).offset().left+$(this).outerWidth());
        });
        $('html').css('overflow-y','hidden');
        scrW-=$('body').width();
        scrH-=$('body').height();
        $('.fixed').each(function(i){
            rValue[i]-=scrW;
            $(this).css('right',rValue[i]);
        });
        $('.allWrap').addClass('on').css({'margin-right':-scrW,'padding-bottom':-scrH});
        $(window).scrollLeft(scrL);
        $(window).scrollTop(scrT);
    }else{
        if($('.suit_finder').length == 0){
            $('html').css('overflow-y','scroll');
        }
        $('.allWrap').removeClass('on').css({'margin-right':0,'padding-bottom':0});
        $(window).scrollLeft(scrL);
        $(window).scrollTop(scrT);
        $('.fixed').each(function(i){
            $(this).css('right',0);
        });
    }*/
}

/**
 * 입력값을 콤마가 포함된 문자열로 변환하여 리턴
 * @param str   숫자
 * @return ret  콤마를 추가한 숫자
 */
function strAddComma(val) {
    var ret;

    //숫자앞에 있는 "0"을 먼저 삭제함. - 2004.9.12
    var numstr = val + "";
    var rxSplit = new RegExp('([0-9])([0-9][0-9][0-9][,.])');
    var arrNumber = numstr.split('.');
    arrNumber[0] += '.';
    do {
        arrNumber[0] = arrNumber[0].replace(rxSplit, '$1,$2');
    }
    while (rxSplit.test(arrNumber[0]));

    if (arrNumber.length > 1) {
        ret = arrNumber.join('');
    } else {
        ret = arrNumber[0].split('.')[0];
    }

    return ret;
}

/*
    매장찾기 팝업

    @param svcType : pkup / repair / offline

 */
function searchStorePop(svcType, brndGrpId){

    var strParams = null;

    if(svcType =='pkup'){

        var itmNoArr = [];
        var itmQtyArr = [];
        var godTpCd = $("#godTpCd").val();
        var exit = false;

        // 픽업 주문, 품절 상품 선택시 불가 alert 노출
        if(godTpCd == 'SET_GOD' || godTpCd == 'PCKAGE_GOD'){

            // 기본구성품 체크
            $("div[id^='optSelect']").find(".box").find("em").each(function(){
            	if($(this).text().indexOf('품절임박') == -1 ){
            		if($(this).text().indexOf('품절') != -1){
                        openAlert(shop_pick_disable);
                        exit = true;
                        return false;
                    }
            	}
            });

            //추가구성품 체크
            $("#aditGodSelectDiv").find(".box").find("em").each(function(){
            	if($(this).text().indexOf('품절임박') == -1 ){
	                if($(this).text().indexOf('품절') != -1){
	                	openAlert(shop_pick_disable);
	                    exit = true;
	                    return false;
	                }
            	}
            });

        }else{
            if($("#sizeItmNo"+$("#itmNo0").val()).attr("invQtyPkupShop") < 1){ // 선택한 옵션의 재고가 0이면
            	openAlert(shop_pick_disable);
                exit = true;
                return false;
            }
        }

        if(exit) return; // 재고 없으면 종료

        $('[name=itmNo]').each(function(index) {

          if($(this).val() !=''){
              itmNoArr.push($(this).val());
              itmQtyArr.push($("#qty").val());
           }

        });

        //추가 구성 상품
        if($('#addItmNo').length > 0 && $('#addItmNo').val()!=''){
            itmNoArr.push($('#addItmNo').val());
            itmQtyArr.push($("#additQty").val());
        }

        strParams = {'svcType' : svcType, 'itmNoArr':itmNoArr.toString(),'godTpCd':godTpCd, 'godNo':_godNo, 'brndId':$('#brndId').val(),'qtyCnt':$('#qty').val(),'itmQtyArr':itmQtyArr.toString()};

    }else{

        var cpstGodNoArr = null;
        var cpstErpGodNoArr = null;
        var godTpCd = $('#godTpCd').val();

        if(godTpCd == 'SET_GOD' && svcType != 'repair' ){//세트 상품일 경우 구성상품 번호 배열 형식
            cpstGodNoArr = new Array($('[name=cpstGodNo]').length);
            cpstErpGodNoArr = new Array($('[name=cpstErpGodNo]').length);

            $('[name=cpstGodNo]').each(function(index){
                cpstGodNoArr[index] = $(this).val();
            });

            $('[name=cpstErpGodNo]').each(function(index){
                cpstErpGodNoArr[index] = $(this).val();
            });

            strParams = {'svcType' : svcType,'godNo' : $('#bskGodGodNo').val(),'erpGodNo' :$("#storeErpGodNo").val(), 'cpstErpGodNoArr' : cpstErpGodNoArr.toString(),  'godTpCd':godTpCd, 'cpstGodNoArr' : cpstGodNoArr.toString(), 'brndId':$('#brndId').val(), 'brndNm':$('#brndNm').val()};
        }else{

            if(brndGrpId == null || brndGrpId == ''){
                brndGrpId = $('#brndGrpId').val();
            }
            if(svcType == 'repair'){
                godTpCd = 'REPAIR';
            }
            strParams = {'svcType' : svcType,'godNo' : $('#bskGodGodNo').val(),'erpGodNo' :$("#storeErpGodNo").val(), 'godTpCd':godTpCd, 'brndNm':$('#brndNm').val(), 'brndId':brndGrpId};
        }
    }

    console.log(strParams);
    openPop("/public/goods/detail/searchStorePop", "POST", strParams);

}

/*
매장보기 팝업
 */
function viewStorePop(shopId) {
    var params = new Object();
    params.shopId = shopId;
    var baseContext = "";

    openPopupGet(baseContext + '/public/common/viewStorePop', params, 'storeMap', 930, 1050);
}

/*
매장보기 팝업 (레이어)
 */
function viewStoreLayerPop(shopId){
    var params = new Object();
    params.shopId = shopId;

    openPop("/public/common/viewStoreLayerPop", "", params);
}

/**
 * get data from cookie
 */
function getCommonCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

/**
 * save data to cookie
 */
function setCommonCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; path=/; " + expires;
}

//Set selectbox
function setSelectBox_Pop(){
    var $selParent;
    /*select box selected*/
    $('.shop .select').each(function(){
        if($(this).find('li').hasClass('selected')){
            $(this).find('label').html($(this).find('li.selected a').html());
            $(this).find('input').val($(this).find('li.selected a').attr('data-value'));
        }
        $('.shop .select:not(.disabled)').off('click').on('click',function(){
            if($(this).hasClass('over')){
                $(this).removeClass('over');
                $(this).find('.arrow').removeClass('on');
                $selParent?$selParent.css('z-index','auto'):false;
            }else{
                $selParent?$selParent.css('z-index','auto'):false;
                $selParent=$(this).parents('ul').length>0?$(this).parents('li'):undefined;
                $('.shop .select').removeClass('over');
                $('.shop .select').find('.arrow').removeClass('on');

                $(this).addClass('over');
                $(this).find('.arrow').addClass('on');
                $selParent?$selParent.css('z-index',1):false;
            }
            return false;
        });
        /*select box contents click*/
        $('.shop .option li').off('click').on('click',function(e){
            if($(this).is('.title')) return false;
            if($(this).is('.disabled')) return false;
            if($(this).is('.group')) return false;
            $(this).parents('.select').find('label').html($(this).find('a').html());
            $(this).parents('.select').find('input').val($(this).find('a').attr('data-value'));
            $(this).parent().find('li').removeClass('selected');
            $(this).addClass('selected');
        });
    });
}

//팝업공지 오늘만 보기 쿠키 설정
function createCookieTodayStop(popupNotiSn, dspEndDt) {
    var from_dt = new Date();
    var year = from_dt.getFullYear();
    var month = from_dt.getMonth();
    var day = from_dt.getDate();

    if (dspEndDt != undefined) {
        var endDate = dspEndDt.split("-");

        if (endDate.length == 3) {
            year = Number(endDate[0]);
            month = Number(endDate[1]) - 1;
            day = Number(endDate[2]);
        }
    }

    var to_dt = new Date(year, month, day + 1, 0, 0, 0);
    var expires = "expires=" + to_dt.toUTCString();
    var cname = "TODAY_STOP_" + popupNotiSn;
    document.cookie = cname + "=Y; path=/; " + expires;
}

// Cookie
function getCookie(varname) {
    varname += "=";
    startpos = document.cookie.indexOf(varname);
    if (startpos >= 0) {
        startpos += varname.length;
        endpos = document.cookie.indexOf(";", startpos);
        if (endpos == -1) endpos = document.cookie.length;
        return unescape(document.cookie.substring(startpos, endpos));
    }
}

function setCookie( name, value, expiredays, domain ) {
    var todayDate = new Date();
    todayDate.setDate( todayDate.getDate() + expiredays );
    var cookies = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";";
    if(typeof(domain) !== 'undefined'){
        cookies += 'domain=' + domain + ';';
    }
    document.cookie = cookies;
}

function deleteCookie(name, domain){
    var del = '';
    if(domain == '' && domain == null && typeof(domain) == 'undefined'){
        del = name + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;'
    }else{
        del = name + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT; path=/; domain=' + domain + ';';
    }
    document.cookie = del;
}

function createTodayStop(popupNotiSn, dspEndDt){
    var checked = $('#popCookie'+popupNotiSn).is(':checked');
    if(checked){
        createCookieTodayStop(popupNotiSn, dspEndDt);
    }
    $('popWrap_'+popupNotiSn).remove();
}

//컨텐츠 숨기기
function hideContent(conId, delay){
    conId = "#"+conId;
    setTimeout(function(){
        $(conId).fadeOut("slow");
    }, delay);
}

function getInternetExplorerVersion() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    var rv = -1;

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
        if (isNaN(parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))))) {
            //For IE 11 >
            if (navigator.appName == 'Netscape') {
                var ua = navigator.userAgent;
                var re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
                if (re.exec(ua) != null) {
                    rv = parseFloat(RegExp.$1);
                }
            }else{
                //alert('otherbrowser');
            }
        }
        else {
            //For < IE11
            rv = parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
        }
    }
    return rv;
};

/**
 * 더블클릭 방지
 */
var doubleClickFlag = false;
function doubleClickCheck(){
    if(doubleClickFlag){
        return doubleClickFlag;
    } else {
        doubleClickFlag = true;
        return false;
    }
}

function goToEncodeUrl(url){
    location.href = encodeURI(url);
}

//상품상세 이동
function goGodDetail(url, reviewYn){

    //var url = "/"+brndNm+"/"+godNo+"/good";

    //상품상세 레이어 호출
    $.ajax({
        type : "GET",
        url : url,
        data : {"layerYn" : "Y", "reviewViewYn" : reviewYn},
        beforeSend: function(request) {
            var csrfToken = $("meta[name='_csrf']").attr("content");
            var csrfName = $("meta[name='_csrf_header']").attr("content");
            request.setRequestHeader(csrfName, csrfToken);
        },
        success : function(data) {
            $("#prodGridDetailWrap").html(data);
            successGoGodDetail();
            setGodDetailRefererUrl(url);
            history.replaceState('','', url);
        },
        error : function(jqXHR, textStatus, errorThrown) {
            showAlert("조회실패");
            $("#prodGridDetailWrap").html();
            if($(".btn-close-detail").length){
                $(".btn-close-detail").trigger("click");//상품상세 닫기
            }
        }
    });

}


function goRecomDetail(obj) {
    var godNo = $(obj).attr("godNo");
    var clickLogUrl = $(obj).attr("clickLogUrl");

    //traceRecommendGoodsClick(clickLogUrl,callbackLoggingRecopick,godNo);
    var url = location.origin + "/product/" + godNo + "/detail";
    var recoUrl = clickLogUrl + "&url=" + encodeURI(url);

    window.location.href = recoUrl;
}

function callbackLoggingRecopick(godNo) {
    var url = "/product/" + godNo + "/detail";
    location.href=url;
}

/**
 * 추천 서비스 Recopick의 경우 추천 품질 향상을 위하여
 * 사용자들이 추천상품을 클릭하는 경우, clicklog_link를 통해 추천 클릭로그를 남겨준다.
 * 추천 클릭 로그를 제대로 남기지 않을 경우, 추천에 대한 성과를 계산할 수 없으며, 향후 추천 품질이 저하되는 문제가 생긴다.
 * 참조: http://docs.recopick.com/pages/viewpage.action?pageId=3244364
 */
function traceRecommendGoodsClick(clickLogUrl,callbackF,param) {
    if ((typeof(clickLogUrl) == 'undefined') ||
        (clickLogUrl == null) || (clickLogUrl == 'null') || (clickLogUrl == '')) {
        return;
    }
    //console.log(clickLogUrl);
    $.ajax({
        type : "GET",
        async : true,
        url : clickLogUrl,
        dataType: 'jsonp',
        success : function(data) {
            //console.log(data);
        },
        beforeSend: function (request)
        {
            var csrfToken = $("meta[name='_csrf']").attr("content");
            var csrfName = $("meta[name='_csrf_header']").attr("content");
            request.setRequestHeader(csrfName, csrfToken);
        },
        error: function(data) {
            //console.log(data);
        },complete: function () {
            console.log(callbackF);
            console.log(typeof callbackF);
            if (callbackF && typeof callbackF == 'function') {
                callbackF(param);
            }
        }
    });
}

/*
 * 공통 이퀄 설정 기능
 */
function setEqual(obj, callbackFunction) {
	if (doubleClickCheck()) {
        return;
    }
    var equalType, equalValue;
    var bukmkTp;
    var equalElement = "";
    
    equalType = obj.data('equalType');
    equalValue = obj.data('equalValue');
    let gaLabel = obj.data('gaLabel');
    let gaAction = '';
    
    if(equalType == "G" && equalValue != ""){
        equalElement = $("[select='"+equalValue+"']");
    }
    if(equalType == "G"){
    	bukmkTp = "GOD";
        gaAction = "PRODUCT_EQUAL";
    }
    if(equalType == "B"){
    	bukmkTp = "BRND";
        gaAction = "BRAND_EQUAL";
    }

    const url = new URL(location.href).pathname;
    if(url.indexOf('/equal/equalList') > -1){
        gaAction = 'ALL_EQUAL'
    }else if(url.indexOf('/equal/equalGodList') > -1){
        gaAction = 'Products_EQUAL'
    }else if(url.indexOf('/equal/equalBrndList') > -1){
        gaAction = 'Brands_EQUAL'
    }else{
        gaAction = 'EQUAL';
    }

    if(!!bukmkTp && !!equalValue){
    	var params = "conttNo=" + equalValue + "&bukmkTp=" + bukmkTp;

        let isSelected = $(obj).hasClass("selected");
    	if (isSelected) {
    		$.ajax({
    			type: "POST",
    			url: "/equal/equalDelete.json",
    			data: params,
    			success: function (data) {
    				$(obj).removeClass("selected");
    				if($(equalElement).length) {
    					$(equalElement).removeClass("selected"); //리스트 화면과 상세화면에서 2개 존재할수 있음
    				}
    				if(callbackFunction) {
    					callbackFunction("delete", obj);
    				}
    				doubleClickFlag = false;
    			},
    	        error : function(jqXHR, textStatus, errorThrown) {
    	            console.log("이퀄삭제실패");
    	            doubleClickFlag = false;
    	        }
    		});

    	} else {
    		$.ajax({
    			type: "POST",
    			url: "/equal/equalAdd.json",
    			data: params,
    			success: function (data) {
    				$(obj).addClass("selected");
    				if($(equalElement).length) {
    					$(equalElement).addClass("selected"); //리스트 화면과 상세화면에서 2개 존재할수 있음
    				}
    				if(callbackFunction) {
    					callbackFunction("insert", obj);
    				}
    				doubleClickFlag = false;
    			},
    	        error : function(jqXHR, textStatus, errorThrown) {
    	            console.log("이퀄등록실패");
    	            doubleClickFlag = false;
    	        }
    		});
    	}
        
        // GA4 이벤트 태깅
        let prefix = isSelected == true ? "off_" : "on_";
        if(gaLabel != undefined && gaLabel != null && gaAction != '') {
            GPGA.EVENT.setLabel(prefix + gaLabel, gaAction);
        }
    } else {
        showAlert2("필수값을 확인해 주세요.");
        return false;
    }
}

//브랜드 메인 호출
function goBrandMain(obj) {

    var brandShopNo =$(obj).attr("ctgryNo");
    var ctgryOutptTpCd = $(obj).attr("ctgryOutptTpCd");
    var outptSectCd =$(obj).attr("outptSectCd");
    var outptLinkUrl = $(obj).attr("outptLinkUrl");
    var brndCtgryNoYn = false;
    
    if(brandShopNo != null && brandShopNo != "" && typeof(brandShopNo) != "undefined"){
    	brndCtgryNoYn = true;
    }

    if(outptSectCd == 'LINK' && outptLinkUrl != null && outptLinkUrl != "" && typeof(outptLinkUrl) != "undefined"){
    	brndCtgryNoYn = true;
    }
    
    if(brndCtgryNoYn){
        if(outptSectCd == 'LINK' && ctgryOutptTpCd == 'NEW_WIN'){
            window.open(outptLinkUrl);
        }else if(outptSectCd == 'LINK'){
            location.href = outptLinkUrl;
        }else{
            location.href = "/brands/main?brndCategoryNumber="+brandShopNo;
        }
    }
}

function goCtgryList(obj){

    var dspCtgryNo =$(obj).attr("ctgryNo");
    var ctgryOutptTpCd = $(obj).attr("ctgryOutptTpCd");
    var outptSectCd =$(obj).attr("outptSectCd");
    var outptLinkUrl = $(obj).attr("outptLinkUrl");

    if(outptSectCd == 'LINK' && ctgryOutptTpCd == 'NEW_WIN'){
        window.open(outptLinkUrl);
    }else if(outptSectCd == 'LINK'){
        location.href = outptLinkUrl;
    }else{
        location.href = "/display/productsList?categoryNumber="+dspCtgryNo;
    }

}

//비슷한 상품
function goCtgryGodList(obj){

    var dspCtgryNo =$(obj).attr("ctgryNo");
    var newYn =$(obj).attr("newYn");

    location.href = "/display/productsList?categoryNumber="+dspCtgryNo+"&newYn="+newYn;


}


//타임세일 타이머
var timeSaleTimer;
/*function timeSaleCountDown(endDate) {
    if(endDate == undefined || endDate == '') {
        return;
    }
    var now =new Date();
    //var end = new Date(endDate);

    //yyyy-MM-dd HH:mm:ss
    var arEndDate = endDate.split(" ");
    var ymd = arEndDate[0];
    var hms = arEndDate[1];

    var arYmd = ymd.split("-");
    var arHms = hms.split(":");

    var mm = '' + Number(arYmd[1])-1;
    var end = new Date(arYmd[0],mm,arYmd[2],arHms[0],arHms[1],arHms[2]);

    var distance = end-now;
    var second =1000;
    var minute =second*60;
    var hour = minute*60;
    var day =hour*24;

    if(distance < 0){ //종료
        clearInterval(timeSaleTimer);
    }

    var days = Math.floor(distance/day);
    var hours = Math.floor((distance% day)/hour);
    var minutes = Math.floor((distance%hour)/minute);
    var seconds = Math.floor((distance%minute)/second);

    $("#days").html(days);
    $("#hours").html(hours);
    $("#minutes").html(minutes);
    $("#seconds").html(seconds);

}
*/

//타임세일 타이머
function timeSaleCountDown(endDate) {
    if(endDate == undefined || endDate == '') {
        return;
    }
    var now =new Date();
    //var end = new Date(endDate);

    //yyyy-MM-dd HH:mm:ss
    var arEndDate = endDate.split(" ");
    var ymd = arEndDate[0];
    var hms = arEndDate[1];

    var arYmd = ymd.split("-");
    var arHms = hms.split(":");

    var mm = '' + Number(arYmd[1])-1;
    var end = new Date(arYmd[0],mm,arYmd[2],arHms[0],arHms[1],arHms[2]);

    var distance = end-now;
    var second =1000;
    var minute =second*60;
    var hour = minute*60;
    var day =hour*24;

    if(distance < 0){ //종료
        clearInterval(timeSaleTimer);
    }

    var days = Math.floor(distance/day);
    var hours = Math.floor((distance% day)/hour);
    var minutes = Math.floor((distance%hour)/minute);
    var seconds = Math.floor((distance%minute)/second);
    $("#days").html(days+'일 '+hours+'시간 '+minutes+'분 '+seconds+'초 남음');
   /* $("#days").html(days);
    $("#hours").html(hours);
    $("#minutes").html(minutes);
    $("#seconds").html(seconds);*/

}


/**
 * Alert 다이얼로그 노출
 */
function showAlert(text, callbackConfirm, callbackCancel) {
	var isConfirmClose;
	isConfirmClose = false;

	// Alert이 한번도 열리지 않은 경우 DOM 구조 생성. DOM 구조는 한번만 생성함
	if ($('#alert').length === 0) {
		$('body').append('<div id="alert" class="ui-dialog-contents" title="알림 팝업" data-class="dialog-alert"><div class="dialog-contents-flex"><div class="dialog-alert-text"></div><div class="btn-even-wrap"><button type="button" class="btn confirm"><span class="inner-text">확인</span></button></div></div></div>');

		handsome.ui.front.setUIDialog('#alert');
	}

	// Alert 텍스트 구성
	$('#alert .dialog-alert-text').html(text);

	// Alert 확인 버튼 이벤트
	$('#alert .btn-even-wrap .btn.confirm').off('click').on('click', function (event) {
		isConfirmClose = true;
		$('#alert').dialog('close');
		if (callbackConfirm && typeof callbackConfirm === 'function') {
			callbackConfirm();
		}
	});

	// Alert 닫힐때 이벤트
	$('#alert').off('dialogclose').on( 'dialogclose', function( event, ui ) {
		// callbackCancel 함수가 있고 확인 버튼으로 닫히는게 아닌 경우(ex. 우측 상단 X버튼 클릭)
		if (callbackCancel && typeof callbackCancel === 'function' && !isConfirmClose) {
			callbackCancel();
		}
	});

	$('#alert').dialog('open');
}

/**
 * Confirm 다이얼로그 노출
 */
function showConfirm(text, callbackConfirm, callbackCancel) {
	var isConfirmClose, isCancelClose;
	isConfirmClose = isCancelClose = false;

	// Confirm이 한번도 열리지 않은 경우 DOM 구조 생성. DOM 구조는 한번만 생성함
	if ($('#confirm').length === 0) {
		$('body').append('<div id="confirm" class="ui-dialog-contents" title="확인 팝업" data-class="dialog-alert"><div class="dialog-contents-flex"><div class="dialog-alert-text"></div><div class="btn-even-wrap"><button type="button" class="btn cancel"><span class="inner-text">취소</span></button><button type="button" class="btn confirm"><span class="inner-text">확인</span></button></div></div></div>');

		handsome.ui.front.setUIDialog('#confirm');
	}

	// Confirm 텍스트 구성
	$('#confirm .dialog-alert-text').html(text);

	// Confirm 확인 버튼 이벤트
	$('#confirm .btn-even-wrap .btn.confirm').off('click').on('click', function (event) {
		isConfirmClose = true;
		if (callbackConfirm && typeof callbackConfirm === 'function') {
			callbackConfirm();
		}
		$('#confirm').dialog('close');
	});

	// Confirm 취소 버튼 이벤트
	$('#confirm .btn-even-wrap .btn.cancel').off('click').on('click', function (event) {
		isCancelClose = true;
		$('#confirm').dialog('close');
		if (callbackCancel && typeof callbackCancel === 'function' && !isConfirmClose) {
			callbackCancel();
		}
	});

	// Confirm 닫힐때 이벤트
	$('#confirm').off('dialogclose').on( 'dialogclose', function( event, ui ) {
		// callbackCancel 함수가 있고 확인 버튼과 취소 버튼으로 닫히는게 아닌 경우(ex. 우측 상단 X버튼 클릭)
		if (callbackCancel && typeof callbackCancel === 'function' && !isConfirmClose && !isCancelClose) {
			callbackCancel();
		}
	});

	$('#confirm').dialog('open');
}

function onlyNumber(obj) {
	$(obj).val($(obj).val().replace(/[^0-9]/gi, ""));
}

//EQL UI/UX 공통함수
var comm = {
    ajaxCall : function (type, async, url, dataType, data, beforeYn, successCB, errorCB, contentType) {
        $.ajax({
            type : type || "POST",
            async : async,
            url : url,
            dataType: dataType || "json",
            contentType: (!contentType) ? "application/json" : "application/x-www-form-urlencoded; charset=UTF-8",
            data: data || {},
            beforeSend: function (request)
            {
                if (beforeYn == "Y") {
                    var csrfToken = $("meta[name='_csrf']").attr("content");
                    var csrfName = $("meta[name='_csrf_header']").attr("content");
                    request.setRequestHeader(csrfName, csrfToken);
                }
            },
            success : function(res) {
                if (typeof successCB === "function") {
                    successCB(res);
                }
            },
            error: function(res) {
                if (typeof errorCB === "function") {
                    errorCB(res);
                }
            },
        });
    },

    // yyyy-mm-dd 날짜 출력
    fnDate : function(obj){
        var yyyy = Number(obj.substring(0,4));
        var mm = Number(obj.substring(5,7));
        var dd = Number(obj.substring(8,10));

        return yyyy+". "+mm+". "+dd;
    },

    // 빈칸제거
    trimAll : function(str) {
      return (!str) ? "" : str.replace(/ /g, '');
    },

    // 로그인 확인
    chkLogin : function(){
        return new Promise((resolve, reject)=>{
            comm.ajaxCall("POST", true, "/event/chkLogin.json", "json", {}, "Y", function(res){
                resolve(!$.isEmptyObject(res) && res.resultCode == "S")
            });
        });
    },

    // 로그인 페이지 이동
    goLogin : function(){
        location.href="/public/member/login";
    },

    // 이퀄 (좋아요)
    setEqual : function(obj,successCB, countType){
        var equalType, equalValue, bukmkTp;

        equalType = obj.data('equalType');
        equalValue = obj.data('equalValue');

        if(equalType == "G" || equalType == "GOD"){
            bukmkTp = "GOD";
            // 카카오 픽셀 위시 리스트 상품 시작 ( 2024-01-16 : 주영상 )
            try {
                kakaoPixel('543047391215005823').addToWishList({
                    id: equalValue
                });
            } catch(e) {
                console.log(e);
            }
            // 카카오 픽셀 위시 리스트 상품 종
        } else if(equalType == "B" || equalType == "BRND"){
            bukmkTp = "BRND";
        } else if(equalType == "E" || equalType == "EVT"){
            bukmkTp = "EVT";
        } else if(equalType == "P" || equalType == "PROMT"){
            bukmkTp = "PROMT";
        } else if(equalType == "T" || equalType == "TRND"){
            bukmkTp = "TRND";
        }

        if(!!bukmkTp && !!equalValue) {
            var params = {"conttNo" : equalValue, "bukmkTp" : bukmkTp};
            var activeTf = obj.hasClass("is_active");
            var url = (activeTf) ? "/equal/equalDelete.json" : "/equal/equalAdd.json";
            var equalCnt = "";
        	$.ajax({
    			type: "POST",
    			url: url,
    			data: params,
    			success: function (res) {
                    // 이퀄 성공시
                    if (!$.isEmptyObject(res) || res.message == "SUCCESS") {
                        (activeTf) ? $(obj).removeClass("is_active") : $(obj).addClass("is_active");
                        equalCnt = res.equalCnt;

                        // [CH] 이퀄 해제시, 관련 정보 전송
                        if(activeTf == true){
                            setTimeout(()=>{
                                COMMON.EQUAL.ch_removeEqual(bukmkTp, equalValue, res.chMbrNo);
                            }, 100);
                        }
                    }
                    // 카운트타입 존재시(B: 버튼, S: span)
                    if (!$.isEmptyObject(countType) && res.message == "SUCCESS"){
                        var equalCountTarget = (countType == "B") ? $(obj) : $(obj).siblings("span");
                        var equalCountAddNumber = (activeTf) ? Number(-1) : Number(+1);
    
                        if ($(obj).is("[data-equal-cnt]")) {
                            //var equalCnt = Number($(obj).attr("data-equal-cnt"));
                        	
                            //20230428 주석	
                            //equalCnt += equalCountAddNumber;
                            $(obj).attr("data-equal-cnt", equalCnt);
                            if (!equalCountTarget) {
                                if (typeof successCB === "function") {
                                    successCB(res);
                                }
                                return false;
                            }
                            
                            equalCountTarget.text(equalCnt > 999 ? "999+" : equalCnt.toString());
                        }
                        else {
                            if (!equalCountTarget) return false;
    
                            if ($.isEmptyObject(equalCountTarget.text().trim())) {
                                if (typeof successCB === "function") {
                                    successCB(res);
                                }
                                return;
                            }
                            
                            //equalCount = (Number(equalCountTarget.text().trim()) + equalCountAddNumber);
                            equalCountTarget.text(equalCnt > 999 ? "999+" : equalCnt.toString());
                        }
                    }

                    if (typeof successCB === "function") {
                        successCB(res);
                    }
    			},
    	        error : function(jqXHR, textStatus, errorThrown) {
    	            console.log("이퀄등록실패");
    	        }
    		});
        } else {
            showAlert2("필수값을 확인해 주세요.");
            return false;
        }
    },

    // 이벤트 시간 설정
    setEventTime : function(time) {
        // 빈값
        if(!time) return "";

        let fullTime = time.split(" ");     // (2) ['2023-02-01', '16:00:59']
        let ymd = fullTime[0].split("-");    // (3) ['2023', '02', '01']
        let hms = fullTime[1].split(":");    // (3) ['16', '00', '59']

        return new Date(ymd[0], Number(ymd[1] - 1), ymd[2], hms[0], hms[1], hms[2]).getTime();
    },
    
    // 이벤트 시간 설정 일단위
    setEventTime2 : function(time) {
        // 빈값
        if(!time) return "";

        let fullTime = time.split(" ");     // (2) ['2023-02-01', '16:00:59']
        let ymd = fullTime[0].split("-");    // (3) ['2023', '02', '01']
        let hms = fullTime[1].split(":");    // (3) ['16', '00', '59']

        return new Date(ymd[0], Number(ymd[1] - 1), ymd[2]).getTime();
    },

    // 뱃지 시간
    setTimerBadge : function(type){
        type = (!type) ? "" : type;
        // 초기에 먼저 시작
        comm.timeBadge(type);

        setInterval(function(){
            comm.timeBadge(type);
        }, 1000);
    },

 // 뱃지 시간 계산
    timeBadge : function(type) {
        $.each($(".badge.orange:visible, .badge.timer:visible"), function(i, el){
            if ($(el).data("eventStartTime").startsWith("1900-01-01")
                    && $(el).data("eventEndTime").startsWith("9999-12-31")) {
                    $(".badge.orange").remove();
                    return;
                }

            let now = new Date();
            let nowTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds()).getTime();
            let startTime = comm.setEventTime($(el).data("eventStartTime"));
            let endTime = comm.setEventTime($(el).data("eventEndTime"));

            let nowTime2 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            let startTime2 = comm.setEventTime2($(el).data("eventStartTime"));
            let endTime2 = comm.setEventTime2($(el).data("eventEndTime"));

            // 이벤트&기획전 종료
            if (nowTime > endTime) $(el).hide();

            // 이벤트&기획전 시작전, 종료전
            let baseTime = (nowTime < startTime) ? (startTime - nowTime) : (endTime - nowTime);
            let baseTime2 = (nowTime2 < startTime2) ? (startTime2 - nowTime2) : (endTime2 - nowTime2);
            let dDay = baseTime / (1000*60*60*24);
            let dDay2 = baseTime2 / (1000*60*60*24);
            let remainTime = "";

            if (type == 'god') {
                if (dDay < 1) {
                    remainTime =  Math.floor((baseTime % (1000*60*60*24)) / (1000*60*60)).toString().padStart(2, '0') + ":" + Math.floor((baseTime % (1000*60*60)) / (1000*60)).toString().padStart(2, '0');
                } else {
                 if(nowTime2 < startTime2) {
                 remainTime = "D-"+dDay2;
                 } else{
                 remainTime = dDay2+"일";
                 }
                }
            } else {
             if (dDay < 1) {
                  remainTime =  Math.floor((baseTime % (1000*60*60*24)) / (1000*60*60)).toString().padStart(2, '0') + ":" + Math.floor((baseTime % (1000*60*60)) / (1000*60)).toString().padStart(2, '0');
             } else {
             if(nowTime2 < startTime2) {
                 remainTime = "D-"+dDay2;
                 } else{
                 remainTime = dDay2+"일";
                 }
             }
             //remainTime = (dDay >= 1) ? ((nowTime < startTime) ? "D-" + Math.ceil(dDay) : Math.floor(dDay) + "일") :
                //Math.floor((baseTime % (1000*60*60*24)) / (1000*60*60)).toString().padStart(2, '0') + ":" + Math.floor((baseTime % (1000*60*60)) / (1000*60)).toString().padStart(2, '0');
            }
            let remainText = "";
            if (nowTime < startTime) {
             remainText ="진행예정 " + remainTime;
            } else {
             remainText ="진행중 " + remainTime + " 후 종료";
            } 
            //let remainText = (nowTime < startTime) ? "진행예정 " + remainTime : "진행중 " + remainTime + " 후 종료";

            $(el).text(remainText);
        });
    },

    // 숫자만
    onlyNumber(str) {
        return (!str) ? "" : str.replace(/[^0-9]/gi, "");
    },
    
    setTimerTimeSaleOrPreOrder : function(ymdSplit){
        comm.addDdayTimeSaleOrPreOrder(ymdSplit);
        setInterval(function() {
            comm.addDdayTimeSaleOrPreOrder(ymdSplit);
        }, 1000);
    },

    addDdayTimeSaleOrPreOrder: function(ymdSplit) {
		var second = 1000;
        var minute = second * 60;
        var hour = minute * 60;

		$.each($(".badge_s:visible[data-event='PRE-ORDER'], .badge_s:visible[data-event='TIME SALE'], .badge:visible[data-event='PRE-ORDER'], .badge:visible[data-event='TIME SALE']"), function(i, el) {
			let event = $(el).data("event");
			if (!!event) {
                if ($(el).data("eventStartTime").startsWith("1900.1.01") 
                    && $(el).data("eventEndTime").startsWith("9999.12.31")) {
                    return;
                }
                if (!$(el).data("eventStartTime") && !$(el).data("eventEndTime") ) {
                    return;
                }  
                let startDate = comm.convertDate($(el).data("eventStartTime") + ":59", ymdSplit);
				let endDate = comm.convertDate($(el).data("eventEndTime") + ":59", ymdSplit);

				let now = new Date();

				// 종료일자보다 이후 이면 event만 표시
				if (endDate < now) {
					$(el).text(event);
				}
				// 시작일자보다 이전이면 'event D-일자'로 표시
				else if (now < startDate) {
					$(el).text(event + " D-" + comm.getDateDiff(now, startDate));
				}
				else if (startDate < now) {
					const nowYYYYMMDD = now.getFullYear() + "" + now.getMonth().toString().padStart(2, "0") + "" + now.getDate().toString().padStart(2, "0");
					const endYYYYMMDD = endDate.getFullYear() + "" + endDate.getMonth().toString().padStart(2, "0") + "" + endDate.getDate().toString().padStart(2, "0");

					// 종료일자면 event 종료시간까지 남은 시간 표시
					if (nowYYYYMMDD == endYYYYMMDD) {
                        var h = Math.floor((endDate - now) / hour);
                        var m = Math.floor(((endDate - now) % hour) / minute);

						$(el).text(event + " " + h.toString().padStart(2, "0") + ":" + m.toString().padStart(2, "0"));
					}
					// 종료일자보다 이전이면 'event D-일자'로 표시
					else {
						$(el).text(event + " D-" + comm.getDateDiff(now, endDate));
					}
				}
			}
		});
	},

    // Date형식으로 변경
    convertDate : function(time, ymdSplit) {
        // 빈값
        if(!time) return null;

        let fullTime = time.split(" ");     // (2) ['2023-02-01', '16:00:59']
        let ymd = fullTime[0].split(ymdSplit||".");    // (3) ['2023', '02', '01']
        let hms = fullTime[1].split(":");    // (3) ['16', '00', '59']

        return new Date(ymd[0], Number(ymd[1] - 1), ymd[2], hms[0], hms[1], hms[2]);
    },

    getDateDiff: function(startDate, endDate) {
		const diffDate = endDate.getTime() - startDate.getTime();
		return Math.floor(Math.abs(diffDate / (1000 * 60 * 60 * 24)));
	},

    // 계좌번호 텍스트 복사하기
    copyAcctNo : function(acctNo) {
        var tmpAccnt = document.createElement("input");

        tmpAccnt.setAttribute('value', acctNo);
        document.body.append(tmpAccnt);
        tmpAccnt.select();

        try {
            document.execCommand("copy");
            showToast("계좌번호가 복사되었습니다.");
        } catch (err) {
            showToast("이 브라우저는 지원하지 않습니다.");
        }
        tmpAccnt.remove();
    },

    // 입력창 포커스
    setTimeoutFocus : function(thisId, time) {
   		setTimeout(function(){
            $(thisId).focus();
   		}, (!time) ? 1 : Number(time));
   	},

   	// 번호 간격 뛰우기
    changeTelForm : function(mobileNo){
    	var trimMobileNo = mobileNo
    	var firstTel = trimMobileNo.substring(0, 3);
    	var secTel = '';
    	var thrTel = '';

    	if(trimMobileNo.length > 10 )
    	{
    		secTel = trimMobileNo.substring(3, 7);
    		thrTel = trimMobileNo.substring(7, 12);
    	}
    	else
    	{
    		secTel = trimMobileNo.substring(3, 6);
    		thrTel = trimMobileNo.substring(6, 11);
    	}

    	var newMobileNo = firstTel + '-' + secTel + '-' + thrTel;

    	return newMobileNo;
    } ,

};

/**
* Alert 다이얼로그 노출2
*/
function showAlert2(msg, title, callbackConfirm, callbackCancel) {
    // 기존 alert3 존재시
    if($('[id^=alertModal]').length > 0) {
        showAlert3(msg, title, callbackConfirm, callbackCancel);
        return false;
    }

	// 제목, 내용 초기화
    if ($('#titleMsg').length > 0 ) $('#titleMsg').html('');
    if ($('#contentMsg').length > 0 ) $('#contentMsg').html('');


	// Alert이 한번도 열리지 않은 경우 DOM 구조 생성. DOM 구조는 한번만 생성함
	if ($('#ModalDimmed1').length === 0) {
	var alertHtml = `<div class="modal_wrap" id="ModalDimmed1" style="z-index: 1300;">
	            <div class="modal modal_dimmed type2">
	                <div class="modal_header">
	                    <h3 id="alertTitleMsg"></h3>
	                </div>
	
	                <div class="modal_content">
	                    <p class="msg2" id="alertMsg"></p>
	                </div>
	
	                <div class="modal_footer btn_popup_full">
	                    <button type="button" id="btnAlertConfirm" onclick="ModalOpenClose('#ModalDimmed1')">확인</button>
	                </div>
                    <button type="button" name="btnAlertCancel" class="modal_close_btn" onclick="ModalOpenClose('#ModalDimmed1')"><span class="blind">닫기</span></button>	                
	            </div>
	            <div class="dimmer" aria-hidden="true"></div>
	        </div>`

        $('body').append(alertHtml)
    }

    // Alert 확인 버튼 이벤트
   $('#btnAlertConfirm').off('click').on('click', function (event) {
   	if (callbackConfirm && typeof callbackConfirm === 'function') {
   		callbackConfirm();
  	 }
   });

    // 취소, 닫기 버튼 이벤트
   $("[name=btnAlertCancel]").off('click').on('click', function (event) {
   	if (callbackCancel && typeof callbackCancel === 'function') {
        callbackCancel();
  	 }
   });

	// Alert 텍스트 구성
	$('#alertTitleMsg').html((!title) ? "알림" : title);
    if(title == " "){  // 타이틀 영역 없는 케이스
        $('#ModalDimmed1 .modal_dimmed').removeClass("type2");
        $('#alertMsg').removeClass("msg2").addClass("msg");
    }
    $('#alertMsg').html(msg);

    // 오픈
    ModalOpen('#ModalDimmed1');
}

/**
* Alert 다이얼로그 노출3
*/
var callbackFuncArr = [];
var callbacCnclkFuncArr = [];
function showAlert3(msg, title, callbackConfirm, callbackCancel) {
	// Alert 중복으로 생성해서 실행
    var alertModalSeq = $('[id^=alertModal]').length;
    var alertModalId = "alertModal" + alertModalSeq;
    var dimmer = ($(".modal_wrap.showAlert3.is_visible.is_active").length > 0) ? "" : `<div class="dimmer alert3" aria-hidden="true"></div>`;
    var alertModalZindex = Number(3100) + Number(alertModalSeq);
    var alertTitle = (!title) ? "알림" : title;
    // 타이틀 영역 없는 케이스
    var modalType = (title == " ") ? "" : "type2";
    var contentType = (title == " ") ? "msg" : "msg2";

    callbackFuncArr[""+alertModalSeq] = callbackConfirm;
    callbacCnclkFuncArr[""+alertModalSeq] = callbackCancel;

    var alertHtml = `<div class="modal_wrap showAlert3 is_visible is_active" id="${alertModalId}" style="z-index: ${alertModalZindex}">
   	            <div class="modal modal_dimmed ${modalType}">
   	                <div class="modal_header">
   	                    <h3 id="alertTitleMsg">${alertTitle}</h3>
   	                </div>
   	
   	                <div class="modal_content">
   	                    <p class="${contentType}" id="alertMsg">${msg}</p>
   	                </div>
   	
   	                <div class="modal_footer btn_popup_full">
   	                    <button type="button" id="btnDupAlertCncl${alertModalSeq}" name="btnDupAlertCncl${alertModalSeq}" onclick="btnDupAlertCncl(${alertModalSeq}, 'confirm', ${alertModalId});">확인</button>
   	                </div>
                       <button type="button" name="btnDupAlertConfirm${alertModalSeq}" class="modal_close_btn" onclick="btnDupAlertCncl(${alertModalSeq}, 'cncl', ${alertModalId});"><span class="blind">닫기</span></button>	                
   	            </div>
   	            ${dimmer}
   	        </div>`	;

        $('body').append(alertHtml);

    // 오픈
    ModalOpen(alertModalId);
}

var btnDupAlertCncl = function(seq, type, modalId){
    var cbCnfVal = (type == "confirm") ? callbackFuncArr[seq] : callbacCnclkFuncArr[seq];

    if (cbCnfVal && typeof cbCnfVal === 'function') {
        if (type == "confirm") {
            callbackFuncArr[seq]();
        } else {
            callbacCnclkFuncArr[seq]();
        }
  	 }

    ModalOpenClose(modalId)
};

$(document).on("click", "[name^=btnDupAlertCncl]", function(e){

});


/**
* Alert 컨펌(확인/취소) 노출.
*/
function showConfirm2(msg, title, callbackConfirm, callbackCancel, btnCancelNm, btnConfrimNm) {
	// 제목, 내용 초기화
    if ($('#titleMsg').length > 0 ) $('#titleMsg').html('');
    if ($('#contentMsg').length > 0 ) $('#contentMsg').html('');


	// Confirm 한번도 열리지 않은 경우 DOM 구조 생성. DOM 구조는 한번만 생성함
	if ($('#ModalDimmed2').length === 0) {
	var alertHtml = `<div class="modal_wrap" id="ModalDimmed2" style="z-index: 1300;">
            <div class="modal modal_dimmed type2">
                <div class="modal_header">
                    <h3 id="confirmTitleMsg"></h3>
                </div>

                <div class="modal_content">
                    <p class="msg2" id="confirmMsg"></p>
                </div>

                <div class="modal_footer btn_popup_full">
                    <button type="button" id="btnConfirmCancel" class="white" name="btnConfirmCancel"  onclick="ModalOpenClose('#ModalDimmed2')">취소</button>
                    <button type="button" id="btnConfirmConfirm"  onclick="ModalOpenClose('#ModalDimmed2')">확인</button>
                </div>
                
                <button type="button" name="btnConfirmCancel" class="modal_close_btn" onclick="ModalOpenClose('#ModalDimmed2')"><span class="blind">닫기</span></button>

            </div>
            <div class="dimmer" aria-hidden="true"></div>
        </div>`

        $('body').append(alertHtml)
    }

    // 확인 버튼 이벤트
   $('#btnConfirmConfirm').off('click').on('click', function (event) {
   	if (callbackConfirm && typeof callbackConfirm === 'function') {
   		callbackConfirm();
  	 }
   });

    // 취소, 닫기 버튼 이벤트
   $("[name=btnConfirmCancel]").off('click').on('click', function (event) {
   	if (callbackCancel && typeof callbackCancel === 'function') {
        callbackCancel();
  	 }
   });

	// Alert 텍스트 구성
	$('#confirmTitleMsg').html((!title) ? "알림" : title);
    $('#confirmMsg').html(msg);

    // 버튼 이름 세팅
    btnCancelNm = (!btnCancelNm) ? '취소' : btnCancelNm;
    btnConfrimNm = (!btnConfrimNm) ? '확인' : btnConfrimNm;
    $("#btnConfirmCancel").text(btnCancelNm);
    $("#btnConfirmConfirm").text(btnConfrimNm);

    // 오픈
    ModalOpen('#ModalDimmed2');
}

/**
* Alert 토스트 알럿
 */
function showToast(msg) {
    // 내용 초기화
    if ($('#contentMsg').length > 0 ) $('#toastMsg').html('');

	// Alert이 한번도 열리지 않은 경우 DOM 구조 생성. DOM 구조는 한번만 생성함
	if ($('#toast').length === 0) {
		var alertHtml = `<div id="toast" class="toast">
                        <p class="toast_txt" id="toastMsg"></p>
                        </div>`;
		$('body').append(alertHtml)
    }

	// Toast 텍스트 구성
    $('#toastMsg').html(msg);

    // 오픈
    ToastOpen("#toast");
}

/**
 * 번호 간격 뛰우기
 */
function changeTelForm2(mobileNo){
	var trimMobileNo = mobileNo.trim();
	var firstTel = trimMobileNo.substring(0, 3);
	var secTel = '';
	var thrTel = '';
	
	if(trimMobileNo.length > 10 )
	{
		secTel = trimMobileNo.substring(3, 7);
		thrTel = trimMobileNo.substring(7, 12);
	}
	else
	{
		secTel = trimMobileNo.substring(3, 6);
		thrTel = trimMobileNo.substring(6, 11);
	}
	
	var newMobileNo = firstTel + ' ' + secTel + ' ' + thrTel;
	
	return newMobileNo;
}

/**
* 배송조회 modalPopup
*/
function showDlvStatusInfo(dlvInfo, dlvObj) {

    // 기존 배송정보 팝업 삭제
    if($("#modalPopDlvStatus").length > 0) $("#modalPopDlvStatus").remove();

    // 배송정보 미존재 확인
    var status = (dlvInfo.trackingResult.trackingDetails.length > 0) ? '' : 'wait';

    var dlvStatusObj = {
        "1" : "배송준비",
        "2" : "배송시작",
        "3" : "배송중",
        "4" : "배송중",
        "5" : "배송중",
        "6" : "배송완료",
    };

    var trackingResult = dlvInfo.trackingResult;
    var level = (status == "wait") ? "1" : trackingResult.level;   // 배송상태 레벨
    var statusNm = (status == "wait") ? "-" : dlvStatusObj[level]; // 배송상태 이름
    var invoiceNo = trackingResult.invoiceNo;                      // 운송장번호

    // 배송기록
    var dlvHistory = (status == "wait") ? `<tr><td colspan="3">배송정보 확인 중입니다.</td></tr>` : "";
    $.each(trackingResult.trackingDetails, function(i, el){
        var dateArr = el.timeString.split(' ');
        var ymd = dateArr[0].replace(/-/g, '.');
        var hhmm = dateArr[1].substr(0, 5);
        var kind = el.kind;
        var where = el.where;

        dlvHistory += `<tr>
                       <td>${ymd}<br> ${hhmm}</td>
                       <td>${kind}</td>
                       <td>${where}</td>
                      </tr>`;
     });

    // innerHTML
	var alertHtml = `<div class="modal_wrap" id="modalPopDlvStatus">
                        <div class="modal modal_dimmed wid_M">
                        <!-- modal header -->
                        <div class="modal_header">   
                            <h3 class="modal_tit">배송 조회</h3>  
                        </div>
                        <!-- //modal header -->
                            
                        <!-- modal content -->
                        <div class="modal_content">
                        	<div class="content_scroll">
								<div class="section_block">
		                            <ol class="my_order_step">
		                                <li class="step ${(level == '1') ? 'is_active' : ''}">
		                                    <div class="bar"><span></span></div>
		                                    <span class="status">배송준비</span>
		                                </li>
		                                <li class="step ${(level == '2') ? 'is_active' : ''}">
		                                    <div class="bar"><span></span></div>
		                                    <span class="status">배송시작</span>
		                                </li>
		                                <li class="step ${(level == '3' || level == '4' || level == '5') ? 'is_active' : ''}">
		                                    <div class="bar"><span></span></div>
		                                    <span class="status">배송중</span>
		                                </li>
		                                <li class="step ${(level == '6') ? 'is_active' : ''}">
		                                    <div class="bar"><span></span></div>
		                                    <span class="status">배송완료</span>
		                                </li>
		                            </ol>
		                        </div>
                            	<div class="section_block">
									<ul class="gray_box_list">
										<li>
											<em class="wid_120">주문 번호</em><!-- *수정 2023.03.27 wid_160 -> wid_120 -->
											<p>${dlvObj.ordNo}</p>
										</li>
										<li>
											<em class="wid_120">상품명</em><!-- *수정 2023.03.27 wid_160 -> wid_120 -->
											<p class="ellipsis_1">${dlvObj.godNm}</p>
										</li>
									</ul>
								</div>
                        		<div class="section_block">
                        			<div class="table_info gray_table">
				                        <table>
				                        <caption>택배 배송상태</caption>
				                            <colgroup>
				                                <col style="width:calc(100% / 3)">
				                                <col style="width:calc(100% / 3)">
				                                <col style="width:calc(100% / 3)">
				                            </colgroup>
				                        <thead>
				                        <tr>
				                            <th scope="col">택배사</th>
				                            <th scope="col">운송장번호</th>
				                            <th scope="col">배송 상태</th>
				                        </tr>
				                        <tr>
				                            <td>${dlvObj.dlvCompany}</td>
				                            <td>${dlvObj.invoiceNo}</td>
				                            <td>${statusNm}</td>
				                        </tr>
				                        </thead>
				                        </table>
                        			</div>
                        
			                        <div class="table_info gray_table">
				                        <table>
				                        	<caption>택배 현재 위치 및 상태</caption>
					                        <colgroup>
					                            <col style="width:calc(100% / 3)">
					                            <col style="width:calc(100% / 3)">
					                            <col style="width:calc(100% / 3)">
					                        </colgroup>
					                        <thead>
						                        <tr>
						                            <th scope="col">처리일시</th>
						                            <th scope="col">현재 위치</th>
						                            <th scope="col">배송 상태</th>
						                        </tr>
					                        	${dlvHistory}
					                        </thead>
				                        </table>
			                        </div>
                        		</div>
                        	</div>
                        <!-- //modal content -->
                        </div>

            <button type="button" class="modal_close_btn" onclick="ModalFPClose('#modalPopDlvStatus')"><span class="blind">닫기</span></button>
            </div>
            <div class="dimmer" aria-hidden="true" onclick="ModalFPClose('#modalPopDlvStatus')"></div>
        </div>
`;

    // Alert 텍스트 구성
    $('body').append(alertHtml);

    // 오픈
    ModalOpen('#modalPopDlvStatus');
}


/**
* 배송조회 modalPopup
*/
function showChangeDmstcWaybilNo(dlvTurn, dlvPcupspTurn, dlvComCd, dmstcWaybilNo) {

    // 기존 배송정보 팝업 삭제
    if($("#modalPopChangeDmstcWaybilNo").length > 0) $("#modalPopChangeDmstcWaybilNo").remove();

    var alertHtml = `<div class="modal_wrap" id="modalPopChangeDmstcWaybilNo">
			<!-- [D] max_height 추가 시 height 750 고정 높이 가짐 -->
            <div class="modal modal_dimmed wid_M">
				<!-- modal header -->
                <div class="modal_header">
                    <h3>송장번호 입력</h3>
                </div>
				<!-- //modal header -->

				<!-- modal content -->
                <div class="modal_content">
					<!-- [D] : .content_scroll 추가 시 스크롤 됨 -->
                    <div class="content_scroll">
						<div class="form_set col">
							<div class="custom_select_wrap">
								<button type="button" class="option_selected" id="selectDlvCom">택배사 선택</button><!-- [D] : 활성상태 .is_active 추가 -->
								<ul class="option_list" id="ulDlvCompany"><!-- [D] : 활성상태 .is_active 추가 -->
								</ul>
							</div> 
							<div class="input_clear">
                                <input type="text" placeholder="송장번호 '-' 없이 숫자만 입력해주세요" id="dmstcWaybilNo" name="dmstcWaybilNo" value="${dmstcWaybilNo}" maxlength="16" value="" onkeyup="onlyNumber(this)">
                                <button type="button" class="clear_btn"><span class="blind">삭제</span></button>
							</div>
						</div>
					</div>
                </div>
				<!-- //modal content -->

				<!-- modal footer -->
                <div class="modal_footer btn_popup_full">
					<button type="button" class="white" onclick="ModalOpenClose('#modalPopChangeDmstcWaybilNo')">취소</button>
					<button type="button" class="" onclick="changeDmstcWaybilNo();">확인</button>
                </div>
				<!-- //modal footer -->

				<button type="button" class="modal_close_btn" onclick="ModalOpenClose('#modalPopChangeDmstcWaybilNo')"><span class="blind">닫기</span></button>

            </div>
            <div class="dimmer" aria-hidden="true"></div>
            
                <input type="hidden" id="dlvTurn"  value="${dlvTurn}"/>
                <input type="hidden" id="dlvPcupspTurn" value="${dlvPcupspTurn}"/>            
        </div>`	;

    // Alert 텍스트 구성
    $('body').append(alertHtml);
    let dlvCompList = $("#dlvCompanyList").html();
    $("#ulDlvCompany").empty().append(dlvCompList);

    $.each($("#ulDlvCompany > li > button"), function(i, el) {
        if($(el).val() == dlvComCd){
            $("#selectDlvCom").val(dlvComCd).text($(el).text());
        }
    });

    // 오픈
    ModalOpen('#modalPopChangeDmstcWaybilNo');
}

/* 이퀄 좋아요 클릭 이벤트 */
$(document).on('click','.button_equal',function(e){
	// $(this).toggleClass('is_active');
});

$(document).on("click",'.button_toggle', function(e){
	// $(this).toggleClass("is_active");
});

/* 옵션 클릭 이벤트 */
$(document).on('click', '.custom_select_wrap:not(.disabled) .option_selected', function(e) {
	if($(this).closest('.custom_select_wrap').hasClass('is_active')) {
		$(this).closest('.custom_select_wrap').removeClass('is_active').find('.option_list').slideUp(200);
	}else {
		$(this).parent().siblings('.custom_select_wrap').removeClass('is_active').find('.option_list').slideUp(200);
		$(this).closest('.custom_select_wrap').addClass('is_active').find('.option_list').slideDown(200);
	}
});

$(document).on('click', '.custom_select_wrap .option', function() {
    var bindText = $(this).html();
    $(this).closest('.custom_select_wrap').find('.option_selected').html(bindText);
    $(this).closest('.custom_select_wrap').removeClass('is_active').find('.option_list').slideUp(200);
});

$(document).on("click", ".count_set button", function () {
	var $button = $(this);
	var $inputThis = $button.parent().closest(".count_box").find(".count"),
	$inputCount = $inputThis.val(),
	$inputMax = $inputThis.attr("data-max"),
	$inputMin = $inputThis.attr("data-min");
    $button.parent().closest(".count_box").find("button").attr("disabled", false);
    if ($button.hasClass("minus")) {
		//minus
		$inputCount = parseInt($inputCount) - parseInt(1);
		if ($inputCount <= $inputMin) {
			$button.attr("disabled", true);
		}
    } else {
		//plus
		$inputCount = parseInt($inputCount) + parseInt(1);
		if ($inputCount >= $inputMax) {
			if($inputThis.attr('data-page') != "productDetail"){
				$button.attr('disabled', true);				
			}else{
				if($inputCount == 1){
					$button.parent().closest('.count_box').find('.minus').attr('disabled', true);
				}
			}
		}
    }
    $inputThis.val($inputCount);
});

$(document).on('click', '.all_review .review_thumb', function () {
  $(this).toggleClass("is_active");
});

var COMMON = COMMON || {
    // [뒤로가기 개선]
    BACK : {
        setup : (type, param, sig) => {
            if(typeof param == 'undefined') return;
            // console.group('[B-1] 뒤로가기 셋업');
            
            const urlObj = new URL(document.location.href);
            try {
                switch(type){
                    case 'S':
                        if(sig == 'del'){
                            urlObj.searchParams.delete('sort');
                            // console.log('제거 : sort');
                        }else{
                            const sort = param.value;
                            urlObj.searchParams.set('sort', sort);
                            urlObj.searchParams.delete('page');
                            // console.log('정렬 : ', sort);
                            // console.log('페이지 제거');
                        }
                        break;
                    case 'P':
                        if(sig == 'del'){
                            urlObj.searchParams.delete('page');
                            // console.log('제거 : page');
                        }else{
                            urlObj.searchParams.set('page', param);
                            // console.log('페이지 : ', param);
                        }
                        break;
                    case 'C':
                        if(sig == 'del'){
                            urlObj.searchParams.delete('categoryNumber');
                            // console.log('제거 : categoryNumber');
                        }else{
                            urlObj.searchParams.set('categoryNumber', param);
                            // console.log('카테고리 : ', param);
                        }
                        break;
                    case 'BC':
                        if(sig == 'del'){
                            urlObj.searchParams.delete('brndCtgryNo');
                            // console.log('제거 : brndCtgryNo');
                        }else{
                            urlObj.searchParams.set('brndCtgryNo', param);
                            // console.log('브랜드카테고리 : ', param);
                        }
                        break;
                }
                if(urlObj.pathname.indexOf('/productsListCntt') > -1){
                    const elem = document.querySelector('[name="tmplCtgryNo"]');
                    if(elem !== null && elem?.value != ''){
                        urlObj.searchParams.set('tmpl', elem.value);
                    }
                }
                urlObj.searchParams.set('bf', 'Y');
                // console.log('뒤로가기 플래그 : Y');
            } catch (error) {
                console.warn(`🚫BACK.setup fail:${type}/${para}\n${error}`);
            }
            // console.groupEnd();

            history.replaceState(null, null, urlObj);
        },
        reset : () => {
            // console.log('[B-2] 뒤로가기 리셋 : sort, page');
            const urlObj = new URL(location.href);
            urlObj.searchParams.delete('sort');
            urlObj.searchParams.delete('page');

            history.replaceState(null, null, urlObj);
        },
        deleteFilterSessions : () => {
            window.sessionStorage.removeItem("filterTab1");
            window.sessionStorage.removeItem("filterTab2");
            window.sessionStorage.removeItem("filterTab3");
            window.sessionStorage.removeItem("filterTab4");
            window.sessionStorage.removeItem("filterTagDiv");
            window.sessionStorage.removeItem("filterState");
        },
        getFilterState : () => {
            return sessionStorage.getItem("filterState");
        },
        setFilterState : (data) => {
            sessionStorage.setItem("filterState", data);
        },
        isWindowBack : () => {
            return (window.performance && window.performance.navigation.type == 2);
        }
    },

    // 이퀄 관련
    EQUAL : {
        // selector 내 데이터를 'Item,Item,Item'의 형태로 변환
        cnvrtListToStr : (selector, separator, callback) => {
            try {
                const elemGods = document.querySelectorAll(selector);
            
                if(elemGods.length != 0){
                    const arGodNo = [].map.call(elemGods, callback);
                    return arGodNo.join(separator);
                }else{
                    return '';
                }
            } catch (error) {
                console.warn('[ERROR] at cnvrtListToStr...', error);
                return '';
            }
        },

        // BRND ID/GOD NO를 통해 이퀄수/이퀄여부 등의 데이터를 조회
        getEqualItemList : (arrayText, equalType) => {
            return new Promise(function(resolve, reject){
                $.ajax({
                    type : "POST",
                    async : false,
                    url : "/equal/getEqualItemList.json",
                    data : {arGodNoTxt : arrayText, bukmkTp : equalType}, 
                    success : function(data) {
                        resolve(data);
                    },
                    error: function(e) {
                        console.warn('[ERROR] at getEqualItemList...', error);;
                        reject(e);
                    }
                });
            });
        },

        ch_removeEqual : (type, boIdx, mbrNo) => {
            const baseUrl = document.getElementById('chApiDomain')?.value;
            const apiUrl = `${baseUrl}v1/user/equal/collection/clear`;

            // 파라미터 검증
            if(typeof mbrNo == 'undefined' || mbrNo == ''){
                console.warn(`[ERROR] at ch_removeEqual:undefined mbrNo`);
                return false;
            }

            const param = {
                            'type' : type,
                            'boIdx' : boIdx,
                            'mbrNo' : mbrNo
                        };

            $.ajax({
                type: 'POST',
                url: apiUrl,
                data: JSON.stringify(param),
                contentType: 'application/json',
                success: function (data) {
                    console.log(data);
                },
                error: function (e) {
                    console.warn(`[ERROR] at fetchData:${apiUrl}`, e);
                },
            });
        }
    },
};

var eqlUtil = eqlUtil || {
    // formData 조작
    FORMDATA : {
        toString : (formData) => {
            let entries = formData.entries();
            for(const pair of entries){
                console.log(`${pair[0]} : ${pair[1]}`);
            }
        },
        
        convertToObject : (formData) => {
            const formDataObj = {};
            formData.forEach((value, key) => (formDataObj[key] = value));
            return formDataObj;
        }
    }
};