/*
 파일명:		abc.front.js
 설  명:		 공통 자바스크립트
 작성자:		glim
 최초작성일:	  2019/00/00
 최종수정일:
*/

// IE 10 NodeList.forEach 함수 선언
if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = function (callback, thisArg) {
		thisArg = thisArg || window;
		for (var i = 0; i < this.length; i++) {
			callback.call(thisArg, this[i], i, this);
		}
	};
}

(function () {
	if (
		typeof window.CustomEvent === "function" ||
		// In Safari, typeof CustomEvent == 'object' but it otherwise works fine
		this.CustomEvent.toString().indexOf('CustomEventConstructor') > -1
	) {
		return;
	}

	function CustomEvent(event, params) {
		params = params || {bubbles: false, cancelable: false, detail: undefined};
		var evt = document.createEvent('CustomEvent');
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
	}

	CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent;
})();

$(function () {
	// 상품 옵션 커스터마이징
	$.widget('custom.selectProdOption', $.ui.selectmenu, {
		_drawButton: function () {
			this._super();

			var selected, placeholder;
			selected = this.element.find('[selected]').length;
			placeholder = this.options.placeholder;

			if (!selected && placeholder) {
				this.buttonItem.text(placeholder);
			}
		},
		_resetDrawButton: function () {
			var selected, placeholder;
			selected = this.element.find('[selected]').length;
			placeholder = this.options.placeholder;

			if (!selected && placeholder) {
				this.buttonItem.text(placeholder);
			}
		},
		reset: function () {
			this.element[0].selectedIndex = -1;
			this._resetDrawButton();
		},
		_renderItem: function (ul, item) {
			var li, wrapper, labelBox, imminentBox, isStock;
			li = $('<li>');
			wrapper = $('<div>', {
				'class': 'prod-option',
			});

			if (item.disabled) {
				li.addClass('ui-state-disabled');
			}
			isStock = item.element.attr('data-stock') !== undefined && item.element.data('stock') < 6;
			wrapper.data(item.element.data());
			
			labelBox = $('<span>', {
				'class': 'option-label-box',
				'data-itmNo': item.element.attr('data-stockno'),
				'data-itmNm': item.element.attr('data-itmnm'),
				'data-resveOrdDlivyPrearngeDate': item.element.attr('data-resveorddlivyprearngedate'),
				'data-resveSaleGodYn': item.element.attr('data-resvesalegodYn'),
			});
			$('<span>', {
				'class': 'option-label-box-inner',
				'text': item.label,
			}).appendTo(labelBox);
			wrapper.append(labelBox);

			if (!item.disabled && isStock) {
				imminentBox = $('<span>', {
					'class': 'option-stock-box',
					'text': '품절임박 (' + item.element.data('stock') + ')',
				}).appendTo(labelBox);
			}
			return li.append(wrapper).appendTo(ul);
		}
	});
});

var handsome = handsome || {};
handsome.ui = handsome.ui || {};

handsome.ui.front = handsome.ui.front || (function () {
	var _front, _bodyMinWidth, _isMacLike;
	_front = {};
	_bodyMinWidth = 1200;
	_dialogCount = 0;
	_loadingCount = 0;

	/**
	 * GNB 메뉴 기본 스크립트
	 */
	function setGNBMenu() {
		if ($('.header-wrap').length > 0) {
			var depth1Menu;
			// s : body 스크롤 시 헤더 Sticky 처리를 위한 y값 계산
			$('.header-wrap').attr('data-sps-offset', getHeaderScrollOffsetY());
			// e : body 스크롤 시 헤더 Sticky 처리를 위한 y값 계산

			depth1Menu = $('.gnb-menu-wrap .gnb-list .depth-1 > .menu-name');

			// GNB 1뎁스 메뉴명 기본 색상 저장
			depth1Menu.each(function (index) {
				$(this).data('originColor', $(this).closest('.depth-1 .menu-name').css('color'));
				if ($(this).data('hoverColor') !== undefined) {
					this.removeAttribute('data-hover-color');
				}

				// brand 메뉴가 아니고 banner-item이 등록된 경우
				if(!$(this).siblings('.brand-sub').length && $(this).closest('.depth-1').find('.banner-item').length) {
					$(this).closest('.depth-1').find('.banner-wrap').addClass('col-' + Math.ceil($(this).closest('.depth-1').find('.banner-item').length / 2));
				}
			});

			// s : GNB 카테고리 메뉴에 마우스 오버, 포커스 진입시 서브메뉴 노출
			depth1Menu.off('mouseover focusin').on('mouseover focusin', function (event) {
				if (event.type === 'mouseover') {
					$('.gnb-menu-wrap .gnb-list .depth-1').removeClass('active');
				}

				if ($(this).data('hoverColor') !== undefined) {
					$(this).css('color', $(this).closest('.depth-1 .menu-name').data('hoverColor'));
				}

				$(this).closest('.depth-1').addClass('active');

				$(this).closest('.depth-1').off('mouseleave focusout').on('mouseleave focusout', function (event) {
					var that = this;
					setTimeout(function () {
						if ($(that).find('a:focus').length < 1) {
							$(that).removeClass('active');

							if ($(that).find('> .menu-name').data('hoverColor') !== undefined) {
								$(that).find('> .menu-name').css({
									color: $(that).find('> .menu-name').data('originColor') ? $(that).find('> .menu-name').data('originColor') : '',
								});
							}
						}
					}, 50);
				});
			});
			// e : GNB 카테고리 메뉴에 마우스 오버, 포커스 진입시 서브메뉴 노출
		}
	}

	/**
	 * body 스크롤 시 헤더 Sticky 처리를 위한 y값 계산
	 * @returns {number}	헤더영역 높이값(헤더 영역 Sticky 처리되는 top 값)
	 */
	function getHeaderScrollOffsetY() {
		var offsetTop;

		// 값은 한번만 계산한다.
		if (_front.headerFixOffset !== undefined) {
			return _front.headerFixOffset;
		}

		offsetTop = parseInt($('.header-wrap .header-top-wrap').css('padding-top'));
		if ($('.special-banner-wrap').outerHeight() !== undefined) {
			offsetTop += parseInt($('.special-banner-wrap').outerHeight());
		}

		_front.headerFixOffset = offsetTop - 10;
		return _front.headerFixOffset;
	}

	/**
	 * 퀵메뉴 셋팅
	 * @param selector 퀵메뉴 DOM 셀렉터(default : .quick-menu)
	 */
	function setQuickMenu(selector) {
		selector = selector ? selector : '.quick-menu';

		if ($(selector).length > 0) {
			$(selector).each(function (index) {
				var quickMenu;
				quickMenu = $(this);
				// scollPosStyler 적용된 퀵메뉴만 작동
				if (quickMenu.hasClass('sps')) {
					setTimeout(function(){
						quickMenu.attr('data-sps-offset', $('.footer-wrap').offset().top - $(window).height());
					}, 1000);
				}

				quickMenu.find('.btn-top, .btn-bottom').off('click').on('click', function (event) {
					if (quickMenu.siblings('.os-host').length > 0) {
						var overlayScrollHost;
						event.preventDefault();
						overlayScrollHost = quickMenu.siblings('.os-host');
						overlayScrollHost.overlayScrollbars().scroll({
							y: $(event.currentTarget).hasClass('btn-top') ? '0%' : '100%',
						});
					}
					else {
						if ($(this).hasClass('btn-bottom')) {
							var footer;
							event.preventDefault();
							footer = $($(this).attr('href'));

							$(window).scrollTop(footer.offset().top - $(window).height());
						}
					}
				});
			});
		}
	}

	/**
	 * position fixed 처리 된 엘리먼트 좌우 스크롤 이동 처리
	 */
	function setFixedElementPosX() {
		var fixedDOMList, forceAddClassList, ignoreClassList;
		fixedDOMList = [];
		forceAddClassList = [
			// 'class-name',
		];
		ignoreClassList = [
			// 'class-name',
			'quick-menu sps sps-blw',
		];

		forceAddClassList.forEach(function (element) {
			$('.' + element).each(function (index) {
				this.isForceTransformX = true;
				fixedDOMList.push(this);
			});
		});

		// scroll spy 중 ignoreClassList에 없는 경우 타겟팅
		$('.sps').each(function (index) {
			var that, isIgnore;
			that = this;
			isIgnore = ignoreClassList.some(function (element) {
				return $(that).hasClass(element);
			});
			// console.log(isIgnore, that);
			if (!isIgnore) {
				fixedDOMList.push(that);
			}
		});

		fixedDOMList.forEach(function (element) {
			if ($('html').outerWidth() >= _bodyMinWidth) {
				setTimeout(function () {
					$(element).css({
						'transform': 'none',
					});
				}, 10);
			} else {
				if ($(element).hasClass('sps-blw') || element.isForceTransformX) {
					setTimeout(function () {
						$(element).css({
							'transform': 'translateX(' + -$(window).scrollLeft() + 'px)',
						});
					}, 10);
				} else {
					setTimeout(function () {
						$(element).css({
							'transform': 'none',
						});
					}, 10);
				}
			}
		});
	}

	/**
	 * 유튜브 태그 삽입
	 */
	function setYoutubeAPITag() {
		var tag = document.createElement('script');

		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	}


	/**
	 * 레이어팝업 > 우편번호 찾기 영역 On / Off
	 */
	function setZipCode() {
		$('.js-zipcode-btn').on('click', function () {
			if ($(this).hasClass('btn-zipcode-close')) {
				$('.js-zipcode').removeClass('is-active');
			} else {
				$('.js-zipcode').addClass('is-active');
			}
		});
	}

	/**
	 * jQuery UI selectmenu 일괄 닫기
	 */
	function closeSelectMenuOption() {
		$('.js-select .ui-selectmenu-button-open').each(function (index) {
			if ($(this).closest('.js-select').attr('data-renderer') === 'selectProdOption' || $(this).closest('.js-select').attr('data-renderer') === 'selectCouponCount') {
				$(this).closest('.js-select').find('select').selectProdOption('close');
			} else {
				$(this).closest('.js-select').find('select').selectmenu('close');
			}
		});
	}


	////////////////////////////////////////////////////////////
	// 공통 UI 스크립트
	////////////////////////////////////////////////////////////

	/**
	 * 입력값 초기화 가능한 인풋 버튼 셋팅
	 * @param selector 입력값 초기화 인풋 DOM 셀렉터(default : .input-wrap .reset-input)
	 */
	function setInputResetBtn(selector) {
		selector = selector ? selector : '.input-wrap .reset-input';

		if ($(selector).length > 0) {
			$(selector).each(function (index) {
				$(this).off('change keyup focus blur', checkInputValue).on('change keyup focus blur', checkInputValue);
			});
			$(selector).siblings('.btn-reset-input').off('click', btnResetInputClickHandler).on('click', btnResetInputClickHandler);
		}

		function checkInputValue(event) {
			setShowResetBtn(event.target, event.type);
		}

		function setShowResetBtn(targetInput, eventType) {
			if (targetInput.attributes.readonly !== undefined) {
				return;
			}

			if (targetInput.value !== '' && eventType !== 'blur') {
				$(targetInput).addClass('show-reset-btn');
			} else {
				setTimeout(function () {
					$(targetInput).removeClass('show-reset-btn');
				}, 10);
			}
		}

		function btnResetInputClickHandler(event) {
			var inputTarget, formTarget;
			inputTarget = $(event.target).siblings('.reset-input');
			inputTarget.focus();
			inputTarget.val('');
			setShowResetBtn(inputTarget[0]);
		}
	}

	/**
	 * 테이블 캡션 생성
	 * @param selector DOM 셀렉터(default : .tbl-wrap table)
	 */
	function setTableCaption(selector) {
		selector = selector ? selector + ' .tbl-wrap table' : '.tbl-wrap table';
		$(selector).each(function (index) {
			var table, tableClass, captionText, captionComplex, theadHeader, tbodyHeader, bodyToHeadIdxs, hasThead,
				captionSubFix;
			table = $(this);
			tableClass = $(this).closest('.tbl-wrap').attr("class");
			captionTextOrigin = $(this).find("caption").text();
			captionComplex = "";
			captionSubFix = "";
			theadHeader = [];
			tbodyHeader = [];
			bodyToHeadIdxs = [];
			hasThead = false;

			if (tableClass.match("tbl-form") && tableClass.match("form-view") !== null) {
				captionSubFix = "을(를) 입력하는 표입니다.";
			} else {
				captionSubFix = "을(를) 나타낸 표입니다.";
			}

			// thead th값 추출
			if ($(this).find("thead th").length > 0) {
				$(this).find("thead th").each(function (index) {
					theadHeader.push($(this).text());
				});
			}
			// tbody th값 추출
			if ($(this).find("tbody th").length > 0) {
				$(this).find("tbody th").each(function (index) {
					// tbody th가 thead th의 서브 헤더인 경우(thead th와 tbody th가 둘 다 존재하는 경우)
					if (theadHeader.length > 0) {
						if (tbodyHeader[$(this).index()] === undefined) {
							tbodyHeader[$(this).index()] = theadHeader[$(this).index()] + " 컬럼의 하위로";
						}
						tbodyHeader[$(this).index()] += " " + $(this).text();
					} else {
						tbodyHeader.push($(this).text());
					}
				});

				tbodyHeader = tbodyHeader.filter(function (n) {
					return n !== undefined;
				});
			}

			if (theadHeader.length > 0 && tbodyHeader.length > 0) {
				captionComplex += theadHeader.join(", ") + " " + tbodyHeader.join(", ");
			} else if (theadHeader.length > 0) {
				captionComplex += theadHeader.join(", ");
			} else if (tbodyHeader.length > 0) {
				captionComplex += tbodyHeader.join(", ");
			}

			//console.log(captionTextOrigin + " 목록이며 " + captionComplex +  " 을(를) 나타낸 표입니다.");
			$(this).find("caption").text(captionTextOrigin + " 테이블로 " + captionComplex + captionSubFix);
		});
	}

	/**
	 * jQuery UI 탭 설정
	 * @param selector Tab 생성 DOM 셀렉터(default : .js-tab)
	 */
	function setUITabs(selector) {
		selector = selector || '.js-tab';

		if ($(selector).length > 0) {
			$(selector).each(function (index) {
				var disabledTabs;
				disabledTabs = [];
				if ($(this).hasClass('anchor-tab')) {
					return;
				}
				$(this).find('> .tabs .tab-link').each(function (index) {
					if ($(this).hasClass('tab-disabled')) {
						disabledTabs.push(index);
					}
				});

				$(this).tabs({
					disabled: disabledTabs,
					beforeActivate: function (event, ui) {
						if ($(ui.newTab).find('a').attr('href').indexOf('#') !== 0) {
							window.open($(ui.newTab).find('a').attr('href'), '_self');
						}
					},
					activate: function (event, ui) {
						// 탭 내 스와이퍼 기능 정상 작동하도록 update 처리
						ui.newPanel[0].querySelectorAll('[class*=swiper-container-]').forEach(function (element) {
							element.swiper.update();
						});
					},
				});
			});
		}
	}

	/**
	 * jQuery UI 탭 설정
	 * @param selector Tab 생성 DOM 셀렉터(default : .js-datepicker)
	 */
	function setUIDatepicker(selector) {
		selector = selector || '.js-datepicker';

		if ($(selector).length > 0) {
			//datepicker
			$(selector).each(function (index) {
				var isPopupDatepicker;
				isPopupDatepicker = $(this).closest('.ui-dialog-container').length > 0;
				$(this).datepicker({
					beforeShow: function (input, inst) {
						if (isPopupDatepicker) {
							inst.dpDiv.addClass('ui-popup-datepicker');
						}
					},
				});
			});
		}
	}

	/**
	 * jQuery UI 다이얼로그 설정
	 * @param selector 다이얼로그 DOM 셀렉터(default : .ui-dialog-contents)
	 * @param btnSelector 다이얼로그 오픈 버튼 DOM 셀렉터(default : [data-popup-trigger])
	 */
	function setUIDialog(selector, btnSelector) {
		selector = selector || '.ui-dialog-contents';
		btnSelector = btnSelector || '[data-popup-trigger]';

		if ($(selector).length > 0) {
			$(selector).each(function (index) {
				var dialogClass, containerId, dialogId, containerClasses, customWidth;

				containerId = $(this).data('container');
				containerClasses = 'ui-dialog-container';
				// customWidth = 'auto';
				dialogClass = '';

				if (containerId === undefined) {
					containerId = 'body';
				}
				if ($(this).data('class') !== undefined) {
					if (isNaN(parseInt($(this).data('class')))) {
						dialogClass = ' ' + $(this).data('class');
					} else {
						dialogClass = ' auto';
						customWidth = parseInt($(this).data('class'));
					}
				}

				dialogId = containerId.replace('#', '') + 'Dialog' + _dialogCount;
				$(containerId).append('<div id="' + dialogId + '" class="' + containerClasses + '"><div class="ui-dialog-container-inner"></div></div>');
				_dialogCount++;

				$(this).dialog({
					appendTo: containerId + ' #' + dialogId + ' .ui-dialog-container-inner',
					autoOpen: false,
					// modal: true,
					resizable: false,
					draggable: false,
					// width: customWidth,
					minHeight: 'none',
					classes: {
						'ui-dialog': 'ui-corner-all' + dialogClass,
					},
					position: null,
					// position: {my: 'center', at: 'center', of: ('#' + dialogId + ' .ui-dialog-container-inner')},
					open: function (event, ui) {
						var that, inlineStyle;
						that = this;
						inlineStyle = {};

						if (containerId !== 'body') {
							inlineStyle.height = $(containerId).outerHeight();
							inlineStyle.top = $(containerId).find('.os-viewport').length !== 0 ? 0 : $(containerId).scrollTop();
							// console.log(inlineStyle.top);
						} else {
							inlineStyle.top = $(window).scrollTop();
						}

						$(that).closest('.ui-dialog-container').css(inlineStyle);

						$(containerId).addClass('dialog-open');
						$(containerId).append($('#' + dialogId));
						$(that).closest('.ui-dialog-container').addClass('open');
					},
					close: function (event, ui) {
						var that;
						that = this;

						// console.log(that);
						$(that).closest('.ui-dialog-container').removeClass('open');
						// console.log($(containerId).find('.ui-dialog-container.open').length);
						if ($(containerId).find('.ui-dialog-container.open').length === 0) {
							$(containerId).removeClass('dialog-open');
						}
					},
				});
			});
		}

		if ($(btnSelector).length > 0) {
			$(btnSelector).each(function (index) {
				$(this).off('click').on('click', function (event) {
					event.preventDefault();
					$($(this).data('target')).dialog('open');
				});
			});
		}
	}

	/**
	 * 툴팁 On / Off 셋팅
	 * @param selector 툴팁 컨테이너 DOM 셀렉터(default : .js-tooltip-container)
	 */
	function setUITooltip(selector) {
		selector = selector ? selector : '.js-tooltip-container';
		$(selector).each(function () {
			$(this).find('.js-tooltip-trigger').on('click', function () {
				$(this).parents('.js-tooltip-container').addClass('is-active');
			});

			$(this).on('focusout', function () {
				$(this).removeClass('is-active');
			});
			$(this).find('.js-tooltip-trigger').on('focusout', function () {
				$(this).removeClass('is-active');
			});
		})
	}

	/**
	 * jQuery UI select menu 셋팅
	 * @param selector DOM 셀렉터(default : .js-select)
	 */
	function setUISelect(selector) {
		selector = selector || '.js-select';

		$.widget('app.selectmenu', $.ui.selectmenu, {
			_drawButton: function () {
				this._super();
				this._resetDrawButton();
			},
			_resetDrawButton: function () {
				var selected, placeholder;
				selected = this.element.find('[selected]').length;
				placeholder = this.options.placeholder;

				if (!selected && placeholder) {
					this.buttonItem.text(placeholder);
				}
			},
			reset: function () {
				this.element[0].selectedIndex = -1;
				this._resetDrawButton();
			},
		});

		if ($(selector).length > 0) {
			$(selector).each(function (index) {
				var selectWrap, selectMenuOption, widget;
				selectWrap = $(this);
				selectMenuOption = {};

				selectMenuOption.position = {
					my: 'left top-1',
					at: 'left bottom',
				};

				if (selectWrap.data('placeholder') !== undefined) {
					selectMenuOption.placeholder = selectWrap.data('placeholder');
				}
				if (selectWrap.data('menuPlace') !== undefined) {
					switch (selectWrap.data('menuPlace')) {
						case 'up':
							selectMenuOption.position = selectWrap.hasClass('family-site') ? {
								my: 'left bottom-22',
								at: 'left top',
							} : {
								my: 'left bottom+1',
								at: 'left top',
							};
							break;
					}
				}

				if ($(this).data('renderer')) {
					setCustomSelect(selectWrap, selectMenuOption);
					return;
				}

				selectMenuOption.create = function (event, ui) {
					var that, instance, menuClass;
					that = this;
					instance = $(that).selectmenu('instance');
					widget = selectWrap.find('select').selectmenu('menuWidget');
					menuClass = selectWrap.data('menuClass') ? selectWrap.data('menuClass') : '';

					selectWrap.addClass(menuClass);
					widget.addClass(menuClass);

					$(that).selectmenu('open');
					$(that).selectmenu('close');
				};
				selectMenuOption.open = function (event, ui) {
					widget.css('width', selectWrap.width());
				};
				selectWrap.find('select').selectmenu(selectMenuOption);
			});
		}

		function setCustomSelect(target, defaultOption) {
			var rendererName, widget, widgetClass;
			rendererName = target.data('renderer');
			widgetClass = target.data('widgetClass');
			defaultOption.open = function (event, ui) {
				widget.css('width', target.width());
			};

			widget = target.find('select')[rendererName](defaultOption)[rendererName]('menuWidget').addClass(widgetClass);
		}
	}

	/**
	 * Fold box 기본 설정
	 * @param selector Fold box 컨테이너 DOM 셀렉터(default : .js-fold)
	 */
	function setFoldBox(selector) {
		selector = selector ? selector : '.js-fold';
		if ($(selector).length > 0) {
			$(selector).find('.fold-box .fold-box-header').each(function (index) {
				$(this).off('click').on('click', function (event) {
					if ($(event.target).is('a') || $(event.target).is('button')) {
						event.preventDefault();
						return;
					}
					if ($(this).siblings('.fold-box-contents').length === 0 && !$(this).hasClass('header-only')) {
						return;
					}

					if ($(event.currentTarget).closest(selector).data('type') === 'multi') {
						$(event.currentTarget).closest('.fold-box').toggleClass('expanded');
					} else {
						var isExpanded;
						isExpanded = $(this).closest('.fold-box').hasClass('expanded');
						$(this).closest(selector).find('.fold-box').removeClass('expanded');
						isExpanded ? $(this).closest('.fold-box').removeClass('expanded')
							: $(this).closest('.fold-box').addClass('expanded');
					}
					var evtData = {
						index: $(event.currentTarget).closest('.fold-box').index(),
						isExpanded: $(event.currentTarget).closest('.fold-box').hasClass('expanded'),
					};
					var evt = new CustomEvent('headerClick', {'detail': evtData});

					$(event.currentTarget).closest('.fold-box')[0].dispatchEvent(evt);
				});
			});
		}
	}

	/**
	 * Overlay Scrollbars 플러그인 설정
	 * @param selector 커스텀 스크롤 설정할 컨테이너 DOM 셀렉터(default : .js-overlay-scroll)
	 * @param scrollOption Overlay Scrollbars 옵션 Object(defalut: 빈 Object)
	 */
	function setOverlayScroll(selector, scrollOption) {
		selector = selector ? selector : '.js-overlay-scroll';
		scrollOption = scrollOption ? scrollOption : {};
		if ($(selector).length > 0) {
			$(selector).overlayScrollbars(scrollOption);
		}
	}

	/**
	 * Star Rating 플러그인 설정
	 * @param selector Star Rating DOM 셀렉터(default : .js-rating)
	 */
	function setStarRating(selector) {
		selector = selector || '.js-rating';

		if ($(selector).length > 0) {
			$(selector).rating({
				language: 'ko',
				showCaption: false,
				showClear: false,
				min: 0,
				max: 5,
				step: 1,
			});
		}
	}

	/**
	 * jQuery UI Spinner 설정
	 * @param selector Spinner DOM 셀렉터(default : .js-spinner)
	 */
	function setUISpinner(selector) {
		selector = selector || '.js-spinner';

		if ($(selector).length > 0) {

			$(selector).each(function (index) {
				$(this).spinner({
					min: 1,
					max: $(this).attr('max') && $(this).attr('max') > 9999 ? 9999 : ($(this).attr('max') ? $(this).attr('max') : 9999),
				});

				if ($(this).hasClass('disabled')) $(this).spinner('option', 'disabled', true);
			});

			$(selector).off('input').on('input', function (event) {
				var val, regExVal;
				val = $(this).spinner('value');
				if (val === null) {
					val = 1;
				}
				regExVal = val.toString().replace(/[^\d+$]/g, '');
				$(this).spinner('value', regExVal);
				//this.value = this.value.replace(/^[1-9]+[0-9]*$/g, '');
			});
		}
	}

	/**
	 * 카테고리 필터 버튼 이벤트 설정
	 * @param selector 카테고리 DOM 셀렉터(default : .js-category)
	 */
	/*
	function setFilter(selector) {
		selector = selector || '.js-category';

		// s : 필터, 정렬 영역 스크립트
		$('.btn-category-filter, .btn-category-sort', selector).on('click', function (event) {
			$(this).closest('.category-btn-wrap').toggleClass('show');
		});

		$('.category-filter-layer [data-layer-close]', selector).on('click', function (event) {
			$(this).closest('.category-btn-wrap').removeClass('show');
		});

		categoryFilterScrollBars = $('.category-filter-scroll').overlayScrollbars({});

		// 브랜드 필터 링크 버튼 클릭
		$('.filter-brand .brand-link', selector).on('click', function (event) {
			var scrollTo;
			scrollTo = $($(event.currentTarget).data('target'));
			$('.filter-brand .category-filter-scroll').overlayScrollbars().scroll({el: scrollTo}, 300);
		});
		// e : 필터, 정렬 영역 스크립트
	}
	*/

	function setFilter(selector) {
		selector = selector || '.js-category'; 
		
		// s : 필터, 정렬 영역 스크립트   
		$('.btn-category-filter, .btn-category-sort', selector).on('click', function (event) {
				  $(this).closest('.category-btn-wrap').toggleClass('show');
		});
		
		$('.category-filter-layer [data-layer-close]', selector).on('click', function (event) {
			$(this).closest('.category-btn-wrap').removeClass('show');
		});
		
		$('.category-filter-scroll').each(function(){
			var categoryFilterScrollBars = $(this).overlayScrollbars({});      
			
			// 브랜드 필터 링크 버튼 클릭      
			$('.filter-brand .brand-link', selector).on('click', function (event) {         
				var scrollTo;         
				scrollTo = $($(event.currentTarget).data('target'));         
				categoryFilterScrollBars.overlayScrollbars().scroll({el: scrollTo}, 300);      
			});   
		});   
		// e : 필터, 정렬 영역 스크립트
	}
 
 
 



	/**
	 * 헤더영역 검색 버튼 설정
	 * @param selector 헤더 검색영역 DOM 셀렉터(default : .js-search)
	 */
	function setHsearch(selector) {
		selector = selector ? selector : '.js-search';

		var wordListScrollBars;
		var autocompleteListScrollBars;
		var popularSwiper;

		// Event : search 활성화
		$('.header-wrap .btn-search').on('click', function () {
			$(selector).fadeIn(300);
			popularSwiper.init();
		});

		// Event : search close
		$('.btn-close', selector).on('click', function () {
			$(selector).find('.hsearch-input input')[0].value = '';
			$(selector).find('.js-autocomplet').fadeOut(150);
			$(selector).fadeOut(200);
		});

		// Event : search input change 활성화
		$(selector).find('.hsearch-input input').on('change input', $(this), function () {

			if ($(this).closest('.hsearch-input').hasClass('js-no-keword')) return false;

			if (this.value === '') {
				$(selector).find('.js-autocomplet').fadeOut(150);
				$(selector).find('.btn-input-remove').hide();
			} else {
				$(selector).find('.js-autocomplet').fadeIn(200);
				$(selector).find('.btn-input-remove').show();
			}
		});

		// Event : search input value - delete
		$(selector).find('.btn-input-remove').on('click', $(this), function () {
			$(selector).find('.hsearch-input input')[0].value = '';
			$(selector).find('.js-autocomplet').fadeOut(150);
			$(this).hide();
		});

		// ScrollBars
		if (wordListScrollBars === undefined) wordListScrollBars = $(selector).find('.js-word-list').overlayScrollbars({});
		if (autocompleteListScrollBars === undefined) autocompleteListScrollBars = $(selector).find('.js-autocomplet').overlayScrollbars({});

		// 인기 검색어 Swiper
		if ($('.js-popular-word .swiper-slide').length > 1) {

			popularSwiper = new Swiper($('.js-popular-word', selector), {
				init: false,
				slidesPerView: 1,
				spaceBetween: 0,
				loop: false,
				navigation: {
					prevEl: '.js-popular-word ~ .btn-swiper-arrow-wrap .btn-swiper-arrow.prev',
					nextEl: '.js-popular-word ~ .btn-swiper-arrow-wrap .btn-swiper-arrow.next',
				},
			});
		}
	}

	/**
	 * 검색영역 입력값 삭제 버튼 이벤트 설정
	 * @param selector DOM 셀렉터(default : .js-search-input)
	 */
	function setSearchInputValDelete(selector) {
		selector = selector ? selector : '.js-search-input';

		// Event : search input change 활성화
		$('input', selector).on('change input', $(this), function () {

			if (this.value === '') {
				$(selector).find('.btn-input-remove').hide();
				$(selector).find('.btn-input-search').show();
			} else {
				$(selector).find('.btn-input-remove').show();
				$(selector).find('.btn-input-search').hide();
			}
		});

		$(selector).find('.btn-input-remove').on('click', $(this), function () {
			$('input', selector)[0].value = '';
			$(this).hide();
			$(selector).find('.btn-input-search').show();
		});
	}

	/**
	 * 공통 상세 swiper 설정
	 * @param selector DOM 셀렉터(default : .js-detail-content)
	 */
	function setDetailContent(selector) {
		var gateSwiper;
		selector = selector ? selector : '.js-detail-content';

		if ($('.gate-banner-wrap > .gate-banner-swiper', selector).length > 0) {
			gateSwiper = new Swiper($('.gate-banner-wrap > .gate-banner-swiper', selector), {
				init: false,
				slidesPerView: 4,
				spaceBetween: 0,
				speed: 600,
				navigation: {
					prevEl: $('.gate-banner-wrap').find('.btn-swiper-arrow-wrap .btn-swiper-arrow.prev'),
					nextEl: $('.gate-banner-wrap').find('.btn-swiper-arrow-wrap .btn-swiper-arrow.next'),
				},
				// TODO : 4단 분기 고객 정의 후 추가 필요
				breakpoints: {
					1440: {
						slidesPerView: 2,
					},
					1920: {
						slidesPerView: 3,
					},
				},
				resistance: '100%',
				resistanceRatio: 0,
			});

			if ($('.js-contents-swiper', selector).length > 0) {
				$('.js-contents-swiper', selector).each(function () {

					var contentSwiper;

					contentSwiper = new Swiper($(this), {
						init: false,
						slidesPerView: 1,
						spaceBetween: 0,
						scrollbar: {
							el: $(this).find('.swiper-scrollbar'),
						},
						resistance: '100%',
						resistanceRatio: 0,
					});

					contentSwiper.init();
				});
			}

			// 이미지 화보
			if ($('.js-pictorial-gallery', selector).length > 0) {
				$('.js-pictorial-gallery', selector).each(function () {
					var galleryThumbs = new Swiper($(this).find('.js-gallery-thumbs'), {
						slidesPerView: 5,
						spaceBetween: 30,
						watchSlidesVisibility: true,
						watchSlidesProgress: true,
					});

					var galleryTop = new Swiper($(this).find('.js-gallery-top'), {
						slidesPerView: 1,
						spaceBetween: 0,
						navigation: {
							prevEl: $(this).find('.btn-swiper-arrow-wrap .btn-swiper-arrow.prev'),
							nextEl: $(this).find('.btn-swiper-arrow-wrap .btn-swiper-arrow.next'),
						},
						thumbs: {
							swiper: galleryThumbs,
						},
						on: {
							slideChange: function () {
								if (galleryText !== undefined) {
									galleryText.slideTo(galleryTop.realIndex);
								}
							},
						},
						resistance: '100%',
						resistanceRatio: 0,
					});

					if ($(this).find('.js-gallery-text').length > 0) {
						var galleryText = new Swiper($(this).find('.js-gallery-text'), {
							slidesPerView: 1,
							spaceBetween: 0,
							allowTouchMove: false,
						});
					}
				});
			}

			// 이미지 1분할
			if ($('.js-gallery-col1', selector).length > 0) {
				$('.js-gallery-col1', selector).each(function () {
					var galleryThumbs = new Swiper($(this).find('.js-thumbs'), {
						slidesPerView: 1,
						watchSlidesVisibility: true,
						watchSlidesProgress: true,
						allowTouchMove: false,
					});

					var galleryTop = new Swiper($(this).find('.js-top'), {
						slidesPerView: 1,
						scrollbar: {
							el: $(this).find('.swiper-scrollbar'),
						},
						navigation: {
							prevEl: $(this).find('.btn-swiper-arrow-wrap .btn-swiper-arrow.prev'),
							nextEl: $(this).find('.btn-swiper-arrow-wrap .btn-swiper-arrow.next'),
						},
						thumbs: {
							swiper: galleryThumbs,
						},
						resistance: '100%',
						resistanceRatio: 0,
					});
				});
			}

			// 이미지 2분할
			if ($('.js-gallery-col2', selector).length > 0) {
				$('.js-gallery-col2', selector).each(function () {
					var galleryLeftThumbs = new Swiper($(this).find('.js-thumbs-left'), {
						slidesPerView: 1,
						watchSlidesVisibility: true,
						watchSlidesProgress: true,
						allowTouchMove: false,
					});

					var galleryLeftTop = new Swiper($(this).find('.js-top-left'), {
						slidesPerView: 1,
						spaceBetween: 0,
						scrollbar: {
							el: $(this).find('.js-top-left .swiper-scrollbar'),
						},
						navigation: {
							prevEl: $(this).find('.js-top-left').find('.btn-swiper-arrow-wrap .btn-swiper-arrow.prev'),
							nextEl: $(this).find('.js-top-left').find('.btn-swiper-arrow-wrap .btn-swiper-arrow.next'),
						},
						thumbs: {
							swiper: galleryLeftThumbs,
						},
						resistance: '100%',
						resistanceRatio: 0,
					});

					var galleryRightThumbs = new Swiper($(this).find('.js-thumbs-right'), {
						slidesPerView: 1,
						watchSlidesVisibility: true,
						watchSlidesProgress: true,
						allowTouchMove: false,
					});

					var galleryRightTop = new Swiper($(this).find('.js-top-right'), {
						slidesPerView: 1,
						spaceBetween: 0,
						scrollbar: {
							el: $(this).find('.js-top-right .swiper-scrollbar'),
						},
						navigation: {
							prevEl: $(this).find('.js-top-right').find('.btn-swiper-arrow-wrap .btn-swiper-arrow.prev'),
							nextEl: $(this).find('.js-top-right').find('.btn-swiper-arrow-wrap .btn-swiper-arrow.next'),
						},
						thumbs: {
							swiper: galleryRightThumbs,
						},
						resistance: '100%',
						resistanceRatio: 0,
					});
				});
			}

			// 연관상품, 상품 텍스트형 category-list
			if ($('.category-list-wrap', selector).length > 0) {
				$('.category-list-wrap', selector).each(function () {
					var categorySwiper;

					categorySwiper = new Swiper($(this), {
						init: false,
						slidesPerView: 'auto',
						spaceBetween: 20,
						speed: 600,
						navigation: {
							prevEl: $(this).find('.btn-swiper-arrow-wrap .btn-swiper-arrow.prev'),
							nextEl: $(this).find('.btn-swiper-arrow-wrap .btn-swiper-arrow.next'),
						},
						resistance: '100%',
						resistanceRatio: 0,
					});

					categorySwiper.init();
				});

			}

			gateSwiper.init();
		}
	}

	/**
	 * 고객센터 컨텐츠 검색 버튼 이벤트 설정
	 * @param selector DOM 셀렉터(default : .js-search-content)
	 */
	function setSearchContent(selector) {
		selector = selector ? selector : '.js-search-content';

		$(selector).each(function () {
			$(this).find('.js-btn-search').on('click', function () {
				$(this).hasClass('btn-search-close') ? $(this).parents(selector).removeClass('is-active') : $(this).parents(selector).addClass('is-active');
			});
		})
	}

	/**
	 * 유튜브 DOM 구조 Youtube Iframe API 셋팅
	 * @param target 유튜브 Iframe 노출 할 DOM jQuery Object
	 * @param videoUrl 비디오 URL
	 * @param onReadyCallback 비디오 플레이 준비완료 callback 함수
	 */
	function setYoutubeIFrame(target, videoUrl, onReadyCallback) {
		if (target.is('iframe')) {
			return;
		}

		var videoId, playerWrapper, playerTarget, player, iFrameId, videoWidth, videoHeight, playerVars;

		videoId = getVideoId(videoUrl);
		videoWidth = '100%';
		videoHeight = '100%';//'56.25%';

		iFrameId = 'youtubeFrame' + $('iframe').length;

		if (target.hasClass('video-wrap')) {
			playerWrapper = target;
		} else {
			playerWrapper = $('<div>', {
				class: 'video-wrap',
			});
		}

		playerTarget = $('<div>', {
			id: iFrameId,
			class: 'youtube-iframe',
		});
		playerWrapper.append(playerTarget);

		playerWrapper.appendTo(target);

		playerVars = {
			'playlist': videoId,
			'autoplay': 1,
			'controls': 0,
			'showinfo': 0,
			'rel': 0,
			'disablekb': 1,
			'loop': 1,
			'modestbranding': 1,
			'enablejsapi': 1,
		};

		player = new YT.Player(iFrameId, {
			width: videoWidth,
			height: videoHeight,

			playerVars: playerVars,
			events: {
				'onReady': function (event) {
					var playerTarget;
					playerTarget = $('#' + iFrameId);
					playerTarget.data('player', player);

					if (onReadyCallback) {
						onReadyCallback(player);
					}
					// setTimeout(function() {
					// 	console.log('setTimeout');
					// 	event.target.playVideo();
					// }, 1000);
				},
				'onStateChange': function (event) {
					if (event.data === 5) {
						event.target.playVideo();
						document.querySelector('#' + iFrameId).contentWindow.focus();
					}
				}
			}
		});

		function getVideoId(url) {
			var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
			var match = url.match(regExp);

			if (match && match[7].length === 11) {
				return match[7];
			} else {
				return 'error';
			}
		}
	}

	/**
	 * 비메오 Iframe 셋팅
	 * @param target 비메오 Iframe 노출 할 DOM jQuery Object
	 * @param videoUrl 비디오 URL
	 */
	function setVimeoIframe(target, videoUrl) {
		var videoId, playerWrapper, iFrameId, videoWidth, videoHeight;
		if (target.is('iframe')) {
			return;
		}

		videoId = getVideoId(videoUrl);
		videoWidth = '100%';
		videoHeight = '100%';//'56.25%';

		iFrameId = 'vimeoFrame' + $('iframe').length;

		playerWrapper = $('<div>', {
			id: iFrameId,
			class: 'video-wrap vimeo-wrap',
			style: 'padding-top: 56.25%;',
		});

		var iframe = $('<iframe>', {
			src: 'https://player.vimeo.com/video/' + videoId + '?autoplay=1&amp;title=0&amp;byline=0&amp;portrait=0',
			frameborder: 0,
			style: 'position:absolute;top:0;left:0;width:100%;height:100%;',
			allow: 'autoplay; fullscreen',
			allowfullscreen: true,
		});

		playerWrapper.append(iframe).appendTo(target);

		/*
		playerWrapper = $('<div>', {
			id: iFrameId,
			class: 'video-wrap vimeo-wrap',
		});

		playerWrapper.appendTo(target);

		player = new Vimeo.Player(iFrameId, {
			id: videoId,
			autoplay: true,
			responsive: true,
		});
		player.on('loaded', function () {
			document.querySelector('#' + iFrameId + ' iframe').contentWindow.focus();
		});
		*/

		function getVideoId(url) {
			// var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
			var regExp = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i;
			var match = url.match(regExp);
			return match[1];
		}
	}

	/**
	 * 로딩 팝업 Show
	 */
	function showLoadingPopup() {
		if ($('#loadingPopup').length === 0) {
			$('body').append('<div id="loadingPopup" class="ui-dialog-contents" title="로딩 팝업" data-class="dialog-loading"><div class="loading-motion"></div><p class="loading-text">Loading<span class="loading-dot">...</span></p></div>');

			_front.setUIDialog('#loadingPopup');
			$('#loadingPopup').on('dialogopen', function (event, ui) {
				window.popupLoading = lottie.loadAnimation({
					wrapper: this.querySelector('.loading-motion'),
					animType: 'html',
					loop: true,
					prerender: true,
					autoplay: true,
					path: '/resources/lottie/loading.json',
				});
			});
			$('#loadingPopup').on('dialogclose', function (event, ui) {
				window.popupLoading.destroy();
				window.popupLoading = null;
			});
		}

		if (!$('#loadingPopup').dialog('isOpen')) {
			$('#loadingPopup').dialog('open');
		}
	}

	/**
	 * 로딩 팝업 Hide
	 */
	function hideLoadingPopup() {
		$('#loadingPopup').dialog('close');
	}

	/**
	 * 상품 리스트 등 더보기 시 하단 로딩 아이콘 Attach
	 * @param container 로딩 아이콘 노출할 container DOM 셀렉터
	 */
	function attachLoading(container) {
		var loadingAnimation;
		$(container).append('<div id="attachLoading' + _loadingCount + '" class="attach-loading"></div>');

		loadingAnimation = lottie.loadAnimation({
			container: document.getElementById('attachLoading' + _loadingCount),
			animType: 'html',
			loop: true,
			prerender: true,
			autoplay: true,
			path: '../../resources/lottie/loading.json',
		});
		_loadingCount++;

		$(container).data('attachLoading', loadingAnimation);
	}

	/**
	 * 상품 리스트 등 더보기 시 하단 로딩 아이콘 Detach
	 * @param container 로딩 아이콘 삭제할 container DOM 셀렉터
	 */
	function detachLoading(container) {
		var loading;
		loading = $(container + ' .attach-loading');
		$(container).data('attachLoading').destroy();
		loading.remove();
	}

	/**
	 * 기본 UI 설정
	 * @param selector 특정 영역 하위 기본 UI 설정을 위한 DOM 셀렉터
	 */
	function initUI(selector) {
		var initSelector;
		initSelector = {
			resetBtn: selector ? selector + ' .input-wrap .reset-input' : '.input-wrap .reset-input',
			tableCaption: selector ? selector + ' .tbl-wrap table' : '.tbl-wrap table',
			tab: selector ? selector + ' .js-tab' : '.js-tab',
			dialog: selector ? selector + ' .ui-dialog-contents' : '.ui-dialog-contents',
			dialogBtn: selector ? selector + ' [data-popup-trigger]' : '[data-popup-trigger]',
			tooltip: selector ? selector + ' .js-tooltip-container' : '.js-tooltip-container',
			datepicker: selector ? selector + ' .js-datepicker' : '.js-datepicker',
			select: selector ? selector + ' .js-select' : '.js-select',
			fold: selector ? selector + ' .js-fold' : '.js-fold',
			rating: selector ? selector + ' .js-rating' : '.js-rating',
			spinner: selector ? selector + ' .js-spinner' : '.js-spinner',
			quickMenu: selector ? selector + ' .quick-menu' : '.quick-menu',
		};

		setInputResetBtn(initSelector.resetBtn);
		setTableCaption(initSelector.tableCaption);
		setUITabs(initSelector.tab);
		setUIDialog(initSelector.dialog, initSelector.dialogBtn);
		setUITooltip(initSelector.tooltip);
		setUIDatepicker(initSelector.datepicker);
		setUISelect(initSelector.select);
		setFoldBox(initSelector.fold);
		setStarRating(initSelector.rating);
		setUISpinner(initSelector.spinner);
		setQuickMenu(initSelector.quickMenu);
	}

	$(window).on('scroll resize', function () {
		setFixedElementPosX();
		closeSelectMenuOption();
	});

	// s : Public 접근 가능한 변수 함수로 선언
	_front.setInputResetBtn = setInputResetBtn;
	_front.setTableCaption = setTableCaption;
	_front.setUITabs = setUITabs;
	_front.setUIDialog = setUIDialog;
	_front.setUIDatepicker = setUIDatepicker;
	_front.setUISelect = setUISelect;
	_front.setFoldBox = setFoldBox;
	_front.setOverlayScroll = setOverlayScroll;
	_front.setFilter = setFilter;
	_front.setStarRating = setStarRating;
	_front.setUISpinner = setUISpinner;
	_front.setHsearch = setHsearch;
	_front.setQuickMenu = setQuickMenu;
	_front.setSearchInputValDelete = setSearchInputValDelete;
	_front.setYoutubeIFrame = setYoutubeIFrame;
	_front.setVimeoIframe = setVimeoIframe;
	_front.showLoadingPopup = showLoadingPopup;
	_front.hideLoadingPopup = hideLoadingPopup;
	_front.attachLoading = attachLoading;
	_front.detachLoading = detachLoading;
	_front.initUI = initUI;

	// e : Public 접근 가능한 변수 함수로 선언

	$(document).ready(function () {
		// datepicker Default
		$.datepicker.setDefaults({
			selectOtherMonths: true,
			showOtherMonths: true,
			numberOfMonths: 1,
			yearSuffix: ' .',
			dateFormat: 'yy-mm-dd',
			monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
			dayNamesMin: ['SU', 'MO', 'TH', 'WE', 'TH', 'FR', 'SA'],
			showMonthAfterYear: true,
			showOn: 'button',
			buttonImage: '../../resources/images/ui/button/ui_btn_calendar.png',
			buttonImageOnly: false,// 수정 웹접근성 관련
			buttonText: 'Select date',
			currentText: 'Now',
			prevText: '이전달',
			nextText: '다음달'

		});

		/* s : Explorer Check */
		if (/Edge\/\d./i.test(navigator.userAgent)) {
			$('html').addClass('edge');
		} else if (/trident\/\d./i.test(navigator.userAgent)) {
			$('html').addClass('ie');
		}
		/* e : Explorer Check */

		/* s : 맥 OS 또는 iOS 디바이스 체크 */
		_isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
		if (_isMacLike) {
			$('html').addClass('os-apple');
		}
		/* e : 맥 OS 또는 iOS 디바이스 체크 */

		if (window.ScrollPosStyler) {
			ScrollPosStyler.init({
				classAbove: 'sps-abv',
				classBelow: 'sps-blw',
			});
		}

		if (window.OverlayScrollbars) {
			_front.overlayScrollbars = {};
			_front.overlayScrollbars.onScroll = function () {
				closeSelectMenuOption();
			};
			OverlayScrollbars.defaultOptions({
				overflowBehavior: {
					x: 'visible-hidden',
				},
				scrollbars: {
					autoHide: 'scroll',
				},
				callbacks: {
					onScroll: function (event) {
						_front.overlayScrollbars.onScroll();
					},
				},
			});
		}

		// 공통 UI 스크립트
		initUI();

		setZipCode();
		// setHsearch(); //개발 요청으로 주석
		setOverlayScroll();
		setSearchContent();
		setSearchInputValDelete();
		setDetailContent();

		setGNBMenu();
		setQuickMenu();
		setYoutubeAPITag();

	});

	return _front;
})();

function onYouTubeIframeAPIReady() {
	var event;
	$('html').addClass('youtube-ready');
	event = new CustomEvent('youtubeReady');
	// console.log('youtubeReady');
	window.dispatchEvent(event);

	// if ($('html').hasClass('youtube-ready')) {
	// 	handsome.ui.front.setYoutubeIFrame();
	// }
	// else {
	// 	$(window).one('youtubeReady', function () {
	// 		handsome.ui.front.setYoutubeIFrame();
	// 	});
	// }
	// handsome.ui.front.setYoutubeIFrame();
}

//부모 요소 찾기
var clst = {
	parent : null,
	find : function(_this, target){
		var tag = _this.parentNode.tagName.toLowerCase();
		var cls = _this.parentNode.classList;
		var id = _this.parentNode.getAttribute('id');
		clst.parent = _this.parentNode;
		if(target !== tag && !cls.contains(target) && target != id) {
			if(tag != 'html') {
				clst.find(clst.parent, target);
			} else {
				clst.parent = undefined;
			}
		}
		return clst.parent;
	}
}

//자식 요소 찾기
var childFind = function(el, target) {
	var obj = '';
	var arr = [];
	for(var idx = 0 ; idx < el.childNodes.length; idx++) {
		if(el.childNodes[idx].nodeType == 1) {
			var tag = el.childNodes[idx].tagName.toLowerCase();
			var cls = el.childNodes[idx].classList;
			var id = el.childNodes[idx].getAttribute('id');
			if(target === tag || cls.contains(target) || target === id) {
				obj = el.childNodes[idx];
				arr.push(el.childNodes[idx]);
			}
		}
	}
	if(arr.length > 1) {
		return arr;
	} else {
		return obj;
	}
}
// 다음 요소 찾기
var nextFind = function(obj) {
	if(obj.nextSibling.nodeType == 1) {
		next = obj.nextSibling;
	} else {
		nextFind(obj.nextSibling);
	}
	return next;
}

// 221103 하단 연관상품 5개 이상일때 스와이퍼 실행 추가
var fnRelatedSwiperNew = function() {
	if ($('.related-swiper-new').length > 0) {
		$('.related-swiper-new').each(function(idx, el) {
			if ($(el).find('.swiper-slide').length > 4) {
				$(el).addClass('related-swiper-new-excution');
				$(el).find('.btn-swiper-arrow-wrap').show();
			}
		});
		
		var arrRelatedSwiper = [];
		$('.related-swiper-new-excution').each(function(idx, el) {
			var relatedSwiper = new Swiper($(el), {
				init: false,
				slidesPerView: 'auto',
				watchSlidesProgress: true,
				speed: 200,
				spaceBetween: 0,
				navigation: {
					prevEl: '.btn-swiper-arrow.prev',
					nextEl: '.btn-swiper-arrow.next'
				}
			});
			arrRelatedSwiper.push(relatedSwiper);
			arrRelatedSwiper[idx].init();
		});
	}
}

$(function() {
	// eql룩 스와이퍼 추가
	$(".eqllock-swiper").each(function(index){
		var $this = $(this);
		var itemCommSwiper = new Swiper('.swiper' + index, {
			init: false,
			loop: false,
			spaceBetween: 0,
			slidesPerView: 3,
			speed: 400,
			allowTouchMove: false,
			navigation: {
				prevEl: $this.find(".swiper-button-prev")[0],
				nextEl: $this.find(".swiper-button-next")[0],
			},
			watchOverflow: true,
		});
		itemCommSwiper.init();
	});

	// 221103 하단 연관상품 5개 이상일때 스와이퍼 실행 추가11
	fnRelatedSwiperNew();
});