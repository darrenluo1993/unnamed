<!DOCTYPE html>
<#escape x as x?html>
<html>
<head>
    <title>系统结构树</title>
</head>
<body>

<div id="baseTree" class="treeview">
    <li>
        <a><span>长沙银行</span></a>
        <ul>
            <#assign parentSystem=beans['baseSystemManager'].getAllSystem()!>
            <#list parentSystem as system>
                <li>
                    <a onclick="selectSystemNode(this)" name="${system.systemName}" id="${system.id}"><span>${system.systemName}</span></a>
                </li>
            </#list>
        </ul>
    </li>
</div>
</body>

</html>
</#escape>