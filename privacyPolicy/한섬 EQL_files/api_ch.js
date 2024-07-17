// CH DATA를 Template로 랜더링하는 Framework
function eqlRenderUI() {
    function fetchData(apiUrl) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "GET",
                async: true,
                url: apiUrl,
                success: function (data) {
                    resolve(data);
                },
                error: function (e) {
                    console.warn(`[ERROR] at fetchData:${apiUrl}`, e);
                    reject("ERROR");
                },
            });
        });
    }

    function validation(type, inputText){
        try {
            switch(type){
                case 'link':
                    if(typeof inputText == 'undefined' || inputText == '') return '#';
                    else return inputText;
                case 'time':
                    const text = inputText.split(' ')[0];     // YYYY-MM-DD
                    return text.replaceAll('-','.');
                default:
                    return inputText;
            }
        } catch (error) {
            console.warn('[ERROR] at validation ', error);
            return inputText;
        }
    }

    function createPromo(apiData) {
        return new Promise(function(resolve, reject) {
            try {
                if(typeof apiData == 'undefined' || apiData === 'ERROR') reject('API FETCH ERROR');
                if(apiData?.pageInfo.totalCount < 1 || apiData?.data.length == 0) {
                    reject(`NO API DATA(${apiData.pageInfo.totalCount})`);
                }

                const template = document.querySelector("#template-promo-item").innerHTML;
                const fragment = document.createDocumentFragment();
        
                if (apiData) {
                    apiData.data.forEach((item, index) => {
                        try {
                            const container = document.createElement('div');
                            let parsingHtml = template.replaceAll("{evtNm}", item.title)
                                                    .replaceAll("{evtDscr}", item.subTitle)
                                                    .replaceAll("{linkUrl}", validation('link', item.link))
                                                    .replaceAll("{imgUrl}", item.filePath)
                                                    .replaceAll("{index}", index);

                            container.innerHTML = parsingHtml;

                            // 뱃지
                            const elemBadge = container.querySelector('.thumb_area .badge_wrap');
                            if(item.isTimerBadge == 'Y'){
                                elemBadge.insertAdjacentHTML('beforeend', `<span class="badge orange" id="entEndCheck" data-event-start-time="${item.startDate}" data-event-end-time="${item.endDate}"</span>`);
                            }
                            if(item.badge.length != 0){
                                item.badge.forEach(singleBadge => {
                                    elemBadge.insertAdjacentHTML('beforeend', `<span class="badge">${singleBadge}</span>`);
                                });
                            }
            
                            // 태그
                            if(item.tags.length != 0){
                                const elemTags = container.querySelector('.info_area.contents');
                                elemTags.insertAdjacentHTML('beforeend', `<p class="badge_auto_list"></p>`);
            
                                item.tags.forEach(singleTag => {
                                    elemTags.lastChild.insertAdjacentHTML('beforeend', `<span class="hashtag">${singleTag}</span>`);
                                });
                            }
            
                            fragment.appendChild(container.querySelector('li.swiper-slide'));
                        } catch (error) {
                            console.warn(`[FAILED] ${index})${item.title} rendering failed : ${error}`);
                        }
                    });
                }
        
                // 삽입 대상
                const targetElem = document.querySelector('#ctgryMainStyleBy');
                
                // 페이징 버튼
                if(apiData.pageInfo.totalCount > 3){
                    const pageElem = document.createElement('div');
                    pageElem.className = 'pagination pagenum1';
                    pageElem.insertAdjacentHTML('beforeend', `<a href="javascript:void(0);" class="swiper-button-prev">앞으로</a>`);
                    pageElem.insertAdjacentHTML('beforeend', `<a href="javascript:void(0);" class="swiper-button-next">뒤로</a>`);
                    targetElem.querySelector('.tit_area').appendChild(pageElem);    // 타겟 할당
                }
        
                // 스와이프 생성
                const swiperElem = document.createElement('div');
                swiperElem.className = 'swiper swiper_type2 inner_left';
                swiperElem.insertAdjacentHTML('beforeend', `<ul class="swiper-wrapper product_info product_list_evt"></ul>`);
                swiperElem.firstChild.appendChild(fragment);
                targetElem.insertAdjacentElement('beforeend', swiperElem);    // 타겟 할당

                resolve('SUCCESS');
            } catch (error) {
                console.error('[ERROR] at renderPromo...', error);
                reject('ERROR');
            }
        });
    }

    function createGnbBanner(apiData) {
        return new Promise(function(resolve, reject) {
            try {
                if(typeof apiData == 'undefined' || apiData === 'ERROR' || apiData?.status != 200) reject('API FETCH ERROR');

                const template = document.querySelector("#template-banner-item").innerHTML;
                
                if (apiData) {
                    for(let key in apiData.data){
                        try {
                            const fragment = document.createDocumentFragment();
                            const list = apiData.data[key];
    
                            list.forEach((item, index) => {
                                try {
                                    const newDom = createTempltae(template, item);
                                    fragment.appendChild(newDom.querySelector('li'));
                                } catch (error) {
                                    console.warn(`[FAILED] ${key}_${index})'${item.title}' rendering failed : ${error}`);
                                }
                            });

                            if(list.length !== 0){
                                // 삽입 대상
                                const targetElem = document.querySelector(`.gnb_banner#${key}Banner`);
                                targetElem.firstChild.appendChild(fragment);
                                targetElem.style.display = 'block';
                            }
                        } catch (error) {
                            console.error(`[${key}] 배너 랜더링에 실패하였습니다.`, error);
                        }
                    }
                }

                resolve('SUCCESS');
            } catch (error) {
                console.error('[ERROR] at createGnbBanner...', error);
                reject('ERROR');
            }
        });
    }

    function createTempltae(templateStr, singleData) {
        try {
            const container = document.createElement('div');
            const parsingHtml = templateStr.replaceAll("{evtNm}", singleData.title)
                                            .replaceAll("{linkUrl}", validation('link', singleData.link))
                                            .replaceAll("{imgUrl}", singleData.filePath);
            container.innerHTML = parsingHtml;
    
            // 뱃지
            const elemBadge = container.querySelector('.img_box .badge_wrap');
            if(singleData.badge.length != 0){
                singleData.badge.forEach(singleBadge => {
                    elemBadge.insertAdjacentHTML('beforeend', `<span class="badge">${singleBadge}</span>`);
                });
            }

            return container;
        } catch (error) {
            throw(error);
        }
    }

    async function render(url) {
        try {
            const resultAPI = await fetchData(url);
            const resultRender = await createPromo(resultAPI);
            
            if(resultRender == 'SUCCESS'){
                var swiper2 = new Swiper(".swiper_type2", {
                    slidesPerView: 3.1,
                    spaceBetween: 10,
                    slidesPerGroup: 3,
                    ally: false,
                    threshold: 0,
                    navigation: {
                        nextEl: ".pagenum1 > .swiper-button-next",
                        prevEl: ".pagenum1 > .swiper-button-prev",
                    },
                });
    
                const target = document.querySelector('#ctgryMainStyleBy');
                target.style.display = 'block';
                comm.setTimerBadge();
            }else{
                console.error('랜더링에 실패하였습니다.');
            }
        } catch (error) {
            console.error('[ERROR] at eqlRenderUI.render()', error);
        }
    }

    async function renderGnb(url) {
        try {
            const resultAPI = await fetchData(url);
            const resultRender = await createGnbBanner(resultAPI);
            
            if(resultRender == 'SUCCESS'){
                // 성공
            }else{
                console.error('랜더링에 실패하였습니다.');
            }
        } catch (error) {
            console.error('[ERROR] at eqlRenderUI.render()', error);
        }
    }

    return {
        render: render,
        renderGnb : renderGnb
    };
}