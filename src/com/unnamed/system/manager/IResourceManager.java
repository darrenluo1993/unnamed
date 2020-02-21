package com.unnamed.system.manager;

import java.util.List;

import org.ironrhino.core.service.BaseManager;

import com.unnamed.base.model.ReturnResult;
import com.unnamed.system.model.Resource;
import com.unnamed.system.model.ResourceAO;

/**
 * 系统资源通用业务处理层
 *
 * @CreatedBy Darren Luo
 * @CreatedTime Sep 19, 2019 4:22:27 PM
 */
public interface IResourceManager extends BaseManager<Resource> {
	/**
	 * 根据父级资源ID获取子级系统资源
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 20, 2019 3:36:37 PM
	 * @param supResId
	 * @return
	 */
	List<Resource> listResourceViaSupId(Long supResId);

	/**
	 * 根据资源ID启用禁用系统资源
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 23, 2019 5:01:07 PM
	 * @param args
	 * @return
	 */
	ReturnResult<Void> switchResourceViaResId(ResourceAO args);

	/**
	 * 根据资源ID删除系统资源
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 23, 2019 11:56:06 AM
	 * @param resId
	 * @return
	 */
	ReturnResult<Void> removeResourceViaResId(Long resId);

	/**
	 * 根据资源ID列表查询系统资源
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Oct 8, 2019 9:58:23 AM
	 * @param resIdList
	 * @return
	 */
	List<Resource> listResourceViaMultiResId(List<Long> resIdList);
}