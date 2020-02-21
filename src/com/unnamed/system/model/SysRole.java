package com.unnamed.system.model;


import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.ironrhino.core.metadata.AutoConfig;
import org.ironrhino.core.metadata.Hidden;
import org.ironrhino.core.metadata.Richtable;
import org.ironrhino.core.metadata.UiConfig;
import org.ironrhino.core.model.BaseEntity;
import org.ironrhino.core.util.AuthzUtils;

/**
 * 系统角色
 **/
@AutoConfig
@Richtable(celleditable = false)
@Entity
@Table(name = "tb_sys_role")
public class SysRole extends BaseEntity {
	@Column(name = "roleid", length = 50, nullable = false)
	@UiConfig(hidden = true, alias = "角色代码")
	private String roleId;

	@Column(name = "rolename", length = 100, nullable = false)
	@UiConfig(alias = "角色名称")
	private String roleName;

	@Column(name = "createuserid", length = 32, nullable = false)
	@UiConfig(hiddenInInput = @Hidden(true), alias = "创建人")
	private String createUserId = AuthzUtils.getUsername();

	@Column(name = "createdate", nullable = false)
	@UiConfig(hiddenInInput = @Hidden(true), alias = "创建时间")
	@Temporal(value = TemporalType.TIMESTAMP)
	private Date createDate = new Date();

	@Column(name = "status", length = 1, nullable = false)
	@UiConfig(alias = "是否有效", hidden = true)
	private boolean status;//是否有效

	@Column(name = "flag", length = 10)
	@UiConfig(hidden = true)
	private String flag;//预留标志位


	public String getRoleId() {
		return this.roleId;
	}

	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}

	public String getRoleName() {
		return this.roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public String getCreateUserId() {
		return this.createUserId;
	}

	public void setCreateUserId(String createUserId) {
		this.createUserId = createUserId;
	}

	public Date getCreateDate() {
		return this.createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public boolean isStatus() {
		return this.status;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}

	public String getFlag() {
		return this.flag;
	}

	public void setFlag(String flag) {
		this.flag = flag;
	}
}
