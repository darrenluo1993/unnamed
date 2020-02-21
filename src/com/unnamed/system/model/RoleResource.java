package com.unnamed.system.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;
import org.ironrhino.core.hibernate.CreationUser;
import org.ironrhino.core.model.BaseEntity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sys_role_resource")
public class RoleResource extends BaseEntity {

	private static final long serialVersionUID = -8014364492255600358L;
	/**
	 * 角色ID
	 */
	@Column(nullable = false)
	private Long roleId;
	/**
	 * 资源ID
	 */
	@Column(nullable = false)
	private Long resId;
	/**
	 * 创建人
	 */
	@CreationUser
	@Column(nullable = false, updatable = false)
	private String createUser;
	/**
	 * 创建时间
	 */
	@CreationTimestamp
	@Column(nullable = false, updatable = false)
	private Date createDate;
}