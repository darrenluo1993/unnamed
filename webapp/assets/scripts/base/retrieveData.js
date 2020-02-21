var timeout = 1000;
var index = 0;
var fileName = "";
var fileNames = "";
var channelTypeByESB = "ESB";
var channelTypeByICOP = "ICOP";
var channelTypeByMBP = "108_mbp";

// 校验必填项
function checkInput(){
	var IpAddress = $('#IpAddress').val();
	var serUserName = $('#serUserName').val();
	var serPassword = $('#serPassword').val();
	var filePath = $('#filePath').val();
	
	if (null == IpAddress || '' == IpAddress) {
		Message.showFieldError($('#IpAddress'), null, "请输入IP地址");
		return false;
	}
	if (null == serUserName || '' == serUserName) {
		Message.showFieldError($('#serUserName'), null, "请输入服务器登录名");
		return false;
	}
	if (null == serPassword || '' == serPassword) {
		Message.showFieldError($('#serPassword'), null, "请输入服务器登录密码");
		return false;
	}
	if (null == filePath || '' == filePath) {
		Message.showFieldError($('#filePath'), null, "请输入文件夹路径");
		return false;
	}
	
	return true;
}

// 重置表单
function resetBtn(){
	document.getElementById("retrieveData_list").reset();
	// 重置表单后需要清空table里面的内容
	$('#fileTobdy').html("");
	// remove只读属性
	// 将表单里面的内容设置为只读
	var host = $('#IpAddress').removeAttr("readonly","readonly");
	var serUserName = $('#serUserName').removeAttr("readonly","readonly");
	var serPassword = $('#serPassword').removeAttr("readonly","readonly");
	var protocol = $('#protocol').removeAttr("disabled","disabled");
	var filePath = $('#filePath').removeAttr("readonly","readonly");
	var selectChannel = $('#selectChannel').removeAttr("disabled","disabled");
	$('#queryChannel').removeAttr("readonly","readonly")
	$('#queryChannel').val("");
	fileNames = ""
	hideServerCfg();
}

// 选择协议
function selectProtocol(this_){
	var protocol = $(this_).find("option:selected").text();
	if ("FTP"== protocol) {
		$('#port').val("21");
	}
	if ("SFTP" == protocol) {
		$('#port').val("22");
	}
}

// 显示列表
function jumpNextPage(){
	if (!checkInput()) {
		return false;
	}
	
	var host = $('#IpAddress').val();
	var serUserName = $('#serUserName').val();
	var serPassword = $('#serPassword').val();
	var protocol = $('#protocol option:selected').text();
	var port = $('#port').val();
	var filePath = $('#filePath').val();
	$('#channelType').val("");// 将类型置空
	hideServerCfg();
	
	$.ajax({
		type : "post",
		global : false,
		async : true,
		url : CONTEXT_PATH + '/base/retrieveData/showSelectFile',
		data:{
			host : host,
			serUserName : serUserName,
			serPassword : serPassword,
			protocol : protocol,
			port : port,
			filePath : filePath
	  	},
		dataType : "json",
		success : function(data) {
		 	if (data != null) {
		 		var filesList = data.filesList;
		 		if (typeof(data.error) != "undefined") {
		 			doTheAlert("提示", data.error);
					return;
				}
				if(typeof(filesList) != "undefined" && filesList != null){
					var queryChannel = $('#queryChannel').val();
					// 通过渠道类型区分文件
					var channelType = $('#selectChannel option:selected').val();
					// 对页面上的一些操作
					showRetrieveList();
					// 通过渠道类型获得文件过滤规则
					var logBaseSystem = null;
					if (channelType == channelTypeByMBP) {
						logBaseSystem = getFilteringRules(channelType);
						show108mbpTips(channelType);
					} else {
						$('#108mbpTipsDiv').hide();
					}
					// 遍历List<Map>对象
					for (var j = 0; j < filesList.length; j++) {
						// 每个newsiteMap 都是一个Map对象  已知key的情况下直接通过key获取value值
						var newsiteMap = filesList[j];
						// 构造过滤对象
						var filteObj = new Object();
						filteObj.newsiteMap = newsiteMap;
						filteObj.queryChannel = queryChannel;
						filteObj.channelType = channelType;
						filteObj.logBaseSystem = logBaseSystem;
						// 过滤文件名
						if (!filteringRules(filteObj)) {
							continue;
						}
						var fileName = newsiteMap.fileName;
						var fileSize = newsiteMap.fileSize;
						var fileMTime = newsiteMap.fileMTime;
						$('#allCkbox').attr("checked",false);
						$('#fileTobdy').append(
							"<tr>"
							//+ "<td class='tableBorder tdClass'><input type='radio' name='fileRadio' onclick='checkRedio(this)'></td>"
							+ "<td class='tableBorder tdClass'><input type='checkbox' name='fileCheckBox' onclick='checkboxClick(this)'></td>"
							+ "<td class='tableBorder tdClass'>"
							+ fileName
							+ "</td><td class='tableBorder tdClass'>"
							+ fileSize
							+ "K</td><td class='tableBorder tdClass'>"
							+ fileMTime
							+ "</td></tr>");
					}
				}
			}
		},
		error:function(){
			doTheAlert('提示', errorTip);
		}
	});	
	
}

// 过滤规则
function filteringRules(filteObj){
	// 每个newsiteMap 都是一个Map对象  已知key的情况下直接通过key获取value值
	var fileName = filteObj.newsiteMap.fileName;
	var fileSize = filteObj.newsiteMap.fileSize;
	var fileMTime = filteObj.newsiteMap.fileMTime;
	// 获取文件过滤规则
	var logBaseSystem = filteObj.logBaseSystem;
	// 获取渠道号
	var queryChannel = filteObj.queryChannel;
	// 通过渠道类型区分文件
	var channelType = filteObj.channelType;
	
	if (fileName == null || typeof(fileName) == "undefined") {
		fileName = "";
		return false;
	}
	if (fileSize == null || typeof(fileSize) == "undefined") {
		fileSize = "";
		return false;
	}
	if (fileMTime == null || typeof(fileMTime) == "undefined") {
		fileMTime = "";
		return false;
	}
	if (queryChannel != "" && fileName.indexOf(queryChannel) == -1) {
		return false;
	}
	if (channelType == channelTypeByESB && fileName.indexOf(channelTypeByESB) == -1) {
		return false;
	} else if (channelType == channelTypeByICOP && fileName.indexOf(channelTypeByESB) != -1) {
		return false;
	} else if (channelType == channelTypeByMBP) {
		if (logBaseSystem != null) {
			// 前置报文文件名规则
			var caseFileNameList = logBaseSystem.caseFileNameList;
			// 挡板报文文件名规则
			var baffleFileNameList = logBaseSystem.baffleFileNameList;
			for (var i = 0; i < caseFileNameList.length; i++) {
				if (fileName.indexOf(caseFileNameList[i]) != -1) {
					return true;
				}
			}
			for (var i = 0; i < baffleFileNameList.length; i++) {
				if (fileName.indexOf(baffleFileNameList[i]) != -1) {
					return true;
				}
			}
		}
		return false;
	}
	
	return true;
}

// 通过渠道类型获得文件过滤规则
function getFilteringRules(channelType){
	var logBaseSystem = null;
	$.ajax({
		type : "post",
		global : false,
		async : false,
		url : CONTEXT_PATH + '/base/retrieveData/getFilteringRules',
		data:{
			channelType : channelType
	  	},
		dataType : "json",
		success : function(data) {
		 	if (data != null) {
		 		var filteCheckFlag = data.checkFlag
				if(typeof(filteCheckFlag) != "undefined" ){
					if (filteCheckFlag == "true") {
						logBaseSystem = data.logBaseSystem;
					} else {
						console.log(data.msg);
					}
				}
			}
		},
		error:function(){
			doTheAlert('提示', errorTip);
		}
	});
	return logBaseSystem;
}

function showRetrieveList(){
	// 遍历之前需要清空table里面的内容
	$('#fileTobdy').html("");
	// 将表单里面的内容设置为只读
	$('#IpAddress').attr("readonly","readonly");
	$('#serUserName').attr("readonly","readonly");
	$('#serPassword').attr("readonly","readonly");
	$('#protocol').attr("disabled","disabled");
	$('#port').attr("readonly","readonly");
	$('#filePath').removeAttr("readonly","readonly");
	$('#selectChannel').removeAttr("disabled","disabled");
	$('#queryChannel').removeAttr("readonly","readonly");
	var queryChannel = $('#queryChannel').val();
	// 通过渠道类型区分文件
	var channelType = $('#selectChannel option:selected').val();
	$('#channelType').val(channelType);
	// 展示DIV
	$('#serverCfg').show();
	if (channelType == channelTypeByESB) {
		$('#systemNameId').val("核心");
	} 
	if (channelType == channelTypeByICOP) {
		$('#systemNameId').val("渠道整合与运营平台");
	}
	if (channelType == channelTypeByMBP) {
		$('#systemNameId').val("柜面_前置");
	}
}


// 解析日志文件
function resolveLogByFileNames(){
	var fileCheckBoxs = $('input[name="fileCheckBox"]:checked');
	// 获取隐藏域中的渠道类型
	var channelType = $('#channelType').val();
	fileNames = "";
	//console.log("fileCheckBoxs length:" + fileCheckBoxs.length);
	if (fileCheckBoxs.length < 1) {
		doTheAlert("提示","请选择文件");
		return false;
	}
	// 如果是MBP渠道  至少选中一个案例和挡板文件
	if (channelType == channelTypeByMBP) {
		var logBaseSystem = getFilteringRules(channelType);
		// 前置报文文件名规则
		var caseFileNameList = logBaseSystem.caseFileNameList;
		// 挡板报文文件名规则
		var baffleFileNameList = logBaseSystem.baffleFileNameList;
		var caseFileFlag = false;
		var baffleFileFlag = false;
		fileCheckBoxs.each(function(){
			var fn = $(this).parent().next().text();
			if (caseFileNameList != null && typeof(caseFileNameList) != 'undefined') {
				for (var i = 0; i < caseFileNameList.length; i++) {
					if (fn.indexOf(caseFileNameList[i]) != -1) {
						caseFileFlag = true;
						break;
					}
				}
			}
		});
		fileCheckBoxs.each(function(){
			var fn = $(this).parent().next().text();
			if (baffleFileNameList != null && typeof(baffleFileNameList) != 'undefined') {
				for (var i = 0; i < baffleFileNameList.length; i++) {
					if (fn.indexOf(baffleFileNameList[i]) != -1) {
						baffleFileFlag = true;
						break;
					}
				}
			}
		});
		if (!caseFileFlag) {
			doTheAlert("提示","请选择前置报文文件");
			return false;
		}
		if (!baffleFileFlag) {
			doTheAlert("提示","请选择挡板报文文件");
			return false;
		}
	}
	fileCheckBoxs.each(function(){
		var fn = $(this).parent().next().text();
		fileNames += fn + ",";
	});
	//console.log("fileNames:" + fileNames);
	var host = $('#IpAddress').val();
	var serUserName = $('#serUserName').val();
	var serPassword = $('#serPassword').val();
	var protocol = $('#protocol option:selected').text();
	var port = $('#port').val();
	var filePath = $('#filePath').val();
	// 通过渠道类型区分文件
	//var channelType = $('#selectChannel option:selected').val();
	var interfaceCode = $('#interfaceCode').val();
	var respCode = $('#respCode').val();
	var reg = /^[A-Za-z0-9]+$/;
	var t=reg.test("13355346778");
	// 校验接口编码和响应吗是否包含特殊字符
	if ('' != interfaceCode && !reg.test(interfaceCode)) {
		Message.showFieldError($('#interfaceCode'), null, "非法参数，请输入数字或字母!");
		return false;
	}
	if ('' != respCode && !reg.test(respCode)) {
		Message.showFieldError($('#respCode'), null, "非法参数，请输入数字或字母!");
		return false;
	}
	
	window.open(CONTEXT_PATH + '/base/retrieveData/resultShow?host=' + host
			+ '&serUserName=' + serUserName + '&serPassword=' + serPassword
			+ '&protocol=' + protocol + '&port=' + port + '&filePath='
			+ filePath + '&channelType=' + channelType
			+ '&interfaceCode=' + interfaceCode + '&respCode=' + respCode + '&fileNames='
			+ fileNames, {
		width : '60%'});
	// 1.5s后开始轮询
	setTimeout(pollingSingleToRemotelyFile,1500);
}

// 轮询
function pollingSingleToRemotelyFile(){
	if (null == fileNames || '' == fileNames) {
		doTheAlert("提示","文件名为空");
		return false;
	}
	// 获取隐藏域中的渠道类型
	var hiddenChannelType = $('#channelType').val();
	//console.log("hiddenChannelType："+hiddenChannelType);
	$.ajax({
		type : "post",
		global : false,
		async : true,
		url : CONTEXT_PATH + '/base/retrieveData/resolveLog',
		data:{
			fileNames : fileNames
	  	},
		dataType : "json",
		beforeSend : function(){
			index++;
			console.log('pollingSingleToRemotelyFile 执行第' + index + '次轮询timetout:' + timeout);
		},
		success : function(data) {
		 	if (data != null) {
		 		var logFileHandleStatusList = data.logFileHandleStatusList;
		 		if (typeof(logFileHandleStatusList) != "undefined") {
		 			var listStatus = logFileHandleStatusList.listStatus;// 文件最终状态
		 			var logFileStatusList = logFileHandleStatusList.logFileHandleStatusList;// 每个文件的状态
		 			//console.log("listStatus:"+listStatus);
		 			if (listStatus == 1) {// 处理失败
		 				doTheAlert("提示","文件处理失败");
		 				//console.log("文件处理失败");
		 				settingStatus(logFileStatusList);
		 				index = 0;
		 				return;
		 			}
		 			if (listStatus == 3) {// 处理成功
		 				//console.log("文件处理完成");
		 				settingStatus(logFileStatusList);
		 				index = 0;
		 				// 前置渠道(MBP)跳转到另一个页面
						if (channelTypeByMBP == hiddenChannelType) {
							closePage();
							window.open(CONTEXT_PATH + '/base/retrieveData/gotoRetrieveDataPageForMbp?type=case&baffleService=case', {width : '90%'});
						} else {
							window.open(CONTEXT_PATH + '/base/retrieveData/resultTotal?fileNames='+fileNames, {width : '90%'});
						}
		 				return;
		 			}
		 			timeout += 1000;
	 				if(timeout > 10000){
	 					timeout = 10000;
	 				}
		 			if (listStatus == 0) {// 未处理
		 				//console.log("文件未处理");
		 				settingStatus(logFileStatusList);
						setTimeout(pollingSingleToRemotelyFile,timeout);
					}
		 			if (listStatus == 2) {// 处理中
		 				//console.log("正在处理文件");
		 				/*if (fileStatusList.length < 4) {
		 					deleteEhcacheForResultShow(fileName);
						}*/
		 				settingStatus(logFileStatusList);
		 				setTimeout(pollingSingleToRemotelyFile,timeout);
					}
		 			
				}
			}
		},
		error:function(){
			doTheAlert('提示', errorTip);
		}
	});	
}

// 校验文件是否正在处理
function checkRemotelyFile(fileName){
	var checkRfFlag = true;
	$.ajax({
		type : "post",
		global : false,
		async : false,
		url : CONTEXT_PATH + '/base/retrieveData/checkRemotelyFile',
		data:{
			fileName : fileName
	  	},
		dataType : "json",
		success : function(data) {
		 	if (data != null) {
		 		if (typeof(data.error) != "undefined") {
		 			doTheAlert("提示", data.error);
					checkRfFlag = false;
				}
			}
		},
		error:function(){
			doTheAlert('提示', errorTip);
		}
	});	
	return checkRfFlag;
}

function settingStatus(logFileStatusList){
	for (var j = 0; j < logFileStatusList.length; j++) {
		var fileStatusList = logFileStatusList[j].list;// 文件中每个步骤的状态
		var logFileName = logFileStatusList[j].logFileName;// 文件名称
		logFileName = logFileName.replace(/\./g,"-");
		for (var i = 0; i < fileStatusList.length; i++) {
			var stepStatus = fileStatusList[i].stepStatus;
			//console.log("每个流程的当前状态stepStatus:"+stepStatus+"---logFileName:"+logFileName);
			var msg = "";
			switch(stepStatus){
			case 0:
				msg = "/assets/styles/themes/icons/edit_remove.png";
				break;
			case 1:
				msg = "/assets/styles/themes/icons/cancel.png";
				break;
			case 2:
				msg = "/assets/styles/themes/default/images/loading.gif";
				break;
			case 3:
				msg = "/assets/styles/themes/icons/check.png";
				break;
			}
			if (i == 0) {
				$('#'+logFileName +' [name=downFile]').empty();
				$('#'+logFileName +' [name=downFile]').append('<img src='+CONTEXT_PATH+msg+' style="width:16px;height:16px">');
				continue;
			}
			if (i == 1) {
				$('#'+logFileName+' [name=decompressionFile]').empty();
				$('#'+logFileName+' [name=decompressionFile]').append('<img src='+CONTEXT_PATH+msg+' style="width:16px;height:16px">');
				continue;
			}
			if (i == 2) {
				$('#'+logFileName+' [name=analysisFile]').empty();
				$('#'+logFileName+' [name=analysisFile]').append('<img src='+CONTEXT_PATH+msg+' style="width:16px;height:16px">');
				continue;
			}
			if (i == 3) {
				$('#'+logFileName+' [name=generateFile]').empty();
				$('#'+logFileName+' [name=generateFile]').append('<img src='+CONTEXT_PATH+msg+' style="width:16px;height:16px">');
				continue;
			}
		}
	}
}

/**
 * 界面展示完毕后清理缓存
 * @returns
 */
function deleteEhcacheForResultShow(fileName){
	$.ajax({
		type : "post",
		global : false,
		async : true,
		url : CONTEXT_PATH + '/base/retrieveData/deleteEhcacheForResultShow?fileName=' + fileName,
		success : function(data) {
		},
		error : function() {
			doTheAlert("提示",errorTip);
		}
	});
}

// 将隐藏域隐藏并置空
function hideServerCfg(){
	// 将DIV设置隐藏
	$('#serverCfg').hide();
	//$('#108mbpTipsDiv').hide();
	// 将按钮设置为不可点击
	//$('#resolve').attr("disabled","disabled");
	// 清空隐藏框的内容
	$('#fileName').val("");
	$('#channel').val("");
	$('#systemNameId').val("");
	$('#interfaceCode').val("");
	$('#respCode').val("");
}

// 校验文件名是否正确
function checkFileName(this_){
	var fileName = $(this_).parent().next().text();
	if (fileName.length < 11) {
		doTheAlert("提示","请选择正确格式的文件");
		hideServerCfg();
		return false;
	}
	// 判断选择的文件名后缀是否为.gz格式
	var suffix = fileName.substring(fileName.length-3);
	if ("" == suffix || null == suffix || typeof(suffix) == "undefined" ||".gz" != suffix) {
		doTheAlert("提示","文件名格式不正确，请选择 .gz 类型的文件");
		hideServerCfg();
		return false;
	}
	var arr = fileName.split("-");
	var channel = arr[0].substr(0, arr[0].length - 5);
	var channelType = "";
	if (channel.indexOf("ESB") != -1) {
		channel = channel.replace("ESB", "");
		if (channel.indexOf("_") == 0) {
			channel = channel.substring(1);
		}
		channelType = channelTypeByESB;
	} else {
		channelType = channelTypeByICOP;
	}
	if (channel.indexOf(".") != -1) {
		channel = channel.substring(0,channel.indexOf("."));
	}
	//console.log("subString channel:"+channel+"--channelType:"+channelType);
	if (!checkFileByExcel(channelType,channel)) {
		//console.log("false");
		return false;
	}
	//console.log("true");
	
	return true;
}

// 校验是否存在此渠道号
function checkFileByExcel(channelType,channel){
	var checkFileByExcelFlag = true;
	$.ajax({
		type : "post",
		global : false,
		async : false,
		url : CONTEXT_PATH + '/base/retrieveData/checkFileName',
		data:{
			channelType : channelType,
			channel : channel
	  	},
		dataType : "json",
		success : function(data) {
		 	if (data != null) {
		 		var errorMsg = data.error;
				if(typeof(data.error) != "undefined" && '' != errorMsg && null != errorMsg){
					checkFileByExcelFlag = false;
					doTheAlert("提示", errorMsg);
				}
			}
		},
		error:function(){
			doTheAlert('提示', errorTip);
		}
	});	
	return checkFileByExcelFlag;
}

// checkbox点击事件
function checkboxClick(this_){
	// 通过渠道类型区分文件
	var channelType = $('#selectChannel option:selected').val();
	if(this_.checked){
		// 全部选中时  将全选框设置为选中
		var fileCheckBoxs = $('input[name="fileCheckBox"]');
		var allCheckboxFlag = true;
		fileCheckBoxs.each(function(){
			if (!$(this).is(":checked")) {
				allCheckboxFlag = false;
			}
		});
		if (allCheckboxFlag) {
			$('#allCkbox').attr("checked","checked");
			$('#allCkbox').prop("checked","checked");
		}
		// 2018/04/02 前置系统不需要校验渠道标识
		if (channelType != channelTypeByMBP) {
			// 校验当前选中的文件
			if (!checkFileName(this_)) {
				$(this_).attr("checked",false);
			} else {
				$(this_).attr("checked","checked");
			}
		}
	} else {
		// 将全选按钮取消选中
		$('#allCkbox').removeAttr("checked","checked");
		$(this_).removeAttr("checked","checked");
	}
}

//全选按钮
function allCheckbox(this_){
	var fileCheckBoxs = $('[name=fileCheckBox]');
	var checkFileNameFlag = true;
	// 通过渠道类型区分文件
	var channelType = $('#selectChannel option:selected').val();
	// 判断全选按钮是否选中
	if(this_.checked){
		// 2018/04/02 前置系统不需要校验渠道标识
		if (channelType != channelTypeByMBP) {
			fileCheckBoxs.each(function(){
				// 调用校验的方法
				if (!checkFileName($(this))) {
					checkFileNameFlag = false;
				}
			});
		}
		// 校验通过 将所有的checkbox设置为选中
		if (checkFileNameFlag) {
			fileCheckBoxs.attr("checked","checked");
			fileCheckBoxs.prop("checked","checked");
		} else {
			$(this_).removeAttr("checked");
		}
	} else {
		fileCheckBoxs.removeAttr("checked");
	}
	
}

// 解析日志文件
function openDetail(fileName){
	var filenames = $("#filenames").val();
	window.open(CONTEXT_PATH + '/base/retrieveData/resultDetail?fileName='
			+ fileName, {width : '80%'});
}

function selectedChannel(){
	var channelType = $('#selectChannel option:selected').val();
	var systemNameId = $('#systemNameId').val();
	if (channelType == channelTypeByESB) {
		$('#selectChannel').attr("title","核心");
		$('#IpAddress').val("162.16.6.237");
		$('#serUserName').val("atp");
		$('#serPassword').val("atp123");
		$('#filePath').val("/home/atp/logfiles");
	} 
	if (channelType == channelTypeByICOP) {
		$('#selectChannel').attr("title","渠道整合与运营平台");
		$('#IpAddress').val("162.16.6.237");
		$('#serUserName').val("atp");
		$('#serPassword').val("atp123");
		$('#filePath').val("/home/atp/logfiles");
	}
	if (channelType == channelTypeByMBP) {
		$('#selectChannel').attr("title","柜面_前置");
		$('#IpAddress').val("162.16.1.13");
		$('#serUserName').val("mbp");
		$('#serPassword').val("mbp");
		$('#filePath').val("/mbp/lhp/20180408/TIPS/");
		/*if (null != systemNameId && '' != systemNameId) {
			 $('#systemNameId').val("柜面_前置");
		}*/
	}
}

function show108mbpTips(channelType){
	if (channelType != channelTypeByMBP) {
		return false;
	}
	$('#108mbpTipsDiv').show();
	// 通过渠道类型获得文件过滤规则
	var logBaseSystem = getFilteringRules(channelType);
	if (null != logBaseSystem && typeof(logBaseSystem) != 'undefined') {
		// 前置报文文件名规则
		var caseFileNameList = logBaseSystem.caseFileNameList;
		// 挡板报文文件名规则
		var baffleFileNameList = logBaseSystem.baffleFileNameList;
		$('#108mbpTipsSpan').empty();
		var str = "&nbsp;&nbsp;&nbsp;&nbsp;* 带有以下前缀的文件是前置文件：";
		for (var i = 0; i < caseFileNameList.length; i++) {
			str += caseFileNameList[i];
			if (i != caseFileNameList.length - 1) {
				str += "，";
			}
		}
		str += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;* 带有以下前缀的文件是挡板文件："
		for (var i = 0; i < baffleFileNameList.length; i++) {
			str += baffleFileNameList[i];
			if (i != baffleFileNameList.length - 1) {
				str += "，";
			}
		}
		$('#108mbpTipsSpan').append(str);
	}
}