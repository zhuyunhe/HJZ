'use strict'
var hjz_data = {};
$(function(){
	var iNow = 0;			//当前试题页数
	var shitiLength = 0;	//试题数目

	//解析url中的search参数
	var args = getSearch();

	//拿到这套题的qid
	var appId = args.appId;
	var openId = args.openId;
	var openKey = args.openKey;
	var hwId = args.hwId
	var examId = args.examId;
	var index = args.index;
	var ts = args.ts;
	var sig = args.sig;

	

	//后台请求数据
	ajaxGetData(examId);

	//点击折叠箭头
	$('.option_arrow').on('touchstart',function(){
		if(shitiLength>5){
			$('.student_arrow_con').toggleClass('student_arrow_con_show');
			$('.option_arrow').find('img').toggleClass('option_arrow_down');
		}
	});

	//
	$('.student_arrow_con').find('span').on('touchstart',function(){
		var index = $(this).text()-1;
		scrollTo(index);
	});

	//根据题目id从后台请求数据
	function ajaxGetData(examId){
		$.ajax({
			url : "http://haojiazhang123.com/question_review/get_question_set.json",
			type : "get",
			dataType : "JSON",
			data : {
				examId:examId
			},
			success : function(data){
				if(data.status === 'success'){
					cookData(data);					
				} else{
					alert('好家长后台未返回题目数据');
				}
			},
			error : function(xhr,strStatus,strObject){
				var someData = {type:'pageLoaded',pagename:'homework',retcode:1};
					window.top.postMessage(JSON.stringify(someData),'*');
			}
		});
	}
	//处理题目数据
	function cookData(data){
		//保存这套题的题目数据
		var questionObj = data.data;
		var chapterArr = data.extra.knowledge_title;
		//题目数量
		shitiLength = questionObj.length;
		$('.number span').text(shitiLength);
		var $content = $('#content');
		var $anchorUl = $('.student_arrowcon>ul')
		for (var i = 0; i<questionObj.length; i++) {
			var question = questionObj[i];
			console.log(question.stem);
			var questionStr = '<div class="question_box"><div class="question_box_y"><div class="question_tit"><p>'
								+question.stem+'</p></div><div class="question_options"><div class="qo_list"><p class="qol_titb"><span class="qol_tit">A</span></p><p class="qol_con">'
								+question.option_a+'</p></div><div class="qo_list"><p class="qol_titb"><span class="qol_tit">B</span></p><p class="qol_con">'
								+question.option_b+'</p></div><div class="qo_list"><p class="qol_titb"><span class="qol_tit">C</span></p><p class="qol_con">'
								+question.option_c+'</p></div></div></div></div>';

			$content.append(questionStr);
			
			//锚
			var anchorStr;
			if(i === 0){
				anchorStr = '<li><span class="this_option">'+(i+1)+'</span></li>';
			} else{
				anchorStr = '<li><span>'+(i+1)+'</span></li>';
			}
			$anchorUl.append(anchorStr);
		};

		//初始化
		init();
	}
	//页面滚动函数
	function scrollTo(index){
		$('#since').find("#content").css({
			"transition": ".2s",
			"-webkit-transition": ".2s",
			"transform" : "translate3d("+(-index * hjz_data.viewWidth)+"px,0,0)",
			"-webkit-transform" : "translate3d("+(-index * hjz_data.viewWidth)+"px,0,0)",
		});
	}

	//初始化函数
	function init(){
		var $since = $('#since');
		hjz_data = {
			since : $since,
			viewWidth : $since.width(),
			viewHeight : $since.height(),
			questionContainer : $since.find('#content'),
			questionContainerItem : $since.find('.question_box'),
			question_box_y : $('.question_box_y'),
			questionHeaderH : $('.header').height(),
			questionFooterH : $('.student_arrow').height(),
			questionFooterSpanH : $('.student_arrow').find('span').height(),
			option_arrowH : $('.student_arrow').height()
		};

		setSize();
		setScroll();
		function setSize(){
			var totalWidth = hjz_data.viewWidth*hjz_data.questionContainerItem.length;
			hjz_data.questionContainer.width(totalWidth);
			hjz_data.questionContainerItem.width(hjz_data.viewWidth).height(hjz_data.viewHeight);
			hjz_data.question_box_y.css({
				'padding-bottom' : hjz_data.questionFooterSpanH+hjz_data.option_arrow+10,
				'padding-top' : hjz_data.questionHeaderH
			});

		}
		function setScroll(){
			hjz_data.questionContainerItem.each(function(){
				this.scroll = new IScroll(this,{hScroll:false,preventDefault:false});
			});
		}

		hjz_data.since.on("touchstart",function(e){
			var e = e.originalEvent;
			e = e.touches ? e.touches[0] : e;
			var startX = e.pageX,
				startY = e.pageY,
				endY = 0,
				endX = 0,
				isLeft = false;						//是否要离开页面的标志
			var i = 0;
			hjz_data.questionContainer.css({
				'transition' : 'none',
				'-webkit-transition' : 'none'
			});
			hjz_data.since.on("touchmove",function(e){
				e.preventDefault();
				var e = e.originalEvent;
                e = e.touches ? e.touches[0] : e;

				endX = e.pageX;
				endY = e.pageY;
				i++;
				//console.log(i);

				if(i === 6){
					isLeft = Math.abs(startX-endX) > Math.abs(startY-endY);
				}
				if(isLeft){
					//console.log('要离开了');
					//添加左右滑动css属性
					hjz_data.questionContainerItem.eq(iNow)[0].scroll.disable();
					var disX = endX - startX;
					if(iNow === 0){
						hjz_data.questionContainer.css({
							"-webkit-transform" : "translate3d("+(disX - iNow*hjz_data.viewWidth)/3 + "px,0,0)",
							"transform" : "translate3d("+(disX - iNow*hjz_data.viewWidth)/3 + "px,0,0)"
						});
					} else{
						hjz_data.questionContainer.css({
							"-webkit-transform" : "translate3d("+(disX - iNow*hjz_data.viewWidth) + "px,0,0)",
							"transform" : "translate3d("+(disX - iNow*hjz_data.viewWidth) + "px,0,0)"
						});
					}
				}
			}).on("touchend",function(ev){
				//要离开当前这道题的页面了
				if(isLeft) {
					var disX = endX - startX;
					if(Math.abs(endX-startX) > hjz_data.viewWidth/3){
						if(endX > startX){
							//右滑动
							iNow--;
							iNow<=0 && (iNow=0);
						} else{
							//左滑动
							iNow++;
							iNow >= hjz_data.questionContainerItem.length-1 && (iNow = hjz_data.questionContainerItem.length-1)
						}
					}
					hjz_data.questionContainer.css({
						"transition" : ".2s",
						"-webkit-transition" : ".2s",
						"transform" : "translate3d("+ (-iNow*hjz_data.viewWidth)+"px,0,0)",
						"-webkit-transform" : "translate3d("+ (-iNow*hjz_data.viewWidth)+"px,0,0)",
					});
					hjz_data.questionContainerItem.eq(iNow)[0].scroll.enable();

					//更新header上的当前题目索引
					$('.number em').text(iNow+1);
					changeOptionArrow();
				}
				$(this).off('touchmove touchend');
			});
		});

		//点击每道题的选项时触发的事件
		$('.qo_list').on('click',function(e){
			var $this = $(this);
			$this.parents('.question_options').find('.qol_tit').removeClass('qol_tit_yes');
			$this.find('.qol_tit').addClass('qol_tit_yes');
			$('.student_arrow_con').find('span').eq(iNow).addClass('option_yes');

			//这道题的选择
			var answer = $this.find('.qol_tit').text();
			console.log(answer);

			if(iNow < shitiLength-1){
				iNow++;
				setTimeout(function(){scrollTo(iNow)},10);
			}

			changeOptionArrow();
		});

		//点击footer中题目导航时，切换到相应的题目
		$('.student_arrow_con').find('span').on('touchstart',function(){
			iNow = $(this).text()-1;
			setTimeout(function(){scrollTo(iNow)},10);
			//改变底部锚样式
			changeOptionArrow();
		});
	}

	//底部题号变化函数
	function changeOptionArrow(){
		var optionArrow = $('.student_arrowcon').find('span');
		optionArrow.removeClass('this_option');
		optionArrow.eq(iNow).addClass('this_option');
	}
});

/*
获取url中的search参数
*/
function getSearch(){
    var query = window.location.search.substring(1);
    var args = {};
    var pairs = query.split("&");
    for(var i=0; i<pairs.length; i++){
	    var pos = pairs[i].indexOf("=");
	    if(pos == -1){
	        continue;
	    } else{
	        var key = pairs[i].substring(0,pos);
	        var value = pairs[i].substring(pos+1);
	        args[key] = decodeURI(value);
	    }
    }
    return args;
}