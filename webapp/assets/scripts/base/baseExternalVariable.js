/**
 * 预览页面
 * 鼠标移到td时变色,移出还原,选择后变色并且不会受鼠标移动影响,只能选中一个
 * 点击预览页面上的td,给表达式输入框复制
 */
Observation.showTable = function(container) {
	$("table#showTable tbody tr td").click(function(){
		var objV = $("table#showTable tbody tr td");
		for(var i = 0; i < objV.length; i ++){
			objV[i].style.backgroundColor="#fff";
		}
		this.style.backgroundColor="#99ffff";
	    var hang = $(this).parent().prevAll().length;    
	    var lie = $(this).prevAll().length;    
	    var code = $("#replaceCode").val();
	    $("#expression").val("$SQL{"+code+"["+hang+"]["+lie+"]}");
	});
	$("table#showTable tbody tr td").mouseover(function(){
		var backgroundColor = this.style.backgroundColor;
		if("rgb(153, 255, 255)"!=backgroundColor){
			this.style.backgroundColor="#ffcc66";
		}
	});
	$("table#showTable tbody tr td").mouseout(function(){
		var backgroundColor = this.style.backgroundColor;
		if("rgb(153, 255, 255)"!=backgroundColor){
			this.style.backgroundColor="#fff";
		}
	});
}

function copy(){
	var expression = $("#expression").val();
	if(ifNull(expression)){
		doTheAlert('提示', "请点击一个引用的数据。");
	}
	var Url2=document.getElementById("expression");
	Url2.select(); // 选择对象
	if(document.execCommand('copy', false, null)){
		document.execCommand("Copy");
	}else{
		doTheAlert('提示', "浏览器不支持,请手动复制");
	}
}
/**
 * 打开选择数据库引用的页面
 * @param baseDbConnRefId
 * @returns
 */
function selectBaseDbConnRef(baseDbConnRefId){
	
	window.open(CONTEXT_PATH + '/base/baseDbConnRef/query?baseDbConnRefId=' + baseDbConnRefId, {
		width : '95%'
	});
}
/**
 * 打开预览查询结果的页面,在点击新增或修改页面的预览按钮时调用
 * @returns
 */
function viewSelectResult(){
	if(!checkBaseExternalVariableParams()){
		return false;
	}else{
		$.ajax({
	        cache: true,
	        type: "POST",
	        url: CONTEXT_PATH + '/base/baseExternalVariable/checkSelectResult',
	        data: $('#baseExternalVariable_input').serialize(),
	        async: false,
	        success: function(data) {
	        	if(!ifNull(data)){
	        		if(data.msg=='success'){
	        			if(!ifNull(data.warn)){
	        				getTheMessager().alert('提示', data.warn, '', function () {
	        					
	        				});
	        			}
	        			var code = $("#code").val();
        				window.open(CONTEXT_PATH + '/base/baseExternalVariable/viewSelectResult?namespace='+data.namespace+"&code="+code, { 
	        				width : '95%'
	        			});
	        		}else{
	        			doTheAlert('提示', data.error);
	        		}
	        	}else{
	        		doTheAlert('提示', "请求后台发生错误");
	        	}
	        },
			error: function() {
				doTheAlert('提示', errorTip);
			}
	    });
	}
}

/**
 * 打开预览查询结果的页面,在点击list页面的预览按钮时调用
 * @returns
 */
function viewSelectResult2(baseExternalVariableId,code){
	$.ajax({
		cache: true,
		type: "POST",
		url: CONTEXT_PATH + '/base/baseExternalVariable/checkSelectResult',
		data: {baseExternalVariableId:baseExternalVariableId},
		async: false,
		success: function(data) {
			if(!ifNull(data)){
				if(data.msg=='success'){
					window.open(CONTEXT_PATH + '/base/baseExternalVariable/viewSelectResult?namespace='+data.namespace+"&code="+code, { 
						width : '95%'
					});
				}else{
					doTheAlert('提示', data.error);
				}
			}else{
				doTheAlert('提示', "请求后台发生错误");
			}
		},
		error: function() {
			doTheAlert('提示', errorTip);
		}
	});
}

/**
 * 新增或修改保存
 * @returns
 */
function saveBaseExternalVariable(){
	if(!checkBaseExternalVariableParams()){
		return false;
	}else{
		$.ajax({
	        cache: true,
	        type: "POST",
	        url: CONTEXT_PATH + '/base/baseExternalVariable/saveBaseExternalVariable',
	        data: $('#baseExternalVariable_input').serialize(),
	        async: false,
	        success: function(data) {
	        	if(null != data && typeof(data) != 'undefined' && '' != data){
	        		if(data.msg=='success'){
        				getTheMessager().alert('提示', '保存成功！', '', function () {
        					$("#baseExternalVariable_form").submit();
                			closePage();
        				});
	        		}else{
	        			doTheAlert('提示', data.error);
	        		}
	        	}else{
	        		doTheAlert('提示', "请求后台发生错误");
	        	}
	        },
			error: function() {
				doTheAlert('提示', errorTip);
			}
	    });
	}
} 

/**
 * 打开新增或修改外部引用的信息
 */
function openBaseExternalVariableInput(baseExternalVariableId){
	window.open(CONTEXT_PATH + '/base/baseExternalVariable/input?baseExternalVariableId='+baseExternalVariableId,{width:'70%'});
}

//批量删除外部引用信息
function deleteBaseExternalVariable(){
	var objV = $("form#baseExternalVariable_form table tbody tr td").find('input[type="checkbox"]');
	var value = "";
	for(var i = 0; i < objV.length; i ++){
		if(objV[i].checked == true){
			value = objV[i].value + "," + value;
		}
	}
	if(value == ""){
		doTheAlert('提示', "请至少选择一条记录");
		return false;
	}else{
		$.messager.confirm("警告","确认要删除这些记录吗？",function(f){
			if(f){
				$.ajax({
					type : "post",
					global : false,
					async : true,
					url : CONTEXT_PATH + '/base/baseExternalVariable/deleteBaseExternalVariable',
					data:{
						baseExternalVariableIds : value
				  	},
					dataType : "json",
					success : function(data) {
					 	if (!ifNull(data)) {
							if(data.msg == "success" ){
								$.messager.alert('提示', "删除成功", '', function(r){
									if(r){
										$('#baseExternalVariable_form').submit();
									}
								});
							}else{
								doTheAlert('提示', data.error);
							}
						}else{
							doTheAlert('提示', "网络通讯故障");
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
 * 保存前校验参数
 * @returns
 */
function checkBaseExternalVariableParams(){
	//校验变量编码
	var code = $("#code").val();//别名
	var oldCode = $("#oldCode").val();//旧别名
	var baseExternalVariableId = $("#baseExternalVariableId").val();//id
	if(ifNull(baseExternalVariableId)){
		//新增
		if(!checkCode()){
			return false;
		}
	}else{
		//修改
		if(code!=oldCode){//说明数据修改了
			if(!checkCode()){
				return false;
			}
		}
	}
	//校验变量中文名
	if(!checkName()){
		return false;
	}
	//校验引用的数据库
	if(!checkdbRefAlias()){
		return false;
	}
	//校验查询语句
	if(!checkSelectSql()){
		return false;
	}
	return true;
}
/**
 * 校验变量编码,不能为空
 * @returns
 */
function checkCode(){
	var flag = false;
	var code = $("#code").val();
	if(ifNull(code)){
		Message.showFieldError($('#code'), null, "请输入变量编码");
	}else{
		$.ajax({
			type : "post",
			global : false,
			async : false,
			url : CONTEXT_PATH + '/base/baseExternalVariable/checkCode',
			data:{
				code : code
			},
			dataType : "json",
			success : function(data) {
				if(!ifNull(data)) {
					if (data == 'true') {
						Message.showFieldError($('#code'), null, "该变量名称已存在！");
					} else if (data == 'false'){
						flag=true;
					} else {
						doTheAlert('提示', '操作失败！');
					}
				} else {
					doTheAlert('提示', '操作失败！');
				}
			},
			error:function(){
				doTheAlert('提示', errorTip);
			}
		});	
	}
	return flag;
}
/**
 * 校验变量中文名,不能为空
 * @returns
 */
function checkName(){
	var name = $("#name").val();
	if(ifNull(name)){
		Message.showFieldError($('#name'), null, "请输入变量中文名");
		return false;
	}else{
		return true;
	}
}
/**
 * 校验引用数据库,不能为空
 * @returns
 */
function checkdbRefAlias(){
	var dbRefAlias = $("#dbRefAlias").val();
	if(ifNull(dbRefAlias)){
//		Message.showFieldError($('#dbRefAlias'), null, "请选择引用的数据库");
		doTheAlert('提示', "请选择引用的数据库");
		return false;
	}else{
		return true;
	}
}
/**
 * 校验查询语句,不能为空,且格式必须为查询语句格式
 * @returns
 */
function checkSelectSql(){
	var selectSql = $("#selectSql").val();
	if(ifNull(selectSql)){
		Message.showFieldError($('#selectSql'), null, "请输入查询语句");
		return false;
	}
	var index=selectSql.toLocaleLowerCase().indexOf("select");
	if(index != 0){
		Message.showFieldError($('#selectSql'), null, "查询语句必须以select开头");
		return false;
	}else{
		return true;
	}
}
