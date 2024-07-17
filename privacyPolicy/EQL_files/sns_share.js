document.write('<script src="https://developers.kakao.com/sdk/js/kakao.min.js"></script>');
/**
 * 컨텐츠 목록에서 호출
 * 공유하기 버튼 onclick 에서 사용
 * obj attr에 data-media/data_title/data-url 작성
 *
 * data-media="http://local.thehandsome.com:8012/images/upload/display/trnd/43/343/343_KOR_20200320091922.jpg"
 * data-title="HTML 상품 공통코너 테스트"
 * data-url="http://-local.eqlstore.com:8052/article/archive/346/view"><span>공유하기</span></button>
 *
 * @param obj
 */ 
function shareSnsContt(obj) {
	var media = obj.data('media');
	var title = obj.data('title');
	var subtitle = obj.data('subtitle');
	var url = obj.data('url');
	
	// SNS 모달팝업 오픈
    showSnsShare(media, title, subtitle, url);

	$("#bottomSnsShare").find("[name='mediaParam']").val(media);
	$("#bottomSnsShare").find("[name='titleParam']").val(title);
	$("#bottomSnsShare").find("[name='subtitleParam']").val(subtitle);
	$("#bottomSnsShare").find("[name='urlParam']").val(url);
}

/**
 * SNS 공유
 */
function jsShareSns(type, titleParam, mediaParam, urlParam) {
	var sns_url = document.URL;
	var sns_media = $('[name=og_image]').attr("content");
	var sns_title = $('[name=og_title]').attr("content");
	var sns_meta_url = $('[name=og_url]').attr("content");
	var sns_desc = $('[name=og_desc]').attr("content");
	var cnrsUrl = document.URL;
	var confirmTF = false;

	if(urlParam != undefined && urlParam != ''){
		sns_url = urlParam;
	}
	else {
		if($('[name=urlParam]').val() != '') {
			sns_url = $('[name=urlParam]').val();
		}
		else {
			if(sns_meta_url != undefined && sns_meta_url != '') {
				sns_url	= sns_meta_url;
			}
		}
	}
	if(mediaParam != undefined && mediaParam != ''){
		sns_media = mediaParam;
	}
	else {
		if($('[name=mediaParam]').val() != '') {
			sns_media = $('[name=mediaParam]').val();
		}
	}
	if(titleParam != undefined && titleParam != ''){
		sns_title = titleParam;
		sns_title = sns_title.replace('`','\'');
	} else {
		if($('[name=titleParam]').val() != '') {
			sns_title = $('[name=titleParam]').val();
		}
		sns_title = sns_title.toString().replace('`','\'');
	}

	sns_url = sns_url.replace('http', 'https').replace('mbw',"pcw");

	// [GA4] 이벤트 태그
	let gaLabel = '';
	let gaAction = '퀵버튼_공유하기';

	if(sns_url.indexOf('/detail') > -1){
		// gaAction = '하단고정메뉴_공유하기'
	}else if(sns_url.indexOf('/lookbook') > -1){
		// gaAction = '헤더_공유하기'
	}

	var cnrsSnsCd ='';
	if (type == 'facebook') {
		cnrsSnsCd = 'FACEBUK';
		gaLabel = '페이스북';
		sns_title = encodeURIComponent(sns_title);
		sns_url = encodeURIComponent(sns_url);
		window.open("http://www.facebook.com/sharer.php?u=" + sns_url, "FaceBook", "height=500, width=620, scrollbars=yes");
	} else if (type == 'twitter') {
		cnrsSnsCd = 'TWTR';
		gaLabel = '트위터';
		sns_title = encodeURIComponent(sns_title);
		sns_url = encodeURIComponent(sns_url);
		window.open("https://twitter.com/intent/tweet?text=" + sns_title+" "+sns_url +"&source=webclient", "Twitter", "height=500, width=620, scrollbars=yes");
		//window.open("http://twitter.com/home?status=" + sns_title + " " + sns_url);
	} else if (type == 'pinterest') {
		cnrsSnsCd = 'PNTRST';
		gaLabel = '핀터레스트';
		sns_title = encodeURIComponent(sns_title);
		sns_media = encodeURIComponent(sns_media);
		sns_url = encodeURIComponent(sns_url);
		window.open("http://www.pinterest.com/pin/create/button/?url="+sns_url+"&media="+sns_media+"&description="+sns_title, "Pinterest", "height=500, width=740, scrollbars=yes");
	}
	else if(type == 'kakaostory'){
		cnrsSnsCd = 'KKOST';
		gaLabel = '카카오스토리';
		shareOnKakaoStory(sns_title, sns_url, sns_media);
	}
	else if(type == 'kakaotalk'){
		cnrsSnsCd = 'KKOTK';
		gaLabel = '카카오톡'
		shareOnKakaoTalk(sns_title, sns_url, sns_media);
	}else if(type == 'url'){
		gaLabel = 'URL';
        copyurl(sns_url);
	}

	GPGA.EVENT.setLabel(gaLabel, gaAction);
}

/*
 *※ 카카오 스토리 공유하기 ※
 */
function shareOnKakaoStory(sns_title, sns_url, media){
	try{
		Kakao.init(KAKAO_SNS_KEY);
	}catch(e){}
		Kakao.Story.share({
			url: sns_url,
			text: sns_title
		});
}

//카카오톡
function shareOnKakaoTalk(sns_title, sns_url,media) {
	try{
		Kakao.init(KAKAO_SNS_KEY);
	}catch(e){console.log(e);}

	var kakaoContent;
	if(media.indexOf("/resources/images/common/share_EQL.jpg") > -1) {
		var imgWidth = 400;
		var imgHeight = 200;
		kakaoContent = {
			title: sns_title,
			imageUrl: media,
			imageWidth: imgWidth,
			imageHeight: imgHeight,
			link: {
				mobileWebUrl: sns_url,
				webUrl: sns_url
			}
		};
	}
	else {
		kakaoContent = {
			title: sns_title,
			imageUrl: media,
			link: {
				mobileWebUrl: sns_url,
				webUrl: sns_url
			}
		};
	}

	Kakao.Link.sendDefault({
		objectType: 'feed',
		content: kakaoContent,
		buttons: [{
			title: '페이지로 이동하기',
			link: {
				mobileWebUrl: sns_url,
				webUrl: sns_url
			}
		}, {
			title: '앱으로 보기',
			link: {
				mobileWebUrl: sns_url,
				webUrl: sns_url,
				androidExecParams : "url="+sns_url,
				iosExecParams : "url="+sns_url
			}
		}]
	});
}

function copyurl(urlParam) {
	var url = document.URL;
	if(urlParam){
		url = urlParam;
	}

	var copyText = $("#copy-to-url");
	copyText.val(url).select();
    try {
        document.execCommand("copy");
        showSnsToast("URL이 복사되었습니다.");
    } catch (err) {
        showSnsToast("이 브라우저는 지원하지 않습니다.");
    }
}

 function urlPattern(pattern){
	 var cnrsUrl = document.URL;
	 var subUrl =  cnrsUrl.substring(cnrsUrl.indexOf(pattern)+pattern.length ); 
	 var split = subUrl.indexOf('/');
	 var key = '';
 
	 if('singleEvent/' == pattern){
		 key = subUrl.substring(subUrl.indexOf('EV'));
		 split = key.indexOf('/');
		 key = key.substring(0,split);	
		 
	 }else if('trend/' == pattern){
		 subUrl= subUrl.substring(split+1); 
		 
		 key = subUrl.substring(0,subUrl.indexOf('/'));
 
	 }else{
		  key = subUrl.substring(0,split);		 
	 }
	 

	 return key;
	}

function initEvent(){
	//$('.allWrap').add("*").off();
	init();
}
/**
 * 레이어 팝업 호출 ( Ajax로 Jsp(html) 가져오는 방식)
 * @param url
 * @param param
 * @param popupId 퍼블리싱 페이지의 팝업 ID
 * @param callType post/get
 * @param async true/false
 */
function loadLayer(url, param, popupId, callType, async){
	$.ajax({
		type : callType,
		async : async,
		url : url,
		data : param,
		beforeSend : function(request) {
			var csrfToken = $('meta[name="_csrf"]').attr('content') || '';
			var csrfName =  $("meta[name='_csrf_header']").attr("content")|| '';
			if (callType.toLowerCase() == 'post' && csrfName != '' && csrfToken != '') {
				request.setRequestHeader(csrfName, csrfToken);
			}
		},
		success : function(data) {
			if($(data).find('input[name="err"]').val()){
				var errUrl = $(data).find('input[name="err"]').val();
				if(errUrl  == 'expiredSession' || errUrl  == 'vulnerabilitySessionExpire' || errUrl == '403_accessDenied'){
					//alert('세션이 만료 되었습니다.');
					location.href = "/public/member/login";
				}else{
					location.href = "/errors/"+errUrl;
				}
				return;
			}

			$('[name=layerPopup]').attr("id", popupId);
			$('#'+popupId).html(data);
			setLayerPopDirect(popupId);
			initEvent();
			
		},
		error: function(xhr) {
			console.log("error");
			//토큰 만료시 페이지 리로딩
			if(xhr.status == '403'){
				location.reload();
			}else{
				/*alert(xhr.responseText);*/
			}
	    }
	});
}
/**
 * 레이어 팝업 닫기
 * @param obj
 */
function closeLayer(id){
	//console.log("obj = "+obj.id);
	$("#"+id).hide();
	$('.allWrap').removeClass('on');
	$('#wrap').css({'z-index':''});
	$('.allWrap').children().addBack().off();
	scrFix(false);
}

/**
* SNS 공유하기 모달팝업
*/
function showSnsShare(media, title, subtitle, url) {
	console.log(media)

	// Confirm 한번도 열리지 않은 경우 DOM 구조 생성. DOM 구조는 한번만 생성함
	if ($('#bottomSnsShare').length === 0) {
	    var alertHtml = `<div class="modal_wrap is_visible is_active" id="bottomSnsShare">
                        <div class="modal modal_dimmed type2">
                            <!-- modal header -->
                            <div class="modal_header">                
                                <h3>공유하기</h3>  
                            </div>
                            <!-- //modal header -->
                            
                            <!-- modal_content -->
                            <div class="modal_content">
                                <div class="share_wrap">
                                	<div class="img_box"><span class="image"><img onerror="imgErr(this)" src="${media}" alt=""></span></div>
                                	<div class="share_txt">
										<strong>${title}</strong>
										<span>${subtitle}</span>
									</div>
                                	<div class="share_link">
	                                    <a href="javascript:undefined;" onclick="jsShareSns('kakaotalk');return false;" class="share01">카카오톡 공유하기</a>
	                                    <a href="javascript:undefined;" onclick="jsShareSns('facebook');return false;" class="share02">페이스북 공유하기</a>
	                                    <a href="javascript:undefined;" onclick="jsShareSns('twitter');return false;" class="share03">트위터 공유하기</a>
	                                    <a href="javascript:undefined;" onclick="jsShareSns('url');return false;" class="share04">url 공유하기</a>
                                	</div>
                                </div>
                            </div>
                            <!-- //modal content -->
                            <button type="button" class="modal_close_btn" onclick="ModalOpenClose('#bottomSnsShare')"><span class="blind">닫기</span></button>
                        </div>
            
                        <div class="dimmer" aria-hidden="true" onclick="ModalOpenClose('#bottomSnsShare')"></div>
                        
                        <input type="hidden" id="titleParam" name="titleParam"  value="${title}"/>
						<input type="hidden" id="subtitleParam" name="subtitleParam"  value="${subtitle}"/>
                        <input type="hidden" id="mediaParam" name="mediaParam" value="${media}"/>
                        <input type="hidden" id="urlParam" name="urlParam" value="${url}"/>
                        <input id="copy-to-url" style="position:absolute; top:-9999em;" readonly="readonly" value=""/>

                    </div>`;

        $('body').append(alertHtml)
    }

    // 오픈
    ModalOpen('#bottomSnsShare');
}

/**
* 토스트 알럿
 */
function showSnsToast(msg) {
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

