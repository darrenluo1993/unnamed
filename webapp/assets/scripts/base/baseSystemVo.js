$(document).ready(function(){
	
});
var protocolName;//协议名称
var ProtocolVal;//协议ID
var systemCode;//系统编码
var protocolFlag = false;
var sysCode = true;
var changeInputFlag = false;

function changeInput(){
	changeInputFlag = true;
}

//配置协议环境关闭按钮事件
function closeProEnv(){
	var form = "baseSystemVo_form_editEnv";
	closeBtnEvent(form);
}

//新增/编辑关闭按钮事件
function closeSyProsPage(){
	var form = "baseSystemVo_form_input";
	closeBtnEvent(form);
}

//点击关闭按钮时取消提示
function closeBtnEvent(form){
	$("#"+form).removeClass("dirty");
	closePage();
}

//删除环境信息
function delSysEnv(envId,sysId){
	console.log("envId:"+envId+" sysId:"+sysId);
	$.messager.confirm("警告","确认要删除该环境？",function(isDelEnv){
		if(isDelEnv){
			$.ajax({
				type : "post",
				global : false,
				async : true,
				url : CONTEXT_PATH + '/base/baseSystemVo/deleteSysEnv',
				data:{
					envId : envId,
					sysId : sysId
				},
				dataType : "json",
				success : function(data) {
					if (data != null) {
						if(typeof(data.msg) != "undefined"){
							$.messager.alert('提示', data.msg, '', function(r){
								if(r){
									$('#query_baseSystemVo').click();
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

//校验系统编码
function verSystemCode(){
	var systemCode = $('#baseSystemVo_systemCode_input').val();
	if(systemCode == ""){
		Message.showFieldError($('#baseSystemVo_systemCode_input'), null, "请输入字典名称");
		return false;
	}else{
		$.ajax({
			type : "post",
			global : false,
			async : true,
			url : CONTEXT_PATH + '/base/baseSystemVo/verSystemCode',
			data:{
				systemCode : systemCode
		  	},
			dataType : "json",
			success : function(data) {
			 	if (data != null) {
					if(typeof(data.msg) != "undefined" ){
						if(data.flag){
							//Message.showFieldError($('#baseSystemVo_systemCode_input'), null, data.msg);
							return sysCode = data.flag;
						}
						Message.showFieldError($('#baseSystemVo_systemCode_input'), null, data.msg);
						return sysCode = data.flag;
					}
				}
			},
			error:function(){
				doTheAlert('提示', errorTip);
			}
		});	
			
	}
}

//新建协议别名
function newProtocolAlias(){
	ProtocolVal = $('#multiselect_left option:selected').val();
	protocolName = $('#multiselect_left option:selected').text();
	systemCode = $('#baseSystemVo_systemCode_input').val();
	var actionUrl = $('#getActionBaseUrl').val();
	if (systemCode == '' || systemCode == 'default') {
		jAlert('请先输入系统编码！', '提示');
		return false;
	}
	if (protocolName == '' || protocolName == 'default') {
		jAlert('请先选择协议！', '提示');
		return false;
	}
	window.open(actionUrl+'/newAlias?protocolName='+protocolName,{width:'40%',height:'20%'});
}

// 校验协议别名是否存在
function verProtocolAlias(){
	var objV = $('#multiselect_right option');
	var protocolAlias = $('#protocolAlias').val();
	var supportProtocol = protocolName+"_"+protocolAlias;
	if(protocolAlias != ""){
		if(objV.length > 0){
			for (var i = 0; i < objV.length; i++){
				if(supportProtocol == objV[i].text){
					Message.showFieldError($('#protocolAlias'), null, "协议别名已存在，请重新输入");
					return protocolFlag =  false;
				}
			}
			return protocolFlag = true;
		}else{
			return protocolFlag = true;
		}
	}else{
		Message.showFieldError($('#protocolAlias'), null, "请输入别名！");
		return protocolFlag =  false;
	}
	
}

//新建协议别名保存按钮
function protocolAliasSave(){
	var protocolAlias = $('#protocolAlias').val();
	var supportProtocol = protocolName+"_"+protocolAlias;
	if(protocolAlias == ""){
		Message.showFieldError($('#protocolAlias'), null, "请输入别名！");
		return false;
	}
	if(protocolFlag){
		$("#multiselect_right").append("<option id=' ' value='"+ProtocolVal+"'>"+supportProtocol+"</option>");
		closePage();
	}
}

//移除支持协议
function removeProtocolAlias(){
	var delBsId;
	var bsIdArray = $('#bsIdArray').val();
	var mtSelected = $('#multiselect_right').find("option:selected");
	$.messager.confirm("警告","确认要移除此条协议吗？",function(f){
		if(f){
			delBsId = bsIdArray + "#" + mtSelected.attr("id");
			$('#bsIdArray').val(delBsId);
			mtSelected.remove();
		}
	})
}

function RequestSysEnvPro() {
	this.envId;
	this.sysId = $('#systemId').val();
	this.rsplList = [];
}

//保存协议环境
function saveProtocolEnv(){
	var requestSysEnvPro = new RequestSysEnvPro();
	requestSysEnvPro.envId = proAttrEnvId;
	console.log("保存方法中的:"+requestSysEnvPro.envId);
	var attr = [];
	var tabs = $("[tab_type='data']");//获取所有tabs对象
	var sysId = $('#systemId').val();//系统ID
	//var protocolId;//协议ID
	var bsProtocolId = "";//系统协议表ID
	for (var i = 0; i < tabs.length; i++){
		var firstTd = $(tabs[i]).find("td input[type='text']");
		var sysProIdAttr = {};
		//判断tab对象是否为空
		if(firstTd.length<1){
			continue;
		}
		console.log("firstTd.length:"+firstTd.length);
		//protocolId = tabs[i].proId;
		bsProtocolId = tabs[i].id + "#" +bsProtocolId;
		attr = [];
		for (var j = 0; j < firstTd.length; j++){
			var baseAttr = {};
			baseAttr.id = (firstTd[j].id).split("_")[1];
			baseAttr.defaultValue = firstTd[j].value;
			attr[j] = baseAttr;
		}
		console.log("attr.length:"+attr.length);
		sysProIdAttr.bsProtocolId = tabs[i].id;
		sysProIdAttr.baseAttrLbList = attr;
		requestSysEnvPro.rsplList.push(sysProIdAttr);
	}
	console.log("saveProtocolEnv:"+JSON.stringify(requestSysEnvPro));
	//requestSysEnvPro = {baseAttrLbList : attrs,envId : envId,sysId : sysId};
	$.ajax({
		type : "post",
		global : false,
		async : true,
		url : CONTEXT_PATH + '/base/baseSystemVo/saveProtocolEnv',
		data:{
			requestSysEnvPro : JSON.stringify(requestSysEnvPro),
		},
		dataType : "json",
		success : function(data) {
			console.log("proEnvSaveAjax-----"+data);
			if (data != null) {
				if(typeof(data['msg']) != "undefined"){
					$.messager.alert('提示', data['msg'], '', function(r){
						if(r){
							//$('#query_baseSystemVo').click();
							//closePage();
						}
					});
				}
				changeInputFlag = false;
			}
		},
		error:function(){
			doTheAlert('提示', errorTip);
		}
	});	
}

//新建协议环境保存按钮
function proEnvSave(){
	saveProtocolEnv();
	closePage();
	$('#query_baseSystemVo').click();
}

var proAttrEnvId;
Observation.baseSystemVo_form_editEnv = function(container) {
	proAttrEnvId = $('#baseSystemVo_envName_select option:selected').val();
	console.log("初始化proAttrEnvId:"+proAttrEnvId);
}

/*
 * 切换环境	如果页面input有变动 提示是否保存
 * $.messager.confirm('','',function(){}); 里面的内容还未执行完毕 也会直接执行后面的代码
 */
function proAttrByEnv(){
	//判断input是否有变动
	if (changeInputFlag) {
		$.messager.confirm('提示', "是否保存当前页面的内容?", function(isSave){
			if(isSave){
				//saveProtocolEnv();		//保存
			}
			loadProtocolAttrtab();	//刷新table
		});
	}else{
		loadProtocolAttrtab();
	}
}

//刷新配置协议环境table
function loadProtocolAttrtab(){
	var sysId = $('#systemId').val();//系统ID
	var bsProtocolId = "";//系统协议表ID
	var envId = $('#baseSystemVo_envName_select').find("option:selected").val();//获取当前选中环境ID
	console.log("envId:"+envId);
	var tabs = $("[tab_type='data']");//获取所有tabs对象
	for (var i = 0; i < tabs.length; i++){
		//获取tab中所有的Input对象  长度 < 0  说明tab中无数据 跳过此次循环
		var firstTd = $(tabs[i]).find("td input[type='text']");
		if(firstTd.length<1){
			continue;
		}
		bsProtocolId = tabs[i].id + "#" +bsProtocolId;
	}
	
	$.ajax({
		type : "post",
		global : false,
		async : true,
		url : CONTEXT_PATH + '/base/baseSystemVo/getAttrByEnvId',
		data:{
			envId : envId,
			sysId : sysId,
			bsProtocolId : bsProtocolId
		},
		dataType : "json",
		success : function(data) {
			if (data != null) {
				//获取后台传递过来的list对象
				var rsList = data['rsList'];
				for (var i = 0; i < rsList.length; i++){
					var bsProtocolId;
					var baseAttrLbList
					//获取协议属性ID 和协议属性List
					bsProtocolId = rsList[i].bsProtocolId;
					baseAttrLbList = rsList[i].baseAttrLbList;
					//alert("baseAttrLbList.length："+baseAttrLbList.length+" bsProtocolId:"+bsProtocolId);
					//遍历页面的table 获取tableId和table下面的所有的Input
					for (var j = 0; j < tabs.length; j++) {
						var tabId = tabs[j].id;
						var tabAllInput = $(tabs[j]).find("td input[type='text']");
						//alert("tab.id:"+tabs[j].id);
						//如果后台返回的协议属性id和tableId相等 且table的input大于0   将table中的值替换
						if (bsProtocolId == tabId && tabAllInput.length > 0) {
							//alert("后台传过来的ID:"+bsProtocolId);
							for (var k = 0; k < baseAttrLbList.length; k++) {
								var attrListId = baseAttrLbList[k].id;	//后台传过来的Id
								var attrListValue = baseAttrLbList[k].defaultValue;	//后台传过来的value
								//alert("后台传过来的Id:"+attrListId+" 后台传过来的val:"+attrListValue);
								//遍历table中的input  id相等 且attrListValue!= undefined 将后台传过来的值放入input中
								for (var l = 0; l < tabAllInput.length; l++) {
									var attrId = tabAllInput[l].id;
									var baseAttrId = (tabAllInput[l].id).split("_")[1];
									//var attrValue = tabAllInput[l].value;
									if (attrListId == baseAttrId) {
										if (attrListValue != undefined) {
											var la = $('#'+attrId).val();
											//alert("attrListValue:" + attrListValue+ " attrid.value:" + la);
											$('#'+attrId).val(attrListValue);
										}else{
											$('#'+attrId).val("");
										}
									}
									
								}
							}
						}
					}
				}
				proAttrEnvId = $('#baseSystemVo_envName_select').find("option:selected").val();
				changeInputFlag = false;
			}
		},
		error:function(){
			doTheAlert('提示', errorTip);
		}
		
	});
}

/*Observation.baseSystemVo_multiselect = function(container){
var obj = $('#baseSystemVo_form_input',container);
obj.each(function() {
	var form = this;
	form.onsuccess = function() {
		$('.ui-dialog-titlebar-close', $(form).closest('.ui-dialog')).click();
		$('#query_baseSystemVo').click();
	}
});
}*/

/*Observation.baseSystemVo_multiselect = function(container){
	var obj = $('#baseSystemVo_form_input',container);
	obj.each(function() {
		var envId = $("select#baseSystemVo_envName_input").val();
		$("input#baseSystemVo_envid_old").val(envId);
		$('#multiselect').multiselect();
		var form = this;
		form.onsuccess = function() {
			var sysId = $("input#baseSystemVo_id_input").val();
			if(sysId != null && typeof(sysId) != "undefined" && sysId != ''){
				$(form).removeClass("dirty");
				$('.ui-dialog-titlebar-close', $(form).closest('.ui-dialog')).click();
			}
			$('#query_baseSystemVo').click();
		}
	});
}

$(document).on('change', 'select#baseSystemVo_envName_input', function() {
	var envId = $(this).val();
	if(envId == ''){
		$.messager.alert("提示", "环境名称不能为空！");
		var oldEnvId = $("input#baseSystemVo_envid_old").val(); 
		$("select#baseSystemVo_envName_input").val(oldEnvId);
		return false;
	}
	$.messager.confirm("提示", "请确认是否已经保存！",function(f){
		if(f){
			$(".alert").remove();
			$("input#baseSystemVo_envid_old").val(envId);
			$("#multiselect_leftAll").click();
			optionToInput();
		}else{
			var oldEnvId = $("input#baseSystemVo_envid_old").val(); 
			$("select#baseSystemVo_envName_input").val(oldEnvId);
		}
	});	
});

$(document).on('click', '#multiselect_leftSelected', function() {
	$("table#table_baseAttr tbody.baseAttrDefult").show();
	$("table#table_baseAttr tbody.baseAttr_tbody").hide();
	var options = $("select#multiselect").children();
	for (var index = 0; index < options.length; index ++) {
		var option = options[index];
		$("table#table_baseAttr tbody#tbody_baseAttr_"+option.value).remove();
	}
});

$(document).on('click', '#multiselect_leftAll', function() {
	$("table#table_baseAttr tbody.baseAttr_tbody").remove();
	$("table#table_baseAttr tbody.baseAttrDefult").show();
});

$(document).on('dblclick', 'select#multiselect_to option', function(e) {
	e.preventDefault();
	showBaseAttr(this);
});

function showBaseAttr(obj){
	$("table#table_baseAttr tbody.baseAttrDefult").hide();
	$("table#table_baseAttr tbody.baseAttr_tbody").hide();
	var table = $("table#table_baseAttr tbody#tbody_baseAttr_" + obj.value);
	if(table.length > 0){
		table.show();
	}else{
		addBaseAttrTr(obj);	
	}
}*/

function addBaseAttrTr(obj){
	$.ajax({
		type : "post",
		global : false,
		url : CONTEXT_PATH + '/base/baseSystemVo/findBaseAttrList',
		data : {
			protocolId : obj.value
		},
		dataType : "json",
		success : function(data) {
	   	  if(data.length > 0){
	   	  	var trXh = document.getElementsByName('baseAttr_tr').length;
	   	  	var content = '<tbody id="tbody_baseAttr_' + obj.value + '" class="baseAttr_tbody">';
	   	  	for(var i = 0; i < data.length; i ++){
   	  			var object = data[i];
   	  			var defaultValue = object.defaultValue;
   	  			if(defaultValue == null){
   	  				defaultValue = "";
   	  			}
  				content = content + '<tr name="baseAttr_tr">' +
	  				'<input type="hidden" name="baseProtocolAttrVoList[' + trXh + '].protocolId" value="' + obj.value + '">' +
	  				'<input type="hidden" name="baseProtocolAttrVoList[' + trXh + '].attrId" value="' + object.id + '">' +
	  				'<td>' + object.attrDesc + '</td>' +
	  				'<td><input type="text" value="' + defaultValue + '" name="baseProtocolAttrVoList[' + trXh + '].attrValue" style="width: 91%;"></td></tr>';
	  			trXh ++;
	   	  	 }
	   	  	 content = content + "</tbody>";
	   	  	 $("table#table_baseAttr").append(content);
	   	  }
		},
		error : function(){
			doTheAlert('提示', errorTip);
		}
	});	
} 

function sumbitForm(){
	var options = $("select#multiselect_right").children();
	if($("select#multiselect_right").children().length == 0){
		$.messager.alert("提示", "请配置协议！");
		return false;
	}else{
		//optionToInput();
		//pxBaseAttrTr();
		var objV = $('#multiselect_right option');
		var value = "";
		var text = "";
		var bsProtocolIds="";
		var bsProtocolId = $('#multiselect_right option').attr("id");
		if (bsProtocolId == null || bsProtocolId == " " || typeof(bsProtocolId) == "undefined") {
			for(var i = 0; i < objV.length; i ++){
				value = objV[i].value + "#" + value;
				text = objV[i].text + "#" + text;
			}
		}else{
			for(var i = 0; i < objV.length; i ++){
				value = objV[i].value + "#" + value;
				text = objV[i].text + "#" + text;
				bsProtocolIds = objV[i].id + "#" + bsProtocolIds;
			}
			$("#bsProtocolIds").val(bsProtocolIds);
		}
		
		$('#protocolIds').val(value);
		$('#sysProtocolNames').val(text);
		var baseSystemVo_systemCode_input = $('#baseSystemVo_systemCode_input').val();
		var baseSystemVo_systemName_input = $('#baseSystemVo_systemName_input').val();
		if(baseSystemVo_systemCode_input == '' || baseSystemVo_systemCode_input == null || 
				baseSystemVo_systemName_input == '' || baseSystemVo_systemName_input == null){
			$.messager.alert('提示', '必填项不能为空', '',function(r){
			});
			return false;
		}
		var flagSystemCode = true;
		if (!sysCode) {
			//判断系统编码
			flagSystemCode = verSystemCode();
		}
		//判断协议别名
		var flagAlias = verProtocolAlias();
		if(flagSystemCode && flagAlias){
			$("form#baseSystemVo_form_input").submit();
			$.messager.alert('提示', '保存成功', '',function(r){
				if (r) {
					var form = "baseSystemVo_form_input";
					closeBtnEvent(form);
					$('#query_baseSystemVo').click();
				}
			});
		}else{
			$.messager.alert('提示', '保存失败', '',function(r){
			});
		}
	}
}

function optionToInput(){
	var options = $("select#multiselect_right").children();
	$("div#multiselect_to_input").children().remove();
	for (var index = 0; index < options.length; index ++) {
		var option = options[index];
		var content = '<input type="hidden" name="baseProtocolList['+index+'].id" value="'+option.value+'">' +
			'<input type="hidden" name="baseProtocolList['+index+'].protocolName" value="'+option.innerHTML+'">';
		$("div#multiselect_to_input").append(content);
	}
}

function pxBaseAttrTr(){
	var tr = document.getElementsByName('baseAttr_tr');
	if(tr != null && typeof(tr) != "undefined" && tr.length > 0){
		for (var index = 0; index < tr.length; index++) {
			tr[index].children[0].name = "baseProtocolAttrVoList[" + index + "].protocolId";
			tr[index].children[1].name = "baseProtocolAttrVoList[" + index + "].attrId";
			tr[index].children[3].firstElementChild.name = "baseProtocolAttrVoList[" + index + "].attrValue";
		}
	}
}

function deleteBaseSystemVo(){
	var objV = $("form#baseSystemVo_info_list table tbody tr td").find('input[type="checkbox"]');
	var value = "";
	for(var i = 0; i < objV.length; i ++){
		if(objV[i].checked == true){
			value = objV[i].value + "#" + value;
		}
	}
	if(value == ""){
		$.messager.alert('提示', "没有选中");
		return false;
	}else{
		$.messager.confirm("警告","此操作会将选中系统下所有数据删除（包括创建的案例、测试计划等），确认要删除这些记录吗？",function(f){
			if(f){
				$.ajax({
					type : "post",
					global : false,
					async : true,
					url : CONTEXT_PATH + '/base/baseSystemVo/deleteBaseSystemVo',
					data:{
						sysId : value
				  	},
					dataType : "json",
					success : function(data) {
					 	if (data != null) {
							if(typeof(data['RESULT']) != "undefined"){
								$.messager.alert('提示', data['RESULT'], '', function(r){
									if(r){
										$('#query_baseSystemVo').click();
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

/**
 * 跳转系统概况界面
 * @returns
 */
function showSystemOverview(envId,sysId){
	window.open(CONTEXT_PATH + '/plan/testPlan/showSystemOverview?sysId='+sysId+'&envId='+envId,{width:'60%'});
}

/**
 * 系统概况查询
 * @returns
 */
function queryOverviewButton(){
	$('#testPlan_overview_query').submit();
}

/**
 * 系统概况重置
 * @returns
 */
function resetOverviewButton(){
	$('#overviewPlanName').val('');
	$('#overviewProcessMode').get(0).selectedIndex = 0;
	$('#overviewProcessState').get(0).selectedIndex = 0;
}
