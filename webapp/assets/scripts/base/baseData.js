var baseSystemEnvId = "";
var systemId = "";
var inputUrl = "";

//新增/编辑关闭按钮事件
function baseData_input(){
	$("#baseData_input").removeClass("dirty");
	closePage();
}
//新增/编辑关闭按钮事件
function baseData_input(){
	var form = "baseData_input";
	closeBtnData(form);
}

//点击关闭按钮时取消提示
function closeBtnData(form){
	$("#"+form).removeClass("dirty");
	closePage();
}


//新增数据字典按钮
function addBaseData(){
	if (systemId == "") {
		jAlert("请选择系统！","提示");
		return false;
	}
	if (baseSystemEnvId == "") {
		jAlert("请选择环境！","提示");
		return false;
	}
	if (inputUrl != "") {
		window.open(inputUrl,{width:'80%'});
	}
}

//上传校验
function fileUploadFunction() {  
    var file = $("#fileUpload").val();  
    var form = $('form#baseData_view');
    if (file == "") {  
        //alert("请选择要上传的文件"); 
        Message.showFieldError($('#FileUpload'), null, "上传文件不能为空!");
        return false  
    } else {  
        //检验文件类型是否正确  
        var exec = (/[.]/.exec(file)) ? /[^.]+$/.exec(file.toLowerCase()) : '';  
        if (exec != "xlsx") {  
            //alert("文件格式不对，请上传Excel文件!");  
            Message.showFieldError($('#FileUpload'), null, "文件格式不对，请上传Excel文件!");
            return false;  
        }  
    }
    form.submit();
   
}
//新增/修改页面选择字段名称填充字段描述、备注
function fieldsChange(){
    var fnValue = $('#fieldNameSelect option:selected').val();
    var fnDesc = $('#fieldNameSelect option:selected').attr("desc");
    var fnText = $('#fieldNameSelect option:selected').text();
    if(fnValue == "fnefaultOption"){
    	$("#fieldDesc").val("");
    	$("#remark").val("");
    	$("#alias").val("");
    }else{
    	$("#fieldDesc").val(fnValue);
    	$("#remark").val(fnDesc);
    	$("#alias").val(fnText);
    }
}

//根据环境节点查询数据池信息
function getDataBaseBySystemEnvId(sysId,beId){
	baseSystemEnvId = beId;
	systemId = sysId;
	var formUrl = $("form.criteria").attr("action");
	inputUrl = formUrl+"/input?systemId="+systemId+"&baseSystemEnvId="+baseSystemEnvId;
	$('#baseData_fieldName').val("");
	$('#baseData_fieldDesc').val("");
}

//模糊查询
function queryBaseData(){
	var bdfieldNameVal = $('#baseData_fieldName').val();
	var bdfieldDescVal = $('#baseData_fieldDesc').val();
	var formCheck = $("form#baseData_form_check");
	var form = $("form#baseData_form_list");
	var formCriteria = $("form.criteria");
	var formUrl = formCriteria.attr("action");
	formUrl = formUrl + "/getBaseDataAllList?systemId="+systemId+"&baseSystemEnvId=" + baseSystemEnvId + "&fieldName="
			+ bdfieldNameVal + "&fieldDesc=" + bdfieldDescVal;
	formCheck.attr("action", formUrl);
	form.attr("action", formUrl);
	form.submit();
}

//新增页面保存按钮
function preserve(){
	var fieldId = $("#fieldId").val();
	if(checkInput(fieldId)) {
		$("#preserveId").submit();
		$.messager.alert('提示', '保存成功', '',function(r){
			if (r) {
				var form = "baseData_input";
				closeBtnData(form);
				$('#queryBaseData').click();
			}
		});
	}
}

// 校验必填项
function checkInput(fieldId){
	var baseId = $('#id').val();
	var alias = $('#alias').val();
	var sysId = $("#sysId").val();
	var sysEnvId = $('#sysEnvId').val();
	var checkFlag = true;
	
	if(sysId==""){
		jAlert("请选择系统！","提示");
		closePage();
		return false;
	} 
	if (fieldId == "" || typeof(fieldId) == "undefined") {
		jAlert("请选择字典名称","提示");
		return false;
	}
	if(alias == "" || alias == null){
		 Message.showFieldError($('#alias'), null, "别名不能为空！");
		return false
	}
	
	$.ajax({
		type : "post",
		global : false,
		async : false,
		url : CONTEXT_PATH + '/base/baseData/checkAlias',
		data:{
			alias : alias,
			baseSystemEnvId : sysEnvId,
			baseId : baseId
	  	},
		dataType : "json",
		success : function(data) {
		 	if (data != null) {
				if(typeof(data.flag) != "undefined" ){
					if ("false" == data.flag) {
						checkFlag = false;
						Message.showFieldError($('#alias'), null, "别名已存在，请重新输入！");
					}
				}
			}
		},
		error:function(){
			doTheAlert('提示', errorTip);
		}
	});	
	
	return checkFlag;
}

//删除
function deleteBaseData(){
	var objV = $("form#baseData_form_list table tbody tr td").find('input[type="checkbox"]');
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
					url : CONTEXT_PATH + '/base/baseData/del',
					data:{
						idArray : value
				  	},
					dataType : "json",
					success : function(data) {
					 	if (data != null) {
							if(typeof(data.msg) != "undefined" ){
								$.messager.alert('提示', data.msg, '', function(r){
									if(r){
										$('#queryBaseData').click();
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

//加载或刷新list页面中的table时调用此方法
Observation.baseData_input = function(container) {
	$(document).bind('click',function(e) {
		var e = e || window.event;
		var elem = e.target || e.srcElement;
		while (elem) {
			if (elem.id && (elem.id == 'fieldNameSelect' || elem.id == "fieldName")) {
				return;
			}
			elem = elem.parentNode;
		}
		$('#fieldNameSelect').css('display', 'none');
	});
}

//字典名称可编辑下拉框function
function changeF(this_) {
	var selOption = $(this_).find("option:selected");
    $(this_).prev("input").val(selOption.val());
    var fieldValue = selOption.val();
    var fieldId = selOption.attr("id");
    var fieldDesc = selOption.attr("desc");
    var remark = selOption.attr("remark");
	//console.log("fieldId:"+fieldId+"--fieldValue:"+fieldValue+"--fieldDesc:"+fieldDesc+"--remark:"+remark);
    $("#fieldDesc").val(fieldDesc);
	$("#remark").val(remark);
	$("#alias").val(fieldValue);
	$("#fieldId").val(fieldId);
    $("#fieldNameSelect").css({"display":"none"});
}
function setfocus(this_){
    $("#fieldNameSelect").css({"display":""});
    var select = $("#fieldNameSelect");
    select.empty();
    setinput(this_);
    var position = $('#fieldName').position();
    var left = position.left;
    var top = position.top + 28;
    $('#fieldNameSelect').css('left',left);
    $('#fieldNameSelect').css('top',top);
    $('#fieldNameSelect').css('z-index','1');
}
function setinput(this_){
	var sysId = $('#sysId').val();
	var thisVal = $(this_).val();
    var select = $("#fieldNameSelect");
    select.html("");
    
    $.ajax({
		type : "post",
		global : false,
		async : true,
		url : CONTEXT_PATH + '/base/baseData/queryfieldsInfo',
		data:{
			sysId : sysId,
			fieldName : thisVal
	  	},
		dataType : "json",
		success : function(data) {
		 	if (data != null) {
				if(typeof(data.list) != "undefined"){
					var warp = document.createDocumentFragment();
					for (var i = 0; i < data.list.length; i++) {
						var fields = data.list[i];
						var fieldId = fields.id;
						var fieldName = fields.fieldName;
						var fieldDesc = fields.fieldDesc;
						var remark = fields.remark;
						if (typeof(remark) == "undefined") {
							remark = "";
						}
						//console.log("fieldId:"+fieldId+"--fieldName:"+fieldName+"--fieldDesc:"+fieldDesc+"--remark:"+remark);
		                var option = document.createElement("option");
		                option.id = fieldId;
		                option.value = fieldName;
		                option.text = fieldName + "\t" + fieldDesc;
						option.setAttribute('desc', fieldDesc);
						option.setAttribute('remark', remark);
		                warp.appendChild(option);
					}
					select.append(warp);
				}
			}
		},
		error:function(){
			doTheAlert('提示', errorTip);
		}
	});	
}



