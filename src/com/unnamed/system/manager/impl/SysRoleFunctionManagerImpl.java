package com.unnamed.system.manager.impl;

import java.util.List;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;
import org.ironrhino.core.service.BaseManagerImpl;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.unnamed.system.manager.SysRoleFunctionManager;
import com.unnamed.system.model.SysRoleFunction;

/**
 * @author zhuwen
 * @since 2017/6/26
 */
@Component
public class SysRoleFunctionManagerImpl extends BaseManagerImpl<SysRoleFunction> implements SysRoleFunctionManager {
	@Override
	@Transactional
	public void saveList(List<SysRoleFunction> sysRoleFunctionList, String saveRoleId) {
		if (sysRoleFunctionList != null && sysRoleFunctionList.size() > 0) {
			DetachedCriteria dc = this.detachedCriteria();
			dc.add(Restrictions.eq("roleId", saveRoleId));
			List<SysRoleFunction> listAll = this.findListByCriteria(dc);
			for (SysRoleFunction paRoleFunction : listAll) {
				super.delete(paRoleFunction);
			}
			for (SysRoleFunction paRoleFunctionItem : sysRoleFunctionList) {
				super.save(paRoleFunctionItem);
			}
		}
	}
}
