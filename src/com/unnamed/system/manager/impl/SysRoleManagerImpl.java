package com.unnamed.system.manager.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.hibernate.transform.Transformers;
import org.ironrhino.core.service.BaseManagerImpl;
import org.ironrhino.security.model.User;
import org.ironrhino.security.service.UserManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.unnamed.system.manager.SysRoleManager;
import com.unnamed.system.model.SysRole;


@Component
@SuppressWarnings("unchecked")
public class SysRoleManagerImpl extends BaseManagerImpl<SysRole> implements SysRoleManager {

	@Autowired
	private UserManager userManager;

	/**
	 * 根据角色ID 取消角色
	 *
	 * @param roleIdList 角色代码
	 */
	@Override
	@Transactional
	public void cancelRole(String roleIdList) {
		String[] roleIds = roleIdList.split(",");
		if (ArrayUtils.isEmpty(roleIds)) {
			return;
		}
		List<String> roleList = new ArrayList<String>();
		for (String roleId : roleIds) {
			if (StringUtils.isNotBlank(roleId)) {
				roleList.add(roleId);
			}
		}
		if (CollectionUtils.isEmpty(roleList)) {
			return;
		}
		Query query = this.sessionFactory.getCurrentSession().createSQLQuery(
				"update tb_sys_role set `status` = false where roleid in (:roleIds)");
		query.setParameterList("roleIds", roleList.toArray(new String[roleList.size()]));
		query.executeUpdate();
	}

	@Override
	@Transactional(readOnly = true)
	public List<SysRole> getRoleList(String userName) {
		DetachedCriteria dc = this.detachedCriteria();
		dc.add(Restrictions.eq("status", true));
		dc.addOrder(Order.desc("createDate"));
		List<SysRole> sysRoleList = this.findListByCriteria(dc);

		DetachedCriteria userdc = DetachedCriteria.forClass(User.class);
		userdc.add(Restrictions.eq("username", userName));
		User user = this.userManager.findByCriteria(userdc);

		for (SysRole sysRole : sysRoleList) {
			if (null != user) {
				Set<String> userRoles = user.getRoles();
				if (userRoles.contains(sysRole.getRoleId())) {
					sysRole.setFlag("1");
				} else {
					sysRole.setFlag("0");
				}
			} else {
				sysRole.setFlag("0");
			}
		}
		return sysRoleList;
	}


	@Override
	public List<User> getUserListByRoleId(String roleId) {
		if(StringUtils.isBlank(roleId)){
			return null;
		}
		String sql = "select t.`username`,t.`name`,t.`sysId` from `tb_sys_user` t where find_in_set (:roleId,t.roles)";
		SQLQuery sqlQuery = this.sessionFactory.getCurrentSession().createSQLQuery(sql);
		sqlQuery.setParameter("roleId", roleId);
		sqlQuery.setResultTransformer(Transformers.aliasToBean(User.class));
		return sqlQuery.list();
	}
}

