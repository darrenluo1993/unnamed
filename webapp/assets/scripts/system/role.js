$(document).ready(function () {
    /**
     * @Name $('#addRolePower').click点击配置角色权限方法
     * @Param node 节点
     * @Description 配置角色权限
     **/
    $('#addRolePower').click(function (event) {
        var length = $("#sysRole_form").find("table tbody tr").length;
        var selectLength = 0;//总行数
        var selectedRow = 0;//被选中行的下标
        //计算总行数
        for (var i = 0; i < length; i++) {
            var select = $("#sysRole_form").find("table tbody").find("tr").eq(i).attr("class");
            if (select === "selected") {
                selectedRow = i;
                selectLength++;
            }
        }
        //校验如果selectLength=0则表示没选中一行，如果selectLength>1表示选中了多行
        if (selectLength < 1) {
            doTheAlert("提示", "请表格中勾选中一个角色！");
            return false;
        } else if (selectLength > 1) {
            doTheAlert("提示", "只能勾选中一个角色配置权限");
            return false;
        } else if (selectLength === 1) {
            var tr = $("#sysRole_form").find("table tbody").find("tr").eq(selectedRow);
            var checkRoleId = tr.find("td")[1].childNodes[0].value;
            window.open("/system/sysRole/setRolePower?checkRoleId=" + checkRoleId, {width: '320px'});
        }
    });

    $('#deleteRolePower').click(function (event) {
        var roleIdList = "";
        var length = $("#sysRole_form table tbody tr").length;
        var selectLength = 0;//总行数
        var selectedRow = 0;//被选中行的下标
        //计算总行数
        for (var i = 0; i < length; i++) {
            var select = $("#sysRole_form table tbody").find("tr").eq(i).attr("class");
            if (select === "selected") {
                var roleId = $("#sysRole_form table tbody").find("tr").eq(i).find("td").eq(1).find("input").val();
                roleIdList = roleIdList + roleId + ",";
                selectedRow = i;
                selectLength++;
            }
        }
        //校验如果selectLength=0则表示没选中一行，如果selectLength>1表示选中了多行
        if (selectLength < 1) {
            doTheAlert("提示", "请表格中勾选角色！");
            return false;
        } else {
            $.messager.confirm("提示", "确定删除", function (f) {
                if (f) {
                    $.ajax({
                        type: "post",
                        global: false,
                        async: true,
                        url: '/system/sysRole/deleteRole?roleIdList=' + roleIdList,
                        dataType: "json",
                        success: function (data) {
                            getTheMessager().alert("提示", data, '', function () {
                                clickRoleNode();
                            });
                        },
                        error: function () {
                            doTheAlert("提示", "删除失败！");
                            return false;
                        }
                    });
                }
            });
        }
    });

});


/**
 * 刷新页面数据
 */
function clickRoleNode() {
    var from1 = $('form.criteria');
    if (from1 && from1.length >= 0) {
        var from2 = from1[from1.length - 1];
        var id = from2.id;
        var actionBase = "/system/sysRole";
        $("#" + id)[0].action = actionBase;
        $("#" + id).trigger("submit");
    }
}



