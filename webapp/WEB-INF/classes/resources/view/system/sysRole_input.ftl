<!DOCTYPE html>
<#escape x as x?html>
<html>
<head>
    <title>维护角色页面</title>
</head>
<body>
    <@s.form id="sysRole_input" action="${actionBaseUrl}/save" method="post" class="ajax form-horizontal" >
        <#if !sysRole.new>
            <@s.hidden name="sysRole.id"/>
            <@s.hidden name="sysRole.roleId"/>
        </#if>
        <@s.hidden name="sysRole.status"/>

    <div class="row-fluid">
        <div class="span12 w300">
            <@s.textfield  label="角色名称：" name="sysRole.roleName" class="required"/>
        </div>
    </div>

    <div class="row-fluid">
        <div class="span11 center-style">
            <@s.submit value=getText('save') class="btn btn-primary"/>
        </div>
    </div>
    </@s.form>
</body>
</html>
</#escape>