/**
 * GA SETUP BY GOLDEN PLANET (PC ver.)
 * date : 2022-12-27
 */ 

 var GPGA = GPGA || {
    // GA 사용변수
    AndroidWebview : 'GA_Android',			// Android userAgent
    iOS_Webview_WK : 'GA_iOS_WK',			// WKWebView userAgent
    CommonData : new Object,
    isMoveFlag : false,
    browserInfo : navigator.userAgent,
    tmpDataLayer : new Array(),

    Convert_Element: function(RemoveValue){
        var return_Value = new Object();
        for(key in RemoveValue){
            if(RemoveValue[key] === "" || RemoveValue[key] === undefined || RemoveValue[key] === null){
            delete RemoveValue[key]
            }
        }
        return_Value = RemoveValue;
        return return_Value
    },
    
     // 공통 하이브리드 함수
    Hybrid: function(GADATA){
        var emptyObject = JSON.parse(JSON.stringify(this.Convert_Element(this.CommonData)));
        emptyObject = Object.assign(emptyObject, this.Convert_Element(GADATA))
        if (this.browserInfo.indexOf(this.AndroidWebview) > -1) window.eqlgascriptAndroid.GA_DATA(JSON.stringify(emptyObject));
        else if (this.browserInfo.indexOf(this.iOS_Webview_WK) > -1) webkit.messageHandlers.eqlgascriptCallbackHandler.postMessage(JSON.stringify(emptyObject));  
    },
    
    // 공통 화면 함수
    GA_DataScreen: function(Object, gtmCode){
        try{
            this.CommonData = Object;
            if(this.browserInfo.indexOf('GA_iOS_WK') > -1 || this.browserInfo.indexOf('GA_Android') > -1){ 
                this.CommonData.type = "screen"
                this.Hybrid(this.CommonData); 
            }else{ 
                dataLayer = [this.CommonData]; 
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer',gtmCode); //GTM 컨테이너 ID 설정
            }

            // GTM 셋팅 전에 쌓인 dataLayer 적재
            if(typeof dataLayer != 'undefined' && GPGA.tmpDataLayer.length > 0){
                GPGA.tmpDataLayer.forEach((obj)=>{ dataLayer.push(JSON.parse(JSON.stringify(obj))); });
                // console.log('[GA4] tmpDataLayer -> dataLayer Success!!\n',JSON.stringify(GPGA.tmpDataLayer));
                GPGA.tmpDataLayer = [];
            }
        }catch(e){
            if(e.message.indexOf("dataLayer")){ console.warn("[GA4] GADataScreen 함수 ERROR");}
            else{ console.warn("[GA4] APP 코드 시 ERROR") }
        }
    },
    
    // 공통 전자상거래 함수
    EcommerceSet: function(E_step, Products, actionList, addDimension, addMetric){
        try{
            if(this.browserInfo.indexOf('GA_iOS_WK') > -1 || this.browserInfo.indexOf('GA_Android') > -1){ 
                var APPData = new Object();
                APPData.EcommerceStep  = E_step;
                APPData.type  = 'ecommerce';
                APPData.Products = Products;
                APPData.transaction = actionList;
                if(APPData.transaction.currencyCode === "" || APPData.transaction.currencyCode === undefined || APPData.transaction.currencyCode === null){
                    APPData.transaction.currencyCode = "KRW"
                }
                APPData = Object.assign(APPData, addDimension, addMetric);
                this.Hybrid(APPData);
            }else{
                var EcommerceData = new Object();
                var Ecommerce = new Object();
                var EcommerceStep = E_step;
                EcommerceData = Object.assign({}, addDimension, addMetric);
                EcommerceData.event = 'ga_ecommerce';
                Ecommerce[EcommerceStep] = {actionField : {}, products : []}
                Ecommerce[EcommerceStep].products = Products;
                Ecommerce[EcommerceStep].actionField = actionList;
                if(Ecommerce.currencyCode === "" || Ecommerce.currencyCode === undefined || Ecommerce.currencyCode === null){
                    Ecommerce.currencyCode = "KRW"
                }
                EcommerceData.ecommerce = Ecommerce;

                // dataLayer 생성 이전이라면, 임시 배열 push
                if(typeof dataLayer == 'undefined'){
                    GPGA.tmpDataLayer.push(EcommerceData);
                    GPGA.tmpDataLayer.push({
                        'ecommerce' : undefined,
                        'nonInteraction' : false,
                        'category' : undefined,
                        'action' : undefined,
                        'label' : undefined,   
                        'metric1' : undefined,
                        'metric2' : undefined, 
                        'metric3' : undefined, 
                    });
                    // console.log('[GA4] 임시 배열 PUSH :: \n', JSON.stringify(GPGA.tmpDataLayer));
                }else{
                    dataLayer.push(EcommerceData)
                    dataLayer.push({
                        'ecommerce' : undefined,
                        'nonInteraction' : false,
                        'category' : undefined,
                        'action' : undefined,
                        'label' : undefined,   
                        'metric1' : undefined,
                        'metric2' : undefined, 
                        'metric3' : undefined, 
                    });
                }
        }
        }catch(e){
            if(e.message.indexOf("dataLayer")){ console.warn("[GA4] EcommerceSet 함수 ERROR");}
            else{ console.warn("[GA4] APP 코드 시 ERROR") }
        }
    },
        
    // 공통 가상페이지뷰 함수
    GA_Virtual: function(VirtualObject){
        try{
            var VirtualData = VirtualObject
            if(this.browserInfo.indexOf("GA_iOS_WK") > -1 || this.browserInfo.indexOf("GA_Android") > -1){ 
                VirtualData.type = 'screen';
                this.Hybrid(VirtualData);     
            }else{
                VirtualData.event = 'ga_virtual';

                // dataLayer 생성 이전이라면, 임시 배열 push
                if(typeof dataLayer == 'undefined'){
                    GPGA.tmpDataLayer.push(VirtualData);
                }else{
                    dataLayer.push(VirtualData);
                }
            }
        }catch(e){
            if(e.message.indexOf("dataLayer")){ console.warn("[GA4] GA_Virtual 함수 ERROR");}
            else{ console.warn("[GA4] APP 코드 시 ERROR") }
        }
    },

    // 채널 유형 체크
    chckChannel: function(appYn){
        if(appYn == 'Y') return 'APP';
        else return /Android|webOS|iPhone|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) == true ? 'MO_WEB' : 'PC_WEB';
    },

    /**
     * 맞춤 측정 값, 데이터 가공 및 셋팅 
     * @param {string} type 
     * @param {string} data 
     * @returns 
     */
    setDimesion: function(type, data){
        let result = 'U';
        try {
            if(type == null || data == null || data == '') result = 'U';
            else if(type == 4) {
                const arr = data.split(' ');
                result = arr[0] + ' ' + arr[1];
            }else if(type == 10) {
                result = Math.floor((new Date().getFullYear() - Number(data))/5) * 5;    // 고객_연령대
            }
        } catch (error) {
            console.error('[GA4] setDimesion', error);
            result = 'U';
        } finally {
            return result;
        }
    },

    /**
     * 온라인 등급명 가져오기
     * @deprecated - userTag단 처리로 대체
     * @returns {String} onlineGrdCdNm
     */
    getOnlineGrd: function(){
        return new Promise(function(resolve, reject){
            $.ajax({
                type : "GET",
                url : "/secured/member/getOnlineGrdCdNm.json",		
                data : '',							
                success : function(data) {
                    resolve(data.onlineGrdCdNm);
                },
                error: function(error) {
                    console.error('[GA4] getOnlineGrd :: ',error);
                    resolve('U');
                }
            });
        });
    },

    /**
     * 파라미터 내의 역슬래시(backslash, \) 값을 공백으로 치환
     *  + 치환된 문자(^) 또한 공백으로 치환
     * @param {stirng} txt 
     */
    escpSlash: function(txt){
        try {
            const result = txt.replace(/[\\^]/ig, "")
            return result;
        } catch (error) {
            console.error('[GA4] escpSlash', error);
            return txt;
        }
    },

    /**
     * 파라미터 내의 따옴표 값을 특수문자(^)로 치환(백슬래시 치환 불가)
     * @param {stirng} txt 
     */
    escpQt: function(txt){
        try {
            let result = txt.replaceAll("\'","^").replaceAll("\"","^");
            return result;
        } catch (error) {
            console.error('[GA4] escpQt', error);
            return txt;
        }
    },

    /**
     * [최종] 데이터 셋팅 및 맞춤정의 전송 단계
     * @deprecated
     * @param {Object} paramObj - 맞춤정의가 정의된 객체
     * @param {string} gtmCode - GTM-CODE
     */
    sendData: async function (paramObj, gtmCode){
        if(paramObj.dimension14 == 'Y' && paramObj.dimension11 == ''){
            paramObj.dimension11 = await GPGA.getOnlineGrd();       // ajax 동기 처리
        }
        // console.log('[GA4] send data', paramObj);
        GPGA.GA_DataScreen(paramObj, gtmCode);                               // GA로 데이터 전송
    },

    // 페이지뷰
    PAGEVIEW : {
        // GA 전달하는 최종 depth 결과 저장 
        dpthArray : [],

        /**
         * 파라미터로 들어온 값을 페이지 제목 배열에 PUSH
         * @param {stirng || Array} param 
         */
        pushDpth: function(param){
            try {
                if(typeof param == 'undefined' || param == '') throw new Error('param is empty...');

                if(typeof param == 'string'){           // 문자열
                    GPGA.PAGEVIEW.dpthArray.push(param);
                }else if(Array.isArray(param) == true){ // 배열
                    param.forEach((item)=>{GPGA.PAGEVIEW.dpthArray.push(item)});
                }
            } catch (error) {
                // GPGA.PAGEVIEW.dpthArray = [];
                console.error('[GA4] PAGEVIEW.pushDpth', error);
            }
        },

        /**
         * 전체 URL 검사 후 타이틀 지정
         * @param {Object} dict - 전체 URL에서 검사할 key와 그에 매핑되는 value를 정의
         * @returns 
         */
        setByIndexOf: function(dict){
            const now = location.href;
            for (const key in dict) {
                if(now.indexOf(key) > -1) return GPGA.PAGEVIEW.pushDpth(dict[key]);
            }
        },

        /**
         * 정보 추출(요소 선택자명)
         * @param {string} target - innerText를 추출할 element 요소의 선택자명
         */
        getNameByElement: function(target){
            try {             
                return document.querySelector(target)?.innerText;
            } catch (error) {
                console.error('[GA4] PAGEVIEW.getNameByElement', error);
            }
        },
        
        /**
         * 정보 추출(공유 버튼 기준)
         * - 공유버튼 내의 dataset을 활용하여 현재 문서의 제목 추출
         * @param {string} target - dataset을 추출할 element 요소의 선택자명
         * @returns 
         */
        getNameByDataset: function(target){
            try {
                const elem = document.querySelector(target);
                // dataset 내의 url 값 location 대체
                if(pageviewObj == true) pageviewObj.location = elem.dataset.url;

                return elem?.dataset?.title;
            } catch (error) {
                console.error('[GA4] PAGEVIEW.getNameByDataset', error);
            }
        },

        /**
         * Meta Tag 내의 정보를 활용하여 정보 추출
         * @param {string} name 
         * @returns 
         */
        getTitleByMetaTag: function(name){
            try {
                const text = document.querySelector(`meta[name="${name}"]`)?.content;
                if(typeof text != 'undefined' && text != 'EQL STORE') return text;
            } catch (error) {
                console.error('[GA4] PAGEVIEW.getTitleByMetaTag', error);
            }
        },

        /**
         * 카테고리 리스트의 뎁스를 셋팅함
         */
        setProductsList: async function(){
            try {
                let fullCtgryNm = await GPGA.PAGEVIEW.setGACategry();
                GPGA.PAGEVIEW.dpthArray = [];

                const arr = fullCtgryNm.split('/');
                arr.forEach((item, idx)=>{ GPGA.PAGEVIEW.dpthArray[idx] = item; });
                return 'done';
            } catch (error) {
                GPGA.PAGEVIEW.dpthArray = [];
                console.error('[GA4] PAGEVIEW.setProductsList', error);
                return error;
            }
        },

        /**
         * array idx에 따라 페이지 뎁스 설정;
         * @param {string} item - 페이지명
         * @param {Number} depth - 뎁스 순서
         */
        setPageDimesion: function(item, depth){
            switch(depth){
                case 0 : pageviewObj.dimension17 = item; break; // 페이지_1Depth
                case 1 : pageviewObj.dimension18 = item; break; // 페이지_2Depth
                case 2 : pageviewObj.dimension19 = item; break; // 페이지_3Depth
                // case 3 : pageviewObj.dimension20 = item; break; // 페이지_4Depth (미사용)
            }
        },

        /**
         * 페이지 뎁스 배열을 맞춤 정의 항목으로 변환 및 할당
         */
        setPageTitle: function(){
            let title = '';
            try {
                if(pageviewObj == false) throw new Error('pageviewObj is empty');
                if(!GPGA.PAGEVIEW.dpthArray) throw new Error('depth array is empty');
                
                // depth4 제외
                const maxIdx = GPGA.PAGEVIEW.dpthArray.length === 4 ? 3 : GPGA.PAGEVIEW.dpthArray.length;
                GPGA.PAGEVIEW.dpthArray.forEach((item, idx)=>{
                    if(idx < maxIdx){
                        GPGA.PAGEVIEW.setPageDimesion(item, idx);
                        title += item;
                        if(idx < maxIdx - 1) title += '>';
                    }
                });
            } catch (error) {
                console.error('[GA4] PAGEVIEW.setPageTitle', error);
                title = document.title;
            } finally {
                pageviewObj.title = title;
            }
        },

        /**
         * GNB 내 DOM 클래스 정보를 통해, 현재 GA Category 정보를 셋팅
         */
        setGACategry: function(){
            return new Promise(function(resolve, reject){
                try {
                    var fullCtgryNm = '';
                    var lCtgryNm = '';
                    var mCtgryNm = $('.category-depth-1').text();
                    if(typeof $('.gnb-list-menu.depth-1.on')[0] != "undefined"){
                        lCtgryNm = $('.gnb-list-menu.depth-1.on')[0].innerText;
                        fullCtgryNm = lCtgryNm;
                    }
                    if(mCtgryNm != ''){     
                        fullCtgryNm = fullCtgryNm + '/' + mCtgryNm;	
                    }
                    for(var i=0; i<2; i++){
                        if(typeof $('.active')[i] !="undefined"){
                            fullCtgryNm = fullCtgryNm + '/' + $('.active')[i].innerText;
                        }
                    }
                    fullCtgryNm = fullCtgryNm.toUpperCase();
                    $('input[name=fullDspNm]').val(fullCtgryNm);
        
                    resolve(fullCtgryNm);
                } catch (error) {
                    reject(error);
                }
            });
        },

        /**
         * 가상페이지뷰 전송 전 데이터 셋팅 진행
         * - 기존 페이지뷰를 deep copy이후, 새로운 값으로 셋팅하여 전달
         * @param {string} godNm 
         * @param {string} url 
         */
        setVirtualObj: function(godNm, url){
            try {
                if(typeof godNm == 'undefined' || typeof url == 'undefined') throw new Error('setVirtualObj param is empty...');
                
                let virtualPageviewObj = JSON.parse(JSON.stringify(pageviewObj));
                virtualPageviewObj.title = '상품상세>' + godNm;
                virtualPageviewObj.location = location.origin + url;
                virtualPageviewObj.dimension17 = '상품상세';
                virtualPageviewObj.dimension18 = godNm;

                GPGA.GA_Virtual(virtualPageviewObj);
            } catch (error) {
                console.warn('[GA4] PAGEVIEW.setVirtualObj() ', error);
            }
        }
    },

    // 이벤트 태그
    EVENT: {
        // Global variable for event tag
        global : {
            ctgry : '',
            action : '',
            label : '',
        },

        /**
         * 상위 트리에 선언하여 이벤트를 셋업
         * - 이벤트 위임 패턴
         * 
         * ㅁ. ga-type
         *  - upper : ul>li 처럼 이벤트가 발생하는 상위 요소에서 선언. 클릭 위치가 upper 인 경우, 포함하지 않도록 처리.
         *  - current : 발생 요소 혹은 클릭 요소 중 current가 있는 경우, 해당 요소의 ga-label을 가져오도록 처리.
         * @param {event} event
         */
        setup: function(event){
            const elem = event.currentTarget;
            const clickedElem = event.target;

            const type1 = clickedElem.getAttribute('ga-type');
            const type2 = elem.getAttribute('ga-type');
            if(type1 == 'upper') return;

            let label = '';
            if(type1 == 'current' || type2 == 'current'){
                label = elem.getAttribute('ga-label');
            }else{
                label = clickedElem.getAttribute('ga-label');
            }

            const ctg = elem.getAttribute('ga-ctgry') || GPGA.EVENT.global.ctgry;
            let category = this.cnvrtFormatChCtgry(ctg);
            let action = elem.getAttribute('ga-action');

            if(label == null) label = clickedElem.innerText;

            this.pushData(category, action, label);
        },
        
        /**
         * 이벤트 값을 모두 파라미터로 받아서 셋팅
         * e.g) onclick="GPGA.EVENT.set(카테고리,액션,라벨)"
         * @param {string} ctg 
         * @param {string} action 
         * @param {string} label 
         */
        set: function(ctg, action, label){
            let category = this.cnvrtFormatChCtgry(ctg);
            this.pushData(category, action, label);
        },

        /**
         * label과 action만 수동으로 입력받아 사용
         * - 카테고리는 전역변수(ctgry) 값 사용
         * - 액션 값 파라미터 없을 시, 글로벌 변수 체크
         * e.g) onclick="GPGA.EVENT.set(라벨,액션)"
         * @param {string} label 
         * @param {string} param_action 
         */
        setLabel: function(label, param_action){
            try {
                if(GPGA.EVENT.global.ctgry == '') throw new Error('EVENT Global variable(ctgry) is empty...');

                let category = this.cnvrtFormatChCtgry(GPGA.EVENT.global.ctgry);
                let action = param_action != undefined && param_action != '' ? param_action : GPGA.EVENT.global.action;
                
                this.pushData(category, action, label);
            } catch (error) {
                console.error('[GA4] EVENT.setLabel', error);
            }
        },

        /**
         * 카테고리 메뉴의 data-upper-depth 값을 활용하여 GA 값 셋팅
         * - 사용 영역 : /display/productsList 위 GNB 영역
         * @param {event} event 
         */
        setDptEvt: function(event){
            const ctg = GPGA.EVENT.cnvrtFormatChCtgry(GPGA.PAGEVIEW.dpthArray[0]);

            const tgt = event.target;
            const action = '카테고리메뉴_' + tgt?.dataset.upperDepth;
            const label = tgt?.innerText;

            this.pushData(ctg, action, label);
        },

        /**
         * 카테고리 메뉴의 data-upper-depth 값을 활용하여 GA 값 셋팅
         * - 사용 영역 : /display/gnbList
         * @param {event} event 
         * @param {string} depth1 
         */
        setGnbDptEvt: function(event, depth1){
            const ctg = GPGA.EVENT.cnvrtFormatChCtgry('SHOP');
            const action = '카테고리메뉴';

            const tgt = event.target;
            const label = GPGA.EVENT.cnvrtFormatUndDepth([depth1, tgt.dataset.upperDepth, tgt.innerText]);

            this.pushData(ctg, action, label);
        },

        /**
         * 지정한 카테고리 값으로 변환 {디바이스_카테고리명}
         * e.g. PC_이벤트 / MO_상품상세 / APP_검색
         * @param {string} param 
         * @returns 
         */
        cnvrtFormatChCtgry: function(param){
            // let ch = pageviewObj.dimension13 == '' ? GPGA.chckChannel() : pageviewObj.dimension13;
            if(typeof param == 'undefined' || param.indexOf('undefined') > -1) return undefined;
            let ch = 'PC';

            return ch + '_' + param;
        },

        /**
         * Array 값들을 언더바(_)로 이어진 한 문자열로 변환
         * e.g. WOMEN_BEST_ALL BEEST
         * @param {Array} param 
         */
        cnvrtFormatUndDepth: function(param){
            let result = '';

            param.forEach((item, idx)=>{
                result += item;
                if(idx < param.length - 1) result += '_';
            });

            return result;
        },

        /**
         * 이벤트 태깅용 전역변수 설정
         * @param {string} key 
         * @param {string} value 
         */
        setGlobalVar: function(key, value){
            try {
                switch(key){
                    case 'C': GPGA.EVENT.global.ctgry = value; break;
                    case 'A': GPGA.EVENT.global.action = value; break;
                    case 'L': GPGA.EVENT.global.label = value; break;
                    default : GPGA.EVENT.global[key] = value; break;
                }
            } catch (error) {
                // GPGA.EVENT[key] = '';
                console.error('[GA4] EVENT.setGlobalVar', error);
            }
        },

        /**
         * 이벤트 태깅용 전역변수 초기화
         */
        initGlobal: function(){
            GPGA.EVENT.global = {
                ctgry : '',
                action : '',
                label : '',
            };
        },

        /**
         * 전달받은 변수를 dataLayer에 push
         * @param {sting} category 
         * @param {sting} action 
         * @param {sting} label 
         * @returns 
         */
        pushData: function(category, action, label){
            try{
                // 파라미터 검증
                for (const key in arguments) {
                    if(typeof arguments[key] == 'undefined' || arguments[key] == '') throw new Error(`param(${key}) is empty...`);
                }
            
                let GAData = {
                    "event_name" : "click_event",
                    "category" : GPGA.escpSlash(category),
                    "action" : GPGA.escpSlash(action),
                    "label" : GPGA.escpSlash(label),
                };
            
                // 디바이스 상태에 따라 객체명, 속성값 별도 지정
                if(GPGA.browserInfo.indexOf('GA_iOS_WK') > -1 || GPGA.browserInfo.indexOf('GA_Android') > -1){ 
                    GAData.type = "event";
                    GPGA.Hybrid(GAData);
                }else{
                    GAData.event = "ga_event";
                    // dataLayer 생성 이전이라면, 임시 배열 push
                    if(typeof dataLayer == 'undefined'){
                        GPGA.tmpDataLayer.push(GAData);
                    }else{
                        dataLayer.push(GAData);
                    }
                }
            
                // console.log('EVENT.pushData() ::' + category + ' / ' + action + ' / ' + label);
            }catch(e){
                console.error('[GA4] EVENT.pushData', e);
                console.warn('[ERR] %s / %s / %s', category, action, label);
                if(e.message.indexOf("dataLayer")){ console.warn("pushData 함수 ERROR");}
                else{ console.warn("APP 코드 시 ERROR") }
            }
        },
    },

    /**
     * URL을 기준으로 GA 측정 항목 셋업
     */
    setupByUrl: function(){
        return new Promise(function(resolve, reject) {
            try {
                const urlObj = new URL(location.href);
                const url = urlObj.pathname;
                
                if(url.indexOf('/display/snbList') > -1){
                    GPGA.PAGEVIEW.setProductsList();        // 페이지뷰
                    // 이벤트
                    GPGA.EVENT.setGlobalVar('C', 'CATEGORY');
                    GPGA.EVENT.setGlobalVar('A', '상품목록');
                    if(GPGA.PAGEVIEW.dpthArray?.length != 0){
                        const dptUnder = GPGA.EVENT.cnvrtFormatUndDepth(GPGA.PAGEVIEW.dpthArray);
                        GPGA.EVENT.setGlobalVar('C', dptUnder);
                    }
                }
                else if(url.indexOf('/display/productsList') > -1){
                    GPGA.EVENT.setGlobalVar('C', 'CATEGORY');
                    GPGA.EVENT.setGlobalVar('A', '상품목록');
                }else if(url.indexOf('/thema/exclusive') > -1){
                    GPGA.PAGEVIEW.pushDpth('EQL EXCLUSIVE');

                    // 이벤트
                    GPGA.EVENT.setGlobalVar('C', 'EQL_EXCLUSIVE');
                    GPGA.EVENT.setGlobalVar('A', '상품목록');
                }else if(url.indexOf('/brands') > -1){
                    GPGA.PAGEVIEW.pushDpth(['BRAND','Brandlist']);
                    
                    if(url.indexOf('/brands/main') > -1){
                    	//AS-IS
//                        const brndNm = GPGA.PAGEVIEW.getNameByElement('.profile-name .fullname');
                    	//TO-BE
                        const brndNm = GPGA.PAGEVIEW.getNameByElement('.prd_title p');
                        GPGA.PAGEVIEW.pushDpth(brndNm);
                        // 이벤트
                        GPGA.EVENT.setGlobalVar('C', 'BRAND_' + brndNm);
                        GPGA.EVENT.setGlobalVar('A', '상품목록');
                    }else{
                        // 이벤트
                        GPGA.EVENT.setGlobalVar('C', 'BRAND');
                    }
                }else if(url.indexOf('/article/lookbook') > -1){
                    GPGA.PAGEVIEW.pushDpth(['BRAND','Lookbook']);

                    if(url.indexOf('/view') > -1){
                    	//AS-IS
//                    	const brndNm = GPGA.PAGEVIEW.getNameByElement('.profile-name .fullname');
                        //TO-BE
                        const brndNm = GPGA.PAGEVIEW.getNameByElement('.info_area .brand');
                        //AS-IS
//                        const lkbkNm = GPGA.PAGEVIEW.getNameByElement('.lookbook-title');
                        //TO-BE
                        const lkbkNm = GPGA.PAGEVIEW.getNameByElement('.tit_area .tit');
                        GPGA.PAGEVIEW.pushDpth(brndNm);

                        GPGA.EVENT.setGlobalVar('C', 'LOOKBOOK_'+lkbkNm);
                        GPGA.EVENT.setGlobalVar('A', '상품목록');
                    }else{ // 메인
                        GPGA.EVENT.setGlobalVar('C', 'LOOKBOOK');
                    }
                }else if(url.indexOf('/article/archive') > -1){
                    GPGA.PAGEVIEW.pushDpth('DISCOVER');
                    
                    if(url.indexOf('/view') > -1){
                        const title = GPGA.PAGEVIEW.getTitleByMetaTag('og_title');
                        GPGA.PAGEVIEW.pushDpth(title);
                        
                        // 이벤트
                        GPGA.EVENT.setGlobalVar('C', 'DISCOVER_' + title);
                    }
                }else if(url.indexOf('/event/list') > -1){
                    GPGA.PAGEVIEW.pushDpth('EVENT');
                    GPGA.EVENT.setGlobalVar('C', 'EVENT');
                    GPGA.EVENT.setGlobalVar('A', 'ALL_이벤트목록');
                    
                }else if(url.indexOf('/event') > -1 || url.indexOf('/special') > -1){
                    GPGA.PAGEVIEW.pushDpth('EVENT');
                    const title = GPGA.PAGEVIEW.getTitleByMetaTag('og_title');
                    GPGA.PAGEVIEW.pushDpth(title);

                    // 이벤트
                    GPGA.EVENT.setGlobalVar('C', 'EVENT_' + title);
                    GPGA.EVENT.setGlobalVar('A', '상품목록');
                }else if(url.indexOf('/secured/mypage') > -1){
                    GPGA.PAGEVIEW.pushDpth('MY');

                    if(url.indexOf('/mypage/pwdConfirm') > -1){
                        if(location.href.indexOf('updateMember') > -1) GPGA.PAGEVIEW.pushDpth('회원정보수정 본인인증');
                        else GPGA.PAGEVIEW.pushDpth('회원탈퇴 본인인증');
                    }else if(url.indexOf('/mypage/updateMember') > -1){
                        GPGA.PAGEVIEW.pushDpth('회원정보수정');
                    }else if(url.indexOf('/mypage/myMemberShipInfo') > -1){
                        GPGA.PAGEVIEW.pushDpth('회원등급');
                    }else if(url.indexOf('/mypage/myHsMile') > -1){
                        GPGA.PAGEVIEW.pushDpth('한섬마일리지');
                    }else if(url.indexOf('/mypage/memberSecessionMall') > -1){
                        GPGA.PAGEVIEW.pushDpth(['회원탈퇴', 'EQL 회원탈퇴']);
                    }else if(url.indexOf('/mypage/memberSecession') > -1){
                        GPGA.PAGEVIEW.pushDpth('회원탈퇴');
                    }else if(url.indexOf('/mypage/myCouponList') > -1){
                        GPGA.PAGEVIEW.pushDpth('COUPON');
                    }else if(url.indexOf('/mypage/eqlMyGoodsReviewList') > -1){
                        GPGA.PAGEVIEW.pushDpth('상품리뷰');
                    }else if(url.indexOf('/mypage/listOrder') > -1){
                        GPGA.PAGEVIEW.pushDpth('주문/교환/반품/취소');
                    }else if(url.indexOf('/mypage/myInquiryList') > -1){
                        GPGA.PAGEVIEW.pushDpth('1:1 문의');
                    }else if(url.indexOf('/mypage/csInquiry') > -1){
                        GPGA.PAGEVIEW.pushDpth(['1:1 문의', '1:1문의등록']);
                    }else if(url.indexOf('/mypage/myQnaList') > -1){
                        GPGA.PAGEVIEW.pushDpth('상품 Q&A');
                        if(location.href.indexOf('ANS_WAIT') > -1) GPGA.PAGEVIEW.pushDpth('답변대기');
                        else if(location.href.indexOf('ANS_COMPT') > -1) GPGA.PAGEVIEW.pushDpth('답변완료');
                        else GPGA.PAGEVIEW.pushDpth('전체');
                    }else if(url.indexOf('/mypage/eventList') > -1){
                        GPGA.PAGEVIEW.pushDpth('이벤트 참여내역');
                    }else if(url.indexOf('/mypage/handsomeSwitchJoin') > -1){
                        GPGA.PAGEVIEW.pushDpth('한섬 멤버십 통합');
                    }
                }else if(url.indexOf('/equal/') > -1){
                    GPGA.PAGEVIEW.pushDpth('EQUAL');
                    
                    // 이벤트
                    GPGA.EVENT.setGlobalVar('C', 'EQUAL');
                    if(url.indexOf('/equalList') > -1){
                        GPGA.PAGEVIEW.pushDpth('ALL');
                        if(location.href.indexOf('MB202005220000035') > -1) {
                            // 디스커버 이퀄팀
                            GPGA.EVENT.setGlobalVar('C', 'DISCOVER_EQUAL_TEAM');
                        }
                    }else if(url.indexOf('/equalGodList')){
                        GPGA.PAGEVIEW.pushDpth('Products');
                        GPGA.EVENT.setGlobalVar('A', 'Products_상품목록');
                    }else if(url.indexOf('/equalBrndList')){
                        GPGA.PAGEVIEW.pushDpth('Brands');
                        GPGA.EVENT.setGlobalVar('A', 'Brands_상품목록');
                    }
                }else if(url.indexOf('/public/common') > -1){
                    GPGA.PAGEVIEW.pushDpth('COMPANY');
                    
                    if(url.indexOf('/common/aboutEqlPc') > -1){
                        GPGA.PAGEVIEW.pushDpth('ABOUT EQL');
                    }else if(url.indexOf('/useAgr') > -1){
                        GPGA.PAGEVIEW.pushDpth('이용약관');
                    }else if(url.indexOf('/privacyPolicy') > -1){
                        GPGA.PAGEVIEW.pushDpth('개인정보처리방침');
                    }
                }else if(url.indexOf('/public/helpdesk') > -1){
                    GPGA.PAGEVIEW.pushDpth('HELP');
                    
                    if(url.indexOf('/helpdesk/faqList') > -1){
                        GPGA.PAGEVIEW.pushDpth('FAQ');
                    }else if(url.indexOf('/helpdesk/noticeList') > -1){
                        GPGA.PAGEVIEW.pushDpth('공지사항');
                    }else if(url.indexOf('/helpdesk/affInquiry') > -1){
                        GPGA.PAGEVIEW.pushDpth('제휴문의');
                    }else if(url.indexOf('/helpdesk/vendorRequest') > -1){
                        GPGA.PAGEVIEW.pushDpth('입점상담');
                    }else if(url.indexOf('/helpdesk/mbrshipGrdBenefit') > -1){
                        GPGA.PAGEVIEW.pushDpth('멤버십안내');
                    }
                }else if(url.indexOf('/public/search/view') > -1){
                    // 페이지뷰
                    GPGA.PAGEVIEW.pushDpth(['검색', '검색결과']);
                    
                    // 맞춤정의
                    const type = urlObj.searchParams.get('ga_type');
                    const keyword = decodeURIComponent(urlObj.searchParams.get('searchWord'));
                    if(typeof pageviewObj != 'undefined'){
                        let d16 = '';
                        switch(type){
                            case 'HOT':     d16 = '인기검색어'; break;
                            case 'RECENT':  d16 = '최근검색어'; break;
                            case 'SEASON':  d16 = '시즌키워드'; break;
                            default: d16 = '직접입력';
                        }
                        pageviewObj.dimension15 = keyword;         // 검색_검색어
                        pageviewObj.dimension16 = d16;             // 검색_검색유형
                    }

                    // 이벤트
                    GPGA.EVENT.set('공통', 'SEARCH_검색', '검색_' + keyword);
                    GPGA.EVENT.set('SEARCH_RESULT', '검색', '검색_' + keyword);

                    GPGA.EVENT.setGlobalVar('C', 'SEARCH_RESULT');
                    GPGA.EVENT.setGlobalVar('A', 'PRODUCT_상품목록');
                }else if(url.indexOf('/public/member/addMemberStep1') > -1){
                    GPGA.PAGEVIEW.pushDpth('JOIN');
                    
                }else if(url.indexOf('/public/member/login') > -1){
                    GPGA.PAGEVIEW.pushDpth('로그인');
                    
                }else if(url.indexOf('/public/member/searchNonMemberOrder') > -1){
                    GPGA.PAGEVIEW.pushDpth(['로그인', '비회원 주문조회']);
                }else if(url.indexOf('/public/cart') > -1){
                    GPGA.PAGEVIEW.pushDpth('CART');
                    
                    // 이벤트
                    GPGA.EVENT.setGlobalVar('C', '장바구니');
                }else if(url.indexOf('/product/') > -1){
                    GPGA.PAGEVIEW.pushDpth('상품상세');
                    //AS-IS
//                    GPGA.PAGEVIEW.pushDpth(GPGA.PAGEVIEW.getNameByElement('#prod-detail-info .prod-name'));
                    //TO-BE
                    GPGA.PAGEVIEW.getNameByElement('.prd_title .line_2');		
                    // 이벤트
                    GPGA.EVENT.setGlobalVar('C', '상품상세');
                }else if(url.indexOf('/secured/order/new') > -1){
                    GPGA.PAGEVIEW.pushDpth('ORDER');
                }else if(url.indexOf('/complete') > -1){
                    GPGA.PAGEVIEW.pushDpth('ORDER');

                    // 이벤트
                    GPGA.EVENT.setGlobalVar('C', 'ORDER_COMPLETED');
                }else if(url.indexOf('/main') > -1){
                    GPGA.PAGEVIEW.pushDpth('메인');

                    // 이벤트
                    GPGA.EVENT.setGlobalVar('C', '홈메인');
                    GPGA.EVENT.setGlobalVar('A', '상품목록');

                    (()=>{
                        const arr1 = document.querySelectorAll('.brand-list li');
                        arr1.forEach((item)=>{
                            let text = item.innerText;
                            if(text.substr(-1) === ',') text = text.slice(0,-1);

                            item.addEventListener('click', ()=>{
                                GPGA.EVENT.setLabel(text, '키워드배너');
                            });
                        });
                    })();
                }

                resolve('done');
            } catch (error) {
                reject(error);
            }
        });
    },
};
