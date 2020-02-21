var fieldNameFlag = 0;

//新增/编辑关闭按钮事件
function closeFields(){
	$("#baseFields_input").removeClass("dirty");
	closePage();
}

//数据长度校验
function verFieldLength(){
	var reg = /^\+?[1-9][0-9]*$/;
	var fieldLength = $('#fieldLength').val();
	if (!reg.test(fieldLength) && fieldLength != "") {
		  Message.showFieldError($('#fieldLength'), null, "数据长度为非0的正整数!");
		  return false;
	}
	return true;
}

//上传校验
function fileUploadFunction() {  
    var file = $("#fileUpload").val();  
    var form = $('form#baseFields_view');
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
//树节点查询
function clickBaseSystemManagerNode(sysId){
	$('#list_sysId').val(sysId);
	var formUrl = $("form.criteria").attr("action");
	var inputUrl = "window.open('"+formUrl+"/input?sysId="+sysId+"',{width:'60%'})";
	$('#add_dm').attr("onclick", inputUrl);
	$('#baseFields_fieldName').val("");
	$('#baseFields_fieldDesc').val("");
}

//模糊查詢
function queryFields(){
	var sysId = $("#list_sysId").val();
	var fieldName = $('#baseFields_fieldName').val();
	var fieldDesc = $('#baseFields_fieldDesc').val();
	var formCheck = $("form#baseFields_form_check");
	var form = $("form#baseFields_form_list");
	var formCriteria = $("form.criteria");
	var formUrl = formCriteria.attr("action");
	formUrl = formUrl + "/queryBaseFields?sysId="+sysId + "&fieldName=" + fieldName + "&fieldDesc=" + fieldDesc;
	formCheck.attr("action", formUrl);
	form.attr("action", formUrl);
	form.submit();
}

//删除
function deleteBaseFields(){
	var objV = $("form#baseFields_form_list table tbody tr td").find('input[type="checkbox"]');
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
					url : CONTEXT_PATH + '/base/baseFields/del',
					data:{
						idArray : value
				  	},
					dataType : "json",
					success : function(data) {
					 	if (data != null) {
							if(typeof(data.msg) != "undefined" ){
								$.messager.alert('提示', data.msg, '', function(r){
									if(r){
										$('#query_baseFields').click();
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

//新增页面保存按钮
function preserve(){
	var fieldLength = $('#fieldLength').val();
	var baseFieldsId = $('#baseFieldsId').val();
	var sysId = $("#sysId").val();
	var sysListId = $("#systemSelect option:selected").attr("id");
	//校验数据字典名称是否已经存在
	verFieldName();
	if (fieldNameFlag == 1) {
		return false;
	}
	//校验数据长度的值是否合法
	if (verFieldLength() && fieldLength!='') {
		$("#sysId").val(sysListId);
		if (baseFieldsId != '') {
			$("#preserveId").submit();
		}else if(fieldNameFlag == 0){
			$("#preserveId").submit();
			//fieldNameFlag = 1;
			//closePage();
			//$('#query_baseFields').click();
		}else{
			Message.showFieldError($('#fieldName'), null, "字典名称已经存在！");
			return false;
		}
		$("#baseFields_input").removeClass("dirty");
		closePage();
		$('#query_baseFields').click();
	}else {
		Message.showFieldError($('#fieldLength'), null, "数据长度不能为空并且是正整数！");
	}
} 

//字典名称唯一校验
function verFieldName(){
	var fieldId = $('#baseFieldsId').val();
	var fieldName = $('#fieldName').val();
	var sysId = $("#systemSelect option:selected").attr("id");
	if(fieldName == ""){
		Message.showFieldError($('#fieldName'), null, "请输入字典名称");
		return false;
	}else{
		$.ajax({
			type : "post",
			global : false,
			async : true,
			url : CONTEXT_PATH + '/base/baseFields/verFieldName',
			data:{
				fieldId : fieldId,
				fieldName : fieldName,
				sysId : sysId
		  	},
			dataType : "json",
			success : function(data) {
			 	if (data != null) {
					if(typeof(data.msg) != "undefined" ){
						if (data.flag == 1) {
							Message.showFieldError($('#fieldName'), null, data.msg);
						}
						fieldNameFlag = data.flag;
					}
				}
			},
			error:function(){
				doTheAlert('提示', errorTip);
			}
		});	
			
	}
}