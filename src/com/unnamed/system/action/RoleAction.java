package com.unnamed.system.action;

import static com.alibaba.fastjson.JSON.parseArray;
import static java.util.Collections.emptyList;
import static org.ironrhino.core.util.AuthzUtils.getUsername;

import java.util.List;

import org.ironrhino.core.metadata.AutoConfig;
import org.ironrhino.core.metadata.JsonConfig;
import org.ironrhino.core.sequence.Sequence;
import org.ironrhino.core.struts.EntityAction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import com.unnamed.base.model.ReturnResult;
import com.unnamed.base.model.TreeData;
import com.unnamed.system.model.Resource;
import com.unnamed.system.model.Role;
import com.unnamed.system.model.RoleResource;
import com.unnamed.system.service.IRoleService;

import lombok.Getter;
import lombok.Setter;

/**
 * 系统角色业务请求控制层
 *
 * @CreatedBy Darren Luo
 * @CreatedTime Sep 26, 2019 5:11:36 PM
 */
@AutoConfig
public class RoleAction extends EntityAction<Role> {

	private static final long serialVersionUID = 4034681936943109629L;
	/********************** 入参定义区域 **********************/
	@Setter
	private String roleResJSON;
	/********************** 出参定义区域 **********************/
	@Getter
	private ReturnResult<Void> rrVoid;
	@Getter
	private List<TreeData> treeDataList;
	@Getter
	private ReturnResult<List<Resource>> rrListResource;
	/********************* 出入参定义区域 *********************/
	@Getter
	@Setter
	private Long roleId;
	/********************** 非参定义区域 **********************/
	@Autowired
	@Qualifier("roleIdSeq")
	private Sequence roleIdSeq;
	@Autowired
	private IRoleService roleService;

	@Override
	protected void beforeSave(final Role en) {
		if (en.isNew()) {
			en.setRoleId(this.roleIdSeq.nextLongValue());
		}
	}

	/**
	 * 转到角色资源分配页面
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 30, 2019 9:04:51 AM
	 * @return
	 */
	public String gotoAllotRes() {
		return "allotRes";
	}

	/**
	 * 根据角色ID获取该角色拥有的系统资源
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 30, 2019 3:54:07 PM
	 * @return
	 */
	@JsonConfig(root = "rrListResource")
	public String listGrantedResViaRoleId() {
		this.rrListResource = this.roleService.listGrantedResViaRoleId(this.roleId);
		return JSON;
	}

	/**
	 * 根据用户名获取用户拥有权限的系统资源树形数据
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 30, 2019 3:25:50 PM
	 * @return
	 */
	@JsonConfig(root = "treeDataList")
	public String listUserResourceTreeData() {
		this.treeDataList = this.roleService.listUserResourceTreeData(getUsername()).getCarryData(emptyList());
		return JSON;
	}

	/**
	 * 根据角色ID删除角色的系统资源，然后批量保存角色的新系统资源
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 30, 2019 5:45:47 PM
	 * @return
	 */
	@JsonConfig(root = "rrVoid")
	public String saveRoleResource() {
		this.rrVoid = this.roleService.saveMultiRoleResource(this.roleId, parseArray(this.roleResJSON, RoleResource.class));
		return JSON;
	}
}