<!DOCTYPE html>
<#escape x as x?html>
<html>
<head>
    <title><#if user.new>${getText('create')}<#else>${getText('edit')}</#if>${getText('user')}</title>
</head>
<body>
    <@s.form id="user_input" action="${actionBaseUrl}/save" method="post" class="ajax form-horizontal sequential_create">
        <#if !user.new>
            <@s.hidden name="user.id" />
            <@s.textfield name="user.username" readonly="true"/>
            <@s.password name="password" class="sha"/>
            <@s.password name="confirmPassword" class="sha"/>
        <#else>
            <@s.textfield name="user.username" class="required checkavailable regex conjunct" data\-replacement="controls-user-roles" data\-regex="${statics['org.ironrhino.security.model.User'].USERNAME_REGEX}" data\-checkurl="${actionBaseUrl}/checkavailable"/>
            <@s.password name="password" class="required sha"/>
            <@s.password name="confirmPassword" class="required sha"/>
        </#if>
        <@s.textfield name="user.name" class="required"/>
        <@s.textfield name="user.email" type="email" class="email checkavailable required" data\-checkurl="${actionBaseUrl}/checkavailable"/>
        <@s.textfield name="user.phone" class="required"/>
        <@s.textfield name="user.weChat" />
        <@s.textfield name="user.qq" />
        <@s.textfield name="user.rtx" />
        <@s.checkbox name="user.enabled" class="custom" />

        <#assign systemName=beans['baseSystemManager'].getSystemName(user.sysId)!>

    <div class="row-fluid">
        <div class="span12">
            <label class="control-label" for="form_assetType">归属系统：</label>
            <div class="control-group">
                <div class="controls">
                	<#assign systemNames=beans['baseSystemService'].getSysNamesBySysIds(user.sysId)!>
                    <input type="text" name="systemName" id="systemName" value="${systemNames!}" autocomplete="off"
                           readonly=true>
                    <@s.hidden name="user.sysId" id="sysId" value="${user.sysId!}"/>
                    <a class="popwindow l-btn" data-windowoptions="{'width':'300px'}"
                       href='<@url value="/system/userSys/getSystemTree?checkUserName=${user.username!}"/>'
                       title='系统列表' target='_blank'>
                    <span class="l-btn-left l-btn-icon-left">
                        <span class="l-btn-text">选择</span>
                        <span class="l-btn-icon glyphicon glyphicon-search">&nbsp;</span>
                    </span>
                    </a>
                </div>
            </div>
        </div>
    </div>

        <#assign roleNames=beans['sysUserRoleProvider'].getRoleNames(user.roles)!>
        <#assign roleIds=beans['sysUserRoleProvider'].transRolesToString(user.roles)!>

    <div class="row-fluid">
        <div class="span12">
            <label class="control-label" for="form_assetType">角色：</label>
            <div class="control-group">
                <div class="controls">
                    <input type="text" id="id_userRoleNames" value="${roleNames!}" autocomplete="off" readonly=true>
                    <@s.hidden name="user.roles" id="id_userRoleIds"  value="${roleIds!}"/>
                    <a class="popwindow l-btn" data-windowoptions="{'width':'300px'}"
                       href="<@url value="/system/sysRole/getRoleTree?checkUserName=${user.username!}"/>" target='_blank' title='角色列表'>
                    <span class="l-btn-left l-btn-icon-left">
                        <span class="l-btn-text">选择</span>
                        <span class="l-btn-icon glyphicon glyphicon-search">&nbsp;</span>
                    </span>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div class="row-fluid">
        <div class="span12 center-style">
            <@s.submit value=getText('save') class="btn-primary"/>
        </div>
    </div>
    </@s.form>
</body>
</html>
</#escape>

