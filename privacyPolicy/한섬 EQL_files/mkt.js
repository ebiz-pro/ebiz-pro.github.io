/**
 * Script for Marketing Solution
 * 
 * 마케팅 솔루션(braze 등)을 위한 스크립트 
 */

var MKT = MKT || {
    // common variable
    cmmn : {
        ctgryCdArray : [],
        ctgryNmArray : [],
    },

    // common functions
    fn : {
        /**
         * [공통기능] .img-viewer div내의 backgorund-image에서 url 부분을 추출
         * 
         * @param {object} param 
         * @returns 
         */
        getImageUrl : (param) => {
            try {
                if(typeof param != 'object') throw new Error('param type is wrong...');
                
                const inlineStyle = param.style.backgroundImage;
                const tmpArr = inlineStyle.split('url(');
                return tmpArr[1]?.replace(/[\"\'\),]/gi, '').trim();
            } catch (error) {
                console.warn('[MKT]', error);
            }
        },

        /**
         * [공통기능] 문자열 내의 싱글/더블 쿼테이션을 제거
         * 
         * @param {string} param 
         * @returns 
         */
        cnvrtRemoveQt : (param) => {
            return param.replace(/[\"\']/gi, '');
        },

        /**
         * [공통기능] Java Date format을 JS Date객체로 변환
         * e.g. Wed Feb 01 15:59:59 KST 2023(Java) -> new Date(Wed Feb 01 2023 15:59:59)
         * 
         * @param {string} param 
         */
        cnvrtDateToJsFormat : (param) => {
            const tmpArr = param.split(' ');
            let newArr = [];

            tmpArr.forEach((item, idx) => {
                if(idx > 3) return;
                if(idx == 3) newArr.push(tmpArr[tmpArr.length-1]);
                newArr.push(item);
            });

            return new Date(newArr.join(' '));
        },

        /**
         * [공통기능] JS Date를 YYYYMMDDHHssmm 형식으로 변환
         * 
         * @param {Date} timeObj - new Date()의 값
         * @returns 
         */
        cnvrtDateFormat : (timeObj) => {
            try {
                const txtAr = timeObj.toISOString().split('T');
                const date = txtAr[0];
                const time = txtAr[1].split('.')[0];

                let result = date.replaceAll('-','');
                result += time.replaceAll(':','');
                return result;
            } catch (error) {
                console.warn('[ERROR] at cnvrtDateFormat...', error);
                return '';
            }
        },

        /**
         * [공통기능] KST 반영을 위한 timezone 셋팅된 객체 변환
         * - toISOString() 시 KST를 반영하기 위함
         * 
         * @param {string} timeTxt 
         * @returns Date 객체 반환
         */
        cnvrtDateKST : (timeTxt) => {
            const timezoneOffset = new Date().getTimezoneOffset() * 60000;
            return new Date(new Date(timeTxt).getTime() - timezoneOffset);
        },

        /**
         * [공통기능] 호스트네임이 제외된 URL을 FULL URL로 변환
         * 
         * @param {string} param 
         * @returns
         */
        cnvrtFullUrl : (param) => {
            const urlObj = new URL(location.href);
            return urlObj.origin + param;
        },

        /**
         * [공통기능] 문자의 기존 구분자를 새로운 구분자로 변환
         * e.g. a/b/c -> a^b^c
         * 
         * @param {string} param 
         * @param {string} target 
         * @param {string} newSprt 
         * @returns 
         */
        cnvrtSprtArray : (param, target, newSprt) => {
            const tmpArr = param.split(target);
            let newArr = [];
            tmpArr.forEach(item => {
                if(item !== '') newArr.push(item);
            });

            return newArr.join(newSprt);
        },

        /**
         * [공통기능] 복수의 조건 값 중, 최하위(Leaf) value를 반환
         * cateCd는 카테고리 뎁스별 4개가 존재하고 있으며, 그 중 가장 마지막 값을 반환
         * 
         * @param {object} param 
         * @param {Number} lastIdx 
         * @returns 
         */
        getLeafValue : (param, lastIdx) => {
            try {
                if(typeof param != 'object') throw new Error('param type is not Object...');
                
                for(let i = lastIdx ; i >= 0 ; i--){
                    const result = param[i]?.value;
                    if(typeof result !== 'undefined' && result !== '') return result;
                }
                return '';
            } catch (error) {
                console.warn('[MKT]', error);
            }
        },

        /**
         * [공통기능] APP 데이터 정합성을 위한 전처리
         * - null / 미선언 시, '' 빈 스트링으로 대체
         * 
         * @param {object} param 
         * @returns 
         */
        validationObj : (param) => {
            for(const key in param){
                if(typeof param[key] == 'undefined' || param[key] === null) param[key] = '';
            }
            return param;
        },

        // [공통기능] 가운데 문자 마스킹 처리
        masking : function(strName) {
            if (strName.length > 2) {
                var originName = strName.split('');
                originName.forEach(function(name, i) {
                    if (i === 0 || i === originName.length - 1) return;
                    originName[i] = '*';
                });
                var joinName = originName.join();
                return joinName.replace(/,/g, '');
            } else {
                var pattern = /.$/; // 정규식
                return strName.replace(pattern, '*');
            }
        },

        /**
         * [공통기능] 카테고리 뎁스 배열을 셋팅함
         *  현재 선택된 LNB에 따라 카테고리 뎁스를 셋팅함
         */
        setCtgryArray : function() {
            try {
                const domLnb = document.querySelector('.lnb ul.left_menu');
    
                MKT.cmmn.ctgryCdArray = [];
                MKT.cmmn.ctgryNmArray = [];
    
                const classNames = ['li a.ctgry-menu', 'li.on a.ctgry-menu', 'li.on ul.sub_menu .ctgry-menu.on a.ctgry-menu'];
    
                for (let idx = 0; idx < classNames.length; idx++) {
                    let result = MKT.fn.getCtgryData(classNames[idx], domLnb);
    
                    const isAllCtg = (MKT.cmmn.ctgryCdArray[MKT.cmmn.ctgryCdArray.length-1] == result.cd) ? true : false;
                    if(result.msg == 'fail' || isAllCtg == true){
                        // if(isAllCtg) MKT.cmmn.ctgryNmArray.push('전체');
                        break;
                    }else{
                        MKT.cmmn.ctgryCdArray.push(result.cd);
                        MKT.cmmn.ctgryNmArray.push(result.nm);
                    }
                }
            } catch (error) {
                console.warn('[ERROR] at setCtgryArray...', error);
            }
        },

        /**
         * [공통기능] 카테고리 뎁스 셋팅 함수
         *  dataset 내의 정보를 추출하여 객체로 return
         * 
         * @param {string} className 
         * @param {object} dom 
         * @returns 
         */
        getCtgryData : function(className, dom){
            const result = {msg:'fail', cd:'', nm:''};
            try {
                const elem = dom.querySelector(className);
                if(elem != null){
                    result.msg = 'success';
                    result.cd = elem.dataset.dspCtgryNo;
                    result.nm = elem.dataset.dspCtgryNm;
                }
            } catch (error) {
                console.warn('[ERROR] at getDepthData...', error);
            } finally {
                return result;
            }
        }
    },

    // Braze
    BRAZE : {
        apiKey : '',

        /**
         * [커스텀 이벤트] 브레이즈 logCustomEvent 이벤트 트리거
         * 
         * @param {string} name 
         * @param {param} param 
         */
        triggerCustEvent : (name, param) => {
            // 미사용
            return;
            try {
                if(typeof braze == 'undefined') throw new Error('braze is not initialized ...');
                const newParam = MKT.fn.validationObj(param);

                braze.logCustomEvent(name, newParam);
                // console.log(`[MKT_Braze] ${name}, Success!\n\n${JSON.stringify(newParam)}`);
            } catch (error) {
                console.warn('[MKT_Braze] error at triggerCustEvent...', error);
            }
        },

        /**
         * [커스텀 속성] 브레이즈 setCustomUserAttribute 이벤트 트리거
         * - 속성명에 따라 분기 처리(array, time 등)
         * 
         * @param {string} name 
         * @param {string} value 
         * @param {string} flag 
         * @returns 
         */
        triggerCustAttr : (name, value, flag) => {
            // 미사용
            return;
            if(typeof value == 'undefined' || value == '' || value == null) return;

            try {
                // console.log(`setCustomUserAttribute(${name}, ${value}, ${flag})`);
                if(name.indexOf('Dt') > -1){
                    braze.getUser().setCustomUserAttribute(name, new Date(value));
                }else if(name.indexOf('Hist') > -1){
                    if(typeof flag != 'undefined' && flag == 'remove'){
                        braze.getUser().removeFromCustomAttributeArray(name, value);
                    }else{
                        braze.getUser().addToCustomAttributeArray(name, value);
                    }
                }else if(name.indexOf('Agree') > -1){
                    const pVal = value == 'Y' ? true : false;
                    braze.getUser().setCustomUserAttribute(name, pVal);
                }else{
                    braze.getUser().setCustomUserAttribute(name, value);
                }
            } catch (error) {
                console.warn('[MKT_Braze] error at triggerCustAttr...', error);
            }
        },

        /**
         * [커스텀 이벤트/속성] 상품 상세 페이지 관련 이벤트 트리거
         * - 연관 기획전 후 호출에 따른, 분기 처리
         * 
         * @param {string} flag 
         */
        sendDetailProduct : (flag) => {
            try {
                const brazeObj = MKT.BRAZE.setDetailObj();
                if(flag == 'exist'){
                    // 연관기획전 존재시, 셋팅
                    Object.assign(brazeObj, MKT.BRAZE.getRelatedPromt());
                }
                
                // [MKT_Braze] 커스템 이벤트 - 상세페이지 조회
                MKT.BRAZE.triggerCustEvent("goProductDetail", brazeObj);
                
                // [MKT_Braze] 커스텀 속성 - 상품 조회 이력
                try {
                    const attrMap = new Map();
                    attrMap.set('date', MKT.fn.cnvrtDateFormat(new Date()));
                    attrMap.set('prdNm', brazeObj.godNm);
                    attrMap.set('prdId', brazeObj.godNo);
                    attrMap.set('catNm', brazeObj.ctgryNm);
                    attrMap.set('catId', brazeObj.ctgryNo);
                    attrMap.set('brndNm', brazeObj.brndNm);
                    attrMap.set('brndId', brazeObj.brndNo);
                    attrMap.set('price', brazeObj.realPrice);
                    
                    MKT.BRAZE.triggerCustAttr('productHist', MKT.BRAZE.cnvrtCustAttrHist(attrMap));
                } catch (error) {
                    console.warn('[ERROR] at productHist...', error);
                }
            } catch (error) {
                console.warn('[MKT_Braze] error at goProductDetail', error);
            }
        },
        
        /**
         * [커스텀 속성] ID 기준으로 requset 셋업 -> API 통신 결과와 param을 동기 처리
         * 
         * @param {string} mbrId 
         * @param {Object} param 
         */
        sendUserAttr : (mbrId, param) => {
            // 미사용
            return;
            try {
                if(MKT.BRAZE.apiKey === '') throw new Error('Braze ApiKey is empty...');
                // custome attribute set
                const req = MKT.BRAZE.setupApiRequest(MKT.BRAZE.apiKey, mbrId);
                
                // send modified value using fetch api
                fetch("https://sdk.iad-06.braze.com/users/export/ids", req)
                    .then(response => response.text())
                    .then(result => {
                        // console.log('[MKT_Braze] fetch success');
                        MKT.BRAZE.sendCustAttrOnce(JSON.parse(result), param);
                    })
                    .catch(error => console.warn('[MKT_Braze] sendCustAttrOnce', error));
            } catch (error) {
                console.warn('[MKT_Braze] error at sendUserAttr.. ', error);
            }
        },

        /**
         * [커스텀 이벤트] 상품 상세 페이지에서 정보 추출 및 셋팅
         * 
         * @returns 
         */
        setDetailObj : () => {
            try {
                const godNo = $("#bskGodGodNo").val();
                const godNm = $('#godNm').val();
                const cvrPrc = $('#cvrPrc').val();              // 정상가
                const realPrice = $('#realPrice').val();        // 할인가
    
                const cateNm = $('#cateFullNm').val();
                const cateCd = MKT.fn.getLeafValue($('input[name="cateCd"]'), 3);
                const brndNm = $('#brndNm').val();
                const brndCd = $('#brndCd').val();
    
                const link = document.querySelector('meta[name="og_url"]').content;
                const imgUrl = MKT.fn.cnvrtRemoveQt($('#thumbnailImgUrl').val());
                const isStock = $('#isGoodSoldOut').val() == 'true' ? false : true;
    
                let param = {
                    'godNm' : godNm,
                    'godNo' : godNo,
                    'ctgryNm' : MKT.fn.cnvrtSprtArray(cateNm,'/','^'),
                    'ctgryNo' : cateCd,
                    'brndNm' : brndNm,
                    'brndNo' : brndCd,
                    'link' : link,
                    'imgUrl' : imgUrl,
                    'price' : cvrPrc,
                    'realPrice' : realPrice,
                    'isStock' : isStock
                };

                return param;
            } catch (error) {
                console.warn('[MKT_Braze] error at setDetailObj...', error);
            }
        },

        /**
         * [커스텀 이벤트] 상품 상세 페이지에서 연관 기획전 정보 추출 및 셋팅
         * 
         * @returns object
         */
        getRelatedPromt : ()=>{
            let relatedPromtObj = new Object();
            try {
                const relatedPromtArr = document.querySelectorAll('#contentsDiv .gate-view-item');

                if(relatedPromtArr.length !== 0){
                    // 최상위 기획전만
                    const tmp = relatedPromtArr[0]?.querySelector('.img-viewer');
                    const promtImgUrl = MKT.fn.getImageUrl(tmp);
                    const promtUrl = relatedPromtArr[0]?.querySelector('[name="relatedContent.url"]').value;
                    const promtTitle = relatedPromtArr[0]?.querySelector('.view-info-wrap .title').innerText;
                    const promtDesc = relatedPromtArr[0]?.querySelector('.view-info-wrap .desc').innerText;
                    const promtEndDt = relatedPromtArr[0]?.querySelector('[name="relatedContent.endDt"]').value;
    
                    relatedPromtObj = {
                        'rltdEvtLink' : MKT.fn.cnvrtFullUrl(promtUrl),
                        'rltdEvtTitle' : promtTitle,
                        'rltdEvtDesc' : promtDesc,
                        'rltdEvtImgUrl' : promtImgUrl,
                        'rltdEvtEndDt' : MKT.fn.cnvrtDateToJsFormat(promtEndDt).toISOString()
                    };
                }
                return relatedPromtObj;
            } catch (error) {
                console.warn('[ERROR] at getRelatedPromt...', error);
                return relatedPromtObj;
            }
        },

        /**
         * [커스텀 이벤트] 선택된 옵션의 남은 재고 수량을 반환함
         * e.g. {옵션명, 재고수량}
         */
        getStock : ()=>{
            try {
                const elem = document.getElementById('opt-itm-name');
                const itmNm = elem.innerText;
                const itmStock = elem.getAttribute('stock');

                return {
                    'optNm' : itmNm,
                    'stock' : itmStock
                };              
            } catch (error) {
                console.warn('[MKT_Braze] error at getStock...', error);
                return {};
            }
        },

        /**
         * [커스텀 속성] Hist 양식에 맞게 Map 데이터 변환
         * e.g. 'date_20230215/godNo_GP1234/...'
         * 
         * @param {Map} pmap 
         * @returns 
         */
        cnvrtCustAttrHist : (pmap) => {
            try {
                if(typeof pmap == 'undefined') throw new Error('Hist Map is empty...');

                let result = '';
                pmap.forEach((value, key) => {
                    result += `${key}_${value}/`;
                });

                return result.slice(0, -1); // 마지막 슬래쉬 제거
            } catch (error) {
                console.warn('[ERROR] at setuCustApttrHist...', error);
                return '';
            }
        },

        /**
         * [커스텀 속성] API 통신을 통해, 신규/업데이트 된 값만 이벤트 트리거
         * - 1회 및 수정될 때만 : 고객명, 닉네임, 가입일, 성별
         * 
         * @param {object} result - API 통신을 통해 받은 서버값
         * @param {object} param  - 신규로 보내는 파라미터값
         */
        sendCustAttrOnce : (result, param) => {
            try {
                if(result.users.length == 0 || Object.keys(result.users[0]).length == 0){
                    // 전송 기록 없을 경우 -> 모두 전송
                    for(const key in param){
                        MKT.BRAZE.triggerCustAttr(key, param[key]);
                    }
                    // console.log('[MKT_Braze] 최초 모두 전송');
                }else{
                    // 전송 기록 있을 경우
                    const resultAttr = result.users[0]?.custom_attributes;
                    for(const key in param){
                        const resultValue = resultAttr[key];
                        try {
                            if(typeof resultValue == 'undefined'){
                                // 전송된 적 없음 -> 전송
                                MKT.BRAZE.triggerCustAttr(key, param[key]);
                            }else{
                                if(resultValue != param[key]){
                                    // 값 존재 && 값 불일치 -> 전송
                                    if(key == 'joinDt'){                    // data ISO Format 비교
                                        const timeFromBRZ = MKT.fn.cnvrtDateKST(resultValue).toISOString();
                                        const timeFromEQL = MKT.fn.cnvrtDateKST(param[key]).toISOString();
                                        if(timeFromBRZ == timeFromEQL) continue;
                                    }else if(key == 'smsAgree'){            // boolean 비교
                                        const strVal = resultValue == true ? 'Y' : 'N';
                                        if(strVal == param[key]) continue;
                                    }
    
                                    MKT.BRAZE.triggerCustAttr(key, param[key]);
                                }else{
                                     // 값 존재 && 값 일치 -> SKIP
                                }
                            }
                        } catch (error) {
                            console.warn('[ERROR] at sendCustAttrOnce in iteration :: ' + key);
                        }
                    }
                }
            } catch (error) {
                console.warn('[ERROR] at sendCustAttrOnce...', error);
            }
        },

        /**
         * [커스텀 속성] API 전송을 위한 requset 옵션 셋팅
         * @param {string} key 
         * @param {string} userId 
         * @returns 
         */
        setupApiRequest : (key, userId) => {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${key}`);

            var raw = JSON.stringify({
                                        "external_ids": [userId],
                                        "fields_to_export": [
                                            "custom_attributes",
                                        ]
                                    });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            return requestOptions;
        }
    },

    // Groobee
    GROOBEE : {
        sendGrbCA : function(){
            try {
                MKT.fn.setCtgryArray();

                const result = { category :
                                    {
                                        cateCd : MKT.cmmn.ctgryCdArray[MKT.cmmn.ctgryCdArray.length-1],
                                        cateNm : MKT.cmmn.ctgryNmArray[MKT.cmmn.ctgryNmArray.length-1],
                                        catL : MKT.cmmn.ctgryCdArray[0],
                                        cateLNm : MKT.cmmn.ctgryNmArray[0],
                                        catM : MKT.cmmn.ctgryCdArray[1],
                                        cateMNm : MKT.cmmn.ctgryNmArray[1],
                                        catS : MKT.cmmn.ctgryCdArray[2],
                                        cateSNm : MKT.cmmn.ctgryNmArray[2]
                                    }
                                };
                groobee('CA', result);
            } catch (error) {
                console.warn('[ERROR] at GROOBE.sendGrbCA...', error);
            }
        }
    }
};