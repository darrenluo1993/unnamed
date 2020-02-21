function conversion(){
	var reqMessage = $('#reqMessage').val();
	if (null == reqMessage || "" == reqMessage) {
		jAlert("请输入老核心报文！");
		return false;
	}
	$.ajax({
		type : "post",
		global : false,
		async : true,
		url : CONTEXT_PATH + '/base/messageConversion/conversion',
		data:{
			requestString : reqMessage
	  	},
		dataType : "json",
		success : function(data) {
		 	if (data != null) {
				if(typeof(data.msgDetail) != "undefined"){
					$('#respMessage').val(data.msgDetail);
				}
			}
		},
		error:function(){
			doTheAlert('提示', errorTip);
		}
	});	
	
}