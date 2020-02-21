package com.unnamed.system.action;

import org.ironrhino.core.metadata.AutoConfig;
import org.ironrhino.core.struts.EntityAction;

import com.unnamed.system.model.SysMenu;

/**
 * @author zhuwen
 * @since 2017/6/28
 */
@AutoConfig
public class SysMenuAction extends EntityAction<SysMenu> {

	private static final long serialVersionUID = 7294443525120214679L;
	//角色ID
	private String checkRoleId;

	/**
	 * 获取树菜单
	 *
	 * @return 跳转目标页面
	 */
	public String getMselectMenuTree() {
		return "tree";
	}

	public String getCheckRoleId() {
		return this.checkRoleId;
	}

	public void setCheckRoleId(String checkRoleId) {
		this.checkRoleId = checkRoleId;
	}
}
