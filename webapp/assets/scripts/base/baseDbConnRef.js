/**
 * 实现列表单选必须赋值name属性
 */
Observation.baseDbConnRef_view = function(container) {
	var objV = $("form#baseDbConnRef_form table tbody tr td").find('input[type="radio"]');
	for(var i = 0; i < objV.length; i ++){
		objV[i].name="check";
	}
}

/**
 * 选定数据库引用记录,将数据库引用的id赋值给外部数据引用数据
 * @returns
 */
function selectBaseDbConnRefId(){
	var baseDbConnRefId = $("input[name='check']:checked").val();
	var alias = $("input[name='check']:checked").parent().next().text();
	if(ifNull(baseDbConnRefId)){
		jAlert('请至少勾选一项！', '提示');
		return false;
	}else{
		$("#dbRefId").val(baseDbConnRefId);
		$("#dbRefAlias").val(alias);
		closePage();
	}
	
}

//新增页面保存按钮
function saveBaseDbConnRef(){
	if(!checkBaseDbConnRefParam()){
		return false;
	}else{
		$.ajax({
	        cache: true,
	        type: "POST",
	        url: CONTEXT_PATH + '/base/baseDbConnRef/saveBaseDbConnRef',
	        data: $('#baseDbConnRef_input').serialize(),
	        async: false,
	        success: function(data) {
	        	if(null != data && typeof(data) != 'undefined' && '' != data){
	        		if(data.msg=='success'){
	        			$("#baseDbConnRef_input").removeClass("dirty");
        				getTheMessager().alert('提示', '保存成功！', '', function () {
        					$("#baseDbConnRef_form").submit();
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
 * 检验外部引用数据库别名是否重复
 * 重复返回false,不重复返回true
 * @returns
 */
function checkAlias(){
	var flag = false;
	var alias = $("#alias").val();
	if(ifNull(alias)){
		Message.showFieldError($('#alias'), null, "请输入别名");
	}else{
		$.ajax({
			type : "post",
			global : false,
			async : false,
			url : CONTEXT_PATH + '/base/baseDbConnRef/checkAlias',
			data:{
				alias : alias
			},
			dataType : "json",
			success : function(data) {
				if(!ifNull(data)) {
					if (data == 'true') {
						Message.showFieldError($('#alias'), null, "该数据库别名已存在！");
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
 * 删除外部数据库引用
 * @returns
 */
function deleteBaseDbConnRef(){
	var baseDbConnRefId = $("input[name='check']:checked").val();
	if(ifNull(baseDbConnRefId)){
		jAlert('请至少勾选一项进行移除！', '提示');
		return false;
	}else {
		$.messager.confirm('提示','是否确认移除这个数据库引用？',
				function(f) {
			if (f) {
				$.ajax({
					type : "post",
					global : false,
					async : true,
					url : CONTEXT_PATH + '/base/baseDbConnRef/deleteBaseDbConnRef',
					data : {baseDbConnRefId : baseDbConnRefId},
					dataType : "json",
					success : function(data) {
						$('#baseDbConnRef_form').submit();
							getTheMessager().alert("提示","移除成功",'',function() {
						});
					},
					error : function() {
						jAlert("删除失败！","提示");
						return false;
					}
				});
			}
		});
	}
	
}
/**
 * 打开新增或修改外部引用数据库的信息
 */
function openBaseDbConnRefInput(baseDbConnRefId){
	window.open(CONTEXT_PATH + '/base/baseDbConnRef/input?baseDbConnRefId='+baseDbConnRefId,{width:'70%'});
}

/**
 * 校验参数
 * @returns
 */
function checkBaseDbConnRefParam(){
	//校验别名
	var alias = $("#alias").val();//别名
	var oldAlias = $("#oldAlias").val();//旧别名
	var baseDbConnRefId = $("#baseDbConnRefId").val();//id
	if(ifNull(baseDbConnRefId)){
		//新增
		if(!checkAlias()){
			return false;
		}
	}else{
		//修改
		if(alias!=oldAlias){//说明数据修改了
			if(!checkAlias()){
				return false;
			}
		}
	}
	//校验库名
	if(!checkSchema()){
		return false;
	}
	//校验ip地址
	if(!checkAddress()){
		return false;
	}
	//校验用户名
	if(!checkUsername()){
		return false;
	}
	//校验密码
	if(!checkPassword()){
		return false;
	}
	
		
	return true;
}

/**
 * 校验ip地址
 * @returns
 */
function checkAddress(){
	var address = $("#address").val();//校验地址
	if(ifNull(address)){
		Message.showFieldError($('#address'), null, "请输入ip地址");
		return false;
	}else if(!checkIpAddress(address,"")){
		Message.showFieldError($('#address'), null, "ip地址格式不对");
		return false;
	}else{
		return true;
	}
}

/**
 * 校验库名,库名不能为空
 * @returns
 */
function checkSchema(){
	var schema = $("#schema").val();//校验库名
	if(ifNull(schema)){
		Message.showFieldError($('#schema'), null, "请输入库名");
		return false;
	}else{
		return true;
	}
}

/**
 * 校验用户名,用户名不能为空
 * @returns
 */
function checkUsername(){
	var username = $("#username").val();
	if(ifNull(username)){
		Message.showFieldError($('#username'), null, "请输入用户名");
		return false;
	}else{
		return true;
	}
}

/**
 * 校验密码,密码不能为空
 * @returns
 */
function checkPassword(){
	var password = $("#password").val();
	if(ifNull(password)){
		Message.showFieldError($('#password'), null, "请输入密码");
		return false;
	}else{
		return true;
	}
}

/**
 * 测试连接是否通畅
 * @returns
 */
function checkConnect(){
	if(!checkBaseDbConnRefParam()){
		return false;
	}else{
		$.ajax({
	        cache: true,
	        type: "POST",
	        url: CONTEXT_PATH + '/base/baseDbConnRef/checkConnect',
	        data: $('#baseDbConnRef_input').serialize(),
	        async: false,
	        success: function(data) {
	        	if(!ifNull(data)){
	        		if(data.msg=='success'){
	        			$("#baseDbConnRef_input").removeClass("dirty");
        					getTheMessager().alert('提示', data.success, '', function () {
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