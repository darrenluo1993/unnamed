package com.unnamed.system.service.impl;

import static com.unnamed.base.model.ReturnResult.FAILURE;
import static com.unnamed.base.model.ReturnResult.SAVE_FAILURE_MSG;
import static com.unnamed.base.model.ReturnResult.SAVE_SUCCESS_MSG;
import static com.unnamed.base.model.ReturnResult.SUCCESS;
import static java.util.Collections.emptyList;
import static org.hibernate.criterion.Order.asc;
import static org.springframework.util.CollectionUtils.isEmpty;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.criterion.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.unnamed.base.model.ReturnResult;
import com.unnamed.base.model.TreeData;
import com.unnamed.system.manager.IResourceManager;
import com.unnamed.system.manager.IRoleResourceManager;
import com.unnamed.system.model.Resource;
import com.unnamed.system.model.RoleResource;
import com.unnamed.system.service.IRoleService;

import lombok.extern.slf4j.Slf4j;

/**
 * 系统角色业务逻辑处理层实现
 *
 * @CreatedBy Darren Luo
 * @CreatedTime Sep 29, 2019 5:27:41 PM
 */
@Slf4j
@Service
public class RoleServiceImpl implements IRoleService {

	@Autowired
	private IResourceManager resourceManager;
	@Autowired
	private IRoleResourceManager roleResourceManager;

	@Override
	public ReturnResult<List<Resource>> listGrantedResViaRoleId(final Long roleId) {
		try {
			final List<Long> resIdList = new ArrayList<>();
			this.roleResourceManager.listRoleResourceViaRoleId(roleId).forEach(roleResource -> {
				resIdList.add(roleResource.getResId());
			});
			if (isEmpty(resIdList)) {
				return new ReturnResult<>(SUCCESS, emptyList());
			}
			return new ReturnResult<>(SUCCESS, this.resourceManager.listResourceViaMultiResId(resIdList));
		} catch (final Exception e) {
			log.error(e.getMessage(), e);
		}
		return new ReturnResult<>(FAILURE, "根据角色ID获取该角色拥有的系统资源失败！");
	}

	@Override
	public ReturnResult<List<TreeData>> listUserResourceTreeData(final String username) {
		try {
			final Order[] orders = { asc(HIERARCHY), asc(SERIAL_NUM) };
			final List<Resource> resourceList = this.resourceManager.findAll(orders);

			final List<TreeData> treeDataList = new ArrayList<>(resourceList.size());
			resourceList.forEach(resource -> {
				final TreeData treeData = new TreeData();
				treeData.setId(resource.getResId().toString());
				treeData.setText(resource.getResName());
				final Long supResId = resource.getSupResId();
				if (supResId != null) {
					treeData.setParentId(supResId.toString());
				}
				treeDataList.add(treeData);
			});
			return new ReturnResult<>(SUCCESS, treeDataList);
		} catch (final Exception e) {
			log.error(e.getMessage(), e);
		}
		return new ReturnResult<>(FAILURE, "根据用户名获取用户拥有权限的系统资源树形数据失败！");
	}

	@Override
	@Transactional
	public ReturnResult<Void> saveMultiRoleResource(final Long roleId, final List<RoleResource> roleResourceList) {
		try {
			// 保存新的角色资源关联关系之前先删除旧的
			this.roleResourceManager.listRoleResourceViaRoleId(roleId).forEach(roleResource -> {
				this.roleResourceManager.delete(roleResource);
			});
			// 保存新的角色资源关联关系
			roleResourceList.forEach(roleResource -> {
				this.roleResourceManager.save(roleResource);
			});
			return new ReturnResult<>(SUCCESS, SAVE_SUCCESS_MSG);
		} catch (final Exception e) {
			log.error(e.getMessage(), e);
		}
		return new ReturnResult<>(FAILURE, SAVE_FAILURE_MSG);
	}

	private static final String HIERARCHY = "hierarchy";
	private static final String SERIAL_NUM = "serialNum";
}