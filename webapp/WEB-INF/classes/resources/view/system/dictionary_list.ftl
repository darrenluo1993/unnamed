<#ftl encoding="UTF-8" output_format="HTML">
<#compress>
<!DOCTYPE html>
<html>
<head>
<title>字典管理</title>
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
const url = "/system/dictionary/listDictionaryViaSupId";

$(function(){
	$("#dictionaryTreeGrid").treegrid({
		url: url,
		striped: true,
		fitColumns: true,
		rownumbers: true,
		singleSelect: true,
		idField: "dictId",
		treeField: "dictName",
		parentField: "supDictId",
		columns:[[
			{
				width: 150,
				field: "dictName",
				title: "<b>字典名称</b>",
				formatter: function(value, row){
					return "<a onclick=\"window.open('/system/dictionary/view?id=" + row.id + "',{width:'45%'});\">" + value + "</a>";
				}
			},{
				width: 150,
				field: "dictCode",
				title: "<b>字典编码</b>"
			},{
				width: 150,
				field: "dictValue",
				title: "<b>字典值</b>"
			},{
				width: 150,
				field: "supDictCode",
				title: "<b>父级字典编码</b>"
			},{
				width: 120,
				align: "center",
				field: "enabled",
				title: "<b>字典状态</b>",
				formatter: function(value, row){
					if (value){
						return "<span class=\"label label-success\">已启用</span>";
					} else {
						return "<span class=\"label label-danger\">已禁用</span>";
					}
				}
			},{
				width: 100,
				align: "center",
				field: "serialNum",
				title: "<b>排序序号</b>"
			},{
				width: 200,
				field: "introduction",
				title: "<b>字典简介</b>"
			},{
				width: 100,
				align: "center",
				field: "createUser",
				title: "<b>创建人</b>"
			},{
				width: 120,
				align: "center",
				field: "createDate",
				title: "<b>创建时间</b>"
			},{
				width: 100,
				align: "center",
				field: "modifyUser",
				title: "<b>修改人</b>"
			},{
				width: 120,
				align: "center",
				field: "modifyDate",
				title: "<b>修改时间</b>"
			},{
				width: 150,
				align: "center",
				field: "operation",
				title: "<b>操作</b>",
				formatter: function(value, row){
					return "<a onclick=\"window.open('/system/dictionary/input?id=" + row.id + "',{width:'45%'});\">编辑</a>&nbsp;"
						 + "<a onclick=\"switchDictionary(" + row.dictId + "," + row.enabled + ",'" + row.state + "');\" class=\"" + (row.enabled ? "red" : "green") + "\">" + (row.enabled ? "禁用" : "启用") + "</a>&nbsp;"
						 + "<a onclick=\"removeDictionary(" + row.dictId + ",'" + row.state + "');\">删除</a>&nbsp;"
						 + "<a onclick=\"window.open('/system/dictionary/input?supDictId=" + row.dictId + "',{width:'45%'});\">创建子级</a>";
				}
			}
		]],
		onBeforeExpand: function(row){
			$(this).treegrid("options").url = url + "?supDictId=" + row.dictId;
		}
	});
});

// 重载数据字典树形表格
function reloadDictionaryTreeGrid(){
	$("#dictionaryTreeGrid").treegrid("options").url = url;
	$("#dictionaryTreeGrid").treegrid("reload");
}

// 启禁用数据字典
function switchDictionary(dictId, enabled, state){
	var msg;
	if (enabled){
		if (state == "closed"){
			msg = "确定禁用数据字典及其子级吗？";
		} else {
			msg = "确定禁用数据字典吗？";
		}
	} else {
		if (state == "closed"){
			msg = "确定启用数据字典及其子级吗？";
		} else {
			msg = "确定启用数据字典吗？";
		}
	}
	$.messager.confirm("提示", msg, function(yes){
		if(yes){
			$.post("/system/dictionary/switchDictionaryViaDictId", {"args.dictId": dictId, "args.enabled": !enabled}, function(result){
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

// 删除数据字典
function removeDictionary(dictId, state){
	var msg;
	if(state == "closed"){
		msg = "确定删除数据字典及其子级吗？";
	} else {
		msg = "确定删除数据字典吗？";
	}
	$.messager.confirm("提示", msg, function(yes){
		if(yes){
			$.post("/system/dictionary/removeDictionaryViaDictId", {dictId: dictId}, function(result){
				if(result){
					if(result.success){
						$.messager.alert("提示", result.message);
						$("#dictionaryTreeGrid").treegrid("remove", dictId);
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
	<div data-options="region:'center',title:'字典管理'" style="width:100%;padding:10px;overflow:auto">
		<div class="toolbar">
			<a onclick="window.open('/system/dictionary/input',{width:'45%'});" class="easyui-linkbutton" data-options="iconCls:'glyphicon glyphicon-plus'">创建</a>
			<a href="javascript:reloadDictionaryTreeGrid();" class="easyui-linkbutton" data-options="iconCls:'glyphicon glyphicon-refresh'">刷新</a>
			<a href="javascript:$('#dictionaryTreeGrid').treegrid('expandAll');" class="easyui-linkbutton" data-options="iconCls:'glyphicon glyphicon-resize-full'">展开</a>
			<a href="javascript:$('#dictionaryTreeGrid').treegrid('collapseAll');" class="easyui-linkbutton" data-options="iconCls:'glyphicon glyphicon-resize-small'">折叠</a>
		</div>
		<div class="table-body table-style3 mt10">
			<table id="dictionaryTreeGrid"></table>
		</div>
	</div>
</div>
</body>
</html>
</#compress>