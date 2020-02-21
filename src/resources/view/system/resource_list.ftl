<#ftl encoding="UTF-8" output_format="HTML">
<#compress>
<!DOCTYPE html>
<html>
<head>
<title>资源管理</title>
<style type="text/css">
a {
	cursor: pointer !important;
}

.red {
	color: red !important;
}

.green {
	color: green !important;
}

.datagrid .panel-body {
	border: 1px solid #D7E0E5;
}

.datagrid-header {
	border-bottom: 2px solid #e73e37;
}

.datagrid-header-row, .datagrid-row {
	height: 30px !important;
	line-height: 30px !important;
}
</style>
<script type="text/javascript">
const sysErrorMsg = "系统异常，请重试或联系管理员！";
const url = "/system/resource/listResourceViaSupId";

$(function(){
	$("#resourceTreeGrid").treegrid({
		url: url,
		striped: true,
		fitColumns: true,
		rownumbers: true,
		singleSelect: true,
		idField: "resId",
		treeField: "resName",
		parentField: "supResId",
		columns:[[
			{
				width: 200,
				field: "resName",
				title: "<b>资源简称</b>",
				formatter: function(value, row){
					return "<a onclick=\"window.open('/system/resource/view?id=" + row.id + "',{width:'45%'});\">" + value + "</a>";
				}
			},{
				width: 150,
				field: "resIden",
				title: "<b>资源标识</b>",
				formatter: function(value, row){
					return "<label title=\"" + value + "\">" + value + "</label>";
				}
			},{
				width: 150,
				field: "resFullName",
				title: "<b>资源全称</b>",
				formatter: function(value, row){
					return "<label title=\"" + value + "\">" + value + "</label>";
				}
			},{
				width: 100,
				field: "resIdPath",
				title: "<b>资源ID路径</b>"
			},{
				width: 80,
				align: "center",
				field: "resType",
				title: "<b>资源类型</b>"
			},{
				width: 150,
				field: "resUri",
				title: "<b>资源URI</b>",
				formatter: function(value, row){
					return "<label title=\"" + value + "\">" + value + "</label>";
				}
			},{
				width: 70,
				align: "center",
				field: "enabled",
				title: "<b>资源状态</b>",
				formatter: function(value, row){
					if (value){
						return "<span class=\"label label-success\">已启用</span>";
					} else {
						return "<span class=\"label label-danger\">已禁用</span>";
					}
				}
			},{
				width: 70,
				align: "center",
				field: "hierarchy",
				title: "<b>资源层级</b>"
			},{
				width: 70,
				align: "center",
				field: "isPublic",
				title: "<b>是否公共</b>",
				formatter: function(value, row){
					return value ? "是" : "否";
				}
			},{
				width: 70,
				align: "center",
				field: "isExpose",
				title: "<b>是否显示</b>",
				formatter: function(value, row){
					return value ? "是" : "否";
				}
			},{
				width: 70,
				align: "center",
				field: "serialNum",
				title: "<b>排序序号</b>"
			},{
				width: 100,
				field: "introduction",
				title: "<b>资源简介</b>"
			},{
				width: 80,
				align: "center",
				field: "modifyUser",
				title: "<b>修改人</b>"
			},{
				width: 100,
				align: "center",
				field: "modifyDate",
				title: "<b>修改时间</b>"
			},{
				width: 150,
				align: "center",
				field: "operation",
				title: "<b>操作</b>",
				formatter: function(value, row){
					return "<a onclick=\"window.open('/system/resource/input?id=" + row.id + "',{width:'45%'});\">编辑</a>&nbsp;"
						 + "<a onclick=\"switchResource(" + row.resId + "," + row.enabled + ",'" + row.state + "');\" class=\"" + (row.enabled ? "red" : "green") + "\">" + (row.enabled ? "禁用" : "启用") + "</a>&nbsp;"
						 + "<a onclick=\"removeResource(" + row.resId + ",'" + row.state + "');\">删除</a>&nbsp;"
						 + "<a onclick=\"window.open('/system/resource/input?supResId=" + row.resId + "',{width:'45%'});\">创建子级</a>";
				}
			}
		]],
		onBeforeExpand: function(row){
			$(this).treegrid("options").url = url + "?supResId=" + row.resId;
		}
	});
});

// 重载系统资源树形表格
function reloadResourceTreeGrid(){
	$("#resourceTreeGrid").treegrid("options").url = url;
	$("#resourceTreeGrid").treegrid("reload");
}

// 启禁用系统资源
function switchResource(resId, enabled, state){
	var msg;
	if (enabled){
		if (state == "closed"){
			msg = "确定禁用系统资源及其子级吗？";
		} else {
			msg = "确定禁用系统资源吗？";
		}
	} else {
		if (state == "closed"){
			msg = "确定启用系统资源及其子级吗？";
		} else {
			msg = "确定启用系统资源吗？";
		}
	}
	$.messager.confirm("提示", msg, function(yes){
		if(yes){
			$.post("/system/resource/switchResourceViaResId", {"args.resId": resId, "args.enabled": !enabled}, function(result){
				if(result){
					if(result.success){
						$.messager.alert("提示", result.message);
					} else {
						$.messager.error("提示", result.message);
					}
				} else {
					$.messager.error(sysErrorMsg);
				}
			}, "JSON");
		}
	});
}

// 删除系统资源
function removeResource(resId, state){
	var msg;
	if(state == "closed"){
		msg = "确定删除系统资源及其子级吗？";
	} else {
		msg = "确定删除系统资源吗？";
	}
	$.messager.confirm("提示", msg, function(yes){
		if(yes){
			$.post("/system/resource/removeResourceViaResId", {resId: resId}, function(result){
				if(result){
					if(result.success){
						$.messager.alert("提示", result.message);
						$("#resourceTreeGrid").treegrid("remove", resId);
					} else {
						$.messager.error("提示", result.message);
					}
				} else {
					$.messager.error(sysErrorMsg);
				}
			}, "JSON");
		}
	});
}
</script>
</head>
<body>
<div class="easyui-layout" style="width:100%;height:100%">
	<div data-options="region:'center',title:'资源管理'" style="width:100%;padding:10px;overflow:auto">
		<div class="toolbar">
			<a onclick="window.open('/system/resource/input',{width:'45%'});" class="easyui-linkbutton" data-options="iconCls:'glyphicon glyphicon-plus'">创建</a>
			<a href="javascript:reloadResourceTreeGrid();" class="easyui-linkbutton" data-options="iconCls:'glyphicon glyphicon-refresh'">刷新</a>
			<a href="javascript:$('#resourceTreeGrid').treegrid('expandAll');" class="easyui-linkbutton" data-options="iconCls:'glyphicon glyphicon-resize-full'">展开</a>
			<a href="javascript:$('#resourceTreeGrid').treegrid('collapseAll');" class="easyui-linkbutton" data-options="iconCls:'glyphicon glyphicon-resize-small'">折叠</a>
		</div>
		<div class="table-body table-style3 mt10">
			<table id="resourceTreeGrid"></table>
		</div>
	</div>
</div>
</body>
</html>
</#compress>