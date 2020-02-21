package com.unnamed.system.manager;

import java.util.List;

import org.ironrhino.core.service.BaseManager;

import com.unnamed.system.model.RoleResource;

/**
 * 角色资源关联关系通用业务处理层
 *
 * @CreatedBy Darren Luo
 * @CreatedTime Sep 29, 2019 5:03:29 PM
 */
public interface IRoleResourceManager extends BaseManager<RoleResource> {
	/**
	 * 根据角色ID获取角色资源关联关系
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 29, 2019 5:22:34 PM
	 * @param roleId
	 * @return
	 */
	List<RoleResource> listRoleResourceViaRoleId(Long roleId);
}