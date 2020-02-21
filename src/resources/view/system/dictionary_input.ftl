<#ftl encoding="UTF-8" output_format="HTML">
<#compress>
<!DOCTYPE html>
<html>
<head>
<title><#if dictionary.new>${getText("create")}<#else>${getText("edit")}</#if>${getText(richtableConfig.alias)}</title>
</head>
<body>
	<@s.form id="dictionary_input" action="${actionBaseUrl}/save" method="post" class="ajax form-horizontal sequential_create">
		<#if !dictionary.new>
			<@s.hidden name="dictionary.id"/>
			<@s.hidden name="dictionary.dictId"/>
		</#if>
		<@s.hidden name="dictionary.supDictId"/>
		<@s.textfield name="dictionary.dictCode" label="字典编码" class="required"/>
		<@s.textfield name="dictionary.dictName" label="字典名称" class="required"/>
		<@s.textfield name="dictionary.dictValue" label="字典值"/>
		<@s.textfield name="dictionary.supDictCode" label="父级字典编码" readonly=true/>
		<@s.checkbox name="dictionary.enabled" label="字典状态" class="required"/>
		<@s.textfield name="dictionary.serialNum" label="排序序号" type="number" class="required"/>
		<@s.textarea name="dictionary.introduction" label="字典简介"/>
		<@s.submit label=getText("save") class="btn-primary"/>
	</@s.form>
</body>
</html>
</#compress>