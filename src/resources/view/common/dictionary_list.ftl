<!DOCTYPE html>
<#escape x as x?html>
<html>
<head>
    <title>${action.getText('字典管理')}${action.getText('list')}</title>
</head>
<body>
	<#assign actionColumnButtons=r'<@btn view="view" label="view"/><@btn view="input" label="edit"/>'>
        <#assign columns={
        "名字":{"width":"", "template":r"${entity.name!}"},
        "描述":{"width":"", "template":r"${entity.description!}"}
        }>
        <div class="table-body table-style3 mt10">
            <@richtable entityName="dictionary" columns=columns actionColumnButtons=actionColumnButtons searchable=true downloadable=false/>
        </div>
</body>
</html></#escape>