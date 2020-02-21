package com.unnamed.base.model;

import static java.lang.String.format;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 返回结果类
 *
 * @CreatedBy Darren Luo
 * @CreatedTime Sep 23, 2019 11:45:28 AM
 * @param <T>
 */
@Getter
@Setter
@ToString
public final class ReturnResult<T> implements Serializable {

	private static final long serialVersionUID = -6605817530321250459L;
	/**
	 * 是否成功
	 */
	private boolean success;
	/**
	 * 操作类别
	 */
	private String category;
	/**
	 * 携带数据
	 */
	private T carryData;
	/**
	 * 消息内容
	 */
	private String message;

	public ReturnResult() {
		super();
	}

	public ReturnResult(final boolean success) {
		this.success = success;
	}

	public ReturnResult(final boolean success, final String message) {
		this.success = success;
		this.message = message;
	}

	public ReturnResult(final boolean success, final String message, final Object... args) {
		this.success = success;
		this.message = format(message, args);
	}

	public ReturnResult(final boolean success, final String category, final String message) {
		this.success = success;
		this.category = category;
		this.message = message;
	}

	public ReturnResult(final boolean success, final String category, final String message, final Object... args) {
		this.success = success;
		this.category = category;
		this.message = format(message, args);
	}

	public ReturnResult(final boolean success, final T carryData) {
		this.success = success;
		this.carryData = carryData;
	}

	public ReturnResult(final boolean success, final T carryData, final String message) {
		this.success = success;
		this.carryData = carryData;
		this.message = message;
	}

	public ReturnResult(final boolean success, final T carryData, final String message, final Object... args) {
		this.success = success;
		this.carryData = carryData;
		this.message = format(message, args);
	}

	public ReturnResult(final boolean success, final String category, final T carryData) {
		this.success = success;
		this.category = category;
		this.carryData = carryData;
	}

	public ReturnResult(final boolean success, final String category, final T carryData, final String message) {
		this.success = success;
		this.category = category;
		this.carryData = carryData;
		this.message = message;
	}

	public ReturnResult(final boolean success, final String category, final T carryData, final String message, final Object... args) {
		this.success = success;
		this.category = category;
		this.carryData = carryData;
		this.message = format(message, args);
	}

	public T getCarryData(final T defaultIfNull) {
		return this.carryData == null ? defaultIfNull : this.carryData;
	}

	/***************************** 返回结果定义区域 ******************************/
	/**
	 * 成功
	 */
	public static final boolean SUCCESS = true;
	/**
	 * 失败
	 */
	public static final boolean FAILURE = false;

	/***************************** 消息内容定义区域 ******************************/
	/**
	 * 保存成功信息
	 */
	public static final String SAVE_SUCCESS_MSG = "保存成功！";
	/**
	 * 保存失败信息
	 */
	public static final String SAVE_FAILURE_MSG = "保存失败！";
	/**
	 * 提交成功信息
	 */
	public static final String COMMIT_SUCCESS_MSG = "提交成功！";
	/**
	 * 提交失败信息
	 */
	public static final String COMMIT_FAILURE_MSG = "提交失败！";
	/**
	 * 修改成功信息
	 */
	public static final String MODIFY_SUCCESS_MSG = "修改成功！";
	/**
	 * 修改失败信息
	 */
	public static final String MODIFY_FAILURE_MSG = "修改失败！";
	/**
	 * 保存草稿成功信息
	 */
	public static final String SAVE_DRAFT_SUCCESS_MSG = "保存草稿成功！";
	/**
	 * 保存草稿失败信息
	 */
	public static final String SAVE_DRAFT_FAILURE_MSG = "保存草稿失败！";
	/**
	 * 删除成功信息
	 */
	public static final String REMOVE_SUCCESS_MSG = "删除成功！";
	/**
	 * 删除失败信息
	 */
	public static final String REMOVE_FAILURE_MSG = "删除失败！";
	/**
	 * 导入成功信息
	 */
	public static final String IMPORT_SUCCESS_MSG = "导入成功！";
	/**
	 * 导入失败信息
	 */
	public static final String IMPORT_FAILURE_MSG = "导入失败！";
	/**
	 * 分配成功信息
	 */
	public static final String ALLOT_SUCCESS_MSG = "分配成功！";
	/**
	 * 分配失败信息
	 */
	public static final String ALLOT_FAILURE_MSG = "分配失败！";
	/**
	 * 操作成功信息
	 */
	public static final String OPERATE_SUCCESS_MSG = "操作成功！";
	/**
	 * 操作失败信息
	 */
	public static final String OPERATE_FAILURE_MSG = "操作失败！";
	/**
	 * 添加成功信息
	 */
	public static final String ADD_SUCCESS_MSG = "添加成功！";
	/**
	 * 添加失败信息
	 */
	public static final String ADD_FAILURE_MSG = "添加失败！";
}