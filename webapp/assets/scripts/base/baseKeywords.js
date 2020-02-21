function openkeywords(sysId){
	//console.log("sysId:"+sysId);
	var url = CONTEXT_PATH+"/base/baseKeywords?sysId=" + sysId;
	window.open(url,{width:'55%'});
}

//保存
function saveKeywords(){
	var keywordName = $('#keywordName').val();
	var sysId = $('#sysId').val();
	var checkFlag = true;
	if (null == keywordName || "" == keywordName) {
		Message.showFieldError($('#keywordName'), null, "关键字不能为空！");
		return false;
	}
	$.ajax({
		type : "post",
		global : false,
		async : false,
		url : CONTEXT_PATH + '/base/baseKeywords/checkKeywordsSave',
		data : {
			sysId : sysId,
			keywordName : keywordName
		},
		dataType : "json",
		success : function(data) {
			if (data != null) {
				caseKeywordsId = data.saveKeywordsId;
				if (caseKeywordsId == "false") {
					checkFlag = false;
					jAlert("此关键字已存在！","提示");
				}
			}
		},
		error : function() {
			doTheAlert('提示', errorTip);
		}
	});
	console.log("checkFlag:"+checkFlag);
	if (checkFlag) {
		$('#saveKeyword_input').submit();
		$("#saveKeyword_input").removeClass("dirty");
		closePage();
		$('#baseKeywords_form_check').submit();
	}
}

//删除
function deleteBasekeywords(){
	var objV = $("form#baseKeywords_form_list table tbody tr td").find('input[type="checkbox"]');
	var value = "";
	for(var i = 0; i < objV.length; i ++){
		if(objV[i].checked == true){
			value = objV[i].value + "#" + value;
		}
	}
	if(value == ""){
		doTheAlert('提示', "没有选中");
		return false;
	}else{
		$.messager.confirm("警告","确认要删除这些记录吗？",function(f){
			if(f){
				$.ajax({
					type : "post",
					global : false,
					async : true,
					url : CONTEXT_PATH + '/base/baseKeywords/del',
					data:{
						idArray : value
				  	},
					dataType : "json",
					success : function(data) {
					 	if (data != null) {
							if(typeof(data.msg) != "undefined" ){
								$.messager.alert('提示', data.msg, '', function(r){
									if(r){
										$('#query_keywordName').click();
										closePage();
									}
								});
							}
						}
					},
					error:function(){
						doTheAlert('提示', errorTip);
					}
				});	
			}  
		});		
	}
}