package com.unnamed.system.model;

import static java.lang.Boolean.TRUE;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.NaturalId;
import org.ironrhino.core.metadata.Richtable;
import org.ironrhino.core.metadata.UiConfig;
import org.ironrhino.core.model.BaseRecordableEntity;

import lombok.Getter;
import lombok.Setter;

/**
 * 组织机构
 *
 * @CreatedBy Darren Luo
 * @CreatedTime Sep 25, 2019 3:22:22 PM
 */
@Getter
@Setter
@Entity
@Table(name = "sys_organization")
@Richtable(alias = "组织机构", order = "orgIdPath asc")
public class Organization extends BaseRecordableEntity {

	private static final long serialVersionUID = 1469500780494572622L;
	/**
	 * 组织ID
	 */
	@NaturalId
	@Column(unique = true, nullable = false)
	@UiConfig(alias = "组织ID", inputType = "hidden")
	private Long orgId;
	/**
	 * 组织简称
	 */
	@Column(length = 150, nullable = false)
	@UiConfig(alias = "组织简称", maxlength = 150)
	private String orgName;
	/**
	 * 组织全称
	 */
	@Column(length = 1800, unique = true, nullable = false)
	@UiConfig(alias = "组织全称", inputType = "hidden", maxlength = 1800)
	private String orgFullName;
	/**
	 * 上级组织ID
	 */
	@UiConfig(alias = "上级组织ID", inputType = "hidden")
	private Long supOrgId;
	/**
	 * 组织ID路径
	 */
	@Column(length = 150, unique = true, nullable = false)
	@UiConfig(alias = "组织ID路径", inputType = "hidden", maxlength = 150)
	private String orgIdPath;
	/**
	 * 组织状态：0禁用、1启用
	 */
	@Column(nullable = false)
	@UiConfig(alias = "组织状态", type = "checkbox")
	private Boolean enabled = TRUE;
	/**
	 * 组织层级
	 */
	@Column(nullable = false)
	@UiConfig(alias = "组织层级", inputType = "hidden")
	private Integer hierarchy;
	/**
	 * 排序序号
	 */
	@Column(nullable = false)
	@UiConfig(alias = "排序序号", inputType = "number")
	private Integer serialNum;
	/**
	 * 组织简介
	 */
	@Column(length = 600)
	@UiConfig(alias = "组织简介", type = "textarea", maxlength = 600)
	private String introduction;
	/**
	 * 树节点状态，open或closed
	 */
	@Transient
	@UiConfig(hidden = true)
	private String state;
}