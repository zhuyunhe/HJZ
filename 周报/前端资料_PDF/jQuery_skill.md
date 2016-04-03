# jQuery的一些使用技巧总结
###
1. 利用jQuery的animate方法，创建简单的滚动到顶部动画    
  ***
	·<a class="top" href="#">back to top</a>
	//回到顶部  
	$('.top').on('click',function(e){
		e.preventDefault();
		$(html,body).animate({scrollTop:0},800)
	});·
2. 图片预加载  
  如果网页使用了很多隐藏图片文件，使用图片预加载可以提升用户体验    
  ***
	·$.preloadImages = function(){
		for(var i=0; i<arguments.length; i++){
			$('<img>').attr('src',arguments[i]);
		}
	}
	$.preloadImages('images/hover-on.png','images/hover-off.png');·
3. 全局Ajax错误处理  
  当一个Ajax调用返回一个404或500错误时，将执行该错误处理。   
  ***
	·$(document).ajaxError(function(e,xhr,settings,error){
		console.log(error);
	});·
