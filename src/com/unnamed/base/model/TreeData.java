package com.unnamed.base.model;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

/**
 * 树形结构数据封装类
 *
 * @CreatedBy Darren Luo
 * @CreatedTime Sep 30, 2019 9:55:58 AM
 */
@Getter
@Setter
public class TreeData implements Serializable {

	private static final long serialVersionUID = -7958663674007088320L;
	/**
	 * ID
	 */
	private String id;
	/**
	 * 树节点文本
	 */
	private String text;
	/**
	 * 树节点状态
	 */
	private String state;
	/**
	 * 父级ID
	 */
	private String parentId;

	public TreeData() {
		super();
	}

	public TreeData(final String id, final String text, final String parentId) {
		this.id = id;
		this.text = text;
		this.parentId = parentId;
	}
}