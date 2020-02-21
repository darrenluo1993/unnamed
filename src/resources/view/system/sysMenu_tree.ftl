<!DOCTYPE html>
<#escape x as x?html>
<html>
<head>
    <title>功能菜单</title>
</head>

<body>
<div class="center-style">
    <a class="btn" name="selectedMenuSave" onClick="saveSelectedMenu();">
	    <span class="l-btn-left l-btn-icon-left">
		    <span class="l-btn-text">保存</span>
			    <span class="l-btn-icon icon-ok glyphicon glyphicon-save">&nbsp;</span>
        </span>
    </a>
</div>
<ul id="id_menutree" class="treeview" style="position:absolute;height:95%;width:280px;overflow:auto">
    <li>
        <input class="custom" type="checkbox" checked name="capital" menuUrl="" parentId="" id="1" value="1"
               onClick="checkedMenuRoot(this)"/>
        <a><span>自动化测试</span></a>
        <ul>
            <#assign parentMenu=beans['sysMenuManager'].getSelectedMenuList(1,checkRoleId)!>
            <#list parentMenu as parentMenu>
                <li>
                    <input name="${parentMenu.functionCode}" type="checkbox" <#if parentMenu.flag=="1"> checked </#if>
                           menuUrl="" parentId="${parentMenu.parent.id}" id="${parentMenu.id}" class="custom"
                           value="${parentMenu.id}" onClick="checkedMenuNode(this)"/>
                    <a><span>${parentMenu.name}</span></a>
                    <ul style="display: none;">
                        <#assign childrenMenu=beans['sysMenuManager'].getSelectedMenuList(parentMenu.id,checkRoleId)!>
                        <#list childrenMenu as childrenMenu>
                            <#assign menuParameter=childrenMenu.menuParameter!"">
                            <#assign menuUrl=childrenMenu.menuUrl!"">
                            <li>
                                <input name="${childrenMenu.functionCode}" type="checkbox" <#if childrenMenu.flag=="1">
                                       checked </#if> menuUrl="${menuUrl+ menuParameter}"
                                       parentId="${childrenMenu.parent.id}" id="${childrenMenu.id}" class="custom"
                                       value="${childrenMenu.id}" onClick="checkedMenuFun(this)"/>
                                <a><span>${childrenMenu.name}</span></a>
                            </li>
                        </#list>
                    </ul>
                </li>
            </#list>
        </ul>
    </li>
</ul>


</body>

</html>
</#escape>