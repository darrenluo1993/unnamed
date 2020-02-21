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
 * 系统资源
 *
 * @CreatedBy Darren Luo
 * @CreatedTime Sep 25, 2019 3:22:41 PM
 */
@Getter
@Setter
@Entity
@Table(name = "sys_resource")
@Richtable(alias = "系统资源", order = "resIdPath asc")
public class Resource extends BaseRecordableEntity {

	private static final long serialVersionUID = -4342320855827086082L;
	/**
	 * 资源ID
	 */
	@NaturalId
	@Column(unique = true, nullable = false)
	@UiConfig(alias = "资源ID", inputType = "hidden")
	private Long resId;
	/**
	 * 资源简称
	 */
	@Column(length = 150, nullable = false)
	@UiConfig(alias = "资源简称", maxlength = 150)
	private String resName;
	/**
	 * 资源标识
	 */
	@Column(length = 150, unique = true, nullable = false)
	@UiConfig(alias = "资源标识", maxlength = 150)
	private String resIden;
	/**
	 * 资源全称
	 */
	@Column(length = 1800, unique = true, nullable = false)
	@UiConfig(alias = "资源全称", inputType = "hidden", maxlength = 1800)
	private String resFullName;
	/**
	 * 父级资源ID
	 */
	@UiConfig(alias = "父级资源ID", inputType = "hidden")
	private Long supResId;
	/**
	 * 资源ID路径
	 */
	@Column(length = 150, unique = true, nullable = false)
	@UiConfig(alias = "资源ID路径", inputType = "hidden", maxlength = 150)
	private String resIdPath;
	/**
	 * 资源类型
	 */
	@Column(length = 30, nullable = false)
	@UiConfig(alias = "资源类型", maxlength = 30)
	private String resType;
	/**
	 * 资源URI
	 */
	@Column(length = 300, nullable = false)
	@UiConfig(alias = "资源URI", maxlength = 300)
	private String resUri;
	/**
	 * 资源状态：0禁用、1启用
	 */
	@Column(nullable = false)
	@UiConfig(alias = "资源状态", type = "checkbox")
	private Boolean enabled = TRUE;
	/**
	 * 资源层级
	 */
	@Column(nullable = false)
	@UiConfig(alias = "资源层级", inputType = "hidden")
	private Integer hierarchy;
	/**
	 * 是否公共（不进行权限控制）
	 */
	@Column(nullable = false)
	@UiConfig(alias = "是否公共", type = "checkbox")
	private Boolean isPublic;
	/**
	 * 是否显示
	 */
	@Column(nullable = false)
	@UiConfig(alias = "是否显示", type = "checkbox")
	private Boolean isExpose = TRUE;
	/**
	 * 排序序号
	 */
	@Column(nullable = false)
	@UiConfig(alias = "排序序号", inputType = "number")
	private Integer serialNum;
	/**
	 * 资源简介
	 */
	@Column(length = 600)
	@UiConfig(alias = "资源简介", type = "textarea", maxlength = 600)
	private String introduction;
	/**
	 * 树节点状态，open或closed
	 */
	@Transient
	@UiConfig(hidden = true)
	private String state;
}