package com.unnamed.system.service;

import java.util.List;

import com.unnamed.base.model.ReturnResult;
import com.unnamed.base.model.TreeData;
import com.unnamed.system.model.Resource;
import com.unnamed.system.model.RoleResource;

/**
 * 系统角色业务逻辑处理层
 *
 * @CreatedBy Darren Luo
 * @CreatedTime Sep 29, 2019 5:26:05 PM
 */
public interface IRoleService {
	/**
	 * 根据角色ID获取该角色拥有的系统资源
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 29, 2019 5:28:15 PM
	 * @param roleId
	 * @return
	 */
	ReturnResult<List<Resource>> listGrantedResViaRoleId(Long roleId);

	/**
	 * 根据用户名获取用户拥有权限的系统资源树形数据
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 30, 2019 3:03:19 PM
	 * @param username
	 * @return
	 */
	ReturnResult<List<TreeData>> listUserResourceTreeData(String username);

	/**
	 * 根据角色ID删除角色的系统资源，然后批量保存角色的新系统资源
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 30, 2019 5:36:09 PM
	 * @param roleId
	 * @param roleResourceList
	 * @return
	 */
	ReturnResult<Void> saveMultiRoleResource(Long roleId, List<RoleResource> roleResourceList);
}