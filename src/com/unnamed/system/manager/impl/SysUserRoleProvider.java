package com.unnamed.system.manager.impl;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.ironrhino.core.security.role.UserRoleProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.unnamed.system.manager.SysRoleManager;
import com.unnamed.system.model.SysRole;

/**
 * 获取系统角色
 *
 * @author syubun
 */
@Component
public class SysUserRoleProvider implements UserRoleProvider {
	@Autowired
	private SysRoleManager sysRoleManager;

	@Override
	public Map<String, String> getRoles() {
		Map<String, String> roles = new LinkedHashMap<String, String>();
		List<SysRole> userRoles = this.sysRoleManager.findAll();
		if (!CollectionUtils.isEmpty(userRoles)) {
			for (SysRole role : userRoles) {
				if (role.isStatus()) {
					roles.put(role.getRoleId(), role.getRoleName());
				}
			}
		}
		return roles;
	}

	/**
	 * 根据角色ID集合获取角色名称集合
	 *
	 * @param rolesSet 角色ID集合
	 * @return 角色名称集合
	 */
	public String getRoleNames(Set<String> rolesSet) {
		if(CollectionUtils.isEmpty(rolesSet)){
			return "";
		}
		Map<String, String> roleMap = this.getRoles();
		StringBuilder roleNames = new StringBuilder();
		for (String role : rolesSet) {
			String name = roleMap.get(role);
			if (StringUtils.isBlank(name)) {
				continue;
			}
			roleNames.append(name).append(",");
		}
		if (roleNames.length() > 1) {
			roleNames = new StringBuilder(roleNames.substring(0, roleNames.length() - 1));
		}
		return roleNames.toString();
	}

	public String transRolesToString(Set<String> rolesSet) {
		if (rolesSet == null) {
			return "";
		} else {
			StringBuilder roleIds = new StringBuilder();
			for (String role : rolesSet) {
				if (StringUtils.isBlank(role)) {
					continue;
				}
				roleIds.append(role).append(",");
			}
			if (roleIds.length() > 1) {
				roleIds = new StringBuilder(roleIds.substring(0, roleIds.length() - 1));
			}
			return roleIds.toString();
		}
	}
}
