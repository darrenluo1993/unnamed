<div class="easyui-accordion" style="width:100%;">
    <div title="${action.getText("index")}">
        <a href="<@url value="/#"/>" class="view" style="margin-left:2px;"><i class="circle-full"></i><span>${action.getText("index")}</span></a>
    </div>
<#assign parentMenu=beans['sysMenuManager'].getMenuList(1)!>
<#list parentMenu as parentMenu>
    <div title="${parentMenu.name}">
        <ul>
            <#assign childrenMenu=beans['sysMenuManager'].getMenuList(parentMenu.id)!>
            <#list childrenMenu as childrenMenu>
                <#assign menuParameter=childrenMenu.menuParameter!"">
                <#assign menuUrl=childrenMenu.menuUrl!"">
                <#assign target=childrenMenu.target!"">
                <li>
                    <a href="#" title="<@url value="${menuUrl+menuParameter}"/>" class="view">
                        <i class="circle-full"></i><span>${childrenMenu.name}</span>
                    </a>
                </li>
            </#list>
        </ul>
    </div>
</#list>
</div>
