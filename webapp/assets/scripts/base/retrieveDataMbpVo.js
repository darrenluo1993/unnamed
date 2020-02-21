Observation.retrieveDataMbpSelect_div = function(container) {
	var obj1 = $('#retrieveDataMbpSelect_div', container);
	obj1.each(function() {
		var flag = false;
		$('#retrieveDataMbpSelect_tab li').each(function(){
			if($(this).attr('class')=='active'){
				flag = true;
			}
		});
		if(!flag){
			$('#retrieveDataMbpSelect_tab').find('li').eq(0).addClass('active');
			$('#retrieveDataMbpSelect_tabContent').find('div').eq(0).addClass('tab-pane fade in active');
		}
	});
	$('#case_req_case_div input[type="radio"]').each(function(){
		this.name = "case_req_radio";
	});
	$('#case_req_case_div input[type="radio"]').click(function(){
		$('#case_req_case_div input[type="radio"]').each(function(){
			$(this).parent().parent().removeClass('selected');
		});
		if(this.checked){
			$(this).parent().parent().addClass('selected');
		}else{
			$(this).parent().parent().removeClass('selected');
		}
	});
	$('#case_resp_case_div input[type="radio"]').each(function(){
		this.name = "case_resp_radio";
	});
	$('#case_resp_case_div input[type="radio"]').click(function(){
		$('#case_resp_case_div input[type="radio"]').each(function(){
			$(this).parent().parent().removeClass('selected');
		});
		if(this.checked){
			$(this).parent().parent().addClass('selected');
		}else{
			$(this).parent().parent().removeClass('selected');
		}
	});
}

Observation.baffleSelect_div = function(container) {
	var obj1 = $('#baffleSelect_div', container);
	obj1.each(function() {
		var baffleflag = false;
		$('#baffleSelect_tab li').each(function(){
			if($(this).attr('class')=='active'){
				baffleflag = true;
			}
		});
		if(!baffleflag){
			$('#baffleSelect_tab').find('li').eq(0).addClass('active');
			$('#baffleSelect_tabContent').find('div').eq(0).addClass('tab-pane fade in active');
		}
	});
	// 控制baffle-tab 不同tab页的分页列表
	$('#baffleSelect_tab li').each(function(){
		var baffleService = $(this).find('input').eq(0).val();
		if(null != baffleService && '' != baffleService && typeof(baffleService) != 'undefined'){
			// 控制baffle-req分页列表单选按钮事件
			$('#baffle_req_' + baffleService + '_div input[type="radio"]').each(function(){
				this.name = 'baffle_req_' + baffleService + '_radio';
				var reqBafflePacketId = $('#baffleSelect_' + baffleService + '_tr').find("td").eq(0).find("input").val();
				if(null != reqBafflePacketId && '' != reqBafflePacketId && typeof(reqBafflePacketId) != 'undefined' && this.value == reqBafflePacketId){
					this.checked = 'checked';
					$(this).parent().parent().addClass('selected');
				}
			});
			$('#baffle_req_' + baffleService + '_div input[type="radio"]').click(function(){
				setBaffleCogTable(baffleService,'req',this);
				$('#baffle_req_' + baffleService + '_div input[type="radio"]').each(function(){
					$(this).parent().parent().removeClass('selected');
				});
				if(this.checked){
					$(this).parent().parent().addClass('selected');
				}else{
					$(this).parent().parent().removeClass('selected');
				}
			});
			// 控制baffle-resp分页列表单选按钮事件
			$('#baffle_resp_' + baffleService + '_div input[type="radio"]').each(function(){
				this.name = 'baffle_resp_' + baffleService + '_radio';
				var respBafflePacketId = $('#baffleSelect_' + baffleService + '_tr').find("td").eq(4).find("input").val();
				if(null != respBafflePacketId && '' != respBafflePacketId && typeof(respBafflePacketId) != 'undefined' && this.value == respBafflePacketId){
					this.checked = 'checked';
					$(this).parent().parent().addClass('selected');
				}
			});
			$('#baffle_resp_' + baffleService + '_div input[type="radio"]').click(function(){
				setBaffleCogTable(baffleService,'resp',this);
				$('#baffle_resp_' + baffleService + '_div input[type="radio"]').each(function(){
					$(this).parent().parent().removeClass('selected');
				});
				if(this.checked){
					$(this).parent().parent().addClass('selected');
				}else{
					$(this).parent().parent().removeClass('selected');
				}
			});
		}
	});
	
}

/**
 * 动态设置挡板配置table
 * @param packetType
 * @param e
 * @returns
 */
function setBaffleCogTable(baffleService,packetType,e){
	var packetId = $(e).parent().parent().find("td").eq(0).find("input").val();
	var serviceCode = $(e).parent().parent().find("td").eq(1).text();
	var fileName = $(e).parent().parent().find("td").eq(2).text();
	var pId = $(e).parent().parent().find("td").eq(3).text();
	var time = $(e).parent().parent().find("td").eq(4).text();
	if(packetType == 'req'){
		var addInputHidden = '<input type="hidden" value="' + packetId + '"/>';
		$('#baffleSelect_' + baffleService + '_tr').find("td").eq(0).text(serviceCode);
		$('#baffleSelect_' + baffleService + '_tr').find("td").eq(0).prepend(addInputHidden);
		$('#baffleSelect_' + baffleService + '_tr').find("td").eq(1).text(fileName);
		$('#baffleSelect_' + baffleService + '_tr').find("td").eq(2).text(pId);
		$('#baffleSelect_' + baffleService + '_tr').find("td").eq(3).text(time);
	}
	if(packetType == 'resp'){
		var addInputHidden = '<input type="hidden" value="' + packetId + '"/>';
		$('#baffleSelect_' + baffleService + '_tr').find("td").eq(4).text(serviceCode);
		$('#baffleSelect_' + baffleService + '_tr').find("td").eq(4).prepend(addInputHidden);
		$('#baffleSelect_' + baffleService + '_tr').find("td").eq(5).text(fileName);
		$('#baffleSelect_' + baffleService + '_tr').find("td").eq(6).text(pId);
		$('#baffleSelect_' + baffleService + '_tr').find("td").eq(7).text(time);
	}
	checkBaffleCogTable(baffleService);
}

/**
 * 切换挡板服务事件
 * @param baffleService
 * @returns
 */
function changeBaffleSelect(baffleService){
	checkBaffleCogTable(baffleService);
}

/**
 * 校验挡板配置是否全部配置完成
 * @param baffleService
 * @returns
 */
function checkBaffleCogTable(baffleService){
	var reqBaffleReqId = $('#baffleSelect_' + baffleService + '_tr').find("td").eq(0).find("input").val();
	var respBaffleReqId = $('#baffleSelect_' + baffleService + '_tr').find("td").eq(4).find("input").val();
	var baffleServiceId = $('#baffleSelect_' + baffleService + '_select option:selected').val();
	var flag = true;
	if(null == reqBaffleReqId || '' == reqBaffleReqId || typeof(reqBaffleReqId) == 'undefined'){
		flag = false;
	}
	if(null == respBaffleReqId || '' == respBaffleReqId || typeof(respBaffleReqId) == 'undefined'){
		flag = false;
	}
	if(null == baffleServiceId || '' == baffleServiceId || typeof(baffleServiceId) == 'undefined'){
		flag = false;
	}
	if(!flag){
		var myGlyphiconEdit = '<i class="glyphicon glyphicon-edit myGlyphicon-edit"></i>';
		$('#baffleSelect_' + baffleService + '_tr').find("td").eq(9).html(myGlyphiconEdit);
		$('#baffleSelect_tab li').each(function(){
			if($(this).attr('class')=='active'){
				$(this).find("a").eq(0).find("span").attr('class','myGlyphicon-edit');
				$(this).find("a").eq(0).find("i").attr('class','glyphicon glyphicon-edit myGlyphicon-edit');
			}
		});
		return false;
	}
	var myGlyphiconCheck = '<i class="glyphicon glyphicon-check myGlyphicon-check"></i>';
	$('#baffleSelect_' + baffleService + '_tr').find("td").eq(9).html(myGlyphiconCheck);
	$('#baffleSelect_tab li').each(function(){
		if($(this).attr('class')=='active'){
			$(this).find("a").eq(0).find("span").attr('class','myGlyphicon-check');
			$(this).find("a").eq(0).find("i").attr('class','glyphicon glyphicon-check myGlyphicon-check');
		}
	});
	var json = {};
	json.reqBaffleReqId = reqBaffleReqId;
	json.respBaffleReqId = respBaffleReqId;
	json.baffleServiceId = baffleServiceId;
	return json;
}

var baffleIconObj;

/**
 * 挡板配置提交
 * @param type
 * @returns
 */
function retrieveDataMbpBaffleSubmit(type){
	var baffleCogArr = [];
	var checkFlag = true;
	$('#baffleSelect_tab li').each(function(){
		var json = {};
		var channelId = $(this).find('input').eq(0).val();
		var description = $(this).find('input').eq(0).attr("name");
		json.channelId = channelId;
		json.description = description;
		var result = checkBaffleCogTable(channelId);
		if(!result){
			doTheAlert('提示','请先配置' + description + '的挡板服务!');
			checkFlag = false;
			return false;
		}
		json.baffleServiceId = result.baffleServiceId;
		json.reqBafflePacketId = result.reqBaffleReqId;
		json.respBafflePacketId = result.respBaffleReqId;
		baffleCogArr.push(json);
	});
	if(!checkFlag){
		return false;
	}
	var baffleCogArrJson = JSON.stringify(baffleCogArr);
	var reqPacketId = $('#baffleSelect_reqPacketId').val();
	var respPacketId = $('#baffleSelect_respPacketId').val();
	var type = $('#baffleSelect_type').val();
	var filterStr = $('#baffleCogFilterStr').val();
	$.ajax({
		type : "post",
		global : false,
		async : true,
		url : CONTEXT_PATH + '/base/retrieveDataMbpVo/retrieveDataMbpBaffleSubmit',
		dataType : "json",
		data : {
			baffleCogArrJson : baffleCogArrJson,
			reqPacketId : reqPacketId,
			respPacketId : respPacketId,
			type : type,
			filterStr : filterStr
		},
		success : function(data) {
			if(null != data && typeof(data) != "undefined"){
				if(data.msg=="success"){
					$('#baffleCogFilterStr').val(data.filterStr);
					closePage();
					doTheAlert('提示','保存挡板配置成功!');
					$(baffleIconObj).attr('class','glyphicon glyphicon-ok myGlyphicon-ok');
				}else{
					doTheAlert('提示',data.error);
				}
			}else{
				doTheAlert('提示','保存挡板配置失败');
			}
		},
		error : function() {
			doTheAlert("提示",errorTip);
		}
	});
}

/**
 * 下一步(跳转至案例预览tab)
 * @returns
 */
function retrieveDataMbpCaseConfigNext(){
	$('#selectResultTabId').click();
}

/**
 * 上一步(跳转至案例匹配tab)
 * @returns
 */
function retrieveDataMbpCaseConfigLast(){
	$('#selectCaseTabId').click();
}

/**
 * 提交
 * @returns
 */
function retrieveDataMbpSubmit(){
	var inputTrObj = $('#retrieveDataMbpSelect_tbody tr');
	if(inputTrObj.length == 0){
		doTheAlert('提示','请先匹配一组案例!');
		return false;
	}
	var caseConfigArr = [];
	for (var i = 0; i < inputTrObj.length; i++) {
		var json = {};
		json.reqPacketId = $(inputTrObj[i]).find("td").eq(0).find("input").val();
		json.respPacketId = $(inputTrObj[i]).find("td").eq(4).find("input").val();
		json.channelId = $(inputTrObj[i]).find("td").eq(1).find("input").val();
		caseConfigArr.push(json);
	}
	var caseConfigJson = JSON.stringify(caseConfigArr);
	$.ajax({
		type : "post",
		global : false,
		async : true,
		url : CONTEXT_PATH + '/base/retrieveDataMbpVo/retrieveDataMbpSubmit',
		dataType : "json",
		data : {
			caseConfigJson : caseConfigJson
		},
		success : function(data) {
			if(null != data && typeof(data) != "undefined"){
				if(data.msg=="success"){
					doTheAlert('提示','案例保存成功,挡板启用成功');
					$('#retrieveDataMbp_closeAll').click();
				}else{
					doTheAlert('提示',data.error);
					$('#retrieveDataMbp_closeAll').click();
				}
			}else{
				doTheAlert('提示','保存失败');
				$('#retrieveDataMbp_closeAll').click();
			}
		},
		error : function() {
			doTheAlert("提示",errorTip);
			$('#retrieveDataMbp_closeAll').click();
		}
	});
}

/**
 * 关闭所有
 * @returns
 */
function retrieveDataMbpCloseAll(){
	$('#retrieveDataMbp_close').click();
}

/**
 * 预览报文详情
 * @param id
 * @param tableId
 * @returns
 */
function showRetrieveDataMbpVoView(id,type,packetType,fileName,baffleService,e){
	var trObj = $(e).parent().parent();
	if($(trObj).attr('class') == 'selected'){
		showDiffRetrieveDataMbpVoView(type,baffleService);
		return;
	}
	if(null == id || '' == id || typeof(id) == 'undefined'){
		doTheAlert('提示','id参数不能为空');
		return false;
	}
	if(null == type || '' == type || typeof(type) == 'undefined'){
		doTheAlert('提示','type参数不能为空');
		return false;
	}
	if(null == packetType || '' == packetType || typeof(packetType) == 'undefined'){
		doTheAlert('提示','packetType参数不能为空');
		return false;
	}
	if(null == fileName || '' == fileName || typeof(fileName) == 'undefined'){
		doTheAlert('提示','fileName参数不能为空');
		return false;
	}
	var channelId = '';
	if(type=='baffle'){
		$('#baffleSelect_tab li').each(function(){
			if($(this).attr('class')=='active'){
				channelId = $(this).find('input').eq(0).val();
				return false;
			}
		});
	}else{
		channelId = $('#retrieveDataMbpSelect_select option:selected').val();
	}
	if(null == channelId || '' == channelId || typeof(channelId) == 'undefined'){
		doTheAlert('提示','channelId参数不能为空');
		return false;
	}
	var idType = 'reqPacketId';
	var fileNameType = 'reqFileName';
	if(packetType == 'resp'){
		idType = 'respPacketId';
		fileNameType = 'respFileName';
	}
	window.open(CONTEXT_PATH + '/base/retrieveDataMbpVo/view?type='+type+
			'&'+idType+'='+id+
			'&'+fileNameType+'='+fileName+
			'&channelId='+channelId, {width : '90%'});
}

/**
 * 对比预览报文详情
 * @param type
 * @returns
 */
function showDiffRetrieveDataMbpVoView(type,baffleService){
	var resultJson = getCheckedPacketId(type,baffleService,null);
	if(resultJson == false){
		return false;
	}
	var channelId = '';
	if(type=='baffle'){
		$('#baffleSelect_tab li').each(function(){
			if($(this).attr('class')=='active'){
				channelId = $(this).find('input').eq(0).val();
				return false;
			}
		});
	}else{
		channelId = $('#retrieveDataMbpSelect_select option:selected').val();
	}
	if(null == channelId || '' == channelId || typeof(channelId) == 'undefined'){
		doTheAlert('提示','channelId参数不能为空');
		return false;
	}
	window.open(CONTEXT_PATH + '/base/retrieveDataMbpVo/view?type='+type+
			'&reqPacketId='+resultJson.reqPacketId+
			'&reqFileName='+resultJson.reqFileName+
			'&respPacketId='+resultJson.respPacketId+
			'&respFileName='+resultJson.respFileName+
			'&channelId='+channelId, {width : '90%'});
}

/**
 * 获取当前选中packetId
 * @param type
 * @returns
 */
function getCheckedPacketId(type,baffleService,checkType){
	if(null == type || '' == type || typeof(type) == 'undefined'){
		doTheAlert('提示','type参数不能为空');
		return false;
	}
	var resultJson = {};
	var reqTrObj = $('#' + type + '_req_' + baffleService + '_table table tbody tr');
	var reqFlag = false;
	var reqIdArr = [];
	for (var i = 0; i < reqTrObj.length; i++) {
		var select = $(reqTrObj[i]).attr('class');
		if(select == 'selected'){
			resultJson.reqPacketId = $(reqTrObj[i]).find("td").eq(0).find("input").val();
			resultJson.reqServiceCode = $(reqTrObj[i]).find("td").eq(1).text();
			resultJson.reqFileName = $(reqTrObj[i]).find("td").eq(2).text();
			resultJson.reqPid = $(reqTrObj[i]).find("td").eq(3).text();
			resultJson.reqTime = $(reqTrObj[i]).find("td").eq(4).text();
			resultJson.reqPacket = $(reqTrObj[i]).find("td").eq(4).text();
			reqIdArr.push(resultJson.reqPacketId);
		}
	}
	var respTrObj = $('#' + type + '_resp_' + baffleService + '_table table tbody tr');
	var respFlag = false;
	var respIdArr = [];
	for (var i = 0; i < respTrObj.length; i++) {
		var select = $(respTrObj[i]).attr('class');
		if(select == 'selected'){
			resultJson.respPacketId = $(respTrObj[i]).find("td").eq(0).find("input").val();
			resultJson.respServiceCode = $(respTrObj[i]).find("td").eq(1).text();
			resultJson.respFileName = $(respTrObj[i]).find("td").eq(2).text();
			resultJson.respPid = $(respTrObj[i]).find("td").eq(3).text();
			resultJson.respTime = $(respTrObj[i]).find("td").eq(4).text();
			respIdArr.push(resultJson.respPacketId);
		}
	}
	if(reqIdArr.length > 1){
		doTheAlert('提示', '仅能勾选一项请求信息！');
		return false;
	}
	if(respIdArr.length > 1){
		doTheAlert('提示', '仅能勾选一项响应信息！');
		return false;
	}
	if(checkType=='all'){
		if(reqIdArr.length == 0 || respIdArr.length == 0){
			doTheAlert('提示', '请匹配一组请求、响应信息！');
			return false;
		}
	}else{
		if(reqIdArr.length == 0 && respIdArr.length == 0){
			doTheAlert('提示', '请至少勾选一项请求、响应信息！');
			return false;
		}
	}
	return resultJson;
}

/**
 * 系统下拉框onchange事件
 * @param e
 * @returns
 */
function changeChannelIdSelect(){
	var channelId = $('#retrieveDataMbpSelect_select option:selected').val();
	$('#case_req_case_channelId').val(channelId);
	$('#case_resp_case_channelId').val(channelId);
	$('#case_req_case_query_form').submit();
	$('#case_resp_case_query_form').submit();
}

/**
 * 案例选择-匹配
 * @returns
 */
function addMateReqResp(type,baffleService){
	var channelId = $('#retrieveDataMbpSelect_select option:selected').val();
	var resultJson = getCheckedPacketId(type,baffleService,'all');
	if(resultJson == false){
		return false;
	}
	var addTr = '<tr>' +
		'<td><input type="hidden" value="' + resultJson.reqPacketId + '"/>' + resultJson.reqServiceCode + '</td>' +
		'<td><input type="hidden" value="' + channelId + '"/>' + resultJson.reqFileName + '</td>' +
		'<td><input type="hidden"/>' + resultJson.reqPid + '</td>' +
		'<td>' + resultJson.reqTime + '</td>' +
		'<td><input type="hidden" value="' + resultJson.respPacketId + '"/>' + resultJson.respServiceCode + '</td>' +
		'<td>' + resultJson.respFileName + '</td>' +
		'<td>' + resultJson.respPid + '</td>' +
		'<td>' + resultJson.respTime + '</td>' +
		'<td>' +
			'<i class="glyphicon glyphicon-eye-open myGlyphicon-ok" onclick=viewForMateReqResp("' + type + '","' + channelId + '","' + resultJson.reqPacketId + '","' + resultJson.respPacketId + '");></i>' +
		'</td>' +
		'<td>' +
			'<i class="glyphicon glyphicon-cog myGlyphicon-cog" onclick=gotoBaffleConfigPage("' + resultJson.reqPacketId + '","' + resultJson.respPacketId + '",this);></i>' +
		'</td>' +
		'<td>' +
			'<i class="glyphicon glyphicon-minus myGlyphicon-cog" onclick="minusExpectTr(this);"></i>' +
		'</td>' +
	'</tr>';
	$('#retrieveDataMbpSelect_tbody').prepend(addTr);
	getFilterList();
}

/**
 * 案例选择-推荐匹配
 * @returns
 */
function addSystemMateReqResp(type){
	var channelId = $('#retrieveDataMbpSelect_select option:selected').val();
	var inputTrObj = $('#retrieveDataMbpSelect_tbody tr');
	var filterArr = [];
	for (var i = 0; i < inputTrObj.length; i++) {
		var json = {};
		json.reqPacketId = $(inputTrObj[i]).find('TD').eq(0).find('INPUT').eq(0).val();
		json.respPacketId = $(inputTrObj[i]).find('TD').eq(4).find('INPUT').eq(0).val();
		filterArr.push(json);
	}
	var filterArrJson = JSON.stringify(filterArr);
	$.ajax({
		type : "post",
		global : false,
		async : true,
		url : CONTEXT_PATH + '/base/retrieveDataMbpVo/addSystemMateReqResp',
		dataType : "json",
		data : {
			packetType : type,
			channelId : channelId,
			filterStr : filterArrJson
		},
		success : function(data) {
			if(null != data && typeof(data) != "undefined"){
				if(data.msg=="success"){
					var mbpCaseConfigVos = data.mbpCaseConfigVos;
					for(var i=0;i<mbpCaseConfigVos.length;i++){
						var resultJson = mbpCaseConfigVos[i];
						var addTr = '<tr>' +
						'<td><input type="hidden" value="' + resultJson.reqPacketId + '"/>' + resultJson.reqServiceCode + '</td>' +
						'<td><input type="hidden" value="' + channelId + '"/>' + resultJson.reqFileName + '</td>' +
						'<td><input type="hidden"/>' + resultJson.reqPid + '</td>' +
						'<td>' + resultJson.reqTime + '</td>' +
						'<td><input type="hidden" value="' + resultJson.respPacketId + '"/>' + resultJson.respServiceCode + '</td>' +
						'<td>' + resultJson.respFileName + '</td>' +
						'<td>' + resultJson.respPid + '</td>' +
						'<td>' + resultJson.respTime + '</td>' +
						'<td>' +
							'<i class="glyphicon glyphicon-eye-open myGlyphicon-ok" onclick=viewForMateReqResp("' + type + '","' + channelId + '","' + resultJson.reqPacketId + '","' + resultJson.respPacketId + '");></i>' +
						'</td>' +
						'<td>' +
							'<i class="glyphicon glyphicon-cog myGlyphicon-cog" onclick=gotoBaffleConfigPage("' + resultJson.reqPacketId + '","' + resultJson.respPacketId + '",this);></i>' +
						'</td>' +
						'<td>' +
							'<i class="glyphicon glyphicon-minus myGlyphicon-cog" onclick="minusExpectTr(this);"></i>' +
						'</td>' +
						'</tr>';
						$('#retrieveDataMbpSelect_tbody').prepend(addTr);
					}
					getFilterList();
				}else{
					doTheAlert('提示',data.error);
				}
			}else{
				doTheAlert('提示','请求失败');
			}
		},
		error : function() {
			doTheAlert("提示",errorTip);
		}
	});
}

/**
 * 查看匹配案例报文
 * @returns
 */
function viewForMateReqResp(type,channelId,reqPacketId,respPacketId){
	window.open(CONTEXT_PATH + '/base/retrieveDataMbpVo/view?type='+type+
			'&reqPacketId='+reqPacketId+
			'&respPacketId='+respPacketId+
			'&channelId='+channelId, {width : '90%'});
}

/**
 * 获取候选案例list
 * @returns
 */
function getFilterList(){
	var inputTrObj = $('#retrieveDataMbpSelect_tbody tr');
	var reqFilterId = '';
	var respFilterId = '';
	for (var i = 0; i < inputTrObj.length; i++) {
		var reqId = $(inputTrObj[i]).find('TD').eq(0).find('INPUT').eq(0).val();
		var respId = $(inputTrObj[i]).find('TD').eq(4).find('INPUT').eq(0).val();
		reqFilterId += reqId + ',';
		respFilterId += respId + ',';
	}
	$('#case_req_case_filter').val(reqFilterId);
	$('#case_resp_case_filter').val(respFilterId);
	$('#case_req_case_query_form').submit();
	$('#case_resp_case_query_form').submit();
}

/**
 * 移除当前预期值配置TR
 * @param e
 * @returns
 */
function minusExpectTr(e){
	var reqPacketId = $(e).parent().parent().find("td").eq(0).find("input").val();
	var respPacketId = $(e).parent().parent().find("td").eq(4).find("input").val();
	var filterStr = $('#baffleCogFilterStr').val();
	$.ajax({
		type : "post",
		global : false,
		async : true,
		url : CONTEXT_PATH + '/base/retrieveDataMbpVo/deleteFilterForRemove',
		dataType : "json",
		data : {
			reqPacketId : reqPacketId,
			respPacketId : respPacketId,
			filterStr : filterStr
		},
		success : function(data) {
			if(null != data && typeof(data) != "undefined"){
				if(data.msg=="success"){
					$('#baffleCogFilterStr').val(data.filterStr);
					$(e).parent().parent().remove();
					getFilterList();
				}else{
					doTheAlert('提示',data.error);
				}
			}else{
				doTheAlert('提示','请求失败');
			}
		},
		error : function() {
			doTheAlert("提示",errorTip);
		}
	});
}

/**
 * 移除挡板配置
 * @returns
 */
function removeThisBaffleCog(reqPacketId,respPacketId){
	var filterStr = $('#baffleCogFilterStr').val();
	$.ajax({
		type : "post",
		global : false,
		async : true,
		url : CONTEXT_PATH + '/base/retrieveDataMbpVo/deleteFilterForRemove',
		dataType : "json",
		data : {
			reqPacketId : reqPacketId,
			respPacketId : respPacketId,
			filterStr : filterStr
		},
		success : function(data) {
			if(null != data && typeof(data) != "undefined"){
				if(data.msg=="success"){
					$('#baffleCogFilterStr').val(data.filterStr);
					$(baffleIconObj).attr('class','glyphicon glyphicon-cog myGlyphicon-cog');
					closePage();
				}else{
					doTheAlert('提示',data.error);
				}
			}else{
				doTheAlert('提示','请求失败');
			}
		},
		error : function() {
			doTheAlert("提示",errorTip);
		}
	});
}

/**
 * 跳转挡板配置界面
 * @param reqId
 * @param respId
 * @returns
 */
function gotoBaffleConfigPage(reqId,respId,e){
	baffleIconObj = e;
	var channelId = $('#retrieveDataMbpSelect_select option:selected').val();
	var filterStr = $('#baffleCogFilterStr').val();
	window.open(CONTEXT_PATH + '/base/retrieveDataMbpVo/gotoBaffleConfigPage?'+
			'type=baffle&baffleService=baffle&channelId='+channelId+
			'&reqPacketId='+reqId+'&respPacketId='+respId+
			'&filterStr='+filterStr, {width : '90%'});
}