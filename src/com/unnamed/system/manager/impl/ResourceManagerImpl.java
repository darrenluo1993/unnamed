package com.unnamed.system.manager.impl;

import static com.unnamed.base.model.ReturnResult.FAILURE;
import static com.unnamed.base.model.ReturnResult.OPERATE_FAILURE_MSG;
import static com.unnamed.base.model.ReturnResult.OPERATE_SUCCESS_MSG;
import static com.unnamed.base.model.ReturnResult.REMOVE_FAILURE_MSG;
import static com.unnamed.base.model.ReturnResult.REMOVE_SUCCESS_MSG;
import static com.unnamed.base.model.ReturnResult.SUCCESS;
import static java.util.Collections.emptyList;
import static org.hibernate.criterion.Order.asc;
import static org.hibernate.criterion.Restrictions.eq;
import static org.hibernate.criterion.Restrictions.in;
import static org.hibernate.criterion.Restrictions.isNull;
import static org.springframework.util.CollectionUtils.isEmpty;

import java.util.List;

import org.hibernate.criterion.DetachedCriteria;
import org.ironrhino.core.service.BaseManagerImpl;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.unnamed.base.model.ReturnResult;
import com.unnamed.system.manager.IResourceManager;
import com.unnamed.system.model.Resource;
import com.unnamed.system.model.ResourceAO;

import lombok.extern.slf4j.Slf4j;

/**
 * 系统资源通用业务处理层实现
 *
 * @CreatedBy Darren Luo
 * @CreatedTime Sep 19, 2019 4:22:57 PM
 */
@Slf4j
@Component
public class ResourceManagerImpl extends BaseManagerImpl<Resource> implements IResourceManager {

	@Override
	public List<Resource> listResourceViaSupId(final Long supResId) {
		DetachedCriteria criteria = super.detachedCriteria();
		criteria.addOrder(asc(SERIAL_NUM));
		criteria.add(supResId == null ? isNull(SUP_RES_ID) : eq(SUP_RES_ID, supResId));

		final List<Resource> resourceList = super.findListByCriteria(criteria);
		for (final Resource resource : resourceList) {
			criteria = super.detachedCriteria();
			criteria.add(eq(SUP_RES_ID, resource.getResId()));
			resource.setState(super.countByCriteria(criteria) > 0 ? "closed" : "open");
		}

		return resourceList;
	}

	@Override
	@Transactional
	public ReturnResult<Void> switchResourceViaResId(final ResourceAO args) {
		try {
			this.modifyResourceEnabled(args.getResId(), args.getEnabled());

			return new ReturnResult<>(SUCCESS, OPERATE_SUCCESS_MSG);
		} catch (final Exception e) {
			log.error(e.getMessage(), e);
		}
		return new ReturnResult<>(FAILURE, OPERATE_FAILURE_MSG);
	}

	/**
	 * 根据资源ID递归修改系统资源的状态
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 23, 2019 5:22:06 PM
	 * @param resId
	 * @param enabled
	 */
	private void modifyResourceEnabled(final Long resId, final Boolean enabled) {
		// 根据资源ID查询系统资源并修改状态
		final Resource resource = super.findByNaturalId(resId);
		if (resource != null) {
			resource.setEnabled(enabled);
			super.update(resource);

			// 根据资源ID查询子级系统资源并修改状态
			final DetachedCriteria criteria = super.detachedCriteria();
			criteria.add(eq(SUP_RES_ID, resId));
			super.findListByCriteria(criteria).forEach(modifyItem -> {
				modifyItem.setEnabled(enabled);
				super.update(modifyItem);

				this.modifyResourceEnabled(modifyItem.getResId(), enabled);
			});
		}
	}

	@Override
	@Transactional
	public ReturnResult<Void> removeResourceViaResId(final Long resId) {
		try {
			this.recursiveRemoveResource(resId);

			return new ReturnResult<>(SUCCESS, REMOVE_SUCCESS_MSG);
		} catch (final Exception e) {
			log.error(e.getMessage(), e);
		}
		return new ReturnResult<>(FAILURE, REMOVE_FAILURE_MSG);
	}

	/**
	 * 根据资源ID递归删除系统资源
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 24, 2019 9:22:30 AM
	 * @param resId
	 */
	private void recursiveRemoveResource(final Long resId) {
		// 根据资源ID查询系统资源并删除
		final Resource resource = super.findByNaturalId(resId);
		if (resource != null) {
			super.delete(resource);
		}
		// 根据资源ID查询子级系统资源并删除
		final DetachedCriteria criteria = super.detachedCriteria();
		criteria.add(eq(SUP_RES_ID, resId));
		super.findListByCriteria(criteria).forEach(removeItem -> {
			super.delete(removeItem);

			this.recursiveRemoveResource(removeItem.getResId());
		});
	}

	@Override
	public List<Resource> listResourceViaMultiResId(final List<Long> resIdList) {
		if (isEmpty(resIdList)) {
			return emptyList();
		}
		final DetachedCriteria criteria = super.detachedCriteria();
		criteria.add(in(RES_ID, resIdList));
		return super.findListByCriteria(criteria);
	}

	private static final String RES_ID = "resId";
	private static final String SUP_RES_ID = "supResId";
	private static final String SERIAL_NUM = "serialNum";
}