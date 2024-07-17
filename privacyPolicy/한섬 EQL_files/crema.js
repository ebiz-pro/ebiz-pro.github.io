/**
 * CREMA Script PC
 * DATE 20220518
 */

var CREMA = {
    value : {
        // PC
        API_LINK : '//widgets.cre.ma/eqlstore.com/init.js',
        applyDomains : [
            'all_pages',
        ]
    },

    Widget : {
        /**
         * 크리마 위젯 초기 셋팅
         * - 선언 후, start() 시에 crema.init()이 동작함
         * 
         * @param {string} cremaYn 크리마리뷰 사용 여부 (커스텀 태그)
         * @param {string} loginYn 로그인 여부 ( 'Y' | 'N' | '' )
         * @param {string} uid  유저 아이디 ( 'id' | '' )
         * @param {string} uname 유저 이름 ( 'name' | '' )
         * @returns 
         */
        load : function(cremaYn, loginYn, uid, uname){
            if(CREMA.fn.validateUse(cremaYn) == false) return;
    
            var id = null;
            var nm = null;
            
            if( CREMA.fn.validateUse(loginYn) == true &&
                CREMA.fn.validateParam(uid) &&
                CREMA.fn.validateParam(uname)) {
                id = uid;
                nm = uname;
            }

            window.cremaAsyncInit = function() {
                crema.init(id,nm);
                console.log('> crema.init');
            }

        },

        /**
         * 크리마 공통 스크립트 실행
         * - 위젯이 삽입된 페이지에서 실행
         */
        start: function(cremaYn, url){
            // 크리마 위젯 미사용인 경우, 종료
            if(CREMA.fn.validateUse(cremaYn) == false) return;
            if(CREMA.fn.validateCrema() == true) {
                console.log('already started');
                crema.run();
                return;
            }
            
            (function(i,s,o,g,r,a,m){
                if(s.getElementById(g)){return};
                a=s.createElement(o),m=s.getElementsByTagName(o)[0];
                a.id=g;
                a.async=1;
                a.src=r;
                m.parentNode.insertBefore(a,m)
            })(window,document,'script','crema-jssdk',CREMA.value.API_LINK);

            console.log('> crema.start');
        },

        /**
         * URL 기준으로 현재 페이지의 위젯 동작 여부 판별
         * 
         * @param {string} url 
         * @returns boolean
         */
        chkUrl: function(url){
            for (const val of CREMA.value.applyDomains) {
                if(CREMA.fn.containIgnoreCase(url, val) == true) return true;
            }
            return false;
        },

        /**
         * 미적용된 Widget을 찾아 crema 적용
         * - ajax 동기 처리할 필요 없을 경우 사용
         * - start()가 실행되지 않아, crema 객체가 없을 경우를 핸들링
         * 
         * @returns 
         */
        run: function(){
            if(CREMA.fn.validateCrema() == true) {
                crema.run();
                console.log('> crema.run');
                return
            }
        },

        /**
         * 미적용된 Widget을 찾아 crema 적용(ajax 처리)
         * - 비동기 통신 등 crema.run() 호출이 어려운 경우
         * - 매개변수가 존재하는 콜백함수는 콤마로 매개변수 기입
         *   e.g. runAjaxSync(getReviewList, '1','','','');
         * 
         * @param {function} callback 호출하는 함수
         * @returns 
         */
        runAjaxSync: function(callback, ...args){
            // crema 스크립트가 적용 안되었을 경우
            if(CREMA.fn.validateCrema() == false) {
                callback(...args) // 비동기 처리 없이 그냥 실행
                console.log('> crema.no.run.sync');
                return;
            }
            callback(...args)
            .then(()=> {
                crema.run();
                console.log('> crema.run.sync');
            })
            .catch((err)=>{
                console.log('runAjaxSync() {} : ' + err);
            });
        }
    },

    fn : {
        /**
         * validate- : true(사용가능) | false(사용불가)
         */

        // 파라메터의 유효값 검사
        validateParam : function(payload){
            return payload === null || payload === '' ? false : true; 
        },
        // 변수의 유효값(사용 유무) 검사
        validateUse: function(payload){
            return payload === 'N' || payload === null || payload === ''  ? false : true; 
        },
        // source 문자열 안에, target이 포함되어있는지 확인
        containIgnoreCase : function(source, target){
            return (source.toLowerCase().indexOf(target.toLowerCase()) >= 0) ? true : false;
        },
        // crema의 유효성 검증 (dynamicConfig 조회 없이)
        validateCrema : function(){
            return typeof(crema) === 'undefined' ? false : true;
        },
        // 가운데 문자 마스킹 처리
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
    },
};
