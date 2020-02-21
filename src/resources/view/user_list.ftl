<!DOCTYPE html>
<#escape x as x?html>
<html>
<head>
    <title>${action.getText('user')}${action.getText('list')}</title>

</head>
<body style="width:100%;height:100%">

<div class="easyui-layout" style="width:100%;height:100%">
    <div class="nav-left" data-options="region:'west',split:true,title:'所有机构'"
         style="width:15%;overflow:auto;height:100%">
        <div id="baseTree" class="treeview">
            <li>
                <a class="ajax view" href="${actionBaseUrl}/query?user.sysId=default" data-replacement="user_form"><span>长沙银行</span></a>
                <ul>
                    <#assign parentSystem=beans['baseSystemService'].getBaseSystemByAuthz()!>
                    <#list parentSystem as system>
                        <li>
                            <a class="ajax view" href="${actionBaseUrl}/query?user.sysId=${system.id}" data-replacement="user_form"><span>${system.systemName}</span></a>
                        </li>
                    </#list>
                </ul>
            </li>
        </div>
    </div>

    <div style="width:82%;padding:10px;overflow:auto" data-options="region:'center',title:'用户管理'">
        <#assign actionColumnButtons=r'<@btn view="input" label="edit"/>'>
        <#assign columns={
        "用户名":{"width":"120px", "template":r"${entity.username!}"},
        "名字":{"width":"120px", "template":r"${entity.name!}"},
        "邮箱":{"width":"120px", "template":r"${entity.email!}"},
        "手机号码":{"width":"120px", "template":r"${entity.phone!}"},
        "enabled":{"width":"70px"},
        "归属系统":{"width":"120px", "template":r"${beans['baseSystemManager'].getSystemName(entity.sysId)!}"},
        "角色":{"width":"120px", "template":r"${beans['sysUserRoleProvider'].getRoleNames(entity.roles)!}"}
        }>
        <div class="table-body table-style3 mt10">
            <@richtable entityName="user" columns=columns actionColumnButtons=actionColumnButtons searchable=true downloadable=false celleditable=false enableable=true/>
        </div>
    </div>
</div>
</body>
</html></#escape>