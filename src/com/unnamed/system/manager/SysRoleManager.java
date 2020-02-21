package com.unnamed.system.manager;

import java.util.List;

import org.ironrhino.core.service.BaseManager;
import org.ironrhino.security.model.User;

import com.unnamed.system.model.SysRole;

/**
 * @author zhuwen
 * @since 2017/6/28
 */
public interface SysRoleManager extends BaseManager<SysRole> {
	void cancelRole(String roleIdList);
	List<SysRole> getRoleList(String userName);
	List<User> getUserListByRoleId(String roleId);
}
