<!DOCTYPE html>
<#escape x as x?html>
<html>
<head>
    <title>角色管理</title>
    <script src=<@url value="/assets/scripts/system/role.js"/> type="text/javascript" defer=""></script>
</head>
<body>
<div class="easyui-layout" style="width:100%;height:100%">
    <div data-options="region:'center',title:'角色管理',iconCls:'icon-save',"
         style="width:100%;padding: 10px;overflow:auto">
        <div class="toolbar">
            <a class="easyui-linkbutton" id="addRolePower" data-options="iconCls:'glyphicon glyphicon-cog'">配置角色权限</a>
            <a class="easyui-linkbutton" id="deleteRolePower"
               data-options="iconCls:'glyphicon glyphicon-trash'">删除角色</a>
        </div>
        <#assign actionColumnButtons=r'<@btn view="input" label="edit"/><@btn view="showUserList" label="查询用户"/>'>
        <#assign columns={
        "roleName":{"width":"180px", "alias":"角色名称","template":r"<@s.hidden name=viroleId value=entity.roleId/>${entity.roleName!}"  },
        "createUserId":{"width":"120px","alias":"创建人"},
        "createDate":{"width":"120px","alias":"创建时间"}
        }>
        <div class="table-body table-style3 mt10">
            <@richtable entityName="sysRole" columns=columns bottomButtons = bottomButtons actionColumnButtons=actionColumnButtons downloadable=false showBottomButtons=true searchable=false celleditable=false enableable=true/>
        </div>
    </div>
</div>
</body>
</html>
</#escape>