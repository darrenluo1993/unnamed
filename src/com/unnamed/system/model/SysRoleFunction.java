package com.unnamed.system.model;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.ironrhino.core.metadata.AutoConfig;
import org.ironrhino.core.metadata.Richtable;
import org.ironrhino.core.model.BaseEntity;

/**
 *
 *
 *
 **/
@AutoConfig
@Richtable(celleditable = false)
@Entity
@Table(name = "tb_sys_role_function")
public class SysRoleFunction extends BaseEntity {
	@Column(name = "roleid", length = 50)
	private String roleId; //角色ID
	@Column(name = "functioncode", length = 100)
	private String functionCode;//功能代码
	@Column(name = "menuid", length = 20)
	private Long menuId;//菜单ID
	@Column(name = "parentmenuid", length = 50)
	private String parentMenuId;//父菜单ID
	@Column(name = "flag", length = 10)
	private String flag;//标志位

	public String getRoleId() {
		return this.roleId;
	}

	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}

	public String getFunctionCode() {
		return this.functionCode;
	}

	public void setFunctionCode(String functionCode) {
		this.functionCode = functionCode;
	}

	public Long getMenuId() {
		return this.menuId;
	}

	public void setMenuId(Long menuId) {
		this.menuId = menuId;
	}

	public String getParentMenuId() {
		return this.parentMenuId;
	}

	public void setParentMenuId(String parentMenuId) {
		this.parentMenuId = parentMenuId;
	}

	public String getFlag() {
		return this.flag;
	}

	public void setFlag(String flag) {
		this.flag = flag;
	}
}
