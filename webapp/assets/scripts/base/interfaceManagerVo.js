$(document).ready(function(){
	$(document).on('click', '#interfaceManager_sure_copy', function() {
		$("#interfaceManager_sure_copy").button('loading');
		var interCode = $("#interfaceManager_interCode_copy").val();
		var interfaceManagerId = $("#interfaceManager_id_copy").val();
		$.ajax({
			type : "post",
			global : false,
			async : true,
			url : CONTEXT_PATH + '/base/interfaceManagerVo/copyInterfaceManagerVo',
			data:{
				interfaceManagerId : interfaceManagerId,
				interCode : interCode
		  	},
			dataType : "json",
			success : function(data) {
			 	if (data != null && typeof(data['RESULT']) != "undefined" && data['RESULT'] != "") {
					var flag = data['RESULT'];
					if(flag == 'true'){
						$.messager.alert('提示', "复制成功！");
						closeCopyInterManger();
						$('#query_interfaceManagerVo').click();
					}else{
						$.messager.alert('提示', flag);
					}
				}else{
					$.messager.alert('提示', "系统异常，请刷新后重试！");
				}
				 $("#interfaceManager_sure_copy").button('reset');
			},
			error:function(){
				doTheAlert('提示', errorTip);
			}
		});	
	});
});

/**
 * 数据字典
 */
var dictionary;

Observation.interfaceManagerVo_save = function(container){
	var obj = $('#interfaceManagerVo_form_input',container);
	obj.each(function() {
		var form = this;
		form.onsuccess = function() {
			var interId = $("input#interfaceManagerVo_id_input").val();
			if(interId != null && typeof(interId) != "undefined" && interId != ''){
				$(form).removeClass("dirty");
			}
			$('.ui-dialog-titlebar-close', $(form).closest('.ui-dialog')).click();
			$('#query_interfaceManagerVo').click();
		}
		//校验JSON/XML粘贴报文字段合法性
		$("#reqCopyText").change(function(){
			var reqCopyText = $('#reqCopyText').val();
			var type = $('#interfaceManagerVo_msgTypeId_input').val();
			checkReqRespText(reqCopyText, type,"req");
		});
		$("#respCopyText").change(function(){
			var respCopyText = $('#respCopyText').val();
			var type = $('#interfaceManagerVo_msgTypeId_input').val();
			checkReqRespText(respCopyText, type,"resp");
		});
		// 加载该页面所用到的数据字典
		// fieldType 数据类型，fieldType2 字段类型，listValueType 集合值存放类型
		var dictionaryName = new Array('fieldType','fieldType2','listValueType');
		dictionary = createDictionaryMap(dictionaryName);
	});
}

var basefieldsloader = function(param,success,error){
	var q = param.q || '';
	if (q.length == 0){return false}
	var sysId = $("#interfaceManagerVo_sysId_input").val();
	$.ajax({
		url: CONTEXT_PATH + '/base/interfaceManagerVo/showBaseFields',
		dataType: 'json',
        data: {
            inputValue: q,
            sysId: sysId
        },
		success: function(data){
       		if(data == null || typeof(data) == "undefined"){
   	  			$.messager.alert('提示','系统超时，请刷新后重试');
	   	  	}else{
	   	  		var flag = data['FLAG'];
	   	  		if(flag == 'true'){
		   	  		var items = $.map(data['RESULT'], function(item, index){
		   	  			var name = "";
		   	  			var fieldDesc = item.fieldDesc;
		   	  			if(fieldDesc == null || typeof(fieldDesc) == "undefined"){
		   	  				name = item.fieldName;
		   	  			}else{
		   	  				name = item.fieldName+"-"+item.fieldDesc;
		   	  			}
						return {
							id: item.id,
							name: name
						};
					});
					success(items);
	   	  		}else{
	   	  			$.messager.alert('提示', flag);
	   	  		}
	   	  	}
		},
        error: function(){
			error.apply(this, arguments);
		}
	});
}

function clickInterfaceMangerNode(code, name){
	if(code != null && typeof(code) != "undefined" && code != ''){
		$('#baseSystem_systemCode_tree').val(code);
		$('#baseSystem_systemName_tree').val(name);
		var formQuery = $("form#interfaceManagerVo_form_check_list");
//		var form = $("form#interfaceManagerVo_info_list");
		var formCriteria = $("form.criteria");
//		var baseAction = formCriteria.attr("action");
//		var formAction = "";
		if(code == 'all'){
//			formAction = baseAction;
			formQuery.find('input[name="systemCode"]').val("");
			formQuery.find('input[name="systemCode"]').removeAttr("readonly");
			formQuery.find('input[name="systemName"]').val("");
			formQuery.find('input[name="systemName"]').removeAttr("readonly");
//			form.attr("action", formAction);
			formQuery.submit();
		}else{
//			formAction = baseAction + "?systemCode=" + code;
			formQuery.find('input[name="systemCode"]').val(code);
			formQuery.find('input[name="systemCode"]').attr("readonly", "true");
			formQuery.find('input[name="systemName"]').val(name);
			formQuery.find('input[name="systemName"]').attr("readonly", "true");
//			form.attr("action", formAction);
			formQuery.submit();
		}
	}
	// 切换系统的时候清除combobox的值以及下拉框
	$("#interfaceManagerVo_tree_field").combobox('clear');
	$("div.combo-p").find("div.combo-panel").empty();
}

function clickSystemTreeNode(id, code, name){
	if(code != null && typeof(code) != "undefined" && code != ''){
		$("#interfaceManagerVo_sysId_input").val(id);
		$("#interfaceManagerVo_systemCode_input").val(code);
		$("#interfaceManagerVo_systemName_input").val(name);
		$.ajax({
			type : "post",
			global : false,
			url : CONTEXT_PATH + '/base/interfaceManagerVo/findSysProtocolIdList',
			data : {
				sysId : id
			},
			dataType : "json",
			success : function(data) {
	       		if(data == null || typeof(data) == "undefined"){
	   	  			$.messager.alert('提示','系统超时，请刷新后重试');
		   	  	}else{
		   	  		var flag = data['FLAG'];
		   	  		if(flag == 'true'){
		   	  			var dataList = data['RESULT'];
		   	  			if(dataList.length == 0){
							$.messager.alert('提示', "请先配置所选系统的协议！");
							$("#interfaceManagerVo_sysProtocolId_input").children().remove();
						}else{
							$("#interfaceManagerVo_sysProtocolId_input").children().remove();
							var content = '';
					   	  	for(var i = 0; i < dataList.length; i ++){
				   	  			var object = dataList[i];
				  				content = content + '<option value="'+object.id+'">'+object.sysProtocolName+'</option>';
					   	  	 }
					   	  	 $("#interfaceManagerVo_sysProtocolId_input").append(content);
						}
		   	  		}else{
		   	  			$.messager.alert('提示', flag);
		   	  		}
		   	  	}
			},
			error : function(){
				doTheAlert('提示', errorTip);
			}
		});
	}else{
		$.messager.alert("提示","网络异常，请刷新后重试！");
	}
	$('.ui-dialog:visible').last().find('.ui-dialog-titlebar-close').click();
}

$(document).on('change', 'select#interfaceManagerVo_msgTypeId_input', function() {
	var msgType = this.selectedOptions[0].innerText;
	if(msgType == null || typeof(msgType) == "undefined" || msgType == ''){
		$.messager.alert("提示", "报文类型不能为空！");
		return false;
	}
	if(msgType.toUpperCase() == 'XML' || msgType.toUpperCase() == 'JSON' || msgType.toUpperCase() == 'LTTSJSON'){
		$("#interfaceManagerVo_msgTypeRadio_input").show();
		$(".report_table").hide();
		$(".report_context").show();
		if(msgType.toUpperCase() == 'LTTSJSON'){
			$(".lttsjson-content").show();
		}else{
			$(".lttsjson-content").hide();
		}
	}else{
		$("#interfaceManagerVo_msgTypeRadio_input").hide();
		$(".report_context").hide();
		$(".report_table").show();
	}
});

/*$(document).on('change', 'select.node_listValueType', function() {
	var treeId = $(this).data('treeid');
	var treeObj = $('#'+treeId);
	var node = treeObj.tree('getSelected');
	var children = treeObj.tree('getChildren', node.target);
	if(children.length > 0){
		$.messager.alert("提示", "此节点存在子节点，list值类型的值必须为对象！要想改变该选项，请先删除此节点下的所有子节点！");
		$(this).val(1);
		return false;
	}
});*/

function showTreeOrText(type){
	if(type != null && typeof(type) != "undefined" && type != ''){
		if(type == 'tree'){
			$(".text").hide();
			$(".tree").show();
		}else if(type == 'text'){
			$(".tree").hide();
			$(".text").show();
		}
	}
}

Observation.interfaceManagerVo_tree = function(container){
	var form = $('#interfaceManagerVo_form_input', container);
	form.each(function() {
		var interId = $("input#interfaceManagerVo_id_input").val();
		var sysId = $("#interfaceManagerVo_sysId_input").val();
		if(sysId == null || typeof(sysId) == "undefined" || sysId == ''){
			$('.ui-dialog-titlebar-close', $(form).closest('.ui-dialog')).click();
			$.messager.alert("提示","请先在左侧选择系统！");
		}
		var url = CONTEXT_PATH + '/base/interfaceManagerVo/interMangerTree?type=INTERMANGER&sysId=' + sysId;
		if(interId != null && typeof(interId) != "undefined" && interId != ''){
			url = url + "&interId=" + interId;
		}
		$("#request_tree").tree({
			url : url + "&requestType=0",
			onContextMenu : function(e, node){
				e.preventDefault();
				$(this).tree('select', node.target);
				$('#tree_menu_request').menu('show', {
					left: e.pageX,
					top: e.pageY
				});
			},
			lines : true,
			animate : true,
			formatter : function(node){
				var s = node.text;
				if (node.children){
					s += '&nbsp;<span style=\'color:blue\'>(' + node.children.length + ')</span>';
				}
				return s;
			},
			onClick : function(node){
				$(".row_fluid_tree").hide();
				$("#row_fluid_tree_"+node.id).show();
			}
		});
		$("#response_tree").tree({
			url : url + "&requestType=1",
			onContextMenu : function(e, node){
				e.preventDefault();
				$(this).tree('select', node.target);
				$('#tree_menu_response').menu('show', {
					left: e.pageX,
					top: e.pageY
				});
			},
			lines : true,
			animate : true,
			formatter : function(node){
				var s = node.text;
				if (node.children){
					s += '&nbsp;<span style=\'color:blue\'>(' + node.children.length + ')</span>';
				}
				return s;
			},
			onClick : function(node){
				$(".row_fluid_tree").hide();
				$("#row_fluid_tree_"+node.id).show();
			}
		});
	});
}

function addTreeNode(){
	treeNodeCommon('add');
}

function treeNodeCommon(optType){
	var field = $("#interfaceManagerVo_tree_field").combobox('getValue');
	if(field == null || typeof(field) == "undefined" || field == ''){
		$.messager.alert('提示', '请先填写树节点名称！');
		return false;
	}
	var sysId = $("#interfaceManagerVo_sysId_input").val();
	var treeId = $("#interfaceManagerVo_tree_opt").val();
	var contentId = $("#interfaceManagerVo_tree_content").val();
	$("#interfaceManagerVo_tree_field").combobox('clear');
	$("#tree_node_modal").window('close');
	$.ajax({
		type : "post",
		global : false,
		url : CONTEXT_PATH + '/base/interfaceManagerVo/findBaseFields',
		data : {
			baseFieldsId : field
		},
		dataType : "json",
		success : function(data) {
		 	if (data == null || typeof(data) == "undefined" || data['FLAG'] == null) {
				$.messager.alert('提示', "系统超时，请刷新后重试！");
			}else{
				if(data['FLAG'] == 'true'){
					var baseFields = data['RESULT'];
					if(baseFields == null || typeof(baseFields) == "undefined"){
						$.messager.confirm("提示", "未找到该数据字典对象，是否继续操作？", function(f){
							if(f){
								showTreeRow(treeId, contentId, null, field, optType);
							}
						});	
					}else{
						showTreeRow(treeId, contentId, baseFields, null, optType);
					}
				}else{
					$.messager.alert('提示', data['RESULT']);
				}
			}
		},
		error : function(){
			doTheAlert('提示', errorTip);
		}
	});
}

function editTreeNode(){
	treeNodeCommon('edit');
}

function showTreeRow(treeId, contentId, baseFields, field, optType){
	$(".row_fluid_tree").hide();
	var fieldName = "";
	var nodeId = "";
	var fieldDesc = "";
	var fieldType = "";
	var fieldLength = "";
	var isMustHaveValue = "";
	var isInterIdent = "";
	var pid = "0";
	var listValueType = "";
	var fieldType2 = "";
	var msgType = "";
	var interId = $("#interfaceManagerVo_id_input").val();
	if(interId == null || typeof(interId) == "undefined" || interId == ''){
		msgType = document.getElementById("interfaceManagerVo_msgTypeId_input").selectedOptions[0].innerText;
	}else{
		msgType = $("#interfaceManagerVo_msgType_input").val();
	}
	// 数据字典 fieldType2 listValueType fieldType
	var fieldTypeDict = {};
	var listValueTypeDict = {};
	var fieldType2Dict = {};
	if(dictionary != null && typeof(dictionary) != "undefined"){
		fieldTypeDict = dictionary['fieldType'];
		listValueTypeDict = dictionary['listValueType'];
		fieldType2Dict = dictionary['fieldType2'];
	}
	if(baseFields == null){
		fieldName = field;
	}else{
		fieldName = baseFields.fieldName;
		fieldDesc = baseFields.fieldDesc;
		fieldType = baseFields.fieldType;
		fieldLength = baseFields.fieldLength;
		if(fieldLength == null || typeof(fieldLength) == "undefined" || fieldLength == '0'){
			fieldLength = '';
		}
		if(fieldDesc == null || typeof(fieldDesc) == "undefined"){
			fieldDesc = '';
		}
	}
	var treeObj = $('#'+treeId);
	var node = treeObj.tree('getSelected');
	var parentFieldName = "";
	var parentFieldDesc = "";
	if(optType == 'add'){
		parentFieldName = $("#row_fluid_tree_"+node.id).find('input.node_fieldName').val();
		if(parentFieldName == null || typeof(parentFieldName) == "undefined"){
			parentFieldName = '';
		}
		parentFieldDesc = $("#row_fluid_tree_"+node.id).find('input.node_fieldDesc').val();
		if(parentFieldDesc == null || typeof(parentFieldDesc) == "undefined"){
			parentFieldDesc = '';
		}
		pid = node.id;
		getTreeNodeId();
		nodeId = treeNodeId;
	}else if(optType == 'edit'){
		listValueType = $("#row_fluid_tree_"+node.id).find('select.node_listValueType').val();
		fieldType2 = $("#row_fluid_tree_"+node.id).find('select.node_fieldType2').val();
		$("#row_fluid_tree_"+node.id).remove();
		var parent = treeObj.tree('getParent', node.target);
		if(parent != null && typeof(parent) != "undefined"){
			parentFieldName = $("#row_fluid_tree_"+parent.id).find('input.node_fieldName').val();
			if(parentFieldName == null || typeof(parentFieldName) == "undefined"){
				parentFieldName = '';
			}
			parentFieldDesc = $("#row_fluid_tree_"+parent.id).find('input.node_fieldDesc').val();
			if(parentFieldDesc == null || typeof(parentFieldDesc) == "undefined"){
				parentFieldDesc = '';
			}
			pid = parent.id;
		}
		nodeId = node.id;
	}
	var list = $("#interfaceManagerVo_tree_list").val();
	var content = '<div id="row_fluid_tree_'+nodeId+'" class="row_fluid_tree"><div class="row-fluid"><div class="span6 w120"><div class="control-group">' +
		'<label class="control-label">父节点编码：</label><div class="controls">' +
		'<input type="hidden" name="'+list+'[0].pid" value="'+pid+'" class="node_pid">' +
		'<input type="hidden" name="'+list+'[0].id" value="'+nodeId+'" class="node_sid">' +
		'<input type="hidden" name="'+list+'[0].isLeaf" value="0" class="node_isLeaf">' +
		'<input type="hidden" name="'+list+'[0].displayOrder" value="0" class="node_displayOrder">';
	content = content + '<input type="text" readonly="true" value="'+parentFieldName+'" class="node_parentFieldName">' +
		'</div></div></div><div class="span6 w120"><div class="control-group">' +
		'<label class="control-label">父节点名称：</label><div class="controls">' + 
		'<input type="text" readonly="true" value="'+parentFieldDesc+'"  class="node_parentFieldDesc"></div></div></div></div>';	
	content = content + '<div class="row-fluid"><div class="span6 w120"><div class="control-group">' +
		'<label class="control-label">节点编码：</label><div class="controls">' +
		'<input type="text" name="'+list+'[0].fieldName" readonly="true" value="'+fieldName+'" class="node_fieldName">' +
		'</div></div></div><div class="span6 w120"><div class="control-group">' +
		'<label class="control-label">节点名称：</label><div class="controls">' + 
		'<input type="text" name="'+list+'[0].fieldDesc" value="'+fieldDesc+'" readonly="true" class="node_fieldDesc"></div></div></div></div>';
	if('LTTSJSON' == msgType.toUpperCase()){
		content = content + '<div class="row-fluid lttsjson-content"><div class="span6 w120"><div class="control-group">' +
			'<label class="control-label">字段类型：</label><div class="controls">' + 
			'<select name="'+list+'[0].fieldType2" class="node_fieldType2"><option value=""></option>';
			// fieldType2 字段类型(0 数组)
			if(fieldType2Dict != null && typeof(fieldType2Dict) != "undefined"){
				$.map(fieldType2Dict, function(value, key){
					if(key == fieldType2){
						content = content + '<option value="' + key + '" selected="selected">' + value + '</option>';
					}else{
						content = content + '<option value="' + key + '">' + value + '</option>';
					}
				});
			}
		content = content + '</select></div></div></div><div class="span6 w120"><div class="control-group">' +
			'<label class="control-label">集合值类型：</label><div class="controls">' +
			'<select name="'+list+'[0].listValueType" class="node_listValueType" data-treeid="'+treeId+'"><option value=""></option>';
			// listValueType 0 字符串 1 对象 2 空数组
			if(listValueTypeDict != null && typeof(listValueTypeDict) != "undefined"){
				$.map(listValueTypeDict, function(value, key){
					if(key == listValueType){
						content = content + '<option value="' + key + '" selected="selected">' + value + '</option>';
					}else{
						content = content + '<option value="' + key + '">' + value + '</option>';
					}
				});
			}
		content = content + '</select></div></div></div></div>';
	}
	content = content + '<div class="row-fluid"><div class="span6 w120"><div class="control-group">' +
		'<label class="control-label">类型：</label><div class="controls">' +
		'<select name="'+list+'[0].fieldType" class="node_fieldType">';
		if(fieldTypeDict != null && typeof(fieldTypeDict) != "undefined"){
			$.map(fieldTypeDict, function(value, key){
				if(key == fieldType){
					content = content + '<option value="' + key + '" selected="selected">' + value + '</option>';
				}else{
					content = content + '<option value="' + key + '">' + value + '</option>';
				}
			});
		}
		content = content + '</select></div></div></div><div class="span6 w120"><div class="control-group">' +
		'<label class="control-label">长度：</label><div class="controls">' + 
		'<input type="text" name="'+list+'[0].fieldLength" value="'+fieldLength+'" class="integer node_fieldLength"></div></div></div></div>';
	content = content + '<div class="row-fluid"><div class="span6 w120"><div class="control-group">' +												
		'<label class="control-label">必须有值：</label><div class="controls">' +
		'<input type="checkbox" name="'+list+'[0].isMustHaveValue" id="isMustHaveValue_'+nodeId+'" value="true"';
		if(isMustHaveValue == '1'){
			content = content + ' checked="checked" ';
		}
		content = content + 'class="custom lastClicked node_isMustHaveValue" style="display: none;"><label class="custom" for="isMustHaveValue_'+nodeId+'"></label><input type="hidden" id="__checkbox_isMustHaveValue_'+nodeId+'" value="true">' +
		'</div></div></div><div class="span6 w120"><div class="control-group"><label class="control-label">标识接口：</label><div class="controls">' +
		'<input type="checkbox" name="'+list+'[0].isInterIdent" id="isInterIdent_'+nodeId+'" value="true"';
		if(isInterIdent == '1'){
			content = content + ' checked="checked" ';
		}
		content = content + 'class="custom lastClicked node_isInterIdent" style="display: none;"><label class="custom" for="isInterIdent_'+nodeId+'"></label><input type="hidden" id="__checkbox_isInterIdent_'+nodeId+'" value="true">' +
		'</div></div></div></div>';
	content = content + '<div class="row-fluid"><div class="span6 w120"><div class="control-group">' +	
		'<label class="control-label">属性类型：</label><div class="controls">' +
		'<input type="checkbox" name="'+list+'[0].isAttrType" id="isAttrType_'+nodeId+'" value="true" class="custom lastClicked node_isAttrType" style="display: none;" onclick="nodeAttrType(this,'+"'"+treeId+"'"+')"><label class="custom" for="isAttrType_'+nodeId+'"></label><input type="hidden" id="__checkbox_isAttrType_'+nodeId+'" value="true">' +
		'</div></div></div></div></div>';
	$("#"+contentId).append(content);
	if(optType == 'edit'){
		treeObj.tree('update', {
			target: node.target,
			text: fieldName
		});
		var children = treeObj.tree('getChildren', node.target);
		if(children.length > 0){
			for (var index = 0; index < children.length; index ++) {
				var parent = treeObj.tree('getParent', children[index].target);
				if(parent.id == node.id){
					parentFieldName = $("#row_fluid_tree_"+parent.id).find('input.node_fieldName').val();
					if(parentFieldName == null || typeof(parentFieldName) == "undefined"){
						parentFieldName = '';
					}
					parentFieldDesc = $("#row_fluid_tree_"+parent.id).find('input.node_fieldDesc').val();
					if(parentFieldDesc == null || typeof(parentFieldDesc) == "undefined"){
						parentFieldDesc = '';
					}
					$("#row_fluid_tree_"+children[index].id).find('input.node_parentFieldName').val(parentFieldName);
					$("#row_fluid_tree_"+children[index].id).find('input.node_parentFieldDesc').val(parentFieldDesc);
				}
			}
		}
	}else if(optType == 'add'){
		treeObj.tree('append', {
			parent: (node?node.target:null),
			data: [{
				id: nodeId,
				text: fieldName
			}]
		});
	}
	var addNode = treeObj.tree('find', nodeId);
	treeObj.tree('select', addNode.target);
}

function nodeAttrType(obj,treeId){
	var msgType = "";
	var interId = $("#interfaceManagerVo_id_input").val();
	if(interId == null || typeof(interId) == "undefined" || interId == ''){
		msgType = document.getElementById("interfaceManagerVo_msgTypeId_input").selectedOptions[0].innerText;
	}else{
		msgType = $("#interfaceManagerVo_msgType_input").val();
	}
	if(msgType == null || typeof(msgType) == "undefined" || msgType == ''){
		$.messager.alert("提示", "报文类型不能为空！");
		return false;
	}
	if(msgType.toUpperCase() == 'JSON'){
		$.messager.alert('提示', 'JSON报文不包含属性！');
		obj.checked = false;
		return false;
	}
	if(msgType.toUpperCase() == 'LTTSJSON'){
		$.messager.alert('提示', 'LTTSJSON报文不包含属性！');
		obj.checked = false;
		return false;
	}
	var treeObj = $('#'+treeId);
	var node = treeObj.tree('getSelected');
	var parent = treeObj.tree('getParent', node.target);
	if(parent == null || typeof(parent) == "undefined"){
		$.messager.alert('提示', '根节点不能设置为属性！');
		obj.checked = false;
		return false;
	}
	var flag = treeObj.tree('isLeaf', node.target);
	if(obj.checked && !flag){
		$.messager.alert('提示', '非叶子节点不能设置为属性！');
		obj.checked = false;
		return false;
	}
}

function pxTreeRow(){
	var requestTreeList = $("#request_tree_content .row_fluid_tree");
	if(requestTreeList != null && typeof(requestTreeList) != "undefined" && requestTreeList.length > 0){
		for (var index = 0; index < requestTreeList.length; index++) {
			$(requestTreeList[index]).find('input.node_pid').attr('name', 'requestTreeList['+index+'].pid');
			$(requestTreeList[index]).find('input.node_fieldName').attr('name', 'requestTreeList['+index+'].fieldName');
			$(requestTreeList[index]).find('input.node_fieldDesc').attr('name', 'requestTreeList['+index+'].fieldDesc');
			$(requestTreeList[index]).find('select.node_fieldType').attr('name', 'requestTreeList['+index+'].fieldType');
			$(requestTreeList[index]).find('input.node_fieldLength').attr('name', 'requestTreeList['+index+'].fieldLength');
			$(requestTreeList[index]).find('input.node_isMustHaveValue').attr('name', 'requestTreeList['+index+'].isMustHaveValue');
			$(requestTreeList[index]).find('input.node_isInterIdent').attr('name', 'requestTreeList['+index+'].isInterIdent');
			$(requestTreeList[index]).find('input.node_isAttrType').attr('name', 'requestTreeList['+index+'].isAttrType');
			$(requestTreeList[index]).find('input.node_sid').attr('name', 'requestTreeList['+index+'].id');
			$(requestTreeList[index]).find('input.node_isLeaf').attr('name', 'requestTreeList['+index+'].isLeaf');
			$(requestTreeList[index]).find('input.node_displayOrder').attr('name', 'requestTreeList['+index+'].displayOrder');
			$(requestTreeList[index]).find('select.node_fieldType2').attr('name', 'requestTreeList['+index+'].fieldType2');
			$(requestTreeList[index]).find('select.node_listValueType').attr('name', 'requestTreeList['+index+'].listValueType');
		}
	}
	var responseTreeList = $("#response_tree_content .row_fluid_tree");
	if(responseTreeList != null && typeof(responseTreeList) != "undefined" && responseTreeList.length > 0){
		for (var index = 0; index < responseTreeList.length; index++) {
			$(responseTreeList[index]).find('input.node_pid').attr('name', 'responseTreeList['+index+'].pid');
			$(responseTreeList[index]).find('input.node_fieldName').attr('name', 'responseTreeList['+index+'].fieldName');
			$(responseTreeList[index]).find('input.node_fieldDesc').attr('name', 'responseTreeList['+index+'].fieldDesc');
			$(responseTreeList[index]).find('select.node_fieldType').attr('name', 'responseTreeList['+index+'].fieldType');
			$(responseTreeList[index]).find('input.node_fieldLength').attr('name', 'responseTreeList['+index+'].fieldLength');
			$(responseTreeList[index]).find('input.node_isMustHaveValue').attr('name', 'responseTreeList['+index+'].isMustHaveValue');
			$(responseTreeList[index]).find('input.node_isInterIdent').attr('name', 'responseTreeList['+index+'].isInterIdent');
			$(responseTreeList[index]).find('input.node_isAttrType').attr('name', 'responseTreeList['+index+'].isAttrType');
			$(responseTreeList[index]).find('input.node_sid').attr('name', 'responseTreeList['+index+'].id');
			$(responseTreeList[index]).find('input.node_isLeaf').attr('name', 'responseTreeList['+index+'].isLeaf');
			$(responseTreeList[index]).find('input.node_displayOrder').attr('name', 'responseTreeList['+index+'].displayOrder');
			$(responseTreeList[index]).find('select.node_fieldType2').attr('name', 'responseTreeList['+index+'].fieldType2');
			$(responseTreeList[index]).find('select.node_listValueType').attr('name', 'responseTreeList['+index+'].listValueType');
		}
	}
}

function pxTreeOrder(){
	var treeRequest = $('#request_tree');
	var requestRoot = treeRequest.tree("getRoot");
	var index = 1;
	pxTreeOrderTo(treeRequest, requestRoot, index);
	
	var treeResponse = $('#response_tree');
	var responseRoot = treeResponse.tree("getRoot");
	index = 1;
	pxTreeOrderTo(treeResponse, responseRoot, index);
}

function pxTreeOrderTo(tree, node, index){
	var children = tree.tree("getChildren", node.target);
	if(children != null && typeof(children) != "undefined" && children.length > 0){
		for(var i = 0; i < children.length; i ++){
			var obj = children[i];
			$("#row_fluid_tree_"+obj.id).find('input.node_displayOrder').val(index);
			index ++;
		}
	}
}

function append(treeId, contentId, list){
	var sysId = $("#interfaceManagerVo_sysId_input").val();
	if(sysId == null || typeof(sysId) == "undefined" || sysId == ''){
		$.messager.alert('提示', '请先选择归属系统后再编辑树！');
		return false;
	}
	var treeObj = $('#'+treeId);
	var node = treeObj.tree('getSelected');
	var parent = treeObj.tree('getParent', node.target);
	if(parent != null && typeof(parent) != "undefined"){
		var flag = $("#row_fluid_tree_"+node.id).find('input.node_isAttrType').prop("checked");
		if(flag){
			$.messager.alert('提示', '属性节点不能新增节点！');
			return false;
		}
		var msgType = "";
		var interId = $("#interfaceManagerVo_id_input").val();
		if(interId == null || typeof(interId) == "undefined" || interId == ''){
			msgType = document.getElementById("interfaceManagerVo_msgTypeId_input").selectedOptions[0].innerText;
		}else{
			msgType = $("#interfaceManagerVo_msgType_input").val();
		}
		if(msgType == null || typeof(msgType) == "undefined" || msgType == ''){
			$.messager.alert("提示", "报文类型不能为空！");
			return false;
		}
		/*if(msgType.toUpperCase() == 'LTTSJSON'){
			var listValueType = $("#row_fluid_tree_"+node.id).find('select.node_listValueType').val();
			if("1" != listValueType){
				$.messager.alert("提示", "list值类型的选择项为对象时才能增加子节点！");
				return false;
			}
		}*/
	}
	$("#interfaceManagerVo_tree_opt").val(treeId);
	$("#interfaceManagerVo_tree_content").val(contentId);
	$("#interfaceManagerVo_tree_list").val(list);
	$("#add_tree_node").unbind("click");
	$("#add_tree_node").bind("click", addTreeNode);
	$("#tree_node_modal").window('open');
}

function edit(treeId, contentId, list){
	var sysId = $("#interfaceManagerVo_sysId_input").val();
	if(sysId == null || typeof(sysId) == "undefined" || sysId == ''){
		$.messager.alert('提示', '请先选择归属系统后再编辑树！');
		return false;
	}
	var treeObj = $('#'+treeId);
	var node = treeObj.tree('getSelected');
	$("#interfaceManagerVo_tree_opt").val(treeId);
	$("#interfaceManagerVo_tree_content").val(contentId);
	$("#interfaceManagerVo_tree_list").val(list);
	$("#add_tree_node").unbind("click");
	$("#add_tree_node").bind("click", editTreeNode);
	$("#tree_node_modal").window('open');
}

function removeit(treeId){
	var treeObj = $('#'+treeId);
	var node = treeObj.tree('getSelected');
	var parent = treeObj.tree('getParent', node.target);
	if(parent == null || typeof(parent) == "undefined"){
		$.messager.alert('提示', '根节点不能被删除！');
		return false;
	}
	$(".row_fluid_tree").hide();
	var children = treeObj.tree('getChildren', node.target);
	if(children.length > 0){
		for (var index = 0; index < children.length; index ++) {
			$("#row_fluid_tree_"+children[index].id).remove();
			treeObj.tree('remove', children[index].target);
		}
	}
	if(node.id != '0'){
		$("#row_fluid_tree_"+node.id).remove();
		treeObj.tree('remove', node.target);
	}
}

function collapse(treeId){
	var treeObj = $('#'+treeId);
	var node = treeObj.tree('getSelected');
	treeObj.tree('collapse', node.target);
}

function expand(treeId){
	var treeObj = $('#'+treeId);
	var node = treeObj.tree('getSelected');
	treeObj.tree('expand', node.target);
}

var treeNodeId = "";

function getTreeNodeId(){
	$.ajax({
		type : "post",
		global : false,
		async : false,
		url : CONTEXT_PATH + '/base/interfaceManagerVo/getTreeNodeId',
		data : {},
		dataType : "json",
		success : function(data) {
		 	if (data != null) {
				if(typeof(data['RESULT']) != "undefined"){
					treeNodeId = data['RESULT'];
				}
			}
		},
		error : function(){
			doTheAlert('提示', errorTip);
		}
	});
}

function sumbitForm(){
	pxTreeRow();
	pxTreeOrder();
	$("#row_fluid_tree_undefined").remove();
	var msgTypeRadio = $('input:radio[name="interfaceManagerVo.msgTypeRadio"]:checked').val();
	if(msgTypeRadio == "2"){
		var reqCopyText = $('#reqCopyText').val();
		var type = $('#interfaceManagerVo_msgTypeId_input').val();
		var flag1 =	checkReqRespText(reqCopyText, type,"req");
		var flag2 = false;
		if(flag1){
			var respCopyText = $('#respCopyText').val();
			flag2 = checkReqRespText(respCopyText, type,"resp");
		}
		if(flag1 && flag2){
			$("form#interfaceManagerVo_form_input").submit();
		}
	}else{
		$("form#interfaceManagerVo_form_input").submit();
	}
}

function addInterfaceManagerVo(){
	var systemCode =$('#baseSystem_systemCode_tree').val();
	var formCriteria = $("form.criteria");
	var baseAction = formCriteria.attr("action");
	var url = "";
	if(systemCode == null || typeof(systemCode) == "undefined" || systemCode == '' || systemCode == 'all'){
		$.messager.alert('提示', "请先在左侧选择系统！");
		return false;
	}else{
		url = baseAction + "/input?systemCode=" + systemCode;
	}
	window.open(url, {width:'90%'});
}

function updateInterfaceManagerVo(){
	var objV = $("form#interfaceManagerVo_info_list table tbody tr td").find('input[type="checkbox"]');
	var objVCheckeNum = 0;
	var value = "";
	for(var i = 0; i < objV.length; i ++){
		if(objV[i].checked == true){
			value = objV[i].value;
			objVCheckeNum ++;
		}
	}
	if(objVCheckeNum < 1){
		$.messager.alert('提示', "请勾选一条记录进行修改！");
		return false;
	}else if(objVCheckeNum > 1){
		$.messager.alert('提示', "只能勾选一条记录进行修改！");
		return false;
	}else if(objVCheckeNum == 1){
		var formCriteria = $("form.criteria");
		var baseAction = formCriteria.attr("action");
		var url = baseAction + "/input?interfaceManagerId=" + value;
		window.open(url, {width:'90%'});
	}
}

function deleteInterfaceManagerVo(value){
	console.log("interface Id:"+value);
	$.ajax({
		type : "post",
		global : false,
		async : true,
		url : CONTEXT_PATH + '/base/interfaceManagerVo/checkInterfaceCaseDetail',
		data:{
			interfaceManagerId : value
	  	},
		dataType : "json",
		success : function(data) {
		 	if (data != null) {
				if(typeof(data['RESULTTYPE']) != "undefined"){
					if (data['RESULTTYPE'] == "false") {
						$.messager.alert('提示', data['RESULT'], '', function(r){
							if(r){
								$('#query_interfaceManagerVo').click();
							}
						});
					} else {
						$.messager.confirm("警告","确认要删除这个接口吗？",function(f){
							if(f){
								$.ajax({
									type : "post",
									global : false,
									async : true,
									url : CONTEXT_PATH + '/base/interfaceManagerVo/deleteInterfaceManagerVo',
									data:{
										interfaceManagerId : value
								  	},
									dataType : "json",
									success : function(data) {
									 	if (data != null) {
											if(typeof(data['RESULT']) != "undefined"){
												$.messager.alert('提示', data['RESULT'], '', function(r){
													if(r){
														$('#query_interfaceManagerVo').click();
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
			}
		},
		error:function(){
			doTheAlert('提示', errorTip);
		}
	});	
}

function copyInterfaceManagerVo(){
	var objV = $("form#interfaceManagerVo_info_list table tbody tr td").find('input[type="checkbox"]');
	var objVCheckeNum = 0;
	var value = "";
	var interCode = "";
	for(var i = 0; i < objV.length; i ++){
		if(objV[i].checked == true){
			value = objV[i].value;
			interCode = objV[i].parentElement.nextElementSibling.innerText;
			objVCheckeNum ++;
		}
	}
	if(objVCheckeNum < 1){
		$.messager.alert('提示', "请勾选一条记录进行复制！");
		return false;
	}else if(objVCheckeNum > 1){
		$.messager.alert('提示', "只能勾选一条记录进行复制！");
		return false;
	}else if(objVCheckeNum == 1){
		$("#interfaceManager_interCode_copy").val(interCode);
		$("#interfaceManager_id_copy").val(value);
		$("#copy_inter_modal").window('open');
	}
}

function closeCopyInterManger(){
	$("#copy_inter_modal").window('close');
	$("#interfaceManager_interCode_copy").val("");
	$("#interfaceManager_id_copy").val("");
}

function selectTextFieldName(obj){
	$("#add_tree_node").unbind("click");
	$("#add_tree_node").bind("click", function(){
		var field = $("#interfaceManagerVo_tree_field").combobox('getValue');
		if(field == null || typeof(field) == "undefined" || field == ''){
			$.messager.alert('提示', '请先填写字段名称！');
			return false;
		}
		addTextFiled(obj, field);
	});
	$("#tree_node_modal").window('open');
}

function addTextFiled(obj, field){
	$.ajax({
		type : "post",
		global : false,
		url : CONTEXT_PATH + '/base/interfaceManagerVo/findBaseFields',
		data : {
			baseFieldsId : field
		},
		dataType : "json",
		success : function(data) {
		 	if (data == null || typeof(data) == "undefined" || data['FLAG'] == null) {
				$.messager.alert("提示", "系统超时，请刷新后重试！");
			}else{
				if(data['FLAG'] == 'true'){
					var baseFields = data['RESULT'];
					if(baseFields == null || typeof(baseFields) == "undefined"){
						$.messager.confirm("提示", "未找到该数据字典对象，是否继续操作？", function(f){
							if(f){
								showTextRow(obj, null, field);
							}
						});	
					}else{
						showTextRow(obj, baseFields, field);
					}
				}else{
					$.messager.alert('提示', data['RESULT']);
				}
			}
		},
		error : function(){
			doTheAlert('提示', errorTip);
		}
	});
}

function showTextRow(obj, baseField, field){
	var tr = $(obj).closest('tr');
	if(baseField == null){
		obj.value = field;
	}else{
		obj.value = baseField.fieldName;
		var fieldType = baseField.fieldType;
		if(fieldType == null || typeof(fieldType) == "undefined"){
			fieldType = "";
		}
		var fieldLength = baseField.fieldLength;
		if(fieldLength == null || typeof(fieldLength) == "undefined"){
			fieldLength = "";
		}
		tr.find('.text_fieldType').val(fieldType);
		tr.find('.text_fieldLength').val(fieldLength);
	}
	$("#interfaceManagerVo_tree_field").combobox('clear');
	$("#tree_node_modal").window('close');
}

//校验JSON/XML粘贴报文字段合法性
function checkReqRespText(reqRespText,reqRespTypeId,reqRespType){
	if (("" == reqRespText || null == reqRespText) && "req" == reqRespType) {
		$.messager.alert('提示', "请求报文必须填写！");
		return false;
	}
	if (("" == reqRespText || null == reqRespText) && "resp" == reqRespType) {
		$.messager.alert('提示', "响应报文必须填写！");
		return false;
	}
	var result = true;
	var sysId = $('#interfaceManagerVo_sysId_input').val();
	$.ajax({
		type : "post",
		global : false,
		async : false,
		url : CONTEXT_PATH + '/base/interfaceManagerVo/checkReqRespText',
		data : {
			reqRespText : reqRespText,
			reqRespTypeId : reqRespTypeId,
			sysId : sysId
		},
		dataType : "json",
		success : function(data) {
			if(data.msg=="error"){
				$.messager.alert('提示', data.error);
				result = false;
			}
		},
		error : function(){
			doTheAlert('提示', errorTip);
			result = false;
		}
	});
	return result;
}