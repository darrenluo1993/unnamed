package com.unnamed.system.manager.impl;

import static com.unnamed.base.model.ReturnResult.FAILURE;
import static com.unnamed.base.model.ReturnResult.OPERATE_FAILURE_MSG;
import static com.unnamed.base.model.ReturnResult.OPERATE_SUCCESS_MSG;
import static com.unnamed.base.model.ReturnResult.REMOVE_FAILURE_MSG;
import static com.unnamed.base.model.ReturnResult.REMOVE_SUCCESS_MSG;
import static com.unnamed.base.model.ReturnResult.SUCCESS;
import static org.hibernate.criterion.Order.asc;
import static org.hibernate.criterion.Restrictions.eq;
import static org.hibernate.criterion.Restrictions.isNull;

import java.util.List;

import org.hibernate.criterion.DetachedCriteria;
import org.ironrhino.core.service.BaseManagerImpl;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.unnamed.base.model.ReturnResult;
import com.unnamed.system.manager.IOrganizationManager;
import com.unnamed.system.model.Organization;
import com.unnamed.system.model.OrganizationAO;

import lombok.extern.slf4j.Slf4j;

/**
 * 组织机构通用业务处理层实现
 *
 * @CreatedBy Darren Luo
 * @CreatedTime Sep 19, 2019 4:22:57 PM
 */
@Slf4j
@Component
public class OrganizationManagerImpl extends BaseManagerImpl<Organization> implements IOrganizationManager {

	@Override
	public List<Organization> listOrganizationViaSupId(final Long supOrgId) {
		DetachedCriteria criteria = super.detachedCriteria();
		criteria.addOrder(asc(SERIAL_NUM));
		criteria.add(supOrgId == null ? isNull(SUP_ORG_ID) : eq(SUP_ORG_ID, supOrgId));

		final List<Organization> organizationList = super.findListByCriteria(criteria);
		for (final Organization organization : organizationList) {
			criteria = super.detachedCriteria();
			criteria.add(eq(SUP_ORG_ID, organization.getOrgId()));
			organization.setState(super.countByCriteria(criteria) > 0 ? "closed" : "open");
		}

		return organizationList;
	}

	@Override
	@Transactional
	public ReturnResult<Void> switchOrganizationViaOrgId(final OrganizationAO args) {
		try {
			this.modifyOrganizationEnabled(args.getOrgId(), args.getEnabled());

			return new ReturnResult<>(SUCCESS, OPERATE_SUCCESS_MSG);
		} catch (final Exception e) {
			log.error(e.getMessage(), e);
		}
		return new ReturnResult<>(FAILURE, OPERATE_FAILURE_MSG);
	}

	/**
	 * 根据组织ID递归修改组织机构的状态
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 23, 2019 5:22:06 PM
	 * @param orgId
	 * @param enabled
	 */
	private void modifyOrganizationEnabled(final Long orgId, final Boolean enabled) {
		// 根据组织ID查询组织机构并修改状态
		final Organization organization = super.findByNaturalId(orgId);
		if (organization != null) {
			organization.setEnabled(enabled);
			super.update(organization);

			// 根据组织ID查询子级组织机构并修改状态
			final DetachedCriteria criteria = super.detachedCriteria();
			criteria.add(eq(SUP_ORG_ID, orgId));
			super.findListByCriteria(criteria).forEach(modifyItem -> {
				modifyItem.setEnabled(enabled);
				super.update(modifyItem);

				this.modifyOrganizationEnabled(modifyItem.getOrgId(), enabled);
			});
		}
	}

	@Override
	@Transactional
	public ReturnResult<Void> removeOrganizationViaOrgId(final Long orgId) {
		try {
			this.recursiveRemoveOrganization(orgId);

			return new ReturnResult<>(SUCCESS, REMOVE_SUCCESS_MSG);
		} catch (final Exception e) {
			log.error(e.getMessage(), e);
		}
		return new ReturnResult<>(FAILURE, REMOVE_FAILURE_MSG);
	}

	/**
	 * 根据组织ID递归删除组织机构
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 24, 2019 9:22:30 AM
	 * @param orgId
	 */
	private void recursiveRemoveOrganization(final Long orgId) {
		// 根据组织ID查询组织机构并删除
		final Organization organization = super.findByNaturalId(orgId);
		if (organization != null) {
			super.delete(organization);
		}
		// 根据组织ID查询子级组织机构并删除
		final DetachedCriteria criteria = super.detachedCriteria();
		criteria.add(eq(SUP_ORG_ID, orgId));
		super.findListByCriteria(criteria).forEach(removeItem -> {
			super.delete(removeItem);

			this.recursiveRemoveOrganization(removeItem.getOrgId());
		});
	}

	private static final String SUP_ORG_ID = "supOrgId";
	private static final String SERIAL_NUM = "serialNum";
}