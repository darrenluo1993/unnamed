<!DOCTYPE html>
<#escape x as x?html>
<html>
<head>
    <title>角色名称</title>
</head>
<body>
<div class="treelist">
    <div class="center-style">
        <a class="l-btn" name="selectedRoleSave" onClick="saveSelectedRole();">
	     	<span class="l-btn-left l-btn-icon-left">
				<span class="l-btn-text">确定</span>
				<span class="l-btn-icon glyphicon glyphicon-ok">&nbsp;</span>
			</span>
        </a>
    </div>
    <div class="treeview" style="position:absolute;height:90%;width:280px;overflow:auto">
        <ul id="id_roletree">
            <li>
                <a><span>所有角色</span></a>
                <ul style="display: none;">
                    <#assign roleList=beans['sysRoleManager'].getRoleList(checkUserName)!>
                    <#list roleList as role>
                        <li>
                            <input type="checkbox" <#if role.flag=="1"> checked </#if> class="custom"
                                   name="${role.roleName}" value="${role.roleId}"/>
                            <a><span>${role.roleName}</span></a>
                        </li>
                    </#list>
                </ul>
            </li>
        </ul>
    </div>
</div>
</body>
</html>
</#escape>