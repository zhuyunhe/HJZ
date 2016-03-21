;(function(){
	window.hjz = window.hjz || {};

	window.hjz.addLoader = function(opt){
		var height = window.screen.availHeight;
		opt = opt || {};
		var loaderContainer = document.querySelectorAll('.loaderContainer');
		loaderContainer = Array.prototype.slice.call(loaderContainer);
		if(loaderContainer.length){
			window.hjz.removeClass(loaderContainer,'hide');
		} else{
			var div = document.createElement('div');
			div.className = 'uil-default-css-normal';
			for(var i=0; i<12; i++){
				var angel = 30*i+'deg';
				var flake = document.createElement('div');
				flake.className = 'flake';
				div.appendChild(flake);
			} 
			var loader = document.createElement('div');
			loader.className = 'loader';
			var loaderContainer = document.createElement('div');
			loaderContainer.className = 'loaderContainer';
			loaderContainer.style.height = height+'px';
			loader.appendChild(div);
			loaderContainer.appendChild(loader);
			var little = opt['little'] || false;
			if(little){
				loaderContainer.className += ' little'; 
			} else{
				loaderContainer.className.replace('/ little/',''); 
			}
			document.body.appendChild(loaderContainer);
 		}
	};

	//去除loading层
	window.hjz.removeLoader = function (){
		var loaderContainer = document.querySelectorAll('.loaderContainer');
		loaderContainer = Array.prototype.slice.call(loaderContainer);
		if(loaderContainer.length){
			window.hjz.addClass(loaderContainer,'hide');
		}
	};
	/*
	自定义确认框
	* @param msg 提示信息
	* @param opt 配置信息
	* @returns {boolean} 返回值
	*/
	window.hjz.newConfirm_z = function(msg,opt){
		var result = false;
		var msg = msg || '';
		var opt = opt || {};
		var okText = opt.okText || '确定';
		var cancelText = opt.cancelText || '取消';
		var handler = opt.okLink || function(){};
		var cancelHandler = opt.cancelLink || function(){};
		var hideCancel = opt.hideCancel || false;
		var hideOkAndCancelCancel = opt.hideOkAndCancel || false;
		var closeButton = opt.hasCloseButton || false;		//应该是右上角的小x按钮
		
		var confirmWrap = document.querySelector('.confirmWrap');
		var confirmBody;
		//confirmWrap = Array.prototype.slice.call(confirmWrap);
		if(!confirmWrap){
			var dialogMask = document.createElement('div');
			dialogMask.className = 'dialogMask';
			dialogMask.style.display = 'block';
			var confirmWrap = document.createElement('div');
			confirmWrap.className = 'confirmWrap';
			var confirmDialog = document.createElement('div');
			confirmDialog.className = 'confirmDialog';
			confirmBody = document.createElement('div');
			confirmBody.className = 'confirmBody';
			var confirmFooter = document.createElement('div');
			confirmFooter.className = 'confirmFooter';
			var confirm = document.createElement('a');
			confirm.className = 'confirm';
			var cancel = document.createElement('a');
			cancel.className = 'cancel';
			confirmFooter.appendChild(confirm);
			confirmFooter.appendChild(cancel);
			confirmDialog.appendChild(confirmBody);
			confirmDialog.appendChild(confirmFooter);
			confirmWrap.appendChild(confirmDialog);
			dialogMask.appendChild(confirmWrap);
			document.body.appendChild(dialogMask);

			//确定按钮绑定事件
			window.hjz.addHandler(confirm,'click',function(){
				dialogMask.style.display = 'none';
				if(typeof handler === 'string'){
					window.hjz.goto(handler);
				} else{
					handler();
				}
			});
			//取消按钮绑定事件
			window.hjz.addHandler(cancel,'click',function(){
				dialogMask.style.display = 'none';
				if(typeof cancelHandler === 'string'){
					window.hjz.goto(cancelHandler);
				} else{
					cancelHandler();
				}
			});

		} else{ //之前存在弹窗框
			document.querySelector('.dialogMask').style.display = 'block';
		}
		hjz.toggleClass(confirmWrap,'normalConfirmWrap',!hideCancel);
		confirmBody = document.querySelector('.confirmBody');
		confirmBody.innerText = msg;
		document.querySelector('.confirm').innerText = okText;
		document.querySelector('.cancel').innerText = cancelText;

		if(closeButton){
			var closeBtn = document.createElement('div');
			closeBtn.className = 'confirm_close';
			confirmBody.appendChild(closeBtn);
			hjz.addHandler(closeBtn,'click',function(){
				dialogMask.style.display = 'none';
			});
		}
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
	window.hjz.info = function(msg){
		var delayTime = Math.max(1500,msg.length*100);
		var infoContainer = document.querySelector('.infoContainer');
		if(!infoContainer){
			infoContainer = document.createElement('div');
			infoContainer.className = 'infoContainer';
			var innerText = document.createElement('div');
			innerText.className = 'innerText';
			innerText.innerText = msg;
			infoContainer.appendChild(innerText);
		} else{
			hjz.removeClass(infoContainer,'hide');
			var innerText = document.querySelector('.innerText');
			innerText.innerText = msg;
		}
	}

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

	//添加事件
	window.hjz.addHandler = function(element,type,handler){
		if(element.addEventListener){	//DOM2级
			element.addEventListener(type,handler,false);	//false表示事件冒泡阶段调用处理程序
		} else if(element.attachEvent){		//IE事件处理程序
			element.removeEvent('on'+type,handler);
		} else{	//DOM0级
			element['on'+type] = handler;
		}
	}
	//移除事件
	window.hjz.removeHandler = function(element,type,handler){
		if(element.removeEventListener){
			element.removeEventListener(type,handler,false);
		} else if(element.detachEvent){
			element.detachEvent('on'+type,handler);
		} else{
			element['on'+type] = null;
		}
	};
	//添加类
	window.hjz.addClass = function(elements,value){
		value = typeof value === 'string' && value;
		if(value){
			if(elements instanceof Array){
				elements.forEach(function(item,index,array){
					var cur = item.nodeType===1 && (item.className ? (' '+item.className+' ').replace('/\s/',' ') : ' ' );
					if(cur){
						if(cur.indexOf(' '+value+' ')<0){
							cur += value;
						}
						if(cur !== item.className){
							item.className = cur;
						}
					}
				});
			} else if(typeof elements === 'object' && elements.nodeType === 1){
				var cur = elements.className ? (' '+elements.className+' ').replace('/\s/',' ') : ' ' ;
				if(cur){
					if(cur.indexOf(' '+value+' ')<0){
						cur += value;
					}
					if(cur !== elements.className){
						elements.className = cur;
					}
				}
			}
		}
		return elements;
	};
	//删除类
	window.hjz.removeClass = function(elements,value){
		value = typeof value === 'string' && value;
		if(value){
			if(elements instanceof Array){	//如果是一个DOM元素的数组
				elements.forEach(function(item,index,array){
					var cur = item.nodeType===1 && item.className ? (' '+item.className+' ').replace('/\s/g',' ') : '';
					if(cur){
						while(cur.indexOf(' '+value+' ')){
							cur.replace(' '+value+' ',' ');
						}
						if(cur !== item.className){
							item.className = cur;
						}
					}
				});
			} else if(typeof elements === 'object' && elements.nodeType === 1){	//如果是单个DOM元素
				var cur = elements.className ? (' '+elements.className+' ').replace('/\s/g',' ') : '';
				if(cur){
					while(cur.indexOf(' '+value+' ')){
						cur.replace(' '+value+' ',' ');
					}
					if(cur !== elements.className){
						elements.className = cur;
					}
				}
			}
		}
		return elements;
	};
	//切换类
	window.hjz.toggleClass = function(elements,value,stateVal){
		var type = typeof value;
		if(elements instanceof Array){
			if(type === 'string' && typeof stateVal === 'boolean'){
				return type ? hjz.addClass(elements,value) : hjz.removeClass(elements,value);
			}
			//如果type没指定
			 return elements.forEach(function(item,index,array){
				if(type === 'string'){
					var self = item;
					var className;
					var i = 0;
					var classNames = value.match('/\S+/g') || [];
					while((className = classNames[i])){
						if(self.hasClass(className)){
							hjz.removeClass(self,value);
						} else{
							hjz.addClass(self,value);
						}
					}
				}
			});
		} else if(typeof elements === 'object' && elements.nodeType === 1){
			if(type === 'string' && typeof stateVal === 'boolean'){
				return type ? hjz.addClass(elements,value) : hjz.removeClass(elements,value);
			} else if(type === 'string'){
				var className;
				var i = 0;
				var classNames = value.match('/\S+/g') || [];
				while((className = classNames[i])){
					if(self.hasClass(className)){
						hjz.removeClass(self,value);
					} else{
						hjz.addClass(self,value);
					}
				} 
			}
		}
	}
	//判断类
	window.hjz.hasClass = function(elements,value){
		var className = ' '+value+' ';
		if(elements instanceof Array){
			var i = 0;
			var length = elements.length;
			for(;i<length;i++){
				if ( elements[i].nodeType === 1 && (" " + elements[i].className + " ").replace(/\s/g, " ").indexOf( className ) >= 0 ) {
				return true;
				}
			}
			return false;
		} else if(typeof elements === 'object' && elements.nodeType === 1){
			if ((" " + elements[i].className + " ").replace(/\s/g, " ").indexOf( className ) >= 0 ) {
				return true;
			} else{
				return false;
			}
		}
	}

})()
