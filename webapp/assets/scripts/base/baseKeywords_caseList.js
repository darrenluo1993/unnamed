var caseList_inputCheck;
var caseList_theadCheckbox;
var caseList_checkValue = [];
var caseList_checkFlag = false;

// 加载或刷新list页面中的table时调用此方法
Observation.caseList_form_list = function(container) {
	// 获取list table页面所有的checkbox
	caseList_inputCheck = $("form#caseList_form_list table tbody tr td").find('input[type="checkbox"]');
	caseList_theadCheckbox = $("form#caseList_form_list table thead tr th").find('input[type="checkbox"]');
	
	// 全选按钮事件
	caseList_theadCheckbox.click(function() {
		if ($(this).is(":checked")) { // 判断全选按钮是否选中
			caseList_inputCheck.each(function() {
			var lICheckboxVals = $(this).val();
			if (caseList_checkValue.length < 1) {
				caseList_checkValue.push(lICheckboxVals);
			} else {$(caseList_checkValue).each(
				function(index, attrValue) { // 如果数组中没有当前选中的复选框的value
												// 将其放入数组中
					if (attrValue == lICheckboxVals) {
						return false;
					}
					if (attrValue != lICheckboxVals&& caseList_checkValue.length - 1 == index) {
						caseList_checkValue.push(lICheckboxVals);
					}
				});
			}
		});
			// console.log("caseList_checkValue
			// true:"+caseList_checkValue);
		} else {
			caseList_inputCheck.each(function() {
				var lICheckboxVals = $(this).val();
				$(caseList_checkValue).each(function(index, attrValue) { // 取消全选时移除数组中对应的元素
					if (attrValue == lICheckboxVals) {
						caseList_checkValue.splice(
								index, 1);
					}
				});
			});
			// console.log("caseList_checkValue
			// false:"+caseList_checkValue);
		}
	});
	// 列表中的checkbox事件
	caseList_inputCheck.click(function() {
		var thisCkboxValue = $(this).val();
		if ($(this).is(":checked")) { // 判断复选框是否选中
			if (caseList_checkValue.length < 1) {
				caseList_checkValue.push(thisCkboxValue);
			} else {
				$(caseList_checkValue).each(
				function(index, attrValue) { // 如果数组中没有当前选中的复选框的value
												// 将其放入数组中
					if (attrValue != thisCkboxValue
							&& caseList_checkValue.length - 1 == index) {
						caseList_checkValue
								.push(thisCkboxValue);
					}
				});
			}
		} else {
			$(caseList_checkValue).each(function(index, attrValue) { // 取消选中复选框时判断当前复选框value是否存在数组中
																		// 存在时移除数组中对应的元素
				if (attrValue == thisCkboxValue) {
					caseList_checkValue.splice(index, 1);
				}
			});
		}
		// console.log("caseList_inputCheck.click
		// caseList_checkValue:"+caseList_checkValue);
	});

	// 切换下一页时匹配cookie中的数据 将checkbox设置为选中

	$(caseList_checkValue).each(function(index, attrValue) {
		console.log("checkbox waimian thisAttr:" + attrValue);
		caseList_inputCheck.each(function() {
			var checkboxValue = $(this).val();
			if (attrValue == checkboxValue) {
				$(this).attr("checked", "true");
				$(this).parent().parent().addClass("selected");
			}
		});
	});

	// 判断列表中的checkbox是否全部选中
	caseList_inputCheck.each(function() {
		if (!$(this).is(":checked")) {
			return caseList_checkFlag = false;
		}
		caseList_checkFlag = true;
	});

	if (caseList_checkFlag) {
		caseList_theadCheckbox.attr("checked", true);
	}
}


function removeCkw(){
	caseList_inputCheck.removeAttr("checked"); 
	caseList_theadCheckbox.removeAttr("checked");
	caseList_inputCheck.unbind('click');
	caseList_checkValue = [];
}

function subCaseList(){
	//var caseKeywordsIds = $('#ckwListIds').val(caseList_checkValue);
	var form = $("form#queryCaseForm");
	form.attr("action", CONTEXT_PATH + "/casus/caseManagerVo/queryByKeyWord?caseListKeywordsIds="+caseList_checkValue);
	form.submit();
	form.attr("action",CONTEXT_PATH + "/casus/caseManagerVo/queryByKeyWord");
	removeCkw();
	closePage();
}

