var sessionId;
var packetCreateTimer;
var configSaveTimer;
var percent = 10;

Observation.baseFields_packetCreate = function(container) {
	var obj = $('#baseFields_packetConfig_form', container);
	obj.each(function() {
		
		percent = 10;
		
		$('#baseFields_config_isNotExist_li').click(function(){
			$('#baseFields_config_isExist_li a').css('color','#333');
		});
		$('#baseFields_config_isExist_li').click(function(){
			$('#baseFields_config_isExist_li a').css('color','green');
		});
	});
}

/**
 * 报文模式新增
 * @returns
 */
function packetCreate(){
	var sysId = $('#list_sysId').val();
	if(null == sysId || typeof(sysId) == "undefined" || sysId == ''){
		doTheAlert('提示', '请先选择系统！');
		return false;
	}
	window.open(CONTEXT_PATH + '/base/baseFields/packet?sysId=' + sysId,{width:'80%'});
}

/**
 * 报文模式新增下一步
 * @returns
 */
function packetCreateNext(){
	var sysId = $('#packetCreate_sysId').val();
	var systemName = $('#packetCreate_systemName').val();
	var msgType = $('#packetCreate_msgTypeId option:selected').text();
	var packetText = $('#packetCreate_packetText').val();
	if(!checkParamForPacketCreate()){
		return false;
	}
	$('#packetCreateNextButton').button('loading');
	$('#packetCreate_progressbarDiv').css('display','');
	updateUploadProgressForPacketCreate();
	$.ajax({
        type: "POST",
        url: CONTEXT_PATH + '/base/baseFields/savePacketCreateToEhcache',
        data: {
        	sysId : sysId,
        	systemName : systemName,
        	msgType : msgType,
        	packetText : packetText
        },
        async: true,
        success: function(data) {
        	if(null != data && typeof(data) != 'undefined' && '' != data){
        		if(data.msg=='success'){
        			window.clearTimeout(packetCreateTimer);
        			$('#resetProgressForConfigSave').css('width', '100%');
        			$('#resetProgressForConfigSave').html('生成配置完成' + '100%');
        			sessionId = data.sessionId;
        			setTimeout(gotoPacketCreateNext,500);
        			setTimeout(resetProgressForPacketCreate,2000);
        		}else{
        			doTheAlert('提示', data.error);
        			resetProgressForPacketCreate();
        		}
        	}else{
        		doTheAlert('提示', '请求后台服务失败');
        		resetProgressForPacketCreate();
        	}
        },
		error: function() {
			doTheAlert('提示', errorTip);
			resetProgressForPacketCreate();
		}
    });
}

function checkParamForPacketCreate(){
	var sysId = $('#packetCreate_sysId').val();
	if ('' == sysId || null == sysId || typeof(sysId) == 'undefined') {
		doTheAlert('提示','请输入系统编码');
		return false;
	}
	var systemName = $('#packetCreate_systemName').val();
	if ('' == systemName || null == systemName || typeof(systemName) == 'undefined') {
		doTheAlert('提示','请输入系统名称');
		return false;
	}
	var msgType = $('#packetCreate_msgTypeId option:selected').text();
	if ('' == msgType || null == msgType || typeof(msgType) == 'undefined') {
		doTheAlert('提示','请选择报文类型');
		return false;
	}
	var packetText = $('#packetCreate_packetText').val();
	if ('' == packetText || null == packetText || typeof(packetText) == 'undefined') {
		doTheAlert('提示','请粘贴报文');
		return false;
	}
	return true;
}

/**
 * 跳转至报文新增下一步
 * @returns
 */
function gotoPacketCreateNext(){
	window.open(CONTEXT_PATH + '/base/baseFields/config?sessionId=' + sessionId,{width:'80%'});
}

/**
 * 更新生成配置进度条
 * @returns
 */
function updateUploadProgressForPacketCreate(){
	$('#packetCreate_progressbarId').css('width', percent + '%');
	$('#packetCreate_progressbarId').html('生成配置中...' + percent + '%');
	if(percent <90){
		percent = percent + 10;
		packetCreateTimer = window.setTimeout(updateUploadProgressForPacketCreate,500);
	}
}

/**
 * 还原生成配置进度条
 * @returns
 */
function resetProgressForPacketCreate(){
	$('#packetCreateNextButton').button('reset');
	$('#packetCreate_progressbarId').css('width', '0%');
	$('#packetCreate_progressbarId').html('');
	$('#packetCreate_progressbarDiv').css('display','none');
}

/**
 * 更新保存进度条
 * @returns
 */
function updateUploadProgressForConfigSave(){
	$('#baseFields_config_progressbarId').css('width', percent + '%');
	$('#baseFields_config_progressbarId').html('保存字典中...' + percent + '%');
	if(percent <90){
		percent = percent + 10;
		configSaveTimer = window.setTimeout(updateUploadProgressForConfigSave,500);
	}
}

/**
 * 还原保存进度条
 * @returns
 */
function resetProgressForConfigSave(){
	$('#saveBaseFieldsConfigBtn').button('reset');
	$('#baseFields_config_progressbarId').css('width', '0%');
	$('#baseFields_config_progressbarId').html('');
	$('#baseFields_config_progressbarDiv').css('display','none');
}

/**
 * 取消报文新增
 * @returns
 */
function closePacketCreatePage(){
	$('#packetCreateCloseBtn').click();
}

/**
 * 改变select事件
 * @param e
 * @returns
 */
function changeSelectFn(e){
	var parentParentNode = e.parentNode.parentNode;
	$(parentParentNode).attr('changed',true);
	$(parentParentNode).css('background-color','orange');
}

/**
 * 双击变可编辑状态
 * @param e
 * @returns
 */
function ondblclickChangeSpan2Input(e){
	if(e.childNodes[0].nodeName == 'SPAN'){
		var inputNode = '<input type="text" value="' + e.childNodes[0].textContent + '"></input>';
		$(e).html(inputNode);
		var parentNode = e.parentNode;
		$(parentNode).attr('changed',true);
		$(parentNode).css('background-color','orange');
	}
}

/**
 * 保存字典
 * @returns
 */
function saveBaseFieldsConfig(){
	updateUploadProgressForConfigSave();
	var jsonArr = getFieldValueFromTable();
	var jsonData = JSON.stringify(jsonArr);
	var sysId = $('#configSave_sysId').val();
	$.ajax({
        type: "POST",
        url: CONTEXT_PATH + '/base/baseFields/saveBaseFieldsConfig',
        data: {
        	jsonData : jsonData,
        	sysId : sysId
        },
        async: true,
        success: function(data) {
        	if(null != data && typeof(data) != 'undefined' && '' != data){
        		if(data.msg=='success'){
        			window.clearTimeout(configSaveTimer);
        			$('#packetCreate_progressbarId').css('width', '100%');
        			$('#packetCreate_progressbarId').html('保存字典完成' + '100%');
        			setTimeout(resetProgressForConfigSave,2000);
        			$.messager.alert('提示','保存成功','',function() {
        				closePage();
        				closePacketCreatePage();
        			});
        		}else{
        			doTheAlert('提示', data.error);
        			resetProgressForConfigSave();
        		}
        	}else{
        		doTheAlert('提示', '请求后台服务失败');
        		resetProgressForConfigSave();
        	}
        },
		error: function() {
			doTheAlert('提示', errorTip);
			resetProgressForConfigSave();
		}
    });
}

function getFieldValueFromTable(){
	var tbodyNodes = $('.baseFieldConfigTable tbody');
	var jsonArr = [];
	for (var a=0;a<tbodyNodes.length;a++) {
		var tbodyNode = tbodyNodes.get(a);
		var trNodes = tbodyNode.getElementsByTagName("TR");
		for (var i=0;i<trNodes.length;i++) {
			if(trNodes[i].getAttribute('changed')){
				var trNode = trNodes[i];
				var tdNodes = trNode.getElementsByTagName("TD");
				var json = {};
				json.id = tdNodes[0].getElementsByTagName('INPUT')[0].value;
				json.fieldName = tdNodes[0].getElementsByTagName('SPAN')[0].textContent;
				if(tdNodes[1].childNodes[0].nodeName=='INPUT'){
					json.fieldDesc = tdNodes[1].getElementsByTagName('INPUT')[0].value;
				}else if(tdNodes[1].childNodes[0].nodeName=='SPAN'){
					json.fieldDesc = tdNodes[1].getElementsByTagName('SPAN')[0].textContent;
				}
				json.fieldType = tdNodes[2].getElementsByTagName('SELECT')[0].value;
				if(tdNodes[3].childNodes[0].nodeName=='INPUT'){
					json.fieldLength = tdNodes[3].getElementsByTagName('INPUT')[0].value;
				}else if(tdNodes[3].childNodes[0].nodeName=='SPAN'){
					json.fieldLength = tdNodes[3].getElementsByTagName('SPAN')[0].textContent;
				}
				if(tdNodes[4].childNodes[0].nodeName=='INPUT'){
					json.remark = tdNodes[4].getElementsByTagName('INPUT')[0].value;
				}else if(tdNodes[4].childNodes[0].nodeName=='SPAN'){
					json.remark = tdNodes[4].getElementsByTagName('SPAN')[0].textContent;
				}
				jsonArr.push(json);
			}
		}
	}
	return jsonArr;
}