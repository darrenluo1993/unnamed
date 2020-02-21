package com.unnamed.system.action;

import org.ironrhino.core.metadata.AutoConfig;
import org.ironrhino.core.struts.BaseAction;

@AutoConfig
public class UserSysAction extends BaseAction {

	private static final long serialVersionUID = 3168368816204899892L;

	private String checkUserName;// 选择的用户

	/**
	 * 获取用户-系统选择树
	 *
	 * @return 跳转目标页面
	 */
	public String getSystemTree() {
		return "tree";
	}

	public String getCheckUserName() {
		return checkUserName;
	}

	public void setCheckUserName(String checkUserName) {
		this.checkUserName = checkUserName;
	}

}
