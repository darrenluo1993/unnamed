package com.unnamed.system.action;

import org.ironrhino.core.metadata.AutoConfig;
import org.ironrhino.core.struts.BaseAction;

/**
 * @author zhuwen
 * @since 2017/6/29
 */
@AutoConfig
public class SysTreeAction extends BaseAction {
    private static final long serialVersionUID = 6069400888739633314L;
    /**
     * 获取系统选择树
     *
     * @return 跳转目标页面
     */
    public String getSystemTree() {
        return "tree";
    }

}
