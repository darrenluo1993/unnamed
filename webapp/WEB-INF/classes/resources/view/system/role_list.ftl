<#ftl encoding="UTF-8" output_format="HTML">
<#compress>
<!DOCTYPE html>
<html>
<head>
<title>角色管理</title>
<script type="text/javascript">
// 创建系统角色
function createRole(ele){
	Richtable.open("/system/role/input", true, false, $("form.richtable"), $(ele));
}

// 分配系统资源
function allotResource(ele, roleId){
	Richtable.open("/system/role/gotoAllotRes?roleId=" + roleId, true, true, $("form.richtable"), $(ele));
}
</script>
</head>
<body>
<div class="easyui-layout" style="width:100%;height:100%">
	<div data-options="region:'center',title:'角色管理'" style="width:100%;padding:10px;overflow:auto">
		<div class="toolbar">
			<a class="easyui-linkbutton" data-options="iconCls:'glyphicon glyphicon-plus'" onclick="createRole(this);">创建</a>
		</div>
		<#assign actionColumnButtons=r'<@btn view="input" label="edit"/><button class="btn" onclick="allotResource(this,${entity.roleId});">资源分配</button>'/>
		<#assign columns = {"sysModule":{"alias":"所属系统模块", "width":"120px", "template":r"${beans['dictionaryManager'].getDictNameViaSupAndCode('SYSTEM_MODULE',value)!}"},
							"roleName":{"alias":"角色名称", "width":"150px"},
							"enabled":{"alias":"角色状态", "width":"80px", "template":r"<#if value><span class='label label-success'>已启用</span><#else><span class='label label-danger'>已禁用</span></#if>"},
							"hierarchy":{"alias":"权限层级", "width":"80px", "description":"值越小权限层级越高！"},
							"introduction":{"alias":"角色简介", "width":"150px"},
							"createUser":{"alias":"创建人", "width":"80px"},
							"createDate":{"alias":"创建时间", "width":"100px"},
							"modifyUser":{"alias":"修改人", "width":"80px"},
							"modifyDate":{"alias":"修改时间", "width":"100px"}}/>
		<div class="table-body table-style3 mt10">
			<@richtable entityName="role" columns=columns actionColumnButtons=actionColumnButtons showBottomButtons=true enableable=true celleditable=false downloadable=false/>
		</div>
	</div>
</div>
</body>
</html>
</#compress>