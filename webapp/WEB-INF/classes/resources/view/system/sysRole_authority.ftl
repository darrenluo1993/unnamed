<!DOCTYPE html>
<#escape x as x?html>
<html>
<head>
    <title>权限配置</title>
</head>
<body>
	<div class="tabs" style="position:absolute;height:95%;width:300px;overflow:auto">   
		<@s.hidden class="required" name="checkRoleId" id="id_checkRoleId" value='${checkRoleId!}' readonly=true/>
		<ul class="nav nav-tabs">
			<li class="active"><a  href="#menuPower" data-windowoptions="{'width':'300px'}" data-toggle="tab"">功能菜单权限</a></li>
		</ul>
		<div class="tab-content">
			<div id="menuPower" class="tab-pane ajaxpanel active" data-url="/system/sysMenu/getMselectMenuTree?checkRoleId=${checkRoleId!}"></div>
		</div>
	</div>
</body>
</html>
</#escape>