<!DOCTYPE html>
<#escape x as x?html>
<html>
<head>
    <title>系统名称</title>
</head>
<body>
<div class="treelist">
    <div class="center-style">
        <a class="l-btn" name="selectedSysSave" onClick="saveSelectedSys();">
	     	<span class="l-btn-left l-btn-icon-left">
				<span class="l-btn-text">确定</span>
				<span class="l-btn-icon glyphicon glyphicon-ok">&nbsp;</span>
			</span>
        </a>
    </div>
    <div class="treeview" style="position:absolute;height:90%;width:280px;overflow:auto">
        <ul id="id_systree">
            <li>
                <a><span>所有系统</span></a>
                <ul style="display: none;">
                    <#assign sysList=beans['baseSystemService'].getSysListByUsername(checkUserName)!>
                    <#list sysList as system>
                        <li>
                            <input type="checkbox" <#if system.flag=="1"> checked </#if> class="custom"
                                   name="${system.systemName}" value="${system.id}"/>
                            <a><span>${system.systemName}</span></a>
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