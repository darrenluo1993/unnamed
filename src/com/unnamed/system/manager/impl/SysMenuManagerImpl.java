package com.unnamed.system.manager.impl;

import java.util.Collections;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.ironrhino.core.security.role.UserRole;
import org.ironrhino.core.service.BaseManagerImpl;
import org.ironrhino.core.util.AuthzUtils;
import org.ironrhino.security.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.unnamed.system.manager.SysMenuManager;
import com.unnamed.system.manager.SysRoleFunctionManager;
import com.unnamed.system.model.SysMenu;
import com.unnamed.system.model.SysRoleFunction;

/**
 * 菜单管理
 *
 * @author zhuwen
 * @since 2017/6/26
 */
@Component
public class SysMenuManagerImpl extends BaseManagerImpl<SysMenu> implements SysMenuManager {
	@Autowired
	private SysRoleFunctionManager sysRoleFunctionManager;


	@Override
	@Transactional(readOnly = true)
	public List<SysMenu> getSelectedMenuList(Long id, String roleId) {
		DetachedCriteria dc = this.detachedCriteria();
		dc.createAlias("parent", "p").add(Restrictions.eq("p.id", id));
		//        dc.add(Restrictions.eq("validStatus", "1"));
		dc.addOrder(Order.asc("displayOrder"));
		dc.addOrder(Order.asc("name"));
		List<SysMenu> paMenuList = this.findListByCriteria(dc);
		for (SysMenu paMenuItem : paMenuList) {
			paMenuItem.setFlag("0");
			if (StringUtils.isNotEmpty(roleId)) {
				DetachedCriteria fundc = DetachedCriteria.forClass(SysRoleFunction.class);
				fundc.add(Restrictions.eq("menuId", paMenuItem.getId()));
				fundc.add(Restrictions.eq("roleId", roleId));
				SysRoleFunction paRoleFunction = this.sysRoleFunctionManager.findByCriteria(fundc);
				if (paRoleFunction != null) {
					paMenuItem.setFlag("1");
				} else {
					paMenuItem.setFlag("0");
				}
			}
		}
		return paMenuList;
	}

	@Override
	@Transactional(readOnly = true)
	@SuppressWarnings({"rawtypes", "unchecked"})
	public List<SysMenu> getMenuList(Long id) {
		if (this.isAdmin()) {
			return this.getSelectedMenuList(id, null);
		}
		String roles = this.getRoles();
		if ("".equals(roles)) {
			return Collections.emptyList();
		}
		String sql = String.format("select a.`id`,a.`displayOrder`,a.`fullId`,a.`level`,a.`name`,a.`closeimage`,a.`flag`," +
				"a.`functioncode`,a.`image`,a.`menuparameter`,a.`menuurl`,a.`openimage`,a.`target`,a.`validstatus`,a.`parentId`" +
				" from `tb_sys_menu` a inner join tb_sys_role_function b where a.`id` = b.`menuid` and a.`validstatus` = '1'  " +
				"and b.roleid in (%s)  AND a.`parentId` =%d order by a.displayorder,a.name asc", roles, id);
		SQLQuery query = this.sessionFactory.getCurrentSession().createSQLQuery(sql).addEntity(SysMenu.class);
		return query.list();
	}


	private boolean isAdmin() {
		User user = AuthzUtils.getUserDetails(User.class);
		return user.getRoles().contains(UserRole.ROLE_ADMINISTRATOR);
	}

	private String getRoles() {
		User user = AuthzUtils.getUserDetails(User.class);
		StringBuilder roles = new StringBuilder();
		for (String role : user.getRoles()) {
			roles.append("'").append(role).append("',");
		}
		if ("".equals(roles.toString())) {
			return "";
		}
		return roles.substring(0, roles.length() - 1);
	}
}
