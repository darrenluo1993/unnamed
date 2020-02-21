$(document).ready(function() {

	$('#skin li').click(function(){

	switchSkin(this.id);
		});
	var cookie_skin=$.cookie("MyCssSkin");
	if(cookie_skin){
		switchSkin(cookie_skin);
	}

});

function switchSkin(skinName) {
	$("#"+skinName).addClass("selected").siblings().removeClass("selected");
	$('#skinCss').attr("href","/assets/styles/"+(skinName)+".css");
	$.cookie("MyCssSkin" , skinName , {path:'/',expires:365});
}

