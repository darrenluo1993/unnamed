package com.unnamed.system.model;

import static java.lang.Boolean.TRUE;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.NaturalId;
import org.ironrhino.core.metadata.Hidden;
import org.ironrhino.core.metadata.Richtable;
import org.ironrhino.core.metadata.UiConfig;
import org.ironrhino.core.model.BaseRecordableEntity;

import lombok.Getter;
import lombok.Setter;

/**
 * 数据字典
 *
 * @CreatedBy Darren Luo
 * @CreatedTime Sep 24, 2019 10:35:01 AM
 */
@Getter
@Setter
@Entity
@Table(name = "sys_dictionary")
@Richtable(alias = "数据字典", order = "serialNum asc")
public class Dictionary extends BaseRecordableEntity {

	private static final long serialVersionUID = 7702209539289936417L;
	/**
	 * 字典ID
	 */
	@NaturalId
	@Column(unique = true, nullable = false)
	@UiConfig(alias = "字典ID", hiddenInInput = @Hidden(true))
	private Long dictId;
	/**
	 * 父级字典ID
	 */
	@UiConfig(alias = "父级字典ID", inputType = "hidden")
	private Long supDictId;
	/**
	 * 字典编码
	 */
	@Column(length = 45, nullable = false)
	@UiConfig(alias = "字典编码", maxlength = 45)
	private String dictCode;
	/**
	 * 字典名称
	 */
	@Column(length = 150, nullable = false)
	@UiConfig(alias = "字典名称", maxlength = 150)
	private String dictName;
	/**
	 * 字典值
	 */
	@Column(length = 150)
	@UiConfig(alias = "字典值", maxlength = 150)
	private String dictValue;
	/**
	 * 父级字典编码
	 */
	@Column(length = 45)
	@UiConfig(alias = "父级字典编码", maxlength = 45)
	private String supDictCode;
	/**
	 * 字典状态：0禁用、1启用
	 */
	@Column(nullable = false)
	@UiConfig(alias = "字典状态", type = "checkbox")
	private Boolean enabled = TRUE;
	/**
	 * 排序序号
	 */
	@Column(nullable = false)
	@UiConfig(alias = "排序序号", inputType = "number")
	private Integer serialNum;
	/**
	 * 字典简介
	 */
	@Column(length = 600)
	@UiConfig(alias = "字典简介", type = "textarea", maxlength = 600)
	private String introduction;
	/**
	 * 树节点状态，open或closed
	 */
	@Transient
	@UiConfig(hidden = true)
	private String state;
}