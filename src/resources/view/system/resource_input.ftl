<#ftl encoding="UTF-8" output_format="HTML">
<#compress>
<!DOCTYPE html>
<html>
<head>
<title><#if resource.new>${getText("create")}<#else>${getText("edit")}</#if>${getText(richtableConfig.alias)}</title>
</head>
<body>
	<@s.form id="resource_input" action="${actionBaseUrl}/save" method="post" class="ajax form-horizontal sequential_create">
		<#if !resource.new>
			<@s.hidden name="resource.id"/>
			<@s.hidden name="resource.resId"/>
		</#if>
		<@s.hidden name="resource.resFullName"/>
		<@s.hidden name="resource.supResId"/>
		<@s.hidden name="resource.resIdPath"/>
		<@s.hidden name="resource.hierarchy"/>
		<@s.textfield name="resource.resName" label="资源简称" class="required"/>
		<@s.textfield name="resource.resIden" label="资源标识" class="required"/>
		<@s.textfield name="resource.resType" label="资源类型" class="required"/>
		<@s.textfield name="resource.resUri" label="资源URI" class="required"/>
		<@s.checkbox name="resource.enabled" label="资源状态" class="required"/>
		<@s.checkbox name="resource.isPublic" label="是否公共" class="required"/>
		<@s.checkbox name="resource.isExpose" label="是否显示" class="required"/>
		<@s.textfield name="resource.serialNum" label="排序序号" type="number" class="required"/>
		<@s.textarea name="resource.introduction" label="资源简介"/>
		<@s.submit label=getText("save") class="btn-primary"/>
	</@s.form>
</body>
</html>
</#compress>