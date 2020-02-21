package com.unnamed.system.manager;

import java.util.List;

import org.ironrhino.core.service.BaseManager;

import com.unnamed.system.model.SysRoleFunction;

/**
 * @author syubun
 */
public interface SysRoleFunctionManager extends BaseManager<SysRoleFunction> {
	void saveList(List<SysRoleFunction> sysRoleFunctionList, String saveRoleId);
}
