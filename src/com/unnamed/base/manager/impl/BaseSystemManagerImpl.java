package com.unnamed.base.manager.impl;

import java.util.List;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.ironrhino.core.service.BaseManagerImpl;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.unnamed.base.manager.BaseSystemManager;
import com.unnamed.base.model.BaseSystem;

/**
 * @author zhuwen
 * @since 2017/6/27
 */
@Component
public class BaseSystemManagerImpl extends BaseManagerImpl<BaseSystem> implements BaseSystemManager {

	@Override
	@Transactional(readOnly = true)
	public List<BaseSystem> getAllSystem() {
		DetachedCriteria dc = this.detachedCriteria();
		dc.addOrder(Order.asc("systemCode"));
		return this.findListByCriteria(dc);
	}

	@Override
	@Transactional(readOnly = true)
	public String getSystemName(String id) {
		BaseSystem baseSystem = this.get(id);
		return null == baseSystem ? null : baseSystem.getSystemName();
	}

	@Override
	@Transactional(readOnly = true)
	public String getSystemCode(String id) {
		BaseSystem baseSystem = this.get(id);
		return null == baseSystem ? null : baseSystem.getSystemCode();
	}

	@Override
	@Transactional(readOnly = true)
	public BaseSystem getBaseSystemById(String sysId) {
		DetachedCriteria dc = this.detachedCriteria();
		dc.add(Restrictions.eq("id", sysId));
		dc.addOrder(Order.asc("systemCode"));
		return this.findByCriteria(dc);
	}

	@Override
	@Transactional(readOnly = true)
	public BaseSystem getBaseSystemBySysCode(String systemCode) {
		DetachedCriteria dc = this.detachedCriteria();
		dc.add(Restrictions.eq("systemCode", systemCode));
		return this.findByCriteria(dc);
	}

}
