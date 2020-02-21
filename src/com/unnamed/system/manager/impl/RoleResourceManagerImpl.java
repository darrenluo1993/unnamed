package com.unnamed.system.manager.impl;

import static org.hibernate.criterion.Restrictions.eq;

import java.util.List;

import org.hibernate.criterion.DetachedCriteria;
import org.ironrhino.core.service.BaseManagerImpl;
import org.springframework.stereotype.Component;

import com.unnamed.system.manager.IRoleResourceManager;
import com.unnamed.system.model.RoleResource;

/**
 * 角色资源关联关系通用业务处理层实现
 *
 * @CreatedBy Darren Luo
 * @CreatedTime Sep 29, 2019 5:05:27 PM
 */
@Component
public class RoleResourceManagerImpl extends BaseManagerImpl<RoleResource> implements IRoleResourceManager {

	@Override
	public List<RoleResource> listRoleResourceViaRoleId(final Long roleId) {
		final DetachedCriteria criteria = super.detachedCriteria();
		criteria.add(eq(ROLE_ID, roleId));

		return super.findListByCriteria(criteria);
	}

	private static final String ROLE_ID = "roleId";
}