/**
 * 展开节点下所有子节点，给所有子节点checked赋值为父节点的checked
 * @param node 节点
 */
function checkedMenuNode(node) {
    //展开子节点
    var li = node.parentNode;
    var childrenList = li.children;//获取某个li下的所有子对象
    li.class = "collapsable";
    for (var i = 0; i < childrenList.length; i++) {
        if (childrenList[i].className == "hitarea expandable-hitarea") {
            childrenList[i].className = "hitarea collapsable-hitarea";
        }
        if (childrenList[i].nodeName == "UL") {
            childrenList[i].style.display = "";
            checkNextObj(childrenList[i], node.checked);
        }
    }
}

function isNull(keyVal) {
    return (keyVal == null || keyVal == undefined || keyVal == "");
}

/**
 * 根据子节点的checked状态更改父节点的checked状态
 * @param node 节点
 */
function checkedMenuFun(node) {
    //如果选中上级也需要选中否则判断同级是否都未选中如果都没有选中上级也设置为不选中
    if (node.checked) {
        var li = node.parentNode.parentNode.parentNode;
        upchecked(li, node.checked);
    } else {
        var li = node.parentNode.parentNode.parentNode;
        var liList = node.parentNode.parentNode.children;
        var isAllCheck = "0";
        for (var i = 0; i < liList.length; i++) {
            var inputBox = liList[i].children;//获取某个li下的所有子对象
            //循环li的的子对象
            for (j = 0; j < inputBox.length; j++) {
                var inputType = inputBox[j].type;
                if (inputBox[j].type == "checkbox" && inputBox[j].checked == true) {
                    isAllCheck = "1";
                }
            }
        }
        if (isAllCheck == 0) {
            upchecked(li, node.checked);
        }
    }
}

/**
 * 根据子节点的checked状态更改父节点的checked状态
 * @param node 节点
 */
function checkedMenuRoot(node) {
    node.checked = true;
}

/**
 * 根据子节点的checked状态更改父节点的状态
 * @param obj 节点
 * @param check 状态
 */
function upchecked(obj, check) {
    var inputBox = obj.children;//获取某个li下的所有子对象
    //循环li的的子对象
    for (j = 0; j < inputBox.length; j++) {
        var inputType = inputBox[j].type;
        if (inputBox[j].type == "checkbox") {
            inputBox[j].checked = check
        }
    }
}

/**
 * 根据子节点的checked状态更改父节点的checked状态
 * @param obj 节点
 * @param check 节点选中状态
 */
function checkNextObj(obj, check) {
    var liList = obj.children;//获取菜单下所有的LI;
    // 如果子节点复选框对象集合不为空
    for (i = 0; i < liList.length; i++) {
        var inputBox = liList[i].children;//获取某个li下的所有子对象
        //循环li的的子对象
        for (j = 0; j < inputBox.length; j++) {
            var inputType = inputBox[j].type;
            if (inputBox[j].type == "checkbox") {
                inputBox[j].checked = check
            }
        }
    }
}

/**
 * 保存选中菜单信息
 */
function saveSelectedMenu() {
    var roleId = $('#id_checkRoleId').val();
    var liList = $('#id_menutree li');//获取菜单下所有的LI
    var saveJsonStr = "";
    for (i = 0; i < liList.length; i++) {
        var inputBox = liList[i].children;//获取某个li下的所有子对象
        //循环li的的子对象找到复选框被选中的
        for (j = 0; j < inputBox.length; j++) {
            var inputType = inputBox[j].type;
            if (inputBox[j].type == "checkbox" && inputBox[j].checked == true) {
                var rolefunctionItem = "";
                var menuId = inputBox[j].value;
                var parentMenuId = inputBox[j].getAttribute("parentId");
                var functionCode = inputBox[j].name;
                var menuUrl = inputBox[j].getAttribute("menuUrl");
                rolefunctionItem = "{'roleId':'" + roleId + "','menuId':'" + menuId + "','parentMenuId':'" + parentMenuId + "','functionCode':'" + functionCode + "','menuUrl':'" + menuUrl + "','flag':'','id':''}";
                saveJsonStr = saveJsonStr + rolefunctionItem + ",";
                break;
            }
        }
    }
    saveJsonStr = "[" + saveJsonStr.substring(0, (saveJsonStr.length - 1)) + "]";
    $.ajax({
        type: "post",
        global: false,
        url: '/system/sysRole/saveRolefunction',
        data: {
            saveJsonStr: saveJsonStr,
            checkRoleId: roleId
        },
        dataType: "json",
        success: function (data) {
            if (data != "success") {
                doTheAlert("提示", "保存失败！");
            } else {
            	$.messager.alert('提示','保存成功！','',function() {
					closePage();
					$('#sysRole_form').submit();
				});
                // $('.ui-dialog:visible').last().find('.ui-dialog-titlebar-close').click();
            }
        }
    });
}

/**
 * 保存选中角色信息
 */
function saveSelectedRole() {
    var liList = $('#id_roletree li');//获取菜单下所有的LI
    var roleNameList = "";
    var roleIdList = "";
    for (i = 0; i < liList.length; i++) {
        var inputBox = liList[i].children;//获取某个li下的所有子对象
        //循环li的的子对象找到复选框被选中的
        for (j = 0; j < inputBox.length; j++) {
            var inputType = inputBox[j].type;
            if (inputBox[j].type == "checkbox" && inputBox[j].checked == true) {
                var roleName = inputBox[j].name;
                var roleId = inputBox[j].value;
                roleNameList = roleNameList + roleName + ",";
                roleIdList = roleIdList + roleId + ",";
                break;
            }
        }
    }
    roleNameList = roleNameList.substring(0, roleNameList.length - 1);
    roleIdList = roleIdList.substring(0, roleIdList.length - 1);
    $('#id_userRoleNames').val(roleNameList);
    $('#id_userRoleIds').val(roleIdList);
    $('.ui-dialog:visible').last().find('.ui-dialog-titlebar-close').click();
}

//保存选中系统信息
function saveSelectedSys() {
    var liList = $('#id_systree li');//获取菜单下所有的LI
    var sysNameList = "";
    var sysIdList = "";
    for (i = 0; i < liList.length; i++) {
        var inputBox = liList[i].children;//获取某个li下的所有子对象
        //循环li的的子对象找到复选框被选中的
        for (j = 0; j < inputBox.length; j++) {
            var inputType = inputBox[j].type;
            if (inputBox[j].type == "checkbox" && inputBox[j].checked == true) {
                var sysName = inputBox[j].name;
                var sysId = inputBox[j].value;
                sysNameList = sysNameList + sysName + ",";
                sysIdList = sysIdList + sysId + ",";
                break;
            }
        }
    }
    sysNameList = sysNameList.substring(0, sysNameList.length - 1);
    sysIdList = sysIdList.substring(0, sysIdList.length - 1);
    $('#systemName').val(sysNameList);
    $('#sysId').val(sysIdList);
    $('.ui-dialog:visible').last().find('.ui-dialog-titlebar-close').click();
}


function selectSystemNode(node){
    $('#systemName').val(node.name);
    $('#sysId').val(node.id);
    $('.ui-dialog:visible').last().find('.ui-dialog-titlebar-close').click();
}

/**
 *
 * 将机构信息赋值到页面
 * @param node 节点
 */
function selectDptNode(node) {
    var toFieldsStr = document.getElementById("toFields").value;
    var fromFieldsStr = document.getElementById("fromFields").value;
    //校验取值来源字段
    if (fromFieldsStr != null && fromFieldsStr != "") {
    } else {
        doTheAlert("提示", "取值来源字段不能为空！");
        $('.ui-dialog:visible').last().find('.ui-dialog-titlebar-close').click();
        return;
    }

    //目标赋值字段不为空情况处理
    if (toFieldsStr != null && toFieldsStr != "") {
        var toFields = toFieldsStr.split("-");
        var fromFields = fromFieldsStr.split("-");
        if (fromFields.length == toFields.length) {
            for (var i = 0; i < fromFields.length; i++) {
                try {
                    var fromField = eval("node." + fromFields[i]);
                    var temp = toFields[i];
                    $("#" + temp).attr("readOnly", false);
                    $("#" + temp).focus();
                    document.getElementById(toFields[i]).value = fromField;
                    $("#" + temp).change();
                    $("#" + temp).blur();
                    $("#" + temp).attr("readOnly", true);
                } catch (Exception) {
                    doTheAlert("提示", Exception);
                    break;
                }
            }
            //选择机构将机构名称回显在页面的并触发它的change事件。（默认第一个字段是回显的字段）
            if (!$("#" + toFields[0]).change()) {
                return;
            }
            $('.ui-dialog:visible').last().find('.ui-dialog-titlebar-close').click();
        } else {
            doTheAlert("提示", "取值来源字段与目标赋值字段个数不一致！");
            //窗口关闭
            $('.ui-dialog:visible').last().find('.ui-dialog-titlebar-close').click();
            return ;
        }
    } else {//目标赋值字段为空情况处理
        var fromFields = fromFieldsStr.split("-");
        for (var i = 0; i < fromFields.length; i++) {
            try {
                var fromField = eval("node." + fromFields[i]);
                var temp = fromFields[i];
                $("#" + temp).attr("readOnly", false);
                $("#" + temp).focus();
                document.getElementById(fromFields[i]).value = fromField;
                $("#" + temp).change();
                $("#" + temp).blur();
                $("#" + temp).attr("readOnly", true);
                //$("#"+fromFields[i])).change();
            } catch (Exception) {
                doTheAlert("提示", Exception);
                break;
            }
        }
        $('.ui-dialog:visible').last().find('.ui-dialog-titlebar-close').click();
        return;
    }

}