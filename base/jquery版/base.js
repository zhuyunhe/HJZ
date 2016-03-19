$(function(){
	window.hjz = window.hjz || {};

	window.hjz.addLoader = function(opt){
		var height = window.screen.availHeight;
		opt = opt || {};
		var $loaderContainer = $(".loaderContainer");
		if($loaderContainer.length){
			$loaderContainer.removeClass('hide');
		} else{
			var loaderContainer = '<div class="loaderContainer"><div class="loader"><div class="uil-default-css-normal" style="-webkit-transform:scale(0.25);-moz-transform:scale(0.25);-webkit-transform-origin: 0 0;-moz-transform-origin: 0 0;">';
			for(var i=0; i<12; i++){
				var angel = 30*i+'deg';
				loaderContainer += '<div style="top:80px;left:93px;width:14px;height:40px;background:#fff;-webkit-transform:rotate('+angel+') translate(0,-60px); transform:rotate('+angel+') translate(0,-60px); border-radius:10px;position:absolute"></div>';
			}
			loaderContainer += '</div></div></div>';
			$loaderContainer = $(loaderContainer);
			$loaderContainer.css('height',height+'px');
			$('body').append($loaderContainer);
	}

		var little = opt['little'] || false;
		if(little){
			$loaderContainer.addClass('little')
		} else{
			$loaderContainer.removeClass('little')
		}
	};

	window.hjz.addLoader_1 = function(opt){
		var height = window.screen.availHeight;
		opt = opt || {};
		var $loaderContainer_1 = $('.loaderContainer_1');
		if($loaderContainer_1.length){
			$loaderContainer_1.removeClass('hide');
		} else{
			$loaderContainer_1 = $('<div class="loaderContainer_1"><div class="loading"><span></span><span></span><span></span><span></span><span></span></div></div>');
		}

		$loaderContainer_1.css('height',height+'px');

		var little = opt['little'] || false;
		if(little){
			$loaderContainer_1.addClass('little');
		} else{
			$loaderContainer_1.removeClass('little');
		}

		var below = opt['below'] || false;
		if(below){
			$loaderContainer_1.addClass('below');
		} else{
			$loaderContainer_1.removeClass('below');
		}
		
		$('body').append($loaderContainer_1);
	};

	//去除loading层
	window.hjz.removeLoader = function (){
		$(".loaderContainer").addClass("hide");
		$(".loaderContainer_1").addClass("hide");
	};

	/*
	自定义确认框
	* @param msg 提示信息
	* @param opt 配置信息
	* @returns {boolean} 返回值
	*/
	window.hjz.newConfirm = function(msg,opt){
		var result = false;
		var msg = msg || '';
		var opt = opt || {};
		var okText = opt.okText || '确定';
		var cancelText = opt.cancelText || '取消';
		var callback = opt.okLink || function(){};
		var cancelCallback = opt.cancelLink || function(){};
		var hideCancel = opt.hideCancel || false;
		var hideOkAndCancelCancel = opt.hideOkAndCancel || false;
		closeButton = opt.hasCloseButton || false;		//应该是右上角的小x按钮

		var $confirmWrap = $('.confirmWrap');
		if($confirmWrap.length < 1){
			$(['<div class="dialogMask" style="display:block;">','<div class="confirmWrap">','<div class="confirmDialog">','<div class="confirmBody"></div>','<div class="confirmFooter">','<a class="confirm">确定</a>','<a class="cancel">取消</a>','</div></div></div></div>'].join('')).appendTo(document.body);
			$confirmWrap = $('.confirmWrap');

			$confirmWrap.find('.confirm').on('click',function(){
				$('.dialogMask').hide();
				var callback = $(this).data('callback');	//默认的点击确定的回调
				if(callback){
					if(typeof callback === 'string'){
						window.hjz.goto(callback);
					} else{
						callback();	//执行回调
					}
				}
				$('.dialogMask').hide();
			});

			$confirmWrap.find('.cancel').on('click',function(){
				var callback = $(this).data('cancelCallback');
				if(callback){
					if(typeof callback === 'string'){
						window.hjz.goto(callback);
					} else{
						callback();
					}
				}
				$('.dialogMask').hide();
			});
		} else{	//$confirmWrap.length>=1
				$('.dialogMask').show();
		}

		$confirmWrap.toggleClass('normalConfirmWrap',!hideCancel);	//是否要隐藏取消按钮
		$confirmWrap.find('.confirmBody').html(msg);
		if(closeButton){
			var closeBtn = $('<div class="confirm_close"></div>');
			$confirmWrap.find('.confirmBody').append(closeBtn);
			closeBtn.on('click',function(){
				$('.dialogMask').hide();
			});
		}

		$confirmWrap.find('.confirm').text(okText).data('callback',callback||null);
		$confirmWrap.find('.cancel').text(cancelText).data('cancel_callback',cancelCallback||null);
		$confirmWrap.css('margin-top',$confirmWrap.height()*-1);

	};

	//url跳转
	window.hjz.goto = function(url){
		window.location.href = url;
	};

	//获取到滚动条距可视页面顶部的位置
	window.hjz.getScrollTop = function(){
		var scrollTop = 0;
		//经测试，在chrome和ff下，document.documentElement.scrollTop并没有什么卵用，都是一直返回0。但在IE下是好使的，可怜的IE。
		if(document.documentElement && document.documentElement.scrollTop){
			scrollTop = document.documentElement.scrollTop;
		} else if (document.body) {
			scrollTop = document.body.scrollTop
		}
		return scrollTop;
	};

	//获取当前可视范围高度
	window.hjz.getClientHeight = function(){
		var clientHeight = 0;
		if(document.body.clientHeight && document.documentElement.clientHeight){
			clientHeight = Math.min(document.body.clientHeight,document.documentElement.clientHeight);
		} else{
			clientHeight = Math.max(document.body.clientHeight,document.documentElement.clientHeight);
		}

		return clientHeight;
	};

	//获取文档完整高度
	window.hjz.getScrollHeight = function(){
		return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);
	};

	//得到url中的查询参数的函数
	window.hjz.getSearch = function(){
		var query = window.location.search.substring(1);
		var args = {};
		var pairs = query.split("&");

		for(var i=0; i<pairs.length; i++){
			var pos = pairs[i].indexOf("=");
			if(pos === 1){
				continue;
			} else{
				var key = pairs[i].substring(0,pos);
				var value = pairs[i].substring(pos+1);
				args[key] = decodeURI(value);
			}
		}
		return args;
	};

	//判断一个对象是否是空对象{}
	window.hjz.isEmptyObj = function(obj){
		for(param in obj){
			return false;
		}
		return true;
	};


	//弹出一个消息提示框
	window.hjz.info = function(msg){
		var delayTime = Math.max(1500,msg.length*100);
		var $infoContainer = $('.infoContainer');
		if($infoContainer.length){
			$infoContainer.removeClass('hide').find('.innerText').html(msg);
		} else{
			$infoContainer = $('<div class="infoContainer"><div class="innerText">'+msg+'</div></div>');
			$('body').append($infoContainer);
		}

		//初始化计时器归零
		clearTimeout(window.hjz.t1);
		clearTimeout(window.hjz.t2);
		$infoContainer.css('opacity',1).stop();
		window.hjz.t1 = setTimeout(function(){
			$infoContainer.css('opacity',1).animate({opacity:0},500);
			window.hjz.st2 = setTimeout(function(){
				$infoContainer.css('opacity',1).addClass('hide');
			},1000)
		},delayTime);
	};

	//自定义一个alert弹窗
	window.hjz.newAlert = function(msg,callback){
		if(typeof callback == 'function'){
			window.hjz.newConfirm(msg,{
				hideCancel : true,
				okLink : callback
			});
		} else{
			var opt = callback || {};
			opt['hideCancel'] = true;
			window.hjz.newConfirm(msg,opt);
		}
	};

});
