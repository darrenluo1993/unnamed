package com.unnamed.system.manager;

import java.util.List;

import org.ironrhino.core.service.BaseManager;

import com.unnamed.system.model.SysMenu;


public interface SysMenuManager extends BaseManager<SysMenu> {

	List<SysMenu> getSelectedMenuList(Long id, String roleId);

	List<SysMenu> getMenuList(Long id);
}

