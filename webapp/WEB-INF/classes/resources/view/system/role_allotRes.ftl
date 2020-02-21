<#ftl encoding="UTF-8" output_format="HTML">
<#compress>
<!DOCTYPE html>
<html>
<head>
<title>资源分配</title>
<link rel="stylesheet" type="text/css" href="<@url value="/assets/styles/themes/icon.css"/>">
<link rel="stylesheet" type="text/css" href="<@url value="/assets/styles/themes/default/easyui.css"/>">
<script type="text/javascript" src="<@url value="/assets/scripts/easyui/jquery.easyui.min.js"/>"></script>
<script type="text/javascript" src="<@url value="/assets/scripts/easyui/easyui-lang-zh_CN.js"/>"></script>
<script type="text/javascript" src="<@url value="/assets/scripts/easyui/jquery.easyui.extends.js"/>"></script>
<script type="text/javascript">
const sysErrorMsg = "系统异常，请重试或联系管理员！";

$(function(){
	$(parent.document).find("div[id^=_window_]>iframe").attr("scrolling", "no");

	$("#resourceTree").tree({
		url: "listUserResourceTreeData",
		checkbox: true,
		parentField: "parentId",
		onClick: function(node){
			$("#resourceTree").tree(node.checked ? "uncheck" : "check", node.target);
		},
		onLoadSuccess: function(node, nodeData){
			$.post("listGrantedResViaRoleId", {roleId: ${roleId}}, function(result){
				if(result){
					if (result.success){
						$.each(result.carryData, function(i, res){
							var node = $("#resourceTree").tree("find", res.resId);
							if(node){
								var isLeaf = $("#resourceTree").tree("isLeaf", node.target);
								if(isLeaf){
									$("#resourceTree").tree("check", node.target);
								}
							}
						});
					} else {
						$.messager.error("错误", result.message);
					}
				} else {
					$.messager.error("错误", sysErrorMsg);
				}
			}, "JSON");
		}
	});

	// 保存角色资源
	$("#saveRoleRes").click(function(){
		var roleResArr = new Array();
		var nodes = $("#resourceTree").tree("getChecked", ["checked", "indeterminate"]);
		$(nodes).each(function(i, node){
			var roleRes = new Object();
			roleRes.roleId = ${roleId};
			roleRes.resId = node.id;
			roleResArr.push(roleRes);
		});

		$.post("saveRoleResource", {roleId: ${roleId}, roleResJSON: JSON.stringify(roleResArr)}, function(result){
			if (result){
				$.alerts({type: result.success ? "success" : "error", message: result.message});
			} else {
				$.alerts({type: "error", message: sysErrorMsg});
			}
		}, "JSON");
	});
});
</script>
</head>
<body>
<div class="easyui-layout" style="width:100%;height:550px;">
	<div data-options="region:'center',border:false" style="width:100%;height:520px;">
		<ul id="resourceTree"></ul>
	</div>
	<div data-options="region:'south',border:false" style="height:30px;text-align:center;">
		<button id="saveRoleRes" class="btn btn-sm"><span class="glyphicon glyphicon-ok">&nbsp;</span>保存</button>
	</div>
</div>
</body>
</html>
</#compress>