package com.unnamed.system.model;

import static java.lang.Boolean.TRUE;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.hibernate.annotations.NaturalId;
import org.ironrhino.core.metadata.Hidden;
import org.ironrhino.core.metadata.Richtable;
import org.ironrhino.core.metadata.UiConfig;
import org.ironrhino.core.model.BaseRecordableEntity;
import org.ironrhino.core.model.Enableable;

import lombok.Getter;
import lombok.Setter;

/**
 * 系统角色
 *
 * @CreatedBy Darren Luo
 * @CreatedTime Sep 26, 2019 4:49:05 PM
 */
@Getter
@Setter
@Entity
@Table(name = "sys_role")
@Richtable(alias = "系统角色", order = "modifyDate desc")
public class Role extends BaseRecordableEntity implements Enableable {

	private static final long serialVersionUID = 4631969595969214109L;
	/**
	 * 角色ID
	 */
	@NaturalId
	@Column(unique = true, nullable = false)
	@UiConfig(alias = "角色ID", hiddenInInput = @Hidden(true))
	private Long roleId;
	/**
	 * 所属系统模块
	 */
	@Column(length = 30, nullable = false)
	@UiConfig(alias = "所属系统模块", maxlength = 30)
	private String sysModule;
	/**
	 * 角色名称
	 */
	@Column(length = 150, nullable = false)
	@UiConfig(alias = "角色名称", maxlength = 150)
	private String roleName;
	/**
	 * 角色状态：0禁用、1启用
	 */
	@Column(nullable = false)
	@UiConfig(alias = "角色状态", type = "checkbox")
	private Boolean enabled = TRUE;
	/**
	 * 权限层级
	 */
	@Column(nullable = false)
	@UiConfig(alias = "权限层级", description = "值越小权限层级越高！")
	private Integer hierarchy;
	/**
	 * 角色简介
	 */
	@Column(length = 600)
	@UiConfig(alias = "角色简介", type = "textarea", maxlength = 600)
	private String introduction;

	@Override
	public boolean isEnabled() {
		return this.enabled;
	}

	@Override
	public void setEnabled(final boolean enabled) {
		this.enabled = enabled;
	}
}