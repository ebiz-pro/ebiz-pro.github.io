//GNB
// $(function(){
//     var $header = $('.wrarp > header'),
//         $gnb = $('.gnb'),
//         $gnbLi = $gnb.find(' li.depth'),
//         $gnb2Dep = $gnbLi.find('.sub_wrap'),
//       setTime = null

//     $gnbLi.on({
// 		'mouseenter focusin' : function(){
// 			$gnb2Dep.addClass('is_active');
// 			$(this).addClass('is_active').find($gnb2Dep).stop().show();
// 			  $(this).addClass('is_active').siblings().removeClass('is_active').find($gnb2Dep).stop().hide();
// 		   clearTimeout(setTime);
// 		 },
//       'mouseleave focusout' : function(){
//         var _this = this;
//         clearTimeout(setTime);
//         setTime = setTimeout(function(){
//          $gnb2Dep.removeClass('is_active');
//          $(_this).removeClass('is_active').find($gnb2Dep).stop().hide();
//       }, 100);
//       }
//     });
//    $gnb2Dep.on({
//       'mouseenter focusin' : function(){
//          clearTimeout(setTime);
//       }
//    })
// });

$(function () {
  $(".button_like").click(function () {
    $(this).toggleClass("is_active");
  });
});
//goto top
$.fn.goToTop = function () {
  $(".quick").css("margin-top", -($(".quick").height() + 30));
  $(document).on("click", ".quick .top", function () {
    $("body,html").stop().animate(
      {
        scrollTop: 0,
      },
      300
    );
  });
  $(window).on("scroll", function () {
    $(window).scrollTop() > 50 ? $(".quick .top").addClass("scroll") : $(".quick .top").removeClass("scroll");
    // if($(window).scrollTop() > ($('.wrap').prop('scrollHeight') - $('footer').outerHeight() -  $(window).height()) ) {
    // 	$('.quick').css('bottom', $('footer').outerHeight() + 30)
    // } else {
    // 	$('.quick').css('bottom', 30)
    // }
  });
};

$(function () {
  /*if(document.querySelector('.twoway_center:not(.lookbook_sub .twoway_center)') !== null) {*/
  if (document.querySelector(".twoway_center") !== null) {
    $("html").addClass("twoway");
    $(".container").addClass("pb0");

    
    var Html = $("html")[0]
    var Footer = $("footer")
    // $(".twoway_right_area .sticky .tab_btn").click(function(){
    //   if(Html.scrollHeight   < Html.scrollTop + Html.offsetHeight + Footer[0].offsetHeight ){
    //     console.log(1)
    //   }
    // });
  }
  
  var twowayScroll = $(".twoway_right_area");
  var prevScroll = 0
  var Html = $("html")[0]
  var Html2 = $("html,body")
  var Footer = $("footer")
  var btmAction = true;
  twowayScroll.scroll((e)=>{
    if(prevScroll >= twowayScroll.scrollTop() && Html.scrollHeight   < Html.scrollTop + Html.offsetHeight + Footer[0].offsetHeight  ){
      
      if(btmAction){
        btmAction = false;
        Html2.animate( {scrollTop: (Html.scrollHeight - Html.offsetHeight - Footer[0].offsetHeight ) },200 , function(){
          btmAction = true;
        }) 
      }
      e.preventDefault();
      e.stopPropagation();
      twowayScroll.scrollTop(prevScroll)
      
      return false;
    }else{
      prevScroll = twowayScroll.scrollTop()
    }
  })

});


var aa = null;
$.customScroll = function () {

  var Body = $("body")
  $(".mcus_scroll").each(function () {
    var This = this;
    this.leftPageChk = false;
    This.scrollEl = $(this).overlayScrollbars(
      //The passed argument has to be at least a empty object or a object with your desired options
      {
        className: "os-theme-dark",
        resize: "none",
        // sizeAutoCapable : true,
        paddingAbsolute: true,
        scrollbars: {
          clickScrolling: false,
          autoHide: "leave",
          autoHideDelay: 600,
        },
        callbacks : {
          onScroll: function(e) 
          {
            if(e.target.scrollHeight == e.target.scrollTop + e.target.offsetHeight){
              
            }
          }
        }
      }
    );
  });
};

// modal
var pageScrTop = null;
function dimmVisible() {
  pageScrTop = $(window).scrollTop();
  $("html, body").addClass("is_dimmed")//.css("scroll-behavior", "auto");
  // $("body > div:first-child").css({ position: "relative", top: pageScrTop * -1 });
  $(".modal_wrap").scrollTop(0);
  $(".modal_content .content_scroll").scrollTop(0);
  $(".modal_content .expand_thumb_wrap").scrollTop(0);
}
//스크롤 활성화
function dimmHidden() {
  $("html, body").removeClass("is_dimmed");
  $("body > div:first-child").removeAttr("style");
  $(window).scrollTop(pageScrTop);
  $("html, body").removeAttr("style");
}

// BottomSheet

var modalIdx = 1100
function ModalBSOpen(id) {
  $(id).css({ "z-index": modalIdx++ });
  dimmVisible();
  $(id).addClass("is_visible is_active");
}
function ModalBSClose(id) {
  $(id)
    .removeClass("is_active")
    .on("transitionend", function () {
      if (!$(id).hasClass("is_active")) {
        $(id).removeClass("is_visible");

        // 남아있는 모달이 없는 경우 초기화
        if ($(".modal_wrap.is_visible").length == 0) {
          dimmHidden();
        }
      }
    });
}

// Modal full popup
function ModalFPOpen(id) {
  $(id).css({ "z-index": modalIdx++ });
  dimmVisible();
  $(id).addClass("is_visible");
}
function ModalFPClose(id) {
  $(id).removeClass("is_visible");

  // 남아있는 모달이 없는 경우 초기화
  if ($(".modal_wrap.is_visible").length == 0) {
    dimmHidden();
  }
}

// Alert popup
function ModalAlertOpen(id) {
  $(id).css({ "z-index": modalIdx++ });
  dimmVisible();
  $(id).addClass("is_visible is_active");
}
function ModalAlertClose(id) {
  $(id)
    .removeClass("is_active")
    .one("transitionend", function () {
      if (!$(id).hasClass("is_active")) {
        $(id).removeClass("is_visible");

        // 남아있는 모달이 없는 경우 초기화
        if ($(".modal_wrap.is_visible").length == 0) {
          dimmHidden();
        }
      }
    });
}

// Dimmed popup
function ModalOpen(id) {
  $(id).css({ "z-index": modalIdx++ });
  dimmVisible();
  $(id).addClass("is_visible is_active");

  // $(id).mouseup(function (e){
  // 	$(id).removeClass('is_active').one('transitionend', function () {
  // 		if (!$(id).hasClass('is_active')) {
  // 			$(id).removeClass('is_visible');

  // 			// 남아있는 모달이 없는 경우 초기화
  // 			if ($('.modal_wrap.is_visible').length == 0) {
  // 				dimmHidden();
  // 			}
  // 		}
  // 	})
  // });
}
function ModalOpenClose(id) {
  $(id)
    .removeClass("is_active")
    .one("transitionend", function () {
      if (!$(id).hasClass("is_active")) {
        $(id).removeClass("is_visible");

        // 남아있는 모달이 없는 경우 초기화
        if ($(".modal_wrap.is_visible").length == 0) {
          dimmHidden();
        }
      }
    });
}

// ToastOpen
function ToastOpen(id) {
  $(id).addClass("is_visible is_active");
  setTimeout(function () {
    ToastClose(id);
  }, 3000);
}
function ToastClose(id) {
  $(id)
    .removeClass("is_active")
    .one("transitionend", function () {
      !$(id).hasClass("is_active") && $(id).removeClass("is_visible");
    });
}

// Tooltip
var tooltip = {
  init: function () {
    if ($(".tooltip").length) {
      $(document)
        .off("click.tooltip")
        .on("click.tooltip", function (e) {
          $(".tooltip").each(function () {
            var $tooltip = $(this);
            // 툴팁을 클릭하지 않은 경우
            $tooltip.has(e.target).length === 0 && $tooltip.hasClass("is_visible") && tooltip.close($tooltip);

            // open 툴팁을 클릭한 경우
            $tooltip.has(e.target).length > 0 && $tooltip.hasClass("is_visible") && tooltip.close($tooltip);

            // close 툴팁을 클릭한 경우
            $tooltip.has(e.target).length > 0 && !$tooltip.hasClass("is_visible") && tooltip.open($tooltip);
          });
        });
    }
  },
  open: function ($tooltip) {
    $tooltip.toggleClass("is_visible is_active");
  },
  close: function ($tooltip) {
    $tooltip
      .on("transitionend", function () {
        !$tooltip.hasClass("is_active") && $tooltip.removeClass("is_visible");
      })
      .removeClass("is_active");
  },
};

/* Ready */
$(function () {
  tooltip.init(); // 툴팁 공통
});

$.tooltip = function () {
  var $tooltip = $("[data-event=tooltip]");
  $tooltip.each(function () {
    var $this = $(this);
    var $tooltip_trigger = $this.find("[data-tooltip-trigger=tooltip]");
    var $tooltip_con = $this.find("[data-tooltip-con]");
    var $tooltip_close = $this.find("[data-tooltip-close]");
    var $tooltip_pos = $this.data("tooltip-pos");
    var $tooltip_once = $this.hasClass('tooltip_once');
    var tooltip_event = this.dataset.eventtype;
    
    init();
    function init() {
      $tooltip.removeClass("is_positioned");
      if(tooltip_event){
        bindEvents_click()
      }else{
        bindEvents();
      }
      if ( $tooltip_once ) {
        $tooltip_close.on('click', () => tooltipClose());
      }
    }
    function bindEvents() {
      $tooltip_trigger.on("mouseenter", function(e){
        if($(this).next().hasClass("is_active")){
          this.defaltTolltip = "on";
          return false;
        }
        
        if ($tooltip_pos) {
          $tooltip.addClass("is_positioned");
          $tooltip_con.css($tooltip_pos);
        } else {
          $tooltip.removeClass("is_positioned");
        }
        if ( !$tooltip_once ) tooltipOpen();
        // e.stopPropagation();
      });
      $tooltip_trigger.on("mouseleave", function(){
        if(this.defaltTolltip) return false;
        tooltipClose()
      });
    }
    function bindEvents_click() {
      $tooltip_trigger.on("click", (e) => {
        
        if ($tooltip_pos) {
          $tooltip.addClass("is_positioned");
          $tooltip_con.css($tooltip_pos);
        } else {
          $tooltip.removeClass("is_positioned");
        }
        if ( !$tooltip_once ) tooltipOpen();
        // e.stopPropagation();
      });
      $tooltip_close.on("click", () => tooltipClose());
    }
    var tooltipTimer = null;
    function tooltipOpen() {
      if($tooltip_con.hasClass("is_active")){
        $tooltip_con.removeClass("is_active");
      }else{
        $tooltip_con.addClass("is_active");
        tooltipTimer = setTimeout(function(){
          $(document).one("click", function (e) {
            tooltipClose();
          });
        },10)
      }
    }
    function tooltipClose() {
      clearTimeout(tooltipTimer)
      $tooltip_con.removeClass("is_active");
    }
  });
};

$(function () {
  // (Optional) Active an item if it has the class 'is-active'
  $(".accordion > .acc_header.is_active").next(".acc_cont").slideDown();

  $(document).on("click",".accordion > .acc_header:not(.tit_area)",function (e) {
    if ($(this.parentNode).hasClass("unfold")) return false;
    if(this.parentNode.classList.contains("not_toggle") && this.classList.contains("is_active")) return false;

    var $exceptTarget = $(this).find("a[href], select:not([disabled]), button:not([disabled]) , input[type=radio], .tooltip_open"); //해당 요소 제외하고 클릭 시 에만 동작하도록
    // Cancel the siblings
    if (!($exceptTarget.length && $(e.target).is($exceptTarget))) {
      
			var This = $(this)
      
			This.attr('aria-expanded', 'true');
			This.siblings('dt').attr('aria-expanded', 'false');

			if(This.closest(".faq_accordion").length){
        
				if(This.hasClass('is_active')){
					 This.removeClass('is_active').next('.acc_cont').slideUp('ease-out');
				}else{
          if(This.parents(".cs_notice_board").prev(".cs_board_notice").find(".acc_header.is_active").length > 0){
            var prev = This.parents(".cs_notice_board").prev(".cs_board_notice").find(".acc_header.is_active + .acc_cont")
            var thiHeight = $(window).height()/2;
            var now = prev.offset().top
            console.log()
            $("html,body").animate({scrollTop :  now - 400 + This.prevAll().length * 50 }) 
          }

          if(This.prevAll(".acc_header.is_active + .acc_cont").length > 0){
            var prev = This.prevAll(".acc_header.is_active + .acc_cont")// .height();
            var thiHeight = $(window).height()/2;
            var now = prev.offset().top
            // console.log(now, thiHeight)
            $("html,body").animate({scrollTop :  now - 400 }) 
          }
					var List = $('.acc_header');
					var prev = 0;
					var is_prev = true;
					
					List.each((i,o)=>{
						if(o == this){
							is_prev = false;
						};
						if(is_prev && o.classList.contains("is_active")){
							prev += ($(o).next('.acc_cont').height()) + 50
						}
						
						if(o.classList.contains("is_active")){
							$(o).removeClass('is_active').next('.acc_cont').slideUp('ease-out');
						}
					})
					
					var top  = This.offset().top  - $("header").height() - prev;
					//  $("html,body").animate({"scrollTop":top})
					This.addClass('is_active').next('.acc_cont').slideDown('ease-out');
        }
        
			}else{
        
        if(!This.find("input[type=radio]").is(":checked")){
          // 주문서 결제수단 선택 라디오 강제 checked MO_OR_301.html
         if(This.find("input[type=radio]")[0]) This.find("input[type=radio]")[0].checked = true;
        }

        This.siblings(".acc_header").removeClass("is_active").next(".acc_cont").slideUp();
        This.attr("aria-expanded", "true");
        This.siblings("dt").attr("aria-expanded", "false");
  
        // Toggle the item
        This.toggleClass("is_active").next(".acc_cont").slideToggle("ease-out");
        This.not(".is_active").attr("aria-expanded", "false");
			}
			
			// $('.acc_header').removeClass('is_active').next('.acc_cont').slideUp();

			

			
    }

    //$('.accordion.private > .acc_header').next('.acc_cont').hide();
  });
  $(".tit_area.acc_header").click(function () {
    //높이로 열고 닫힘 조장
    // const $modal_contentHeight = $('.modal_content').height();
    const $modal_contentHeight = $("body").height() - ($(".modal_header").outerHeight() + $(".btn_big_wrap").outerHeight());
    const $modal_contentScrollHeight = document.querySelector(".modal_content").scrollHeight;
    const maxScrollValue = $modal_contentScrollHeight + $modal_contentHeight - ($(".tit_area.acc_header").outerHeight() + 29);
    if ($(this).hasClass("is_active")) {
      $(this).removeClass("is_active").next(".acc_cont").css("height", 0);
    } else {
      $(this)
        .addClass("is_active")
        .next(".acc_cont")
        .css("height", $modal_contentHeight - ($(".tit_area.acc_header").outerHeight() + 29));
      setTimeout(function () {
        $(".modal_content").stop().animate({ scrollTop: maxScrollValue }, 400);
      }, 200);
    }
  });
  $(".agree_box > .agree_view_btn").click(function () {
    $(this).siblings(".agree_header").toggleClass("is_active");
    if ($(this).siblings(".agree_header").hasClass("is_active")) {
      $(this).siblings(".agree_cont").slideDown();
    } else {
      $(this).siblings(".agree_cont").slideUp();
    }
  });
});

/* input value clear */
$.inputDel = function () {
  var Document = $(document)
  Document.on("mousedown", ".clear_btn.on", function () {
    $(this).removeClass("on");
    $(this).siblings("input").val("");
    var This = $(this)
		setTimeout(()=>{
			This.siblings("input").focus();
		},100)
    $(".auto_keyword_box, .search_header_wrap").removeClass("is_active");
  });
	
  Document.on("click", ".input_clear .clear_btn",  function (e) {
    
    const searchWrap = $(".auto_keyword_box, .search_header_wrap");
		const $delInput = $(this).siblings("input");
    
		var inputWrap = $(this).closest('.input_clear');

    if($delInput.attr("readonly")) return false;
    if($delInput.attr("disabled")) return false;
    var This = $(this);
    $delInput.val("");
    This.removeClass("on");
    if(searchWrap.length) searchWrap.removeClass("is_active").removeClass("is_autoWord");
    $('.zip_search_layer').removeClass('is_active');
    
  });

  Document.on("keyup", ".input_clear input",  function () {
    
    var This = $(this)
		const $del = $(this).siblings(".clear_btn");
		const $delInput = $(this);
    /*
    if(This.closest(".search_wrap").length) return false;
		if(This.closest('.total_search_wrap').length) return false;
		if(This.closest('.top_search').length) return false;
    */
		// if(This.closest('.zip_search').length) return false;

    if($delInput.attr("readonly")) return false;
    if($delInput.attr("disabled")) return false;
    
		//	$(this).removeClass("input_error");
    let searchWrap = $(this).parents(".auto_keyword_box, .search_header_wrap");
    if(searchWrap.length == 0) searchWrap = $(this).parents().find(".auto_keyword_box, .search_header_wrap");
		if ($delInput.val().length == 0) {
			$del.removeClass("on");
      $('.zip_search_layer').removeClass('is_active');
			if(searchWrap.length) searchWrap.removeClass("is_active").removeClass("is_autoWord");
		} else {
			$del.addClass("on");
      $('.zip_search_layer').addClass('is_active');
			if(!searchWrap.hasClass("is_autoWord")){
        searchWrap.addClass("is_active").addClass("is_autoWord");
        $(document).one("click",function(){
          setTimeout(()=>{
            searchWrap.removeClass("is_autoWord");
          },100)
        })
      }
		}
	});

  Document.on("focus", ".input_clear input",  function () {
    var This = $(this), wrap  = This.closest(".input_clear");
    /*
    if(This.closest(".search_wrap").length) return false;
		if(This.closest('.total_search_wrap').length) return false;
		if(This.closest('.top_search').length) return false;
    */
		// if(This.closest('.zip_search').length) return false;

    if(This.attr("readonly")) return false;
    if(This.attr("disabled")) return false;
    if(wrap.find('.form_bytes').length) wrap.addClass('is_active');//글자수 있는 경우에만 클래스 추가
    if(this.value.length >0){
      const $del = This.siblings(".clear_btn");
      $del.addClass("on")
    }
  });

  Document.on("blur", ".input_clear input",  function () {
    var This = $(this)

    if(This.closest(".search_wrap").length) return false;
		if(This.closest('.total_search_wrap').length) return false;
		if(This.closest('.zip_search').length) return false;
		if(This.closest('.top_search').length) return false;

    if(This.attr("readonly")) return false;
    if(This.attr("disabled")) return false;
    ui_inputWordOff()
    var btn  = This.siblings(".clear_btn");
    var wrap  = This.closest(".input_clear");
    if(!wrap.hasClass("search")){
      btn.removeClass("on");
    }
    if(wrap.find('.form_bytes').length){//글자수 있는 경우에만
      if(This.val().length == 0) wrap.removeClass("is_active");
    }
  });

  ui_inputActive();

};


function ui_inputWordOff(){
  setTimeout(function(){
    $(".auto_keyword_box, .search_header_wrap").removeClass("is_autoWord");
  },200)
}

function ui_inputActive(){
	
  $(".input_clear.search input").each(function(){
		if(
      this.value != "" 
      && this.getAttribute('disabled') == null 
      && this.getAttribute('readonly') == null
    ){
      const $delInput = $(this);
      const $del = $delInput.siblings(".clear_btn");
      $del.addClass("on").css( {'visibility':'visible'});
    }
  })

}



function swiper3_se(){
    
  if ($(".swiper_type3").length > 1) {
    $(".swiper_type3").each(function (index) {
      // 스와이퍼 개별적용
      let $this = $(this);
      let slideInx = 0; //현재 슬라이드 index
      
      if (this.swiper3 != undefined) {
        //슬라이드 초기화
        this.swiper3.destroy();
        this.swiper3 = undefined;
      }
  
      $this.addClass("slider-" + index);
      this.swiper3 = new Swiper(this, {
        slidesPerView: 6,
        initialSlide: slideInx,
        spaceBetween: 10,
        slidesPerGroup: 6,
        threshold: 0,
        ally: false,
        navigation: {
          nextEl: ".slider-" + index + ".pagenum2 > .swiper-button-next",
          prevEl: ".slider-" + index + ".pagenum2 > .swiper-button-prev",
        },
        breakpoints: {
          1281: {
            slidesPerView: 7, //브라우저가 1280보다 클 때
            spaceBetween: 10,
            slidesPerGroup: 7,
          },
        },
        on: {
          activeIndexChange: function () {
            slideInx = this.realIndex; //현재 슬라이드 index 갱신
          },
        },
      });
    });
  }else{
    
    swiper3 = new Swiper(".swiper_type3", {
      slidesPerView: 6,
      spaceBetween: 10,
      slidesPerGroup: 6,
      threshold: 0,
      ally: false,
      navigation: {
        nextEl: ".pagenum2 > .swiper-button-next",
        prevEl: ".pagenum2 > .swiper-button-prev",
      },
      breakpoints: {
        1281: {
          slidesPerView: 7, //브라우저가 1280보다 클 때
          spaceBetween: 10,
          slidesPerGroup: 7,
        },
      },
    });
  }
}



// 상품 가로 스와이프
$(function () {
  swiper3_se();
  var swiper1 = new Swiper(".swiper_type1", {
    slidesPerView: 3.08,
    spaceBetween: 10,
    slidesPerGroup: 3,
    threshold: 0,
    ally: false,
    navigation: {
      nextEl: ".pagenum5 > .swiper-button-next",
      prevEl: ".pagenum5 > .swiper-button-prev",
    },
  });
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
  // var swiper3 = new Swiper('.swiper_type3', {
  // 	slidesPerView: 7,
  // 	spaceBetween: 10,
  // 	slidesPerGroup: 7,
  // 	threshold: 0,
  // 	navigation: {
  // 		nextEl: ".pagenum2 > .swiper-button-next",
  // 		prevEl: ".pagenum2 > .swiper-button-prev",
  // 	  },
  // });
  

  // var swiper4 = new Swiper('.swiper_type4', {
  // 	slidesPerView: 5,
  // 	spaceBetween: 10,
  // 	slidesPerGroup: 5,
  // 	// slidesPerColumnFill: 'row',
  // 	grid: {
  // 		rows: 2,
  // 	},
  // 	navigation: {
  // 		nextEl: ".pagenum3 > .swiper-button-next",
  // 		prevEl: ".pagenum3 > .swiper-button-prev",
  // 	  },
  // });
  var swiper4 = new Swiper(".swiper_type4", {
    slidesPerView: 1,
    ally: false,
    navigation: {
      nextEl: ".pagenum3 > .swiper-button-next",
      prevEl: ".pagenum3 > .swiper-button-prev",
    },
  });
  var pagingSwiper = new Swiper(".swiper_type4", {
    ally: false,
    pagination: {
      el: ".swiper-pagination",
      type: "progressbar",
    },
  });
  if(swiper4.controller) swiper4.controller.control = pagingSwiper;

  var multiSwiper = $(".multi_swiper");
  var multiPaging = $(".multi_pagination");
  multiSwiper.each(function (n) {
    var pagingTxt = "multi_pagination_" + n;
    var swiperTxt = "multi_swiper_" + n;

    multiSwiper.eq(n).addClass(swiperTxt);
    multiPaging.eq(n).addClass(pagingTxt);

    var swiper_multi = new Swiper("." + swiperTxt, {
      slidesPerView: 1,
      ally: false,
      navigation: {
        nextEl: "." + pagingTxt + " > .swiper-button-next",
        prevEl: "." + pagingTxt + " > .swiper-button-prev",
      },
    });
    var pagingSwiper_multi = new Swiper("." + swiperTxt, {
      pagination: {
        el: ".swiper-pagination",
        type: "progressbar",
      },
    });
    if(swiper_multi.controller) swiper_multi.controller.control = pagingSwiper_multi;
    //this.swiper = swiper_multi;
  });

  var multiSwiper_full = $(".multi_swiper_full");
  var multiPaging_full = $(".multi_pagination_full");
  multiSwiper_full.each(function (n) {
    var pagingTxt = "multi_pagination_" + n;
    var swiperTxt = "multi_swiper_" + n;

    multiSwiper_full.eq(n).addClass(swiperTxt);
    multiPaging_full.eq(n).addClass(pagingTxt);

    var swiper_multi = new Swiper("." + swiperTxt, {
      slidesPerView: 4,
      spaceBetween: 10,
      slidesPerGroup: 4,
      ally: false,
      threshold: 0,
      navigation: {
        nextEl: "." + pagingTxt + " > .swiper-button-next",
        prevEl: "." + pagingTxt + " > .swiper-button-prev",
      },
    });
    //this.swiper = swiper_multi;
  });

  var swiper5 = new Swiper(".swiper_type5", {
    //상품상세 하단 연관콘텐츠
    slidesPerView: 2,
    spaceBetween: 10,
    slidesPerGroup: 2,
    threshold: 0,
    ally: false,
    navigation: {
      nextEl: ".pagenum5 > .swiper-button-next",
      prevEl: ".pagenum5 > .swiper-button-prev",
    },
  });
  var swiper6 = new Swiper(".swiper_type6", {
    //카테고리 전시중카테고리 신상품
    slidesPerView: 4.1,
    spaceBetween: 10,
    slidesPerGroup: 4,
    threshold: 0,
    ally: false,
    navigation: {
      nextEl: ".pagenum6 > .swiper-button-next",
      prevEl: ".pagenum6 > .swiper-button-prev",
    },
  });


  // var doubleHeight = $('.swiper_type4').find('.swiper-slide').height() *2;
  // $('.swiper_type4').css({'height': doubleHeight});

  var swiper7 = new Swiper(".swiper_type7", {
    //룩북
    slidesPerView: "auto",
    spaceBetween: 10,
    slidesPerGroup: 3,
    threshold: 0,
    ally: false,
    navigation: {
      nextEl: ".pagenum7 > .swiper-button-next",
      prevEl: ".pagenum7 > .swiper-button-prev",
    },
  });
  /*
	var swiper11= new Swiper('.swiper_type11', { //룩북안에 룩북
		slidesPerView: 'auto',
		spaceBetween: 10,
		freeMode: true,
		threshold: 0,
		nested: true,
		navigation: {
			nextEl: ".swiper_nest .swiper-button-next",
			prevEl: ".swiper_nest .swiper-button-prev",
		},
	});*/

  $(".swiper_type11").each(function (index) {
    // 스와이퍼 개별적용
    let $this = $(this);
    let swiper11 = undefined;
    let slideInx = 0; //현재 슬라이드 index

    if ($(".swiper_type11").length > 1) {
      sliderAct();
    } else {
      swiper11 = new Swiper(".swiper_type11", {
        slidesPerView: "auto",
        spaceBetween: 10,
        freeMode: false,
        threshold: 0,
        nested: true,
        ally: false,
        navigation: {
          nextEl: ".swiper_nest .swiper-button-next",
          prevEl: ".swiper_nest .swiper-button-prev",
        },
      });
    }
    function sliderAct() {
      $this.addClass("slider-" + index);
      if (swiper11 != undefined) {
        //슬라이드 초기화
        swiper11.destroy();
        swiper11 = undefined;
      }
      swiper11 = new Swiper(".slider-" + index, {
        slidesPerView: "auto",
        spaceBetween: 10,
        freeMode: false,
        threshold: 0,
        nested: true,
        ally: false,
        navigation: {
          nextEl: ".slider-" + index + ".swiper_nest .swiper-button-next",
          prevEl: ".slider-" + index + ".swiper_nest .swiper-button-prev",
        },

        on: {
          activeIndexChange: function () {
            slideInx = this.realIndex; //현재 슬라이드 index 갱신
          },
        },
      });
    }
  });

  $('.swiper_tab').each(function(){
    const t = this, eventTab=t.closest('.twoway_right_area') != undefined;
    const swiper33 = new Swiper(t, {
      init:false,
      slidesPerView: "auto",
      spaceBetween: eventTab ? 30 : 0,
      observer: true,
      observeParents: true,
      ally: false,
      freeMode: true,
      scrollbar: {
        el: ".swiper-scrollbar",
        draggable: true,
      },
    });
    var tab_swiper = $(t).find('.swiper-wrapper .tab_btn');
    tab_swiper.click(function (e) {
      var target = $(this);
      e.preventDefault();
      tab_swiper.removeClass("is_active");
      target.addClass("is_active");
    });
    swiper33.init();
  });

  var swiper_brand = new Swiper(".swiper_brand", {
    //브랜드 스와이프, 프로그래스 필요
    slidesPerView: "auto",
    spaceBetween: 10,
    loop: true,
    /*slidesPerGroup: 4,*/
    centeredSlides: true,
    loopAdditionalSlides: 1,
    threshold: 0,
    ally: false,
    pagination: {
      el: ".swiper_brand .swiper-pagination",
      type: "progressbar",
    },
    navigation: {
      nextEl: ".swiper_brand .swiper-button-next",
      prevEl: ".swiper_brand .swiper-button-prev",
    },
  });

  var swiper_brand_long = new Swiper(".swiper_brand_long", {
    //브랜드 스와이프_long, 프로그래스 필요
    slidesPerView: "auto",
    spaceBetween: 10,
    threshold: 0,
    slidesPerGroup: 4,
    ally: false,
    pagination: {
      el: ".swiper_brand_long .swiper-pagination",
      type: "progressbar",
    },

    navigation: {
      nextEl: ".pagenum_brand > .swiper-button-next",
      prevEl: ".pagenum_brand > .swiper-button-prev",
    },
  });

  /*
	var product_list_card= new Swiper('.product_list_card', { //룩북 큰 스와이프 - 그리드
		slidesPerView: 1,		
		spaceBetween: 30,
    	slidesPerGroup: 2,
		preventClicks :true,
    	a11y: false,		

		navigation: {
			nextEl: ".swiper_list_card_big > .swiper-button-next",
			prevEl: ".swiper_list_card_big > .swiper-button-prev",
		},

	});*/

  var swiper_list_card_small = new Swiper(".swiper_list_card_small", {
    //룩북 작은썸넬
    slidesPerView: 3,
    spaceBetween: 4,
    nested: true,
    ally: false,
    pagination: {
      el: ".swiper_list_card_small > .swiper-pagination",
      type: "progressbar",
    },

    navigation: {
      nextEl: ".swiper_list_card_small .swiper-button-next",
      prevEl: ".swiper_list_card_small .swiper-button-prev",
    },
  });

  var swiper_lookbook_dtl = new Swiper(".swiper_lookbook_dtl", {
    //룩북 디테일 1상품 , 프로그래스 필요
    slidesPerView: "auto",
    spaceBetween: 0,
    threshold: 0,
    ally: false,
    pagination: {
      el: ".swiper_lookbook_dtl .swiper-pagination",
      type: "progressbar",
    },

    navigation: {
      nextEl: ".swiper_lookbook_dtl > .swiper-button-next",
      prevEl: ".swiper_lookbook_dtl > .swiper-button-prev",
    },
  });
  var swiper_mb = new Swiper('.swiper_mb', {
		threshold: 0,
		loop: true,
		pagination: {
			el: ".pagination",
			type: "fraction",
		},
		speed: 2000,
		autoplay: {
			delay: 2000,
			disableOnInteraction: false,
		},
	});
  /*
	var swipercol1 = new Swiper('.swiper_col1', { //연관상품 스와이프
		slidesPerView: 'auto',
		spaceBetween: 4,
		freeMode: false,
		threshold: 0,
		centerInsufficientSlides:true,
		navigation: {
			nextEl: ".photo_review_inner .swiper-button-next",
			prevEl: ".photo_review_inner .swiper-button-prev",
		},

	});*/

  $(".swiper_col1").each(function (index) {
    // 스와이퍼 개별적용
    let $this = $(this);
    let swipercol1 = undefined;
    let slideInx = 0; //현재 슬라이드 index

    if ($(".swiper_col1").length > 1) {
      sliderAct();
    } else {
      swipercol1 = new Swiper(".swiper_col1", {
        slidesPerView: "auto",
        spaceBetween: 4,
        freeMode: false,
        threshold: 0,
        ally: false,
        centerInsufficientSlides: true,
        navigation: {
          nextEl: ".photo_review_inner .swiper-button-next",
          prevEl: ".photo_review_inner .swiper-button-prev",
        },
      });
    }
    function sliderAct() {
      $this.parents(".photo_review_inner").addClass("slider-c" + index);
      $this.addClass("slider-cs" + index);
      var $this_val = $this.parents(".photo_review_inner").addClass("slider-" + index);
      if (swipercol1 != undefined) {
        //슬라이드 초기화
        swipercol1.destroy();
        swipercol1 = undefined;
      }
      swipercol1 = new Swiper(".slider-cs" + index, {
        slidesPerView: "auto",
        spaceBetween: 4,
        freeMode: false,
        threshold: 0,
        centerInsufficientSlides: true,
        navigation: {
          nextEl: ".slider-c" + index + " .swiper-button-next",
          prevEl: ".slider-c" + index + " .swiper-button-prev",
        },

        on: {
          activeIndexChange: function () {
            slideInx = this.realIndex; //현재 슬라이드 index 갱신
          },
        },
      });
    }
  });

  var swiper = new Swiper(".swiper_review_small", {
    spaceBetween: 4,
    slidesPerView: "auto",
    freeMode: true,
    centerInsufficientSlides: true,
    watchSlidesProgress: true,
    ally: false,
  });
  var swiper2 = new Swiper(".swiper_review", {
    spaceBetween: 10,
    ally: false,
    navigation: {
      nextEl: ".swiper_review .swiper-button-next",
      prevEl: ".swiper_review .swiper-button-prev",
    },
    thumbs: {
      swiper: swiper,
    },
  });

  /* 룩북 상세 리스트 스와이프 */
  var swiper_br_dtl_01 = new Swiper(".swiper_br_dtl_01", {
    //카테고리 전시중카테고리 신상품
    slidesPerView: 5,
    spaceBetween: 10,
    slidesPerGroup: 5,
    ally: false,
    threshold: 0,
    navigation: {
      nextEl: ".swiper_br01 > .swiper-button-next",
      prevEl: ".swiper_br01 > .swiper-button-prev",
    },
  });

  var swiper_br_dtl_02 = new Swiper(".swiper_br_dtl_02", {
    //상품상세 하단 연관콘텐츠
    slidesPerView: 3,
    spaceBetween: 10,
    slidesPerGroup: 3,
    ally: false,
    threshold: 0,
    navigation: {
      nextEl: ".swiper_br02 > .swiper-button-next",
      prevEl: ".swiper_br02 > .swiper-button-prev",
    },
  });

  /*
	var swiper_br_dtl_03 = new Swiper('.swiper_br_dtl_03', { //상품상세 하단 브랜드 룩북
		slidesPerView: 3,
		spaceBetween: 10,
		slidesPerGroup: 3,
		threshold: 0,
		navigation: {
			nextEl: ".swiper_br03 > .swiper-button-next",
			prevEl: ".swiper_br03 > .swiper-button-prev",
		  },
	});*/
  $(".swiper_br_dtl_03").each(function (index) {
    // 스와이퍼 개별적용
    let $this = $(this);
    let swiper_br_dtl_03 = undefined;
    let slideInx = 0; //현재 슬라이드 index

    if ($(".swiper_br_dtl_03").length > 1) {
      sliderAct();
    } else {
      swiper_br_dtl_03 = new Swiper(".swiper_br_dtl_03", {
        slidesPerView: 3,
        spaceBetween: 10,
        slidesPerGroup: 3,
        threshold: 0,
        navigation: {
          nextEl: ".swiper_br03 > .swiper-button-next",
          prevEl: ".swiper_br03 > .swiper-button-prev",
        },
      });
    }
    function sliderAct() {
      $this.siblings(".tit_area").addClass("slider-b" + index);
      $this.addClass("slider-bs" + index);
      if (swiper_br_dtl_03 != undefined) {
        //슬라이드 초기화
        swiper_br_dtl_03.destroy();
        swiper_br_dtl_03 = undefined;
      }
      swiper_br_dtl_03 = new Swiper(".slider-bs" + index, {
        slidesPerView: 3,
        spaceBetween: 10,
        slidesPerGroup: 3,
        threshold: 0,
        ally: false,
        navigation: {
          nextEl: ".slider-b" + index + " .swiper-button-next",
          prevEl: ".slider-b" + index + " .swiper-button-prev",
        },

        on: {
          activeIndexChange: function () {
            slideInx = this.realIndex; //현재 슬라이드 index 갱신
          },
        },
      });
    }
  });

  $('.swiper_banner').each(function(i){
		const $t = $(this), $page = $t.data('page') ? $($t.data('page')) : $t, autoH = $t.data('autoHeight') ? true : false;
		const swiperBn = [];
		swiperBn[i] = new Swiper($t[0], {
			slidesPerView: 'auto',
			spaceBetween: 0,
			watchSlidesProgress: true,
			autoHeight: autoH,
			pagination: {
				el: $t.find('.swiper-pagination'),
				type: "progressbar",
			},
			navigation: {
				nextEl: $page.find('.swiper-button-next')[0],
				prevEl: $page.find('.swiper-button-prev')[0],
			},
		});
		$t.find('.coupon_tit').click(function(){
			$(this).parent('.coupon_notice').toggleClass('on');
			swiperBn[i].update();
		});
	});

	//가로 스와이퍼(양쪽 그라데이션)
	$('.swiper_grd').each(function(i){
		const $t = $(this);
		const swiperGrd = [];
		swiperGrd[i] = new Swiper($t.find('.swiper')[0], {
			slidesPerView: 'auto',
			freeMode: true,
			watchSlidesProgress: true,
			navigation: {
				nextEl: $t.find('.swiper-button-next')[0],
				prevEl: $t.find('.swiper-button-prev')[0],
			},
		});
	});

  let options = {};
  if ($(".account_list .swiper-slide").length == 1) {
    $(".pagination").hide();
    options = {
      slidesPerView: "auto",
      threshold: 0,
      centeredSlides: true,
    };
  } else {
    options = {
      slidesPerView: "auto",
      threshold: 0,
      centeredSlides: true,
      updateOnWindowResize: true,
      preventClicks : false,
      preventClicksPropagation : false,
      // slideToClickedSlide : true,
      on: {
        slideChangeTransitionStart: function () {
          $(".bank_select_wrap .custom_select_wrap").addClass("disabled");
          $(".custom_select_wrap .option_list").hide();
          $(".bank_select_wrap").find("input").attr("disabled", true);
          $(".bank_select_wrap").hide();
          $(".swiper_type13 .custom_select_wrap").addClass("disabled");
          $(".swiper_type13 .custom_select_wrap").next().find("input").not(".cardPoint").attr("disabled", true);
          
          if ($("li.swiper-slide-active").hasClass("card")) {
            $("li.swiper-slide-active > .custom_select_wrap").not(".cardPoint").removeClass("disabled");
            $("li.swiper-slide-active > .custom_select_wrap").next().find("input").not(".cardPoint").attr("disabled", false);
          } else if ($("li.swiper-slide-active").hasClass("bank")) {
            $(".bank_select_wrap").show();
            $(".bank_select_wrap").find("input").attr("disabled", false);
            $(".bank_select_wrap .custom_select_wrap").not(".cardPoint").removeClass("disabled");
          } else {
          }
        },
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    };
  }
  card_swiper = new Swiper(".swiper_type13", options);

  

});
var card_swiper;



function ui_swiper_init(){
  var Swipers = [];
  $(".swiper").each(function (i) {
    var This = $(this)
    if(This.hasClass('swiper-initialized')) return true;

    var thisID = $(this).attr("id");

    Swipers[i] = new Swiper("#" + thisID, {
      slidesPerView: 4,
      spaceBetween: 10,
      slidesPerGroup: 4,
      ally: false,
      threshold: 0,
      navigation: {
        nextEl: "#next_" + thisID,
        prevEl: "#prev_" + thisID,
      },
    });
  });
}



// 스티키 탭
// $(function () {
// 	var pdbar = $('#detailbar').offset().top;
// 	$(window).scroll(function () {
// 		var window = $(this).scrollTop();
// 		if (pdbar <= window) {
// 			$('#detailbar').addClass('sticky');
// 		} else {
// 			$('#detailbar').removeClass('sticky');
// 		}
// 	});
// 	$('#detailbar button').on('click', function(){
// 		$('#detailbar button.is_active').removeClass('is_active');
// 		$(this).addClass('is_active');
// 	});
// });
function fnMove(tabId){
	var offset = $('#' + tabId).offset();
	$('html, body').animate({scrollTop: (offset.top - 67)}, 500);
	//$('html, body').animate({scrollTop: offset.top}, 500);
}

// jquery-ui slider script
$(function () {
  var $jquerySlider = $('[data-js="jquerySlider"]');
  var $sliderTextLeft = $jquerySlider.find('[data-js="slider-before"]');
  var $sliderTextRight = $jquerySlider.find('[data-js="slider-after"]');

  $("#sliderRange").slider({
    range: true,
    step: 10000,
    min: 0,
    max: 1000000,
    values: [0, 1000000],
    slide: function (event, ui) {
      $sliderTextLeft.val(inputNumberWithComma(ui.values[0]));
      $sliderTextRight.val(inputNumberWithComma(ui.values[1]));
    },
  });
});
// 천단위 이상의 숫자에 콤마( , )를 삽입하는 함수
function inputNumberWithComma(str) {
  str = String(str);
  return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
}

// coupon 개발 삭제 요청 0322
// $.couponIssued = function () {
//   $(document).on("click", ".coupon_item", function () {
//     if (!$(this).hasClass("issued") && !$(this).hasClass("expired")) {
//       $(this).addClass("issued");
//       ToastOpen("#Toast");
//     }
//   });
// };

// 자기자신 삭제 (검색 필터)
$.selfDeleteBtn = function () {
  /*
  $(document).on("click", ".search_txt_item .btn_del", function () {
		$(this).closest(".search_txt_item").remove();
		// if ($(".search_txt_item").length == 0) {
		// 	$(".search_txt_list").hide();
		// 	$(".search_txt_wrap").remove();
		// }
	});
  */



};

// tab
$.tab = function () {
  $('[class^="tab_style"] > .tab_btn').each(function (index, item) {
    const _this = $(item);
    if(_this.closest(".scroll_to").length > 0) return true;
    _this.click(function () {
      const $tab_id = _this.attr("data-tab");
      const $tab = _this.parents('[class^="tab_style"]');
      const $tab_btns = $tab.find(".tab_btn"); // 탭 버튼 전체

      const $tab_content = $tab.siblings(".tab_cont_box").find('.tab_cont[ data-id="' + $tab_id + '"]');
      const $tab_content_all = $tab.siblings(".tab_cont_box").children(".tab_cont"); // 탭 컨텐츠 전체

      const $tab_content01 = $tab
        .parents(".tit_area")
        .siblings(".tab_cont_box")
        .find('.tab_cont[ data-id="' + $tab_id + '"]'); //tit_area 갖고있는 탭
      const $tab_content_all01 = $tab.parents(".tit_area").siblings(".tab_cont_box").children(".tab_cont"); //tit_area 갖고있는 탭 컨텐츠 전체

      const $tab_content_p = $tab.siblings(".tab_cont_box");
      const $tab_depth = $tab.siblings(".tab_depth_box").find('[ data-id="' + $tab_id + '"]');
      const $tab_depth_all = $tab.siblings(".tab_depth_box").find(".tab_depth");
      const $tab_3depth = $tab.siblings(".tab_3depth_box").find(".tab_depth");

      $tab_btns.removeClass("is_active");
      _this.addClass("is_active");

      //$tab_content_all.removeClass('is_active');
      //$tab_content.addClass('is_active');

      //sticky 예외 처리 탭
      if ($tab.parents("div").hasClass("tit_area")) {
        $tab_content_all01.removeClass("is_active");
        $tab_content01.addClass("is_active");
      } else {
        $tab_content_all.removeClass("is_active");
        $tab_content.addClass("is_active");
      }

      $tab_content_p.scrollTop(0);

      $tab_depth_all.removeClass("is_active");
      $tab_depth.addClass("is_active");
      $tab_3depth.removeClass("is_active");

      /* 탭 클릭 시 active 탭 중앙으로 이동 */
      var $tabActive = $tab.find(".tab_btn.is_active");
      var myScrollPos = $tabActive.offset().left + $tabActive.outerWidth() / 2 + $tab.scrollLeft() - $tab.outerWidth() / 2;
      $tab.scrollLeft(myScrollPos);
    });
  });
};

// tab_brand

$.brandSticky = function(){

	
	// A - Z	브랜드 검색
	var tabArea = $('.tab_brand_wrap .tab_style').find('button');
	tabArea.each(function (index, item) {

		const _this = $(item);
		
	
		_this.click(function () {
			
			//버튼이 클릭되면 ABC버튼 각 영어,한글은 초기화
			$(".tab_style button").removeClass("is_active");
			$('section[class^="tab_lang_wrap"]').removeClass("is_active");
			
			//ABC / ㄱㄴㄷ 버튼
			const $tab_id   = _this.attr('data-tab'); //영문,한글
			if( $tab_id != null){
			   if($tab_id == "tab_e"){
				  $($('section[class^="tab_lang_wrap"][data-id="tab_e"]')).addClass("is_active");
				  _this.addClass('is_active');
			   }else{
				  $($('section[class^="tab_lang_wrap"][data-id="tab_k"]')).addClass("is_active");
				  _this.addClass('is_active');
			   }
			}
   
			
			if($(this).attr('data-target').includes("e_")){
			   
			   if($('section[class^="tab_lang_wrap"][data-id="tab_e"]')){
				  $($('section[class^="tab_lang_wrap"][data-id="tab_e"]')).addClass("is_active");
				  $($('button[data-tab="tab_e"]')).addClass("is_active");
			   }
			}else{
			   if($('section[class^="tab_lang_wrap"][data-id="tab_k"]')){
				  $($('section[class^="tab_lang_wrap"][data-id="tab_k"]')).addClass("is_active");
				  $($('button[data-tab="tab_k"]')).addClass("is_active");
			   }
			}
			
			
			_this.addClass('is_active'); //해당 버튼 abc ㄱㄴㄷ 
			scroll_tab($(this).attr('data-target')); // 스크롤 이동
			
		});
	});

	
  /*
	var tabArea01 = $('.search_brand_wrap .tab_style').find('button'); // 단어 선택
	var tabArea02 = $('.search_brand_wrap .tab_style7').find('button');  // 한글 영문

	tabArea02.each(function (index, item) {

		const _this = $(item);
	
		_this.click(function () {

			$('section[class^="tab_lang_wrap"]').removeClass("is_active");
			

			//ABC / ㄱㄴㄷ 버튼
			const $tabArea_lang   = _this.attr('data-tab'); //영문,한글

			//console.log($tabArea_lang);
			const $contArea_lang   = $('.search_result_brand_wrap').find('.tab_lang_wrap[data-id="' + $tabArea_lang + '"]');

			//console.log($contArea_lang);

			if( $tabArea_lang != null){
			   if($tabArea_lang == "tab_e"){
					$('.search_brand_lang_wrap[data-lang-id="tab_e"]').addClass("is_active");
					$('.search_brand_lang_wrap[data-lang-id="tab_k"]').removeClass("is_active");
					$contArea_lang.addClass('is_active');
				  	//console.log('영');
				  	_this.addClass('is_active');
					  $('section[class^="tab_lang_wrap"][data-id="tab_e"]').scrollTop(0);
			   }else{
					$('.search_brand_lang_wrap[data-lang-id="tab_k"]').addClass("is_active");
				  	$('.search_brand_lang_wrap[data-lang-id="tab_e"]').removeClass("is_active");
				  	// console.log('한');
				  	$contArea_lang.addClass('is_active');
				  	_this.addClass('is_active');
					  $('section[class^="tab_lang_wrap"][data-id="tab_k"]').scrollTop(0);
			   }

			   
			}

		});
	});


	tabArea01.each(function (index, item) {

		const _this = $(item);
	
	
		_this.click(function () {


			$(".tab_style button").removeClass("is_active");
			
			if($(this).attr('data-target').includes("e_")){
			   
				if($('section[class^="tab_lang_wrap"][data-id="tab_e"]')){
				   //console.log("영문");
				   $($('section[class^="tab_lang_wrap"][data-id="tab_e"]')).addClass("is_active");
				   $($('button[data-tab="tab_e"]')).addClass("is_active");
				}
			 }else{
				if($('section[class^="tab_lang_wrap"][data-id="tab_k"]')){
				   //console.log("국문");
				   $($('section[class^="tab_lang_wrap"][data-id="tab_k"]')).addClass("is_active");
				   $($('button[data-tab="tab_k"]')).addClass("is_active");
				}
			 }
			 
			 
			 //$tab_id.addClass('is_active'); 
			 _this.addClass('is_active'); 
			 scroll_tab01($(this).attr('data-target')); // 스크롤 이동
			

		});
	});
  */
  
	var scrollBox = $(".search_result_brand_wrap .auto_complete_wrap .tab_lang_wrap");
  var tabBtns = $(".search_brand_wrap  .tab_style7 button")
  var tabBtns_word = $(".search_brand_wrap .search_brand_lang_wrap")
  var cont = scrollBox;
  var tabNow = $(".search_brand_wrap  .tab_style7 button").index($(".search_brand_wrap  .tab_style7 button.is_active"));
	var sizeArr = [];
	var sumTopPos = 0;

  if($(".total_search_word_wrap").length){
     scrollBox = $(".total_search_word_wrap .tab_lang_wrap");
     tabBtns = $(".total_search_word_wrap  .tab_style7 button")
     tabBtns_word = $(".total_search_word_wrap .search_brand_lang_wrap")
     tabNow = $(".search_brand_wrap  .tab_style7 button").index($(".search_brand_wrap  .tab_style7 button.is_active"));
     cont = scrollBox;
  }
  
  if(scrollBox.length == 0) return false;
  
  /* 한/영 선택 */
	tabBtns.off("click.tabBtns")
	tabBtns.on("click.tabBtns",function () {
    
    var n = $(this).index();
    cont.hide().eq(n).show();
		tabBtns_word.removeClass("is_active").eq(n).addClass("is_active");
		scrollBox.scrollTop(0);
		getTop(n);
		tabNow = n;
		tabBtns_word.each(function () {
			this.btns.removeClass("is_active").eq(0).addClass("is_active");
			this.cont.scrollLeft(0);
		})
	});

  /* 포지션 리셋 */
	function getTop(n) {
    scrollBox.stop().scrollTop(0);
		sizeArr = [];
		var contTop = cont.eq(n).offset().top - sumTopPos;
		var section = $("section", cont[n]);
		// console.log(contTop) 
		section.each(function () {
			var sum = Math.ceil($(this).offset().top) - contTop
			sizeArr.push(sum)
		})
		//  console.log(sizeArr)
	}
  /* 단어별 클릭 셋팅 */
	function wordInit() {
    var cont = scrollBox.closest(".cont").not(".is_active");
    cont.show()
    scrollSet()
		getTop(tabNow);
   
		tabBtns_word.each(function () {
			this.btns = $("button:not(:disabled)", this);
			this.btns2 = $("button", this);
			this.btns2.each(function (n) { this.nn = n })
			this.btns2.off("click.word")
			this.cont = $(".tab_sub", this);
      var btns = this.btns;
			this.btns.off("click.word");
			this.btns.each(function (n) {
				this.n = n;
				this.$ = $(this)
				this.scroll = this.$.parent()
				this.width = this.scroll.width();
        this.friend = btns
			}).on("click.word", function () {
        scrollSet()
        getTop(tabNow);
				var n = this.n;
       
        scrollBox.stop().scrollTop( sizeArr[n]  );
        setTimeout(()=>{wordChange(n),50})
        // scrollBox.stop().animate({ scrollTop: sizeArr[n] - 2  },
        // {
        //   step: function () {
        //     // sticky.css({ top: 0 })
        //   }, done: function () {
        //     wordChange(n);
        //   }
        // })
        
			})
		})
    wordChange(0)
    
    cont.hide()
	}
	wordInit();
  
  
  function wordChange(idx){
		var This = tabBtns_word[tabNow].btns.removeClass("is_active").eq(idx)
		This.addClass("is_active")
  }


	var wordNow = 0;
	function scrollSet(){
    
    scrollBox.each(function(){
      var This = $(this);
      var cont = $(".search_filter_modal .content_scroll_wrap");
  
      This.scroll(function () {
        var now = This.scrollTop();
        var idx = 0;
        // console.log(now)
        sizeArr.forEach(function (chk, i) {
          //console.log(chk , now)
          if (chk < now+2) {
            idx = i
            return false;
          }
        });
        if (wordNow != idx) {
          wordNow = idx;
          wordChange(wordNow)
        }
      })
      
    })
  }
  return {init:wordInit}
	
	
};

//버튼클릭이동 -> 부드럽게
function scroll_tab(anchor_id, speed) {
  if (!speed) var speed = "slow";
  var a_tag = $("#" + anchor_id);
  if (a_tag.length > 0) {

    $("html, body").stop().scrollTop(a_tag.offset().top - $(".sticky").height() - 100)
    // $("html, body").stop().animate(
    //   {
    //     scrollTop: a_tag.offset().top - $(".sticky").height() - 100, //sticky class 높이 제외하고 100정도 밑
    //   },
    //   speed
    // );
  } else {
    console.log("no target");
  }

  var scrollValue;
  var a_tag = $("#" + anchor_id);
  if (anchor_id.includes("e_")) {
    // console.log("영")
    $('section[class^="tab_lang_wrap"][data-id="tab_e"]').scrollTop(0);
    scrollValue = a_tag.offset().top - $('section[class^="tab_lang_wrap"][data-id="tab_e"]').offset().top;
  } else {
    // console.log("한")
    $('section[class^="tab_lang_wrap"][data-id="tab_k"]').scrollTop(0);
    scrollValue = a_tag.offset().top - $('section[class^="tab_lang_wrap"][data-id="tab_k"]').offset().top;
  }

  if (!speed) var speed = "slow";

  //console.log("아이디:" + $('.tab_lang_wrap').offset().top);
  // console.log("아이디:" + anchor_id);
  // console.log("아이디:" + scrollValue);

  if (a_tag.length > 0) {
    $(".tab_lang_wrap").stop().animate(
      {
        scrollTop: scrollValue,
      },
      speed
    );
  } else {
    console.log("no target");
  }
}

function scroll_tab01(anchor_id,speed) {

	var scrollValue;
	var a_tag = $("#"+anchor_id);
	var scrollBox = $('.tab_lang_wrap');
	var targetScroll = scrollBox[0]
	
	if(targetScroll.__overlayScrollbars__){
		
		if(anchor_id.includes("e_")){
			// console.log("영")
			targetScroll = scrollBox[0]
			targetScroll.__overlayScrollbars__.scroll({top:0})
			scrollValue = a_tag.offset().top - $('section[class^="tab_lang_wrap"][data-id="tab_e"]').offset().top;
		}else{
			// console.log("한")
			targetScroll = scrollBox[1]
			targetScroll.__overlayScrollbars__.scroll({top:0})
			scrollValue = a_tag.offset().top - $('section[class^="tab_lang_wrap"][data-id="tab_k"]').offset().top;
		}

	}else{
			
		if(anchor_id.includes("e_")){
			// console.log("영")
			$('section[class^="tab_lang_wrap"][data-id="tab_e"]').scrollTop(0);
			scrollValue = a_tag.offset().top - $('section[class^="tab_lang_wrap"][data-id="tab_e"]').offset().top;
		}else{
			// console.log("한")
			$('section[class^="tab_lang_wrap"][data-id="tab_k"]').scrollTop(0);
			scrollValue = a_tag.offset().top - $('section[class^="tab_lang_wrap"][data-id="tab_k"]').offset().top;
		}
	}
		
	if( !speed ) var speed = 'slow';
	

	
	

	
	//console.log("아이디:" + $('.tab_lang_wrap').offset().top);
	// console.log("아이디:" + anchor_id);
	// console.log("아이디:" + scrollValue);
	

	if(a_tag.length > 0){
		if(targetScroll.__overlayScrollbars__){
			targetScroll.__overlayScrollbars__.scroll({top:scrollValue})
		}else{
			scrollBox.stop().animate({
			   scrollTop: scrollValue
			}, speed);
		}
	}else{
	   console.log("no target"); 
	}

	//aa[0].__overlayScrollbars__.scroll({top:100})

}



$.tabExcept = function () {
  const tabtargets = ["btn_select"];
  tabtargets.forEach(function (item, index, array) {
    const flag = checkDupEventBind($("." + item), "tabExcept");

    if($(".btn_select").length == 0) return;

    if(flag == true){
      // 중복할당시 SKIP
      return;
    }else{
      $("." + item).on("click.tabExcept", function (e) {
        var target = $(this);
        var tabtarget = target.attr("data-tab");
        var targetobj = $('[ data-id="' + tabtarget + '"]');
        //  ole.log(targetobj.length);
        if (!targetobj.length) {
          return false;
        }
        $(targetobj).siblings().removeClass("is_active").stop().slideUp(150);
        if ($(targetobj).hasClass("is_active")) {
          $(targetobj).removeClass("is_active").stop().slideUp(150);
        } else {
          $(targetobj).addClass("is_active").stop().slideDown(300);
        }
        target.siblings().removeClass("is_active");
        target.toggleClass("is_active");
      });
    }

  });
};

$.gnb = function () {
  var Header = $(".wrap header");
  if($(".detail_center").length || $(".center_type1").length || $(".twoway_center").length){
    $("body").addClass("headerLine_fix")
  }

  $(document).on("mouseenter focus", ".gnb_depth00_item", function (e) {
    // $(document).on('click', '.gnb_depth00_item', function(e) {
    e.preventDefault();
    var This = $(this);
    Header.addClass("gnbShow")
    $(".gnb_depth00_item").removeClass("on")
    This.addClass("on")
    if (This.next(".gnb_content").length > 0) {
      $(".gnb_content").removeClass("is_opened").stop().slideUp(200);
      This.next(".gnb_content").addClass("is_opened").stop().slideDown(400);
    } else {
      $(".gnb_content").stop().slideUp(200);
    }
  });

  $(".wrap > header , .wrap .wrap-inner header").on("mouseleave", function (e) {
    e.preventDefault();
    Header.removeClass("gnbShow")
    $(".gnb_depth00_item").removeClass("on")
    $(".gnb_content").removeClass("is_opened").stop().slideUp(200);
  });
};

/*
$.lnb = function () {
  var headers = ["A"];
  $(".left_menu > li.on").find(".sub_menu").slideDown();
  $(".left_menu > li.on").find(".sub_menu").find("li:first-child").addClass("on");
  $(".lnb a").click(function (e) {
    var target = e.currentTarget,
      exceptTarget = $(".sub_menu").find("a[href]"),

      name = target.nodeName.toUpperCase();
    var onLi = $(".left_menu > li.on") 
    $(".left_menu > li").removeClass("on") 
    $(".lnb li").removeClass("on");
    onLi.find('.sub_menu').slideUp(function(){
      if($(".left_menu > li.on").length == 0) onLi.addClass("closeOn")
    })
    $(target).parent("li").addClass("on");
    if ($.inArray(name, headers) > -1) {
      var subItem = $(target).next();
      var depth = $(subItem).parents().length; //slid up
      $(subItem).find("li:first-child").addClass("on");
      // console.log('subItem',subItem)
      // console.log('depth',depth)
      var allAtDepth = $(".lnb .sub_menu").filter(function () {
        if ($(this).parents().length >= depth && this !== subItem.get(0)) {
          return true;
        }
      });
      if (!$(e.currentTarget).is(exceptTarget)) {
        //타겟 요소가 아닐 때
        $(allAtDepth).slideUp("fast");
        subItem.slideToggle("fast");
      }
    }
  });
};
*/

/*

ui_lnb = function () {
  $(".left_menu > li.on").addClass("active").find(".sub_menu").slideDown();
  var onList = $(".left_menu > li")
  var subList = $(".left_menu .sub_menu li")
  $(".left_menu .sub_menu a").click(function(){ 
    onList.removeClass("on");
    subList.removeClass("on");
    $(this).parent().addClass("on");
    $(this).closest(".active").addClass("on");
  });
  $(".left_menu a[data-fold-yn='Y']").click(function (e) {
    var now = $(this.parentNode);
    var status = now.hasClass("active");
    var subMenu = now.find(".sub_menu");
    var hasSub = subMenu.length;
    var prev = $(".left_menu > li.active");
    var lis = $(".left_menu > li");
    lis.removeClass(["active","sub"]);
    if(prev[0] == now[0]){
      if(subMenu.css("display") == "none"){
        console.log(prev)
        prev.find(".sub_menu").slideUp();
        subMenu.slideDown();
      }else if(hasSub){
        subMenu.slideUp();
      }
      return true;
    }else{
      prev.find(".sub_menu").slideUp();
    }
    
    now.addClass("active");
    
    if(hasSub){
      console.log(4)
      subMenu.slideDown()
      now.addClass("sub");
    }else{
      lis.removeClass(["active","on"])
      now.addClass("on");
    }
    
    if(status){
        
    }else{

    }

  });
};

*/
/*

    var target = e.currentTarget,
      exceptTarget = $(".sub_menu").find("a[href]"),
      name = target.nodeName.toUpperCase();
    $(".lnb li").removeClass("on");
    $(target).parent("li").addClass("on");
    if ($.inArray(name, headers) > -1) {
      var subItem = $(target).next();
      var depth = $(subItem).parents().length; //slid up
      $(subItem).find("li:first-child").addClass("on");
      // console.log('subItem',subItem)
      // console.log('depth',depth)
      var allAtDepth = $(".lnb .sub_menu").filter(function () {
        if ($(this).parents().length >= depth && this !== subItem.get(0)) {
          return true;
        }
      });
      if (!$(e.currentTarget).is(exceptTarget)) {
        //타겟 요소가 아닐 때
        $(allAtDepth).slideUp("fast");
        subItem.slideToggle("fast");
      }
    }

*/
// selectbox
$.selectbox = function () {
  // 개발 삭제 요청 0323
  // $(document).on("click", ".custom_select_wrap .option_selected", function (e) {
  //   var This = this;
  //   var selectBox = $(this).closest(".custom_select_wrap");
  //   if(selectBox.hasClass("disabled")) return false;
  //   if (selectBox.hasClass("is_active")) {
  //     selectBox.removeClass("is_active").find(".option_list").slideUp(200);
  //   } else {
  //     selectBox.addClass("is_active").find(".option_list").slideDown(200);
  //   }
  //   setTimeout(function(){
  //     $(document).one("click", function(e){
  //       if(e.target == This) return false;
  //       selectBox.removeClass("is_active").find(".option_list").slideUp(200);
  //     })
  //   },10)
  // });
  // $(document).on("click", ".custom_select_wrap .option", function () {
  //   var bindText = $(this).html();
  //   $(this).closest(".custom_select_wrap").find(".option_selected").html(bindText);
  // });

  // $(document).bind("click", function (e) {
  //   var $clickhide = $(e.target);
  //   if (!$clickhide.parents().hasClass("custom_select_wrap")) {
  //     $(this).closest(".custom_select_wrap").find(".option_list").slideUp(200);
  //   }
  // });

  //좋아요
  // $(document).on("click", ".button_equal", function () {
  //   $(this).toggleClass("is_active");
  // });
  // $(document).on("click", ".button_toggle", function () {
  //   $(this).toggleClass("is_active");
  // });
};
// setCount
$.setCount = function () {
  /* 개발 삭제요청 0404
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
        $button.attr("disabled", true);
      }
    }
    $inputThis.val($inputCount);
  });
  */
  // 자기자신 삭제 (옵션)
  $(".count_box").each(function () {
    const $del = $(this).find(".btn_del");
    $del.off("click").on("click", function () {
      $(this).closest(".count_item").remove();
      if ($(".count_item").length == 0) {
        $(".count_wrap").remove();
        $(".total_item").remove();
      }
    });
  });
};

//상품 더보기 접기
function showPrd() {
  var prdimg = $(".area_image");
  var morwbtn = $(".more_wrap");
  if (prdimg.hasClass("fold")) {
    $("#prd_info .btn_sub_full").addClass("more_close");
    prdimg.removeClass("fold");
    $("#prd_info .btn_sub_full button").addClass("unexpand").html("상품 정보 접기");
  } else {
    $("#prd_info .btn_sub_full").removeClass("more_close");
    prdimg.addClass("fold");
    $("html, body").stop().animate({ scrollTop: prdimg.offset().top }, 300);
    $("#prd_info .btn_sub_full button").removeClass("unexpand").html("상품 정보 더 보기");
  }
}

//체크박스 선택 시 금액 색상 변경
$(function () {
  $(".checkbox input:checkbox").click(function () {
    if ($(this).is(":checked") == true) {
      $(this).parent().next().addClass("checked");
    }
    if ($(this).is(":checked") == false) {
      $(this).parent().next().removeClass("checked");
    }
  });
});

//통합 검색
$.searchTotal = function () {
  const $body = $("body");
  const $header = $(".wrap > header");
  const $btnSearch = $(".util .menu1");
  const $totalSearchWrap = $(".total_search_wrap");
  const $autoKeywordBox = $(".auto_keyword_box");
  const $btnClose = $totalSearchWrap.find(".btn_close");
  const $searchDimmed = $('.search_dimmed');
  const focusableElements = $totalSearchWrap.find(
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
  );
  const firstElement = focusableElements && focusableElements.first();
  const lastElement = focusableElements && focusableElements.last();

  // 레이어 닫힘
  function isHide() {
    $searchDimmed.fadeOut()// .remove();
    $totalSearchWrap.removeClass("is_open");
    // $btnSearch.focus();
    isParentsHidden();
  }

  // 레이어 열림
  function isShow() {
    $searchDimmed.fadeIn();
    $totalSearchWrap.addClass("is_open");
    $autoKeywordBox.removeClass("is_open");
    // $btnClose.focus();
    isParentsHidden();
  }

  // 부모 hidden 처리
  function isParentsHidden() {
    if ($totalSearchWrap.hasClass("is_open") && $totalSearchWrap.height() + $autoKeywordBox.height() / 2 < $(window).height()) {
      $body.css("overflow-y", "hidden");
    } else {
      $body.css("overflow-y", "").removeAttr("style");
    }
  }

  $btnSearch.on("click", isShow);
  $btnClose.on("click", isHide);
  // $(window).on('resize', isHide);
  $(document).on("click keydown", function (e) {
    if (e.target.className === "search_dimmed" || e.keyCode === 27) {
      isHide();
    }
  });

  // Tab키 : 초점 받을 수 있는 마지막 요소에서 첫번째 요소으로 초점 이동
  lastElement.on("keydown", function (event) {
    if (!event.shiftKey && (event.keyCode || event.which) === 9) {
      event.preventDefault();
      firstElement.focus();
    }
  });

  // Shift + Tab키 : 초점 받을 수 있는 첫번째 요소에서 마지막 요소으로 초점 이동
  firstElement.on("keydown", function (event) {
    if (event.shiftKey && (event.keyCode || event.which) === 9) {
      event.preventDefault();
      lastElement.focus();
    }
  });
};

$.sticky = function () {
  // $(window).scrollTop(0)
  const $body = $("body"),
    $scrollUp = "scroll_up",
    $scrollDown = "scroll_down",
    $sticky = $(".sticky"),
    $stickyH = $sticky.height(),
    //   $stickyPTop   = $('.sticky_purchase').offset().top,
    $alwaysSticky = $(".sticky.always_sticky"),
    $alwaysStickyH = $alwaysSticky.height() ? $alwaysSticky.height() : 0;
    $stickyTabTop = [0];
    if($sticky.length){
      $stickyTabTop = [];
      $sticky.each(function(){
        $stickyTabTop.push($(this).offset().top)
      })
    }
    let $lastScroll = 0, $headerH = $(".wrap > header").height();
    let $headerSum = $headerH;
  
  $(window).scroll(function () {
    $headerH = $(".wrap > header").height();
    const $currentScroll = $(window).scrollTop();
    if ($currentScroll <= 0) {
      $body.removeClass($scrollUp);
    }
    if ($currentScroll > $lastScroll && !$body.hasClass($scrollDown)) {
      // scroll down
      $body.removeClass($scrollUp);
      $body.addClass($scrollDown);
    } else if ($currentScroll < $lastScroll && $body.hasClass($scrollDown)) {
      // scroll up
      $body.removeClass($scrollDown);
      $body.addClass($scrollUp);
    }
    $lastScroll = $currentScroll;
    
    $alwaysSticky.css("top", $headerH);
    
    $stickyTabTop.forEach(function(stickytop,i){
      /*
      if(i > 0){
        var sum = $currentScroll + $headerH + $alwaysStickyH
        if(stickytop - 37  <= sum && sum <= stickytop ){
          var prev = (37 - (stickytop - sum));
          if($sticky.eq(i-1).length) $sticky.eq(i-1).css({top:$headerH + $alwaysStickyH - prev})
        }
      }
      */
      if (stickytop <= $currentScroll + $headerH + $alwaysStickyH) {
        
        //스티키 탭에 도달하는 시점
        $sticky.eq(i).addClass("on");

        if (!$sticky.eq(i).hasClass("always_sticky")) {
          // 기본타입 (type1)
          if ($body.hasClass($scrollUp)) {
            // 역스크롤 시
            if (!$sticky.find(".scroll_to")) {
              //기본타입
              $sticky.eq(i).css("top", $headerH);
            } else {
              //scroll_to 가 있을때
              $sticky.eq(i).css("top", $headerH);
            }
          } else {
            //스크롤 시
            $sticky.eq(i).not(".always_sticky").css({ top: $headerH });
          }
        } else {
          // 헤더 & 스티키 항상 고정 타입 (type2)
          $(".sticky.always_sticky").css("top", $headerH);
          $sticky.eq(i)
            .not(".always_sticky")
            .css("top", $headerH + $alwaysStickyH-1);
            
          if ($body.hasClass($scrollUp)) {
            // 역스크롤 시
            $(".sticky.always_sticky").next(".sticky").css({ transform: "translateY(0%)" }); //SE_301
          } else if ($body.hasClass($scrollDown)) {
            $(".sticky.always_sticky").next(".sticky").css({ transform: "translateY(-100%)" }); //SE_301
          }
        }
      } else {
        //스티키 탭에 도달하기 전
        $sticky.eq(i).removeClass("on");
      }
    })
    

    // EQL_PC_EV_212.html - 오른쪽 스틱키 조정
    $(".sticky.inner_sticky").css("top", $currentScroll);

    var sticky_purchase_parent = $(".sticky_purchase").parent().hasClass("order_right");

    if (!sticky_purchase_parent && $(".sticky_purchase").length > 0) {
      if ($(".sticky_purchase").offset().top <= $currentScroll + $headerH) {
        $(".sticky_purchase").addClass("on");
        $(".sticky_purchase").css("top", $headerH + 40);
      }
    }
    $.each($(".content_scroll"), function (idx, item) {
      // 스크롤에 위치에 따라 해당 탭 활성화
      var $target = $(".content_scroll").eq(idx),
        i = $target.index(),
        targetTop = $target.offset().top;
      if (targetTop <= $currentScroll + $headerH + $stickyH + $alwaysStickyH) {
        /* EQL_PC_PR_100.html 에만 쓰이는듯  -> 삭제
        $(".sticky .scroll_to").find("a, button").removeClass("is_active");
        $(".sticky .scroll_to").each(function(){
          $("a, button",this).eq(idx).addClass("is_active")
        });
        */
      }
    });
  });
  $(".scroll_to").on("click", ".tab_btn", function (e) {
    var idx = $(this).index();
    var offset = $(".prd_left_area > .content_scroll").eq(idx).offset();
    if(idx  == 2){
      offset = $("#prd_recomnd").offset();
    }
    // console.log('idx',idx)
    var sticky = $(this).closest(".sticky")[0];
    var sum = offset.top - $headerH - $stickyH + 1;
    if($("#prd_review").length && idx < 2){
      sum += $stickyH
    }
    $("html").stop().scrollTop(sum);
  });
};

$(function () {
  //썸네일 이미지 클릭
  $(".thumb_list .image").click(function () {
    var $thisImg = $(".thumb_list .image");
    var $otherImg = $(this).parents().siblings(".img_box").find(".image");
    var $imgUrl = $(this).find("img").attr("src");
    var $bigImg = $(".prdimg_area .image img");

    $otherImg.removeClass("is_active");
    $(this).addClass("is_active");
    $bigImg.attr("src", $imgUrl);
  });

  //상품 문의 버튼
  $(".show_more").click(function () {
    $(this).toggleClass("hide");
    if ($(this).hasClass("hide")) {
     // $(this).text("상품 문의 접기");
    } else {
      //$(this).text("상품 문의 더 보기");
    }
  });

  $(".btn_more").click(function () {
    $(this).toggleClass("hide");
    if ($(this).hasClass("hide")) {
      $(this).find("span").text("접기");
    } else {
      $(this).find("span").text("펼쳐보기");
    }
  });
});

//rangeSlider(lookbook)
$(function () {
  $("#control").on("input", () => {
    $("#lookbookList").removeClass("col1");
    $("#lookbookList").removeClass("col2");
    $("#lookbookList").removeClass("col3");

    let lookbookStyle = $("#control").val();

    if (lookbookStyle == "0") {
      $("#lookbookList").addClass("col1");
      $(".photo_review_swipe").show();
    } else if (lookbookStyle == "1") {
      $("#lookbookList").addClass("col2");
      $(".photo_review_swipe").hide();
    } else if (lookbookStyle == "2") {
      $("#lookbookList").addClass("col3");
      $(".photo_review_swipe").hide();
    }
  });
});

// jquery-ui slider script
$.rangeSlider = function (minValue, maxValue, stepValue) {
  $("#sliderRange").slider({
    range: true,
    step: maxValue / stepValue,
    min: minValue,
    max: maxValue,
    values: [minValue, maxValue],
    create: makeSpan,
    slide: showValues,
  });
  function showValues(event, ui) {
    const $jquerySlider = $('[data-event="jquerySlider"]');
    const $sliderTextLeft = $jquerySlider.find('[data-event="slider-before"]');
    const $sliderTextRight = $jquerySlider.find('[data-event="slider-after"]');
    $sliderTextLeft.text(inputNumberWithComma(ui.values[0]));
    $sliderTextRight.text(inputNumberWithComma(ui.values[1]));
    if (maxValue == ui.values[1]) {
      $(".jqueryslider .right .unit").text("원 이상");
    } else {
      $(".jqueryslider .right .unit").text("원");
    }
  }
  function makeSpan() {
    let bars = "";
    for (let i = 1; i <= stepValue; i++) {
      bars += '<span class="bar' + i + '"></span>';
      $(".bar" + i).css("left", (i / stepValue) * 100 + "%");
    }
    $("#sliderRange .bars").append(bars);
  }
  makeSpan();
};
$.attachedFile = function () {
  // 파일첨부 - 이미지 삽입
 /* 0329 개발삭제요청
  $(".input_file").each(function (index, item) {
    const _this = $(item);
    const _targetId = $(item).attr("id");
    _this.on("change", function (event) {
      for (var image of event.target.files) {
        var reader = new FileReader();
        reader.onload = function (event) {
          var imgCrop = "";
          imgCrop += `<div class="img_box">`;
          imgCrop += `<div class="img_crop"><img src="${event.target.result}"></div>`;
          imgCrop += `<button type="button" class="btn_delete"><span class="blind">삭제</span></button>`;
          imgCrop += `</div>`;
          document.querySelector('[data-file="' + _targetId + '"]').insertAdjacentHTML("beforeend", imgCrop);
        };
        reader.readAsDataURL(image);
      }
    });
    $(document).on("click", ".attached .btn_delete", function () {
      $(this).parents(".img_box").remove();
    });
  });
 */
};

$.commentExpand = function () {
  $(document).on("click", ".write_cont", function () {
    $(this).toggleClass("is_open");
  });
};
$.scrollMove = function () {
  var wrap = $(".expand_thumb_wrap");
  if(wrap.length == 0) return false;

  var innerHeight = wrap.innerHeight();
  var scrollHeight = wrap.prop("scrollHeight");

  wrap.on("scroll", function () {
    const currentScroll = wrap.scrollTop();
    innerHeight = wrap.innerHeight();
    scrollHeight = wrap.prop("scrollHeight");
    
    $.each($(".expand_thumb .img_box"), function (idx, item) {
      // 스크롤에 위치에 따라 해당 탭 활성화
      var target = $(".expand_thumb .img_box").eq(idx),
        idx = target.index(),
        targetTop = document.querySelectorAll(".expand_thumb .img_box")[idx].offsetTop;
      if (targetTop <= currentScroll && !(currentScroll + innerHeight >= scrollHeight)) {
        $(".guide_thumb .img_box").removeClass("is_active").eq(idx).addClass("is_active");
      } else if (currentScroll + innerHeight >= scrollHeight) {
        $(".guide_thumb .img_box")
          .removeClass("is_active")
          .eq($(".expand_thumb .img_box").length - 1)
          .addClass("is_active");
      }
    });
    // console.log("target.length", $(".expand_thumb .img_box").length - 1);
  });

  $(".guide_thumb").on("click", ".img_box", function (e) {
    
    //클릭시 해당 탭으로 이동
    e.preventDefault();
    const _target = $(this),
      idx = _target.index(),
      offsetTop = document.querySelectorAll(".expand_thumb .img_box")[idx].offsetTop;
    $(".expand_thumb_wrap").stop().animate(
      {
        scrollTop: offsetTop,
      },
      500
    );
  });

  // function detectBottom() { //스크롤 맨아래 감지
  // 	var scrollTop = $('.expand_thumb_wrap').scrollTop();

  // 	console.log('scrollTop', scrollTop)
  // 	console.log('innerHeight', innerHeight)
  // 	console.log('scrollHeight', scrollHeight)
  // 	if (scrollTop + innerHeight >= scrollHeight) {
  // 		console.log('마지막')
  // 		return true;
  // 	} else {
  // 		return false;
  // 	}
  // }
  // detectBottom();
};
// $.toWayCenterTabFixed = function() {
// 	if( $(window).outerWidth() < 1290) {
// 		var myLeftPos = - $(window).scrollLeft();
// 		$('.twoway_right_area > ..sticky').css({'transform':'translateX(' + (myLeftPos) +'px)','width': $('.twoway_right_area').outerWidth() });
// 	}else {
// 		$('.twoway_right_area > ..sticky').css({'width':$('.twoway_right_area').width() });
// 	}
// 	$(window).on('scroll resize', function() {
// 		if( $(window).outerWidth() < 1290) {
// 			var myLeftPos = - $(window).scrollLeft();
// 			$('.twoway_right_area > ..sticky').css({'transform':'translateX(' + (myLeftPos) +'px)','width': $('.twoway_right_area').outerWidth() });
// 		} else {
// 			$('.twoway_right_area > ..sticky').css({'width':$('.twoway_right_area').width() });
// 		}
// 	});
// }

//brand reivew 더보기

function ui_long_contents(){
	/* 내용 더보기 */
	$('.toggle_content').each(function(){
		if(!this.heightChk){
			var This = $(this);
			var more = $(this).siblings("button");
			var hei = This.height();
			this.heightChk = true;
      
      if(more[0]) more[0].parentClass = This.parent()?.hasClass("review_detail");
			if(hei > 40){
				This.addClass('show_more')
        this.showChk = false;
				This.off("click");
				more.on("click",function(){
          
					if(!this.showChk){
            This.removeClass('show_more').css({height:'auto'})
            this.showChk = true;
            
            if(this.parentClass){
              more.remove()
            }

            more.text("접기").removeClass("open").addClass("close");
            hei = This.height();
            This.stop().css({height:40}).animate({height:hei},function(){
              This.css({height:'auto'})
            })
          }else{
            this.showChk = false;
            more.text("더보기").removeClass("close").addClass("open");;
            This.stop().animate({height:40},function(){
              This.addClass('show_more')
            })

          }
				})
			}else{
        more.remove()
			}
		}

	});
}

 // slide toggle
$(function(){ 
	ui_long_contents();
  
  /* 개발주석처리 0405
  //brand reivew toggle
  $(".all_review .review_thumb").click(function () {
    $(this).toggleClass("is_active");
  });
  */

});



$(function () {

  
	$(".radio_select").each(function(){
		var radio = $('input[type=radio]',this);
		var options = $('.pay_option',this);
    if(options.length == 0){
      options = $(".option_guide .pay_option")
    }
		var optionRadio = $("input[type=radio]:checked",this);

		if(optionRadio.length > 0 ){
      var indexid = null
      radio.each(function(){
        if(this.checked) indexid = this.id
      });
			options.hide();
			$('.' + indexid).show();
		}
		radio.on('click', function(){
			var indexid = $(this).attr('id');
			options.hide();
			$('.' + indexid).show();
		
		})

	});
  /*
  if ($(".radio_select .option input").is(":checked") == true) {
    var indexid = $(".option_box .option input").attr("id");
    $(".pay_option").hide();
    $("." + indexid).show();
  }
 
  $(".radio_select input[type=radio]").on("click", function () {
    var indexid = $(this).attr("id");
    $(".pay_option").hide();
    $("." + indexid).show();
  });
  */
});

//화살표 위치
$(window).on("resize", function () {
  swiper_brand_resize();
});

//화살표 위치 수정
function swiper_brand_resize() {
  var $myImgHeight = $(".swiper_brand .thumb_area .thumb img").height();
  var $swiperPosi_prev = $(".swiper_brand .swiper-button-prev");
  var $swiperPosi_next = $(".swiper_brand .swiper-button-next");
  var $myImgHeight_posi = $myImgHeight / 2;

  $swiperPosi_prev.css("top", $myImgHeight_posi);
  $swiperPosi_next.css("top", $myImgHeight_posi);

  var $myImgCardHeight = $(".swiper_list_card_small .thumb img").height();
  var $swiperPosi_prev01 = $(".swiper_list_card_small .swiper-button-prev");
  var $swiperPosi_next01 = $(".swiper_list_card_small .swiper-button-next");
  var $myImgHeight_posi01 = $myImgCardHeight / 2;

  $swiperPosi_prev01.css("top", $myImgHeight_posi01);
  $swiperPosi_next01.css("top", $myImgHeight_posi01);

  //console.log($myImgHeight_posi01);
}

/*   공통 탭 스크립트 */
function ui_tab_script() {
  var wrap = $(".tab_script_wrap");
  if (wrap.length == 0) return false;
  wrap.each(function (i, obj) {
    var tabBtn = $(".tab_style2 .tab_btn", obj);
    var tabCont = $(".ui_tab_cont", obj);
    // tabCont.hide().eq(0).show()
    if (tabBtn.length == 0) tabBtn = $(".tab_style3 .tab_btn", wrap);
    if (tabBtn.length == 0) return true;
    
    tabBtn.each(function (n) {
        this.n = n;
      })
      .on("click", function () {
        tabCont.hide().eq(this.n).show();
        wrap.scrollTop(0);
      });
  });
  
  var tabBtn_anchor = $(".tab_anchor");
  var anchor_cont = [];
  if(tabBtn_anchor.length > 0){
    
    anchor_cont = $(".ui_tab_cont_anchor");
    var scrollWrap = $("html,body")
    function get_anchor_cont_pos(){
      anchor_cont.each(function(n){
        this.n = n;
        this.top = Math.ceil($(this).offset().top);
      })
    }
    tabBtn_anchor.each(function(){
      this.tab = $(".tab_btn",this);
      this.tab.each(function(n){
        this.n = n;
      });
      var This = this;
      
      this.tab.click(function(){
        get_anchor_cont_pos()
        var sum  = 95;
        if($(this).index() == 0) sum = 157
        var top = Math.round(anchor_cont[this.n].top) - sum;
        scrollWrap.scrollTop(top);
        var n = this.n;
        setTimeout(function(){
          This.tab.removeClass("is_active").eq(n).addClass("is_active")
        },50)
        return false;
      })
    });
    
    var idx = 0;

    function tab_change(n){
      tabBtn_anchor.each(function(){
        this.tab = $(".tab_btn",this);
        this.tab.removeClass("is_active").eq(n).addClass("is_active")
      })

    }
    get_anchor_cont_pos();
    var $win = $(window)
    $win.scroll(function(){
      // console.log($win.scrollTop())
      anchor_cont.each(function(){
        this.top = Math.ceil($(this).offset().top);
        var scrollTop = Math.ceil($win.scrollTop());
        if(scrollTop >= this.top -  155){
          idx = this.n;
        }
      })
      tab_change(idx)
    })
  }

}

function imgErr(img) {
  $(img).hide();
}

$.calendar = function() {
	$('.datepicker').datepicker({
		showOn: 'both',
		buttonImage : '/resources/images/uiux/icon/ico_calendar.png',
		buttonImgageOnly: true,
		dateFormat: 'yy.mm.dd'
	})
}


function mypageLnbInit(){
  var num = null
    try {
      num = pageIdx;
    } catch (error) {}
  
   // num = null
  var menu = $(".my_menu a.menu_depth01");
  menu.each(function(i){
    this.$ = $(this);
    this.li = this.$.parent();
    this.ul = this.$.next();
    this.child = this.ul.find("a");
    this.child.each(function(j){
      this.li = this.parentNode;
      
      if(num){
        if(num[0] == i){
          if(num[1] == j){
            this.li.classList.add("on")
          }else{
            this.li.classList.remove("on")
          }
        }
      }
    });

    this.$.click(function(){
     // this.ul.slideToggle()
    })

    
    // this.li.removeClass("on")
    // this.ul.hide()
    if(num){
      if(num[0] == i){
        this.li.addClass("on")
        // this.ul.show()
      }
    }
  });
  

}

$.radioTab = function() {
	$('.radio_tab :radio').each(function (index, item) {
		const _this = $(item);
		_this.on('click', function(){
			var radio = $(this);
			radio.change(function(){
				var _tabBox = $(this).parents('.radio_tab').find('.radio_tab_box');
				var _radioName = $(this).prop("checked",true).attr("id");
				_tabBox.removeClass('is_active');
				$('.'+_radioName).addClass('is_active');
			});
		});
	});
}


$.footerLayer = function(){

  $('.family_tit').on('click', function(){
    var This = $(this)

    if(This.hasClass('on')){
      This.removeClass('on');
      This.siblings('.familysite_depth').removeClass('is_active');
    }else{
      This.addClass('on');
      This.siblings('.familysite_depth').addClass('is_active');
      
      setTimeout(() => {
        $(document).one("click",function(){
                
            if(This.hasClass('on')){
              This.removeClass('on');
              This.siblings('.familysite_depth').removeClass('is_active');
            }
        })
      }, 10);
    }
  });

}
//체크박스 선택 시 금액 색상 변경
$(function () {
	$('.detail_box .radioChk input:checkbox').click(function () {
		if($(this).is(':checked') == true) {
			$(this).parent().next().addClass('checked');
		} if($(this).is(':checked') == false) {
			$(this).parent().next().removeClass('checked');
		}
	});
});

$(document).ready(function(){
  $('.textarea_group').each(function (index, item) {
    const _this = $(item);
    // console.log(_this)
    if( _this.hasClass('disabled') ) {
      _this.find('textarea').attr("disabled",true);
    }
  });
});
// 글쓰기 활성

$.focusTxt2 = function () {

	$(document).on("focus", ".textarea_group textarea", function () {
		$(this).parent().addClass("is_active");
	})

	$(document).on("blur", ".textarea_group textarea", function () {
		if (this.value.length == 0) $(this).parent().removeClass("is_active");
	})
	$(".textarea_group textarea").on("keyup", function () {
    $(this).parent().removeClass("input_error");
	})

}

function documentEventInit(){
  
	// 댓글 포커스 영역확장
  $(document).on("focusin",".comment_form textarea",function(e){
    $(e.target).css({"height": "100px"});
  }).on("focusout",".comment_form textarea",function(e){
    var _this = $(e.target)
    _this.css("height", "auto");
    _this.val().length > 0 ? _this.css("height", "100px") : _this.css("height", "52px");
  }).on("keyup",".comment_form textarea",function(e){
    
    var _this = $(e.target)
    if (_this.val().length > 0) {
      _this.parents(".comment_form").find("button").attr("disabled", false);
    } else {
      _this.parents(".comment_form").find("button").attr("disabled", true);
    }
  });

  
	// modal_wrap is_visible is_active
	$(document).on('touchstart click','.dimmer', function(event){
		var This = $(this)
		if(This.siblings(".modal")[0].className.indexOf("wid_") > 0){
			$(this).closest('.modal_wrap').removeClass("is_active")
			$(this).closest('.modal_wrap').removeClass("is_visible")
			
			$("body").removeClass("modalPop");
      dimmHidden();
		}
	});


  /* asis evt */
  $(".pmo-cont .list-notice dt").click(function(){
    // if(location.pathname.indexOf("/event") >= 0 ) return false;
    $(this).next().toggle()  
  })


}



var brandSticky = null
$(function () {
  if ($(".quick").length > 0) $(".quick").goToTop();
  $.selfDeleteBtn();
  $.selectbox(); // div select
  $.setCount();
  $.tooltip();
  // $.couponIssued();
  $.tab();
  brandSticky = $.brandSticky();
  $.gnb();
  $.searchTotal();
  // ui_lnb();
  //$.lnb()
  
  $.tabExcept();
  $.focusTxt2();
  $.inputDel();
  ui_tab_script();
  $.sticky(); //header sticky
  $.rangeSlider(0, 1000000, 20); //min값, max값, step순서
  // if ($(".input_file").length > 0) $.attachedFile();
  
  $.scrollMove();
  $.commentExpand();
  if ($(".mcus_scroll").length > 0) $.customScroll();
  // $.toWayCenterTabFixed();
  swiper_brand_resize();
  $.calendar();

  if($(".my_menu").length){
    mypageLnbInit()
  }
  $.radioTab();
  $.footerLayer();
  ui_swiper_init();

  

  documentEventInit()

  if($(".tab_anchor").length > 0){
    $("header").addClass("noline")
  }
});

// S: Loading Bar
/**
 * 로딩 팝업 생성
 * 
 * @param {string} loadingDomId : 로딩팝업의 ID를 지정
 * @param {object} parentDom : 로딩팝업을 붙이는 부모 DOM
 * @param {number} ms : 자동 삭제 타이머 지정(기본값 3000ms)
 * @param {boolean} isDimmed : 배경 불투명 처리 여부
 * @param {object} custom : 부모/로딩팝업에 커스텀 style 적용시
 */
function createLoadingPopup(loadingDomId, parentDom, ms, isDimmed, custom){
  try {
      if(document.getElementById(loadingDomId)) return false;
      
      const newDom = document.createElement('div');
      newDom.id = loadingDomId;
      newDom.className = 'loading_wrap is_active';
      
      if(isDimmed == true) newDom.classList.add("back");
      
      newDom.innerHTML = `<div class="loading_cont">
                                  <div class="loading_img"><span class="loader_img"><em class="top"></em><em class="bt"></em></span></div>
                              <p class="loading_txt">LOADING</p>
                          </div>`;

      if(typeof custom !== 'undefined'){
        newDom.setAttribute('style', custom.childStyle);
        parentDom.setAttribute('style', custom.parentStyle);
      }else{
        parentDom.classList.add('loading_open');
      }
      parentDom.appendChild(newDom);
      
      // 시간 트리거 이후 자동 삭제(기본값 3초)
      if(typeof ms != 'undefined' && ms == 999){
        // 999 : 타이머 미설정(계속 노출)
      }else{
        setTimeout(()=>{
          hideLoadingPopup2();
        },(typeof ms == 'undefined' ? 3000 : ms));
      }
  } catch (error) {
      console.warn('[ERROR] at createLoadingPopup...', error);
      return false;
  }
}

/**
 * 로딩 팝업 노출(전체 화면 커버)
 * #loadingPopup 으로 생성되며 전체 페이지에 노출되는 기본 형태
 * 
 * @param {boolean} isNoRemove : 삭제하지 않고 안보이게만 할 경우
 * @param {number} ms : 자동 삭제 타이머 지정(기본값 3000ms)
 * @param {boolean} isDimmed : 배경 불투명 처리 여부
 */
function showLoadingPopup2(isNoRemove, ms, isDimmed){
  try {
      const popupElem = document.querySelector('#loadingPopup');
      if(popupElem && isNoRemove == true){
          // 이미존재하며 remove 안할시
          popupElem.style.display = '';
          document.querySelector('body').classList.add('loading_open');
      }else{
          const paramDom = document.querySelector('body');
          createLoadingPopup('loadingPopup', paramDom, ms, isDimmed);
      }
  } catch (error) {
      console.warn('[ERROR] at showLoadingPopup2...', error);
  }
}

/**
 * 로딩 팝업 노출 해제(전체 화면 커버)
 * 
 * @param {boolean} isNoRemove : 삭제하지 않고 안보이게만 할 경우
 */
function hideLoadingPopup2(isNoRemove){
  try {
      const popupElem = document.querySelector('#loadingPopup');
      if(!popupElem) return false;
      
      document.querySelector('body').classList.remove('loading_open');
      
      if(isNoRemove == true) popupElem.style.display = 'none';
      else popupElem.remove();
  } catch (error) {
      console.warn('[ERROR] at hideLoadingPopup2...', error);
  }
}

/**
 * 로딩 팝업 노출(커스텀)
 * 원하는 위치의 div에만 노출되는 커스텀 로딩 팝업(include용)
 * 
 * @param {string} loadingDomId : 로딩팝업의 ID를 지정
 * @param {string} target_selector : 로딩팝업을 붙일 부모의 선택자
 * @param {number} ms : 자동 삭제 타이머 지정(기본값 3000ms)
 */
function showLoadingPopup3(loadingDomId, target_selector, ms, customCSS){
  try {
      const paramDom = document.querySelector(target_selector);
      const customObj = customCSS || {
        parentStyle : 'position: relative; padding-top: 200px;',
        childStyle : 'position: absolute; top: 100%; left: 50%; width: 0px; height: 0px;',
      };

      createLoadingPopup(loadingDomId, paramDom, ms, false, customObj);
  } catch (error) {
      console.warn('[ERROR] at showLoadingPopup2...', error);
  }
}

/**
 * 로딩 팝업 노출 해제(커스텀)
 */
function hideLoadingPopup3(loadingDomId, target_selector){
  try {
      const popupElem = document.getElementById(loadingDomId);
      const parentElem = document.querySelector(target_selector);
      parentElem.removeAttribute('style');

      if(!popupElem) return false;
      popupElem.remove();
  } catch (error) {
      console.warn('[ERROR] at hideLoadingPopup2...', error);
  }
}

(()=>{
  document.addEventListener('DOMContentLoaded', () => {
      hideLoadingPopup2();
  });

  try {
    if(location.href.indexOf('/order/payReturn') < 0){
      window.addEventListener('beforeunload', () => {
        showLoadingPopup2(999);
      });
    }
  } catch (error) {
    console.warn('[ERROR] LoadingPopup at ...', error);
  }
})();
// E: Loading Bar

// 230918 UIUX 수정 | 브랜드 필터 내용 추가
function brandFilterReset() {
  $('.new_brand_filter').find('[type="checkbox"]').prop('checked', false);
}

// 이벤트 바인딩 시, 동일 이벤트가 중복해서 바인되는지 체크
function checkDupEventBind(param, namespace){
  try {
    if(param.length > 0){
      const events = $._data(param[0],"events");  // 이벤트 바인딩 조회(대표 0번 요소만 점검)
      if(typeof events != 'undefined' && events != null){
        if(events.click?.length > 0){
          if(typeof namespace != 'undefined'){
            // 네임스페이스 존재 시
            let flag = false;
            events.click.forEach((item)=>{
              if(item.namespace == namespace) flag = true;
            });
            return flag;
          }else{
            // 네임스페이스 없이, 클릭 이벤트 중복 여부만 체크시
            return true;
          }
        }
        console.log('checkDupEventBind : ' + events.click.length);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.warn('[ERROR] at checkDupEventBind...', error);
    return false;
  }
}