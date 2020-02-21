var simpleCreatesimpleCreateCaseKeyWord_list_inputCheck;
var simpleCreateCaseKeyWord_list_theadCheckbox;
var simpleCreateCaseKeyWord_checkValue = [];
var simpleCreateCaseKeyWord_checkFlag = false;
var simpleCreateKeywordsList = "";
//var simpleCreateCaseKeyWord_list_inputCheck;
//var simpleCreateCaseKeyWord_list_theadCheckbox;
//var simpleCreateCaseKeyWord_checkValue = [];
//var simpleCreateCaseKeyWord_checkFlag = false;
//var simpleCreateKeywordsList = "";


// 加载或刷新list页面中的table时调用此方法
Observation.caseKeywordsSimpleCreate_form_list = function(container) {
	// 获取list table页面所有的checkbox
	simpleCreateCaseKeyWord_list_inputCheck = $("form#caseKeywordsSimpleCreate_form_list table tbody tr td").find('input[type="checkbox"]');
	simpleCreateCaseKeyWord_list_theadCheckbox = $("form#caseKeywordsSimpleCreate_form_list table thead tr th").find('input[type="checkbox"]');
	//console.log("simpleCreateCaseKeyWord_list_inputCheck.length :"+simpleCreateCaseKeyWord_list_inputCheck.length);
	//var simpleCreateKeywordsList = $('#simpleCreateKeywordsList').val();
	//var cdId = $('#caseDetailId').val();
	//console.log("simpleCreateKeywordsList:" + simpleCreateKeywordsList);
	/*if ('' != cdId && null != cdId) {
		if ('undefined' != typeof(simpleCreateKeywordsList) && '' != simpleCreateKeywordsList) {
			var keywords = simpleCreateKeywordsList.split(",");
			for (var i = 0; i < keywords.length-1; i++) {
				simpleCreateCaseKeyWord_checkValue.push(keywords[i]);
			}
		}
	}*/
	var caseSpan = $('#caseKeyWords span');
//	console.log("caseSpan:"+caseSpan.length);
	if (simpleCreateCaseKeyWord_checkValue.length < 1 && caseSpan.length > 0) {
//		console.log("simpleCreateCaseKeyWord_checkValue:"+simpleCreateCaseKeyWord_checkValue);
		//console.log("tiantiantian");
		caseSpan.each(function(){
			simpleCreateCaseKeyWord_checkValue.push($(this).attr("id"));
		});
	}
//	console.log("simpleCreateCaseKeyWord_checkValue caseSpan:"+simpleCreateCaseKeyWord_checkValue);
//	// 点击关闭按钮时 清空数组中的内容
	$('.ui-dialog-titlebar-close').click(function(){
		//console.log('关闭');
		removeKeywordsCK2();
		//simpleCreateCaseKeyWord_checkValue = [];
	});
	// 全选按钮事件
	simpleCreateCaseKeyWord_list_theadCheckbox.click(function() {
		//console.log("方法中simpleCreateCaseKeyWord_list_inputCheck.length :"+simpleCreateCaseKeyWord_list_inputCheck.length);
		//console.log("进去全选事件方法");
		if ($(this).is(":checked")) { // 判断全选按钮是否选中
			//console.log("simpleCreateCaseKeyWord_list_inputCheck.length :"+simpleCreateCaseKeyWord_list_inputCheck.length);
			simpleCreateCaseKeyWord_list_inputCheck.each(function() {
			var lICheckboxVals = $(this).val();
			if (simpleCreateCaseKeyWord_checkValue.length < 1) {
				simpleCreateCaseKeyWord_checkValue.push(lICheckboxVals);
			} else {$(simpleCreateCaseKeyWord_checkValue).each(
				function(index, attrValue) { // 如果数组中没有当前选中的复选框的value
												// 将其放入数组中
					if (attrValue == lICheckboxVals) {
						return false;
					}
					if (attrValue != lICheckboxVals&& simpleCreateCaseKeyWord_checkValue.length - 1 == index) {
						simpleCreateCaseKeyWord_checkValue.push(lICheckboxVals);
					}
				});
			}
		});
			// console.log("simpleCreateCaseKeyWord_checkValue
			// true:"+simpleCreateCaseKeyWord_checkValue);
		} else {//说明当前操作是取消所有选中
			//console.log("simpleCreateCaseKeyWord_list_inputCheck.length :"+simpleCreateCaseKeyWord_list_inputCheck.length);
			simpleCreateCaseKeyWord_list_inputCheck.each(function() {
				var lICheckboxVals = $(this).val();
				$(simpleCreateCaseKeyWord_checkValue).each(function(index, attrValue) { // 取消全选时移除数组中对应的元素
					if (attrValue == lICheckboxVals) {
						simpleCreateCaseKeyWord_checkValue.splice(
								index, 1);
					}
				});
				//console.log("simpleCreateCaseKeyWord_checkValue false:"+simpleCreateCaseKeyWord_checkValue);
			});
		}
	});
	// 列表中的checkbox事件
	simpleCreateCaseKeyWord_list_inputCheck.click(function() {
		var thisCkboxValue = $(this).val();
		if ($(this).is(":checked")) { // 判断复选框是否选中
			if (simpleCreateCaseKeyWord_checkValue.length < 1) {
				simpleCreateCaseKeyWord_checkValue.push(thisCkboxValue);
			} else {
				$(simpleCreateCaseKeyWord_checkValue).each(
				function(index, attrValue) { // 如果数组中没有当前选中的复选框的value
												// 将其放入数组中
					if (attrValue != thisCkboxValue
							&& simpleCreateCaseKeyWord_checkValue.length - 1 == index) {
						simpleCreateCaseKeyWord_checkValue
								.push(thisCkboxValue);
					}
				});
			}
		} else {
			$(simpleCreateCaseKeyWord_checkValue).each(function(index, attrValue) { // 取消选中复选框时判断当前复选框value是否存在数组中
																		// 存在时移除数组中对应的元素
				if (attrValue == thisCkboxValue) {
					simpleCreateCaseKeyWord_checkValue.splice(index, 1);
				}
			});
		}
		// console.log("simpleCreateCaseKeyWord_list_inputCheck.click
		// simpleCreateCaseKeyWord_checkValue:"+simpleCreateCaseKeyWord_checkValue);
	});

	// 切换下一页时匹配cookie中的数据 将checkbox设置为选中

	$(simpleCreateCaseKeyWord_checkValue).each(function(index, attrValue) {
//		console.log("checkbox waimian thisAttr:" + attrValue);
		simpleCreateCaseKeyWord_list_inputCheck.each(function() {
			var checkboxValue = $(this).val();
			if (attrValue == checkboxValue) {
				$(this).attr("checked", "true");
				$(this).prop("checked",true);
				$(this).parent().parent().addClass("selected");
			}
		});
	});

	// 判断列表中的checkbox是否全部选中
	simpleCreateCaseKeyWord_list_inputCheck.each(function() {
		if (!$(this).is(":checked")) {
			return simpleCreateCaseKeyWord_checkFlag = false;
		}
		simpleCreateCaseKeyWord_checkFlag = true;
	});

	if (simpleCreateCaseKeyWord_checkFlag) {
		simpleCreateCaseKeyWord_list_theadCheckbox.prop("checked", true);
		simpleCreateCaseKeyWord_list_theadCheckbox.attr("checked", true);
	}
}

function echoKeywords2() {
	var sysId = $('#sysId').val();
	var caseKeywordName = $('#query_caseKeywordName').val();
	var caseKeywordsId = "";
	var checkKeywords = false;
	if (typeof (simpleCreateCaseKeyWord_checkValue) == 'undefined') {
		return false;
	}
	if (simpleCreateCaseKeyWord_checkValue.length < 1) {
		closePage();
		$('#caseKeyWords').empty();
		removeKeywordsCK2();
		return;
	}
	if (simpleCreateCaseKeyWord_checkValue.length > 6) {
		jAlert("标签数量不能大于6个！","提示");
		return false;
	}
	// 将选中的关键字回显至input界面
	echoCaseInpt2(simpleCreateCaseKeyWord_checkValue);
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
											//console.log("simpleCreateCaseKeyWord_checkValue length" + simpleCreateCaseKeyWord_checkValue.length);
											if (simpleCreateCaseKeyWord_checkValue.length < 1) {
												closePage();
												$('#caseKeyWords').empty();
											}
											$('#caseKeyWords').append("<span class='label' id='" + caseKeywordsId + "'>"
													+ caseKeywordName
													+ "<i class='glyphicon glyphicon-remove' " +
													"onclick='delCaseKeywords2(this)' " +
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
function echoCaseInpt2(idArray){
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
						+ "<i class='glyphicon glyphicon-remove' onclick='delCaseKeywords2(this)'" +
						" onmouseover=this.style.cursor='pointer'></i></span>&nbsp;");
					}
					removeKeywordsCK2();
				}
			}
		},
		error : function() {
			doTheAlert('提示', errorTip);
		}
	});
}

function queryKeywords2(){
	removeKeywordsCK2();
}

function removeKeywordsCK2(){
	simpleCreateCaseKeyWord_list_inputCheck.removeAttr("checked"); 
	simpleCreateCaseKeyWord_list_theadCheckbox.removeAttr("checked");
	simpleCreateCaseKeyWord_list_inputCheck.unbind('click');
	simpleCreateCaseKeyWord_checkValue = [];
	simpleCreateKeywordsList = "";
}

function delCaseKeywords2(t){
	$(t).closest("span").remove();
	removeKeywordsCK2();
}


function openCaseKeywords2(caseId){
	//console.log(caseId);
	removeKeywordsCK2();
	var sysId = $('#sysId').val();
	
	window.open(CONTEXT_PATH + '/base/baseKeywords/caseKeywords?caseId='+caseId+'&sysId='+sysId,{width:'50%'});
}

