# jQuery的一些使用技巧总结
###
## 利用jQuery的animate方法，创建简单的`滚动`到顶部动画<br>
```
<a class="top" href="#">back to top</a>
//回到顶部  
$('.top').on('click',function(e){ 
	e.preventDefault();
	$(html,body).animate({scrollTop:0},800)
});
```
## 图片预加载<br>
  如果网页使用了很多隐藏图片文件，使用图片预加载可以提升用户体验    
  ***<br>
```
$.preloadImages = function(){
	for(var i=0; i<arguments.length; i++){
	$('<img>').attr('src',arguments[i]);
	}
}
$.preloadImages('images/hover-on.png','images/hover-off.png');
```
## 全局Ajax错误处理<br>  
  当一个Ajax调用返回一个404或500错误时，将执行该错误处理。
---
```
$(document).ajaxError(function(e,xhr,settings,error){
	console.log(error);
});
```
