package com.unnamed.system.manager;

import java.util.List;

import org.ironrhino.core.service.BaseManager;

import com.unnamed.base.model.ReturnResult;
import com.unnamed.system.model.Organization;
import com.unnamed.system.model.OrganizationAO;

/**
 * 组织机构通用业务处理层
 *
 * @CreatedBy Darren Luo
 * @CreatedTime Sep 19, 2019 4:22:27 PM
 */
public interface IOrganizationManager extends BaseManager<Organization> {
	/**
	 * 根据父级组织ID获取子级组织机构
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 20, 2019 3:36:37 PM
	 * @param supOrgId
	 * @return
	 */
	List<Organization> listOrganizationViaSupId(Long supOrgId);

	/**
	 * 根据组织ID启用禁用组织机构
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 23, 2019 5:01:07 PM
	 * @param args
	 * @return
	 */
	ReturnResult<Void> switchOrganizationViaOrgId(OrganizationAO args);

	/**
	 * 根据组织ID删除组织机构
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 23, 2019 11:56:06 AM
	 * @param orgId
	 * @return
	 */
	ReturnResult<Void> removeOrganizationViaOrgId(Long orgId);
}