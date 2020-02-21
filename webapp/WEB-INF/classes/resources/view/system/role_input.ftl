<#ftl encoding="UTF-8" output_format="HTML">
<#compress>
<!DOCTYPE html>
<html>
<head>
<title><#if role.new>${getText("create")}<#else>${getText("edit")}</#if>${getText(richtableConfig.alias)}</title>
</head>
<body>
	<@s.form id="role_input" action="${actionBaseUrl}/save" method="post" class="ajax form-horizontal sequential_create">
		<#if !role.new>
			<@s.hidden name="role.id"/>
			<@s.hidden name="role.roleId"/>
		</#if>
		<#assign id="role-sysModule"/>
		<@controlGroup id=id for=id label="所属系统模块" description="角色仅作用于指定的系统模块！">
			<select id="${id}" name="role.sysModule" class="required">
				<option/>
				<#assign sysModuleList=beans["dictionaryManager"].listDictionaryViaSupCode("SYSTEM_MODULE")!>
				<#list sysModuleList as sysModule>
					<option value="${sysModule.dictCode}" <#if sysModule.dictCode==entity.sysModule!>selected</#if>>${sysModule.dictName}</option>
				</#list>
			</select>
		</@controlGroup>
		<@s.textfield name="role.roleName" label="角色名称" class="required"/>
		<@s.checkbox name="role.enabled" label="角色状态" class="required"/>
		<#assign id="role-hierarchy"/>
		<@controlGroup id=id for=id label="权限层级" description="值越小权限层级越高！">
			<input type="number" id="${id}" name="role.hierarchy" value="${entity.hierarchy!}" class="required"/>
		</@controlGroup>
		<@s.textarea name="role.introduction" label="角色简介"/>
		<@s.submit label=getText("save") class="btn-primary"/>
	</@s.form>
</body>
</html>
</#compress>