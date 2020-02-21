<#ftl encoding="UTF-8" output_format="HTML">
<#compress>
<!DOCTYPE html>
<html>
<head>
<title>组织管理</title>
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
const url = "/system/organization/listOrganizationViaSupId";

$(function(){
	$("#organizationTreeGrid").treegrid({
		url: url,
		striped: true,
		fitColumns: true,
		rownumbers: true,
		singleSelect: true,
		idField: "orgId",
		treeField: "orgName",
		parentField: "supOrgId",
		columns:[[
			{
				width: 200,
				field: "orgName",
				title: "<b>组织简称</b>",
				formatter: function(value, row){
					return "<a onclick=\"window.open('/system/organization/view?id=" + row.id + "',{width:'45%'});\">" + value + "</a>";
				}
			},{
				width: 400,
				field: "orgFullName",
				title: "<b>组织全称</b>",
				formatter: function(value, row){
					return "<label title=\"" + value + "\">" + value + "</label>";
				}
			},{
				width: 200,
				field: "orgIdPath",
				title: "<b>组织ID路径</b>"
			},{
				width: 80,
				align: "center",
				field: "enabled",
				title: "<b>组织状态</b>",
				formatter: function(value, row){
					if (value){
						return "<span class=\"label label-success\">已启用</span>";
					} else {
						return "<span class=\"label label-danger\">已禁用</span>";
					}
				}
			},{
				width: 80,
				align: "center",
				field: "hierarchy",
				title: "<b>组织层级</b>"
			},{
				width: 80,
				align: "center",
				field: "serialNum",
				title: "<b>排序序号</b>"
			},{
				width: 150,
				field: "introduction",
				title: "<b>组织简介</b>"
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
					return "<a onclick=\"window.open('/system/organization/input?id=" + row.id + "',{width:'45%'});\">编辑</a>&nbsp;"
						 + "<a onclick=\"switchOrganization(" + row.orgId + "," + row.enabled + ",'" + row.state + "');\" class=\"" + (row.enabled ? "red" : "green") + "\">" + (row.enabled ? "禁用" : "启用") + "</a>&nbsp;"
						 + "<a onclick=\"removeOrganization(" + row.orgId + ",'" + row.state + "');\">删除</a>&nbsp;"
						 + "<a onclick=\"window.open('/system/organization/input?supOrgId=" + row.orgId + "',{width:'45%'});\">创建子级</a>";
				}
			}
		]],
		onBeforeExpand: function(row){
			$(this).treegrid("options").url = url + "?supOrgId=" + row.orgId;
		}
	});
});

// 重载组织机构树形表格
function reloadOrganizationTreeGrid(){
	$("#organizationTreeGrid").treegrid("options").url = url;
	$("#organizationTreeGrid").treegrid("reload");
}

// 启禁用组织机构
function switchOrganization(orgId, enabled, state){
	var msg;
	if (enabled){
		if (state == "closed"){
			msg = "确定禁用组织机构及其子级吗？";
		} else {
			msg = "确定禁用组织机构吗？";
		}
	} else {
		if (state == "closed"){
			msg = "确定启用组织机构及其子级吗？";
		} else {
			msg = "确定启用组织机构吗？";
		}
	}
	$.messager.confirm("提示", msg, function(yes){
		if(yes){
			$.post("/system/organization/switchOrganizationViaOrgId", {"args.orgId": orgId, "args.enabled": !enabled}, function(orgult){
				if(orgult){
					if(orgult.success){
						$.messager.alert("提示", orgult.message);
					} else {
						$.messager.error("提示", orgult.message);
					}
				} else {
					$.messager.error(sysErrorMsg);
				}
			}, "JSON");
		}
	});
}

// 删除组织机构
function removeOrganization(orgId, state){
	var msg;
	if(state == "closed"){
		msg = "确定删除组织机构及其子级吗？";
	} else {
		msg = "确定删除组织机构吗？";
	}
	$.messager.confirm("提示", msg, function(yes){
		if(yes){
			$.post("/system/organization/removeOrganizationViaOrgId", {orgId: orgId}, function(orgult){
				if(orgult){
					if(orgult.success){
						$.messager.alert("提示", orgult.message);
						$("#organizationTreeGrid").treegrid("remove", orgId);
					} else {
						$.messager.error("提示", orgult.message);
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
	<div data-options="region:'center',title:'组织管理'" style="width:100%;padding:10px;overflow:auto">
		<div class="toolbar">
			<a onclick="window.open('/system/organization/input',{width:'45%'});" class="easyui-linkbutton" data-options="iconCls:'glyphicon glyphicon-plus'">创建</a>
			<a href="javascript:reloadOrganizationTreeGrid();" class="easyui-linkbutton" data-options="iconCls:'glyphicon glyphicon-refresh'">刷新</a>
			<a href="javascript:$('#organizationTreeGrid').treegrid('expandAll');" class="easyui-linkbutton" data-options="iconCls:'glyphicon glyphicon-resize-full'">展开</a>
			<a href="javascript:$('#organizationTreeGrid').treegrid('collapseAll');" class="easyui-linkbutton" data-options="iconCls:'glyphicon glyphicon-resize-small'">折叠</a>
		</div>
		<div class="table-body table-style3 mt10">
			<table id="organizationTreeGrid"></table>
		</div>
	</div>
</div>
</body>
</html>
</#compress>