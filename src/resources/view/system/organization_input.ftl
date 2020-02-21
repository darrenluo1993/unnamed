<#ftl encoding="UTF-8" output_format="HTML">
<#compress>
<!DOCTYPE html>
<html>
<head>
<title><#if organization.new>${getText("create")}<#else>${getText("edit")}</#if>${getText(richtableConfig.alias)}</title>
</head>
<body>
	<@s.form id="organization_input" action="${actionBaseUrl}/save" method="post" class="ajax form-horizontal sequential_create">
		<#if !organization.new>
			<@s.hidden name="organization.id"/>
			<@s.hidden name="organization.orgId"/>
		</#if>
		<@s.hidden name="organization.orgFullName"/>
		<@s.hidden name="organization.supOrgId"/>
		<@s.hidden name="organization.orgIdPath"/>
		<@s.hidden name="organization.hierarchy"/>
		<@s.textfield name="organization.orgName" label="组织简称" class="required"/>
		<@s.checkbox name="organization.enabled" label="组织状态" class="required"/>
		<@s.textfield name="organization.serialNum" label="排序序号" type="number" class="required"/>
		<@s.textarea name="organization.introduction" label="组织简介"/>
		<@s.submit label=getText("save") class="btn-primary"/>
	</@s.form>
</body>
</html>
</#compress>