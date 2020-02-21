Observation.baseSystemFunction_list_div = function(container) {
	var obj = $('#baseSystemFunction_list_div', container);
	obj.each(function() {
		obj.find('a').click(function(e) {
							$('#baseSystemFunctionBaseTree').find('li').removeClass('active');
							var li = $(e.target).closest('li');
							li.addClass('active');
						});
		//实现easyUI布局效果
		$('#baseSystemFunctionLayout').layout();
	});
}

var case_inputCheckbox;
var case_theadCheckbox;
var case_checkValue = [];
var case_checkFlag = false;
//加载或刷新list页面中的table时调用此方法
Observation.caseManagerVo_form = function(container){
	//获取list table页面所有的checkbox
	case_inputCheckbox = $("#baseSystemFunction_form table tbody tr td").find('input[type="checkbox"]');
	case_theadCheckbox = $("form#baseSystemFunction_form table thead tr th").find('input[type="checkbox"]');
	//全选按钮事件
	case_theadCheckbox.click(function(){
		if ($(this).is(":checked")) {	//判断全选按钮是否选中
			case_inputCheckbox.each(function(){
				var lICheckboxVals = $(this).val();
				if (case_checkValue.length < 1) {
					case_checkValue.push(lICheckboxVals);
				}else{
					$(case_checkValue).each(function(index,attrValue){	//如果数组中没有当前选中的复选框的value  将其放入数组中
						if (attrValue == lICheckboxVals) {
							return false;
						}
						if (attrValue != lICheckboxVals && case_checkValue.length-1 == index) {
							case_checkValue.push(lICheckboxVals);
						}
					});
				}
			});
			console.log("case_checkValue true:"+case_checkValue);
		}else{
			case_inputCheckbox.each(function(){
				var lICheckboxVals = $(this).val();
				$(case_checkValue).each(function(index,attrValue){	//取消全选时移除数组中对应的元素
					if (attrValue == lICheckboxVals) {
						case_checkValue.splice(index,1);
					}
				});
			});
			console.log("case_checkValue false:"+case_checkValue);
		}
	});
	//列表中的checkbox事件
	case_inputCheckbox.click(function(){	
		var thisCkboxValue = $(this).val();
		if ($(this).is(":checked")) {		//判断复选框是否选中
			if (case_checkValue.length < 1) {
				case_checkValue.push(thisCkboxValue);
			}else{
				$(case_checkValue).each(function(index,attrValue){	//如果数组中没有当前选中的复选框的value  将其放入数组中
					if (attrValue != thisCkboxValue && case_checkValue.length-1 == index) {
						case_checkValue.push(thisCkboxValue);
					}
				});
			}
		}else{
			$(case_checkValue).each(function(index,attrValue){	//取消选中复选框时判断当前复选框value是否存在数组中 存在时移除数组中对应的元素
				if (attrValue == thisCkboxValue) {
					case_checkValue.splice(index,1);
				}
			});
		}
		//console.log("case_inputCheckbox.click case_checkValue:"+case_checkValue);
	});
	
	// 切换下一页时匹配cookie中的数据	将checkbox设置为选中
	 
	$(case_checkValue).each(function(index,attrValue){
		console.log("checkbox waimian thisAttr:"+attrValue);
		case_inputCheckbox.each(function(){
			var checkboxValue = $(this).val();
			if (attrValue == checkboxValue) {
				$(this).attr("checked","true");
				$(this).parent().parent().addClass("selected");
			}
		});
	});
	
	//判断列表中的checkbox是否全部选中
	case_inputCheckbox.each(function(){
		if (!$(this).is(":checked")) {
			return case_checkFlag = false;
		}
		case_checkFlag = true;
	});
	
	if (case_checkFlag) {
		case_theadCheckbox.attr("checked",true);
	}
}

/**
 * 跳转模块检索功能点选择界面
 * @param sysId
 * @returns
 */
function gotoSearchSystemFunctionPage(searchType){
	removeBaseSysFun();
	var sysId = $('#sysId').val();
	if(null == sysId || typeof(sysId) == 'undefined' || '' == sysId){
		jAlert('请先选择系统', '提示');
		return;
	}
	window.open(CONTEXT_PATH + '/base/baseSystemFunction?sysId=' + sysId + '&searchType=' + searchType,{width:'65%'});
}

/**
 * 设置参数
 * @param systemId
 * @param moduleId
 * @param subModuleId
 * @returns
 */
function setParam(systemId,moduleId,subModuleId){
	removeBaseSysFun();
	$('#systemId_query').val('');
	$('#moduleId_query').val('');
	$('#subModuleId_query').val('');
	$('#systemId_query').val(systemId);
	$('#moduleId_query').val(moduleId);
	$('#subModuleId_query').val(subModuleId);
}

/**
 * 提交查询
 * @returns
 */
function queryBaseSystemFunctionByFunctionName(){
	$('#queryBaseSystemFunctionForm').submit();
}

/**
 * 刷新
 * @returns
 */
function flushBaseSystemFunctionList(){
	$('#baseSystemFunction_form').submit();
}

/**
 * 检索
 * @returns
 */
function searchSystemFunction(){
	var searchType = $('#searchType_query').val();
	var systemId = $('#systemId_query').val();
	var moduleId = $('#moduleId_query').val();
	var subModuleId = $('#subModuleId_query').val();
	var functionIds = case_checkValue;
	/*var length = $("#baseSystemFunction_form table tbody tr").length;
	var selectLength = 0;// 总行数
	var selectedRow = 0;// 被选中行的下标
	for (var i = 0; i < length; i++) {
		var select = $("#baseSystemFunction_form table tbody").find("tr").eq(i).attr("class");
		if (select == "selected") {
			var functionId = $("#baseSystemFunction_form table tbody").find("tr").eq(i).find("td").eq(1).find("input").val();
			functionIds = functionIds + functionId;
			selectedRow = i;
			selectLength++;
		}
	}*/
	if('' != functionIds){
		if(null == systemId || '' == systemId){
			jAlert('系统内部编号为空', '提示');
			return false;
		}
		if(null == moduleId || '' == moduleId){
			jAlert('请先选择系统模块', '提示');
			return false;
		}
		if(null == subModuleId || '' == subModuleId){
			jAlert('请先选择系统子模块', '提示');
			return false;
		}
	}
	console.log("functionIds.length:"+functionIds.length);
	if (functionIds.length > 1) {
		jAlert('最多只能勾选一个功能点进行检索!', '提示');
		return false;
	} else{
		if('caseManager' == searchType){
			// 测试管理
			if (functionIds.length != 1) {
				jAlert('请勾选一个功能点进行检索!', '提示');
				return false;
			}
		}
	}
	$('#systemId').val(systemId);
	$('#moduleId').val(moduleId);
	$('#subModuleId').val(subModuleId);
	$('#functionIds').val(functionIds);
	closePage();
	console.log(functionIds);
	$('#queryCaseForm').submit();
	$('#systemId').val('');
	$('#moduleId').val('');
	$('#subModuleId').val('');
	$('#functionIds').val('');
}

function removeBaseSysFun(){
	case_inputCheckbox.removeAttr("checked"); 
	case_theadCheckbox.removeAttr("checked");
	case_inputCheckbox.unbind('click');
	case_checkValue = [];
}