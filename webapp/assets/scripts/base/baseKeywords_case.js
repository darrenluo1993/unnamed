var caseKeyWord_list_inputCheck;
var caseKeyWord_list_theadCheckbox;
var caseKeyWord_checkValue = [];
var caseKeyWord_checkFlag = false;
var keywordsList = "";

// 加载或刷新list页面中的table时调用此方法
Observation.caseKeywords_form_list = function(container) {
	// 获取list table页面所有的checkbox
	caseKeyWord_list_inputCheck = $("form#caseKeywords_form_list table tbody tr td").find('input[type="checkbox"]');
	caseKeyWord_list_theadCheckbox = $("form#caseKeywords_form_list table thead tr th").find('input[type="checkbox"]');
	//var keywordsList = $('#keywordsList').val();
	//var cdId = $('#caseDetailId').val();
	//console.log("keywordsList:" + keywordsList);
	/*if ('' != cdId && null != cdId) {
		if ('undefined' != typeof(keywordsList) && '' != keywordsList) {
			var keywords = keywordsList.split(",");
			for (var i = 0; i < keywords.length-1; i++) {
				caseKeyWord_checkValue.push(keywords[i]);
			}
		}
	}*/
	//removeKeywordsCK();
	var caseSpan = $('#caseKeyWords span');
	//console.log("caseSpan:"+caseSpan.length);
	if (caseKeyWord_checkValue.length < 1 && caseSpan.length > 0) {
		//console.log("caseKeyWord_checkValue:"+caseKeyWord_checkValue);
		caseSpan.each(function(){
			caseKeyWord_checkValue.push($(this).attr("id"));
		});
	}
	// 点击关闭按钮时 清空数组中的内容
	$('.ui-dialog-titlebar-close').click(function(){
		//console.log('关闭');
		removeKeywordsCK();
		//caseKeyWord_checkValue = [];
	});
	// 全选按钮事件
	caseKeyWord_list_theadCheckbox.click(function() {
		if ($(this).is(":checked")) { // 判断全选按钮是否选中
			caseKeyWord_list_inputCheck.each(function() {
			var lICheckboxVals = $(this).val();
			if (caseKeyWord_checkValue.length < 1) {
				caseKeyWord_checkValue.push(lICheckboxVals);
			} else {$(caseKeyWord_checkValue).each(
				function(index, attrValue) { // 如果数组中没有当前选中的复选框的value
												// 将其放入数组中
					if (attrValue == lICheckboxVals) {
						return false;
					}
					if (attrValue != lICheckboxVals&& caseKeyWord_checkValue.length - 1 == index) {
						caseKeyWord_checkValue.push(lICheckboxVals);
					}
				});
			}
		});
			// console.log("caseKeyWord_checkValue
			// true:"+caseKeyWord_checkValue);
		} else {
			caseKeyWord_list_inputCheck.each(function() {
				var lICheckboxVals = $(this).val();
				$(caseKeyWord_checkValue).each(function(index, attrValue) { // 取消全选时移除数组中对应的元素
					if (attrValue == lICheckboxVals) {
						caseKeyWord_checkValue.splice(
								index, 1);
					}
				});
			});
			// console.log("caseKeyWord_checkValue
			// false:"+caseKeyWord_checkValue);
		}
	});
	// 列表中的checkbox事件
	caseKeyWord_list_inputCheck.click(function() {
		var thisCkboxValue = $(this).val();
		if ($(this).is(":checked")) { // 判断复选框是否选中
			if (caseKeyWord_checkValue.length < 1) {
				caseKeyWord_checkValue.push(thisCkboxValue);
			} else {
				$(caseKeyWord_checkValue).each(
				function(index, attrValue) { // 如果数组中没有当前选中的复选框的value
												// 将其放入数组中
					if (attrValue != thisCkboxValue
							&& caseKeyWord_checkValue.length - 1 == index) {
						caseKeyWord_checkValue
								.push(thisCkboxValue);
					}
				});
			}
		} else {
			$(caseKeyWord_checkValue).each(function(index, attrValue) { // 取消选中复选框时判断当前复选框value是否存在数组中
																		// 存在时移除数组中对应的元素
				if (attrValue == thisCkboxValue) {
					caseKeyWord_checkValue.splice(index, 1);
				}
			});
		}
		// console.log("caseKeyWord_list_inputCheck.click
		// caseKeyWord_checkValue:"+caseKeyWord_checkValue);
	});

	// 切换下一页时匹配cookie中的数据 将checkbox设置为选中

	$(caseKeyWord_checkValue).each(function(index, attrValue) {
		console.log("checkbox waimian thisAttr:" + attrValue);
		caseKeyWord_list_inputCheck.each(function() {
			var checkboxValue = $(this).val();
			if (attrValue == checkboxValue) {
				$(this).attr("checked", true);
				$(this).prop("checked",true);
				$(this).parent().parent().addClass("selected");
			}
		});
	});

	// 判断列表中的checkbox是否全部选中
	caseKeyWord_list_inputCheck.each(function() {
		if (!$(this).is(":checked")) {
			return caseKeyWord_checkFlag = false;
		}
		caseKeyWord_checkFlag = true;
	});

	if (caseKeyWord_checkFlag) {
		caseKeyWord_list_theadCheckbox.prop("checked", true);
		caseKeyWord_list_theadCheckbox.attr("checked", true);
	}
}

function echoKeywords() {
	var sysId = $('#sysId').val();
	var caseKeywordName = $('#query_caseKeywordName').val();
	var caseKeywordsId = "";
	var checkKeywords = false;
	if (typeof (caseKeyWord_checkValue) == 'undefined') {
		return false;
	}
	if (caseKeyWord_checkValue.length < 1) {
		closePage();
		$('#caseKeyWords').empty();
		removeKeywordsCK();
		return;
	}
	if (caseKeyWord_checkValue.length > 6) {
		jAlert("标签数量不能大于6个！","提示");
		return false;
	}
	// 将选中的关键字回显至input界面
	echoCaseInpt(caseKeyWord_checkValue);
	// 如果搜索框内容不为空  校验是否存在该关键字
	if (null != caseKeywordName && '' != caseKeywordName && typeof(caseKeywordName) != 'undefined') {
		$.ajax({
			type : "post",
			global : false,
			async : false,
			url : CONTEXT_PATH + '/base/baseKeywords/checkKeywordName',
			data : {
				sysId : sysId,
				keywordName : caseKeywordName
			},
			dataType : "json",
			success : function(data) {
				if (data != null) {
					if (typeof (data.msgFlag) != "undefined" && data.msgFlag == "true") {
						var r = confirm("搜索框内的关键字不存在 ，是否创建？");
						if (r) {
							$.ajax({
								type : "post",
								global : false,
								async : false,
								url : CONTEXT_PATH + '/base/baseKeywords/caseKeywordsSave',
								data : {
									sysId : sysId,
									keywordName : caseKeywordName
								},
								dataType : "json",
								success : function(data) {
									if (data != null) {
										caseKeywordsId = data.saveKeywordsId;
										if (typeof (caseKeywordsId) != "undefined" && caseKeywordsId != "") {
											//创建完新的关键字后判断是否有选中的  如果有 则一并回显
											//console.log("caseKeyWord_checkValue length" + caseKeyWord_checkValue.length);
											if (caseKeyWord_checkValue.length < 1) {
												closePage();
												$('#caseKeyWords').empty();
											}
											$('#caseKeyWords').append("<span class='label' id='" + caseKeywordsId + "'>"
													+ caseKeywordName
													+ "<i class='glyphicon glyphicon-remove' " +
													"onclick='delCaseKeywords(this)' " +
											"onmouseover=this.style.cursor='pointer'></i></span>&nbsp;");
										}
									}
								},
								error : function() {
									doTheAlert('提示', errorTip);
								}
							});
						}
					}
				}
			},
			error : function() {
				doTheAlert('提示', errorTip);
			}
		});
	}
	
}

// 将勾选的关键字回显至case input界面中
function echoCaseInpt(idArray){
	if (idArray.length < 1) {
		return false;
	}
	$('#caseKeyWords').empty();
	$.ajax({
		type : "post",
		global : false,
		async : true,
		url : CONTEXT_PATH + '/base/baseKeywords/queryByIds',
		data : {
			idArray : idArray
		},
		dataType : "json",
		success : function(data) {
			if (data != null) {
				if (typeof (data.msgData) != "undefined"
					&& data.msgData != ""
						&& typeof (data.msgDataIds) != "undefined"
							&& data.msgDataIds != "") {
					var keywordsNames = data.msgData;
					var keywordsIds = data.msgDataIds;
					//console.log("echoKeywords msgData:" + keywordsNames);
					//console.log("echoKeywords msgDataIds:" + keywordsIds);
					closePage();
					for (var i = 0; i < keywordsNames.length; i++) {
						$('#caseKeyWords').append("<span class='label' id='" + keywordsIds[i] + "'>" + keywordsNames[i]
						+ "<i class='glyphicon glyphicon-remove' onclick='delCaseKeywords(this)'" +
						" onmouseover=this.style.cursor='pointer'></i></span>&nbsp;");
					}
					removeKeywordsCK();
				}
			}
		},
		error : function() {
			doTheAlert('提示', errorTip);
		}
	});
}

function queryKeywords(){
	removeKeywordsCK();
}

function removeKeywordsCK(){
	caseKeyWord_list_inputCheck.removeAttr("checked"); 
	caseKeyWord_list_theadCheckbox.removeAttr("checked");
	caseKeyWord_list_inputCheck.unbind('click');
	caseKeyWord_checkValue = [];
	keywordsList = "";
}

function delCaseKeywords(t){
	$(t).closest("span").remove();
	removeKeywordsCK();
}


function openCaseKeywords(caseId){
	//console.log(caseId);
	removeKeywordsCK();
	var sysId = $('#sysId').val();
	
	window.open(CONTEXT_PATH + '/base/baseKeywords/caseKeywords?caseId='+caseId+'&sysId='+sysId,{width:'50%'});
}
